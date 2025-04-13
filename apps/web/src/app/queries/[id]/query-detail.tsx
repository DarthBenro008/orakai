"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Edit, IdCard, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { fetchQueryById, deleteQuery } from "@/lib/api"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface QueryDetailProps {
    queryId: number
}

export function QueryDetail({ queryId }: QueryDetailProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const { data: query, isLoading, error } = useQuery({
        queryKey: ["query", queryId],
        queryFn: () => fetchQueryById(queryId),
    })

    const deleteMutation = useMutation({
        mutationFn: () => deleteQuery(queryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["queries"] })
            router.push("/dashboard")
        },
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Loading...</h1>
                    <p className="text-muted-foreground">Fetching query details</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Error</h1>
                    <p className="text-red-500">Failed to load query</p>
                </div>
            </div>
        )
    }

    if (!query) {
        return null
    }

    const isOwner = query.userId === session?.user?.id

    const getOutputTypeColor = (type: string) => {
        switch (type) {
            case "string":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "bool":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "uint256":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            case "address":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{query.queryName}</h1>
                    <p className="text-muted-foreground">{query.queryDescription}</p>
                </div>
                {isOwner && (
                    <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the query
                                        "{query.queryName}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteMutation.mutate()}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Query Details</CardTitle>
                        <CardDescription>Information about this query</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <IdCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Query ID:</span>
                                <span>{query.queryId}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Created by:</span>
                                <span>{isOwner ? "You" : query.userName}</span>
                            </div>
                            <Badge className={getOutputTypeColor(query.outputType)}>{query.outputType}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Created:</span>
                            <span>{formatDate(query.createdAt)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Query Prompt</CardTitle>
                        <CardDescription>The prompt template used for this query</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md bg-muted p-4">
                            <pre className="text-sm whitespace-pre-wrap">{query.queryPrompt}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
} 