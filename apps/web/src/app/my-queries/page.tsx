import { DashboardShell } from "@/components/dashboard-shell"
import { QueryList } from "@/components/query-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// Mock user data
const currentUser = {
  id: "5ca83ab8-45dc-48ac-9870-6b7c5a8211c6",
  name: "John Doe",
}

// Mock queries data
const queries = [
  {
    id: 1,
    userId: "5ca83ab8-45dc-48ac-9870-6b7c5a8211c6",
    queryName: "English to French",
    queryDescription: "Translates English text to French",
    queryPrompt: "Translate the following text to French: '{text}'",
    outputType: "string",
    createdAt: "2025-04-10T12:30:19.553Z",
  },
  {
    id: 2,
    userId: "7da45cb9-56ec-49bd-8970-7b8c5a8211c7",
    queryName: "Address Validator",
    queryDescription: "Validates if a string is a valid Ethereum address",
    queryPrompt: "Is '{address}' a valid Ethereum address?",
    outputType: "bool",
    createdAt: "2025-04-11T09:15:19.553Z",
  },
  {
    id: 3,
    userId: "5ca83ab8-45dc-48ac-9870-6b7c5a8211c6",
    queryName: "Test Query",
    queryDescription: "Test Description",
    queryPrompt: "Translate the following text to French: 'I am going to cafe!'",
    outputType: "string",
    createdAt: "2025-04-12T15:29:19.553Z",
  },
  {
    id: 4,
    userId: "9fa25db7-34fc-47cd-7860-5a7c5a8211c8",
    queryName: "Token Balance",
    queryDescription: "Gets token balance for an address",
    queryPrompt: "What is the token balance for '{address}'?",
    outputType: "uint256",
    createdAt: "2025-04-12T18:45:19.553Z",
  },
]

// Filter queries for current user
const userQueries = queries.filter((query) => query.userId === currentUser.id)

export default function MyQueriesPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Queries</h1>
          <p className="text-muted-foreground">View and manage queries you've created</p>
        </div>
        <Button asChild>
          <Link href="/queries/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Query
          </Link>
        </Button>
      </div>
      <QueryList queries={userQueries} currentUserId={currentUser.id} />
    </DashboardShell>
  )
}
