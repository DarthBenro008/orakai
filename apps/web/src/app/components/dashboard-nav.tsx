"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, ScrollTextIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { SiGithub } from "@icons-pack/react-simple-icons"
export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "All Queries",
      icon: Database,
    },
    {
      href: "https://github.com/darthbenro008/orakai",
      label: "Go to Github",
      icon: SiGithub,
    },
    {
      href: "https://staging-assets.kofferx.com/orakai_whitepaper.pdf",
      label: "Read the Whitepaper",
      icon: ScrollTextIcon,
    },
  ]

  return (
    <nav className="space-y-1 px-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === route.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <route.icon className="h-4 w-4" />
          <span>{route.label}</span>
        </Link>
      ))}
    </nav>
  )
}
