import Link from "next/link"
import { FileText, User, Code, Briefcase, Mail, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const navItems = [
    { name: "Home", path: "/", icon: FileText },
    { name: "About", path: "/about", icon: User },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Skills", path: "/skills", icon: Code },
    { name: "Contact", path: "/contact", icon: Mail },
  ]

  return (
    <aside className={cn("hidden w-64 flex-shrink-0 border-r border-[#333] bg-[#252526] md:block", className)}>
      <div className="sticky top-0">
        <div className="p-4 text-sm font-medium text-[#888]">EXPLORER</div>

        <div className="px-2">
          <div className="mb-2 flex items-center px-2 py-1 text-sm">
            <ChevronRight size={16} className="mr-1" />
            <span>PORTFOLIO</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center rounded px-2 py-1 text-sm hover:bg-[#37373d]"
              >
                <item.icon size={16} className="mr-2 text-[#888]" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}

