import BillingForm from '@/components/BillingForm'
import { getUserSubscriptionPlan } from '@/utils/stripe'

export default async function BillingPage() {
  const subscriptionPlan = await getUserSubscriptionPlan()

  return <BillingForm subscriptionPlan={subscriptionPlan} />
}
