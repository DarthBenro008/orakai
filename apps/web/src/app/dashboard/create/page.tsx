import { SessionProvider } from "next-auth/react"
import CreateQueryForm from "@/dashboard/create/create-query-form"

export default function CreateQueryPage() {
  return (
    <SessionProvider>
      <CreateQueryForm />
    </SessionProvider>
  )
}
