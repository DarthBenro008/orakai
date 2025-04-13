"use client"

import { useState } from "react"
import { QueryCard } from "@/components/query-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Query } from "@/lib/api"

interface QueryListProps {
  queries: Query[]
  currentUserId: string
}

export function QueryList({ queries, currentUserId }: QueryListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQueries = queries.filter(
    (query) =>
      query.queryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.queryDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const userQueries = filteredQueries.filter((query) => query.userId === currentUserId)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search queries..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Queries</TabsTrigger>
          <TabsTrigger value="my">My Queries</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {filteredQueries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No queries found</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredQueries.map((query) => (
                <QueryCard key={query.queryId} query={query} isOwner={query.userId === currentUserId} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="my" className="mt-4">
          {userQueries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">You haven't created any queries yet</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userQueries.map((query) => (
                <QueryCard key={query.queryId} query={query} isOwner={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
