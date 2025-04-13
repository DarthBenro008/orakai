"use client"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import ContractInteraction from "../../components/ContractInteraction"

export default function Test() {
    const { data: session } = useSession()

    console.log("Session data:", session)

    const createQuery = async () => {
        console.log("Creating query...")
        const response = await fetch("/api/queries", {
            method: "POST",
            body: JSON.stringify({ 
                queryName: "Test Query", 
                queryDescription: "Test Description", 
                queryPrompt: "Translate the following text to French: 'I am going to cafe!'", 
                outputType: "string" 
            }),
        })
        const data = await response.json()
        console.log("Query created:", data)
    }

    const deleteQuery = async () => {
        console.log("Deleting query...")
        const response = await fetch("/api/queries/1", {
            method: "DELETE",
        })
        const data = await response.json()
        console.log("Query deleted:", data)
    }

    const getQueries = async () => {
        console.log("Fetching queries...")
        const response = await fetch("/api/queries", {
            method: "GET",
        })
        const data = await response.json()
        console.log("Queries fetched:", data)
    }

    if (session?.user?.email) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* User Profile Section */}
                    <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                        <Image 
                            src={session.user.image ?? ""} 
                            width={64} 
                            height={64} 
                            alt={session.user.name ?? "User profile picture"} 
                            className="rounded-full"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">Welcome {session.user.name}!</h1>
                            <p className="text-gray-600">{session.user.email}</p>
                        </div>
                        <button 
                            onClick={() => signOut()}
                            className="ml-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Sign out
                        </button>
                    </div>

                    {/* API Interaction Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">API Interactions</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <button 
                                onClick={createQuery}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Create Query
                            </button>
                            <button 
                                onClick={deleteQuery}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete Query
                            </button>
                            <button 
                                onClick={getQueries}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Get Queries
                            </button>
                        </div>
                    </div>

                    {/* Contract Interaction Section */}
                    <ContractInteraction />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow">
                <p className="text-xl text-red-600">You are not authorized to view this page!</p>
            </div>
        </div>
    )
}