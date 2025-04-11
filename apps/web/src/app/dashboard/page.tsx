import { SessionProvider } from "next-auth/react"
import Dashboard from "./dashboard" 

export default function DashboardPage() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  )
}