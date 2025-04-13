"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1>Hello world</h1>
      <Button onClick={() => signIn()}>Go to dashboard</Button>
    </div>
  )
}
