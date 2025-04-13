"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateQueryForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    queryName: "",
    queryDescription: "",
    queryPrompt: "",
    outputType: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, outputType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await fetch("/api/queries", {
      method: "POST",
      body: JSON.stringify(formData),
    })
    // Simulate API call
    setTimeout(async () => {
      setIsSubmitting(false)
      router.push("/dashboard")
    }, 1000)
  }

  const outputTypes = [
    { value: "string", label: "String" },
    { value: "bool", label: "Boolean" },
    { value: "uint256", label: "Uint256" },
    { value: "address", label: "Address" },
  ]

  return (
    <DashboardShell>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          {/* <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link> */}
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Query</h1>
          <p className="text-muted-foreground">Add a new query to the dashboard</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Query Information</CardTitle>
            <CardDescription>Enter the details for your new query</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="queryName">Query Name</Label>
              <Input
                id="queryName"
                name="queryName"
                placeholder="Enter a name for your query"
                value={formData.queryName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="queryDescription">Description</Label>
              <Textarea
                id="queryDescription"
                name="queryDescription"
                placeholder="Describe what your query does"
                value={formData.queryDescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="queryPrompt">Query Prompt</Label>
              <Textarea
                id="queryPrompt"
                name="queryPrompt"
                placeholder="Enter your query prompt template"
                value={formData.queryPrompt}
                onChange={handleChange}
                className="min-h-[100px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use {"{variable}"} syntax for dynamic variables in your prompt
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputType">Output Type</Label>
              <Select value={formData.outputType} onValueChange={handleSelectChange} required>
                <SelectTrigger id="outputType">
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent>
                  {outputTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              {/* <Link href="/dashboard">Cancel</Link> */}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Query"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
} 