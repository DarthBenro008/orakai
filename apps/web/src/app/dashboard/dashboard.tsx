"use client"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Dashboard() {
    const { data: session } = useSession()

    console.log(session)

    if (session?.user?.email) {
        return <div>
            <Image src={session.user.image ?? ""} width={100} height={100} alt={session.user.name ?? "User profile picture"} />
            <p>Welcome {session.user.name}! with email {session.user.email}</p>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    }

    return <p>You are not authorized to view this page!</p>
}