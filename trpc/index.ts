import { prisma } from '@/utils/db'
import { privateProcedure, publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

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
})

export type AppRouter = typeof appRouter
