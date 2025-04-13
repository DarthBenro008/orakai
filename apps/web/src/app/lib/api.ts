import { getSession } from "next-auth/react"

export interface Query {
    queryId: number
    queryName: string
    queryDescription: string
    queryPrompt: string
    outputType: string
    createdAt: string
    userId: string
    userName: string
    userEmail: string
}

export async function fetchQueries(): Promise<Query[]> {
    const session = await getSession()
    if (!session) {
        throw new Error("Not authenticated")
    }

    const response = await fetch("/api/queries")
    if (!response.ok) {
        throw new Error("Failed to fetch queries")
    }

    const data = await response.json()
    return data.queries
}

export async function fetchQueryById(id: number): Promise<Query> {
    const session = await getSession()
    if (!session) {
        throw new Error("Not authenticated")
    }

    const response = await fetch(`/api/queries/${id}`)
    if (!response.ok) {
        throw new Error("Failed to fetch query")
    }

    const data = await response.json()
    return data.query
}

export async function deleteQuery(id: number): Promise<void> {
    const session = await getSession()
    if (!session) {
        throw new Error("Not authenticated")
    }

    const response = await fetch(`/api/queries/${id}`, {
        method: "DELETE",
    })

    if (!response.ok) {
        throw new Error("Failed to delete query")
    }
} 