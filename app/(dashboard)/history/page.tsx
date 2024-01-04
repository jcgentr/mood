import HistoryChart from '@/components/HistoryChart'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getData = async () => {
  const user = await getUserByClerkID()
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const sum = analyses.reduce(
    (acc, { sentimentScore }) => acc + sentimentScore,
    0
  )
  const avg = Math.round(sum / analyses.length)

  return { analyses, avg }
}

export default async function HistoryPage() {
  const { analyses, avg } = await getData()
  console.log(analyses)
  return (
    <div className="p-10 bg-zinc-400/10 h-full w-full">
      <div className="mb-10">{`Avg Sentiment Score: ${avg}`}</div>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  )
}
