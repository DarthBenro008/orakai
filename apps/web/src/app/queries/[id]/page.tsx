import { notFound } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { QueryDetail } from "./query-detail"
import { SessionProvider } from "next-auth/react"

export default async function QueryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const queryId = Number.parseInt(id)
  
  if (isNaN(queryId)) {
    notFound()
  }

  return (
    <SessionProvider>
      <DashboardShell>
        <QueryDetail queryId={queryId} />
      </DashboardShell>
    </SessionProvider>
  )
}
