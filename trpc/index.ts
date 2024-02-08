import { prisma } from '@/utils/db'
import { privateProcedure, publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { INFINITE_QUERY_LIMIT } from '@/utils/config'
import { absoluteUrl } from '@/utils/url'
import { PLANS, getUserSubscriptionPlan, stripe } from '@/utils/stripe'

export const appRouter = router({
  getUserEntries: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        analysis: {
          select: {
            mood: true,
            summary: true,
            sentimentScore: true,
          },
        },
      },
    })

    return entries
  }),
  deleteUserEntry: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const journalEntry = await prisma.journalEntry.findFirst({
        where: {
          id: input.id,
          userId,
        },
      })

      if (!journalEntry) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      await prisma.journalEntry.delete({
        where: {
          id: input.id,
          userId,
        },
      })

      return journalEntry
    }),
  getEntryMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        journalEntryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx
      const { journalEntryId, cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT

      const journalEntry = await prisma.journalEntry.findFirst({
        where: {
          id: journalEntryId,
          userId,
        },
      })

      if (!journalEntry) throw new TRPCError({ code: 'NOT_FOUND' })

      const messages = await prisma.message.findMany({
        take: limit + 1,
        where: {
          journalEntryId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      })

      let nextCursor: typeof cursor = undefined
      if (messages.length > limit) {
        const nextItem = messages.pop()
        nextCursor = nextItem?.id
      }

      return {
        messages,
        nextCursor,
      }
    }),
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId, user } = ctx

    if (!userId || !user) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const billingUrl = absoluteUrl('/billing')

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (subscriptionPlan.isSubscribed && user.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: billingUrl,
      })

      return { url: stripeSession.url }
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card', 'paypal'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === 'Pro')?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    })

    return { url: stripeSession.url }
  }),
})

export type AppRouter = typeof appRouter
