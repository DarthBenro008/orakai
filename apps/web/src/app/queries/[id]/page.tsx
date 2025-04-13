import { notFound } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { QueryDetail } from "./query-detail"
import { SessionProvider } from "next-auth/react"

export default function QueryDetailPage({ params }: { params: { id: string } }) {
  const queryId = Number.parseInt(params.id)
  
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
