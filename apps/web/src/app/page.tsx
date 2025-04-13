"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrakaiLanding from "@/components/landing";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <OrakaiLanding />
    </div>
  )
}
