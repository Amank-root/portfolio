"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, User, Code, Briefcase, Mail, Menu, X } from "lucide-react"
// import { cn } from "@/lib/utils"

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { name: "Home", path: "/", icon: FileText },
    { name: "About", path: "/about", icon: User },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Skills", path: "/skills", icon: Code },
    { name: "Contact", path: "/contact", icon: Mail },
  ]

  return (
    <div className="md:hidden">
      <button
        className="fixed right-4 top-3 z-50 rounded-md p-2 text-white hover:bg-[#37373d]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#1e1e1e] px-4 pt-16">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center rounded-md px-4 py-3 text-sm hover:bg-[#37373d]"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} className="mr-3 text-[#888]" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
} 