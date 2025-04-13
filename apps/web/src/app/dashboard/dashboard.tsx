"use client"
import { DashboardShell } from "@/components/dashboard-shell"
import { QueryList } from "@/components/query-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { fetchQueries } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
    const { data: session } = useSession()
    const { data: queries, isLoading, error } = useQuery({
        queryKey: ["queries"],
        queryFn: fetchQueries,
    })

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Queries</h1>
                        <p className="text-muted-foreground">Loading queries...</p>
                    </div>
                </div>
            </DashboardShell>
        )
    }

    if (error) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Queries</h1>
                        <p className="text-red-500">Error loading queries</p>
                    </div>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Queries</h1>
                    <p className="text-muted-foreground">View and manage all available queries</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Query
                    </Link>
                </Button>
            </div>
            <QueryList queries={queries || []} currentUserId={session?.user?.id || ""} />
        </DashboardShell>
    )
}
