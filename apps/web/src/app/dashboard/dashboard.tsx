"use client"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Dashboard() {
    const { data: session } = useSession()

    console.log(session)

    const createQuery = async () => {
        const response = await fetch("/api/queries", {
            method: "POST",
            body: JSON.stringify({ queryName: "Test Query", queryDescription: "Test Description", queryPrompt: "Test Prompt", outputType: "bool" }),
        })
        const data = await response.json()
        console.log(data)
    }

    const deleteQuery = async () => {
        const response = await fetch("/api/queries/1", {
            method: "DELETE",
        })
        const data = await response.json()
        console.log(data)
    }

    const getQueries = async () => {
        const response = await fetch("/api/queries", {
            method: "GET",
        })
        const data = await response.json()
        console.log(data)
    }

    if (session?.user?.email) {
        return <div>
            <Image src={session.user.image ?? ""} width={100} height={100} alt={session.user.name ?? "User profile picture"} />
            <p>Welcome {session.user.name}! with email {session.user.email}</p>
            <button onClick={() => signOut()}>Sign out</button>
            <button onClick={createQuery}>Create Query</button>
            <button onClick={deleteQuery}>Delete Query</button>
            <button onClick={getQueries}>Get Queries</button>
        </div>
    }

    return <p>You are not authorized to view this page!</p>
}