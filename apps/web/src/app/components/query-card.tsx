"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Query } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteQuery } from "@/lib/api"
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

interface QueryCardProps {
    query: Query
    isOwner: boolean
}

export function QueryCard({ query, isOwner }: QueryCardProps) {
    const queryClient = useQueryClient()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const deleteMutation = useMutation({
        mutationFn: () => deleteQuery(query.queryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["queries"] })
        },
    })

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

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1 text-lg">{query.queryName}</CardTitle>
                    <Badge className={`ml-2 ${getOutputTypeColor(query.outputType)}`}>{query.outputType}</Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">{query.queryDescription}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(query.createdAt), { addSuffix: true })}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/queries/${query.queryId}`}>View Details</Link>
                </Button>
                {isOwner && (
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
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
            </CardFooter>
        </Card>
    )
}
