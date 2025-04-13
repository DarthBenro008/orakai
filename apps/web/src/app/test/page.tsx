import { SessionProvider } from "next-auth/react"
import Test from "./test" 

export default function TestPage() {
  return (
    <SessionProvider>
      <Test />
    </SessionProvider>
  )
}