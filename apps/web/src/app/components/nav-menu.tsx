"use client"

import * as React from "react"
import { Menu } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SiGithub } from "@icons-pack/react-simple-icons"
import Link from "next/link"

export function NavMenu() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="w-full flex-col justify-center items-center z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="w-full px-5 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-jetbrains-mono text-xl font-bold">Orakai</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/login" className="text-sm font-medium transition-colors hover:text-primary">
            Login
          </a>
          <Link href={"https://staging-assets.kofferx.com/orakai_whitepaper.pdf"} target="_blank" className="text-sm font-medium transition-colors hover:text-primary">
            Read the Whitepaper
          </Link>
          <a 
            href="https://github.com/darthbenro008/orakai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            <SiGithub className="h-4 w-4" />
            <span>Github</span>
          </a>
          <ThemeToggle />
        </nav>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8 p-4">
                <a 
                  href="/login" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </a>
                <Link 
                  href={"https://staging-assets.kofferx.com/orakai_whitepaper.pdf"} 
                  target="_blank"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Read the Whitepaper
                </Link>
                <a 
                  href="https://github.com/darthbenro008/orakai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                  onClick={() => setIsOpen(false)}
                >
                  <SiGithub className="h-4 w-4" />
                  <span>Github</span>
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}