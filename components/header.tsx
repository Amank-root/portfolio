import Link from "next/link"
import { FileCode, X } from "lucide-react"

export function Header() {
  const tabs = [
    { name: "index.tsx", path: "/" },
    { name: "about.tsx", path: "/about" },
    { name: "projects.tsx", path: "/projects" },
    { name: "skills.tsx", path: "/skills" },
    { name: "contact.tsx", path: "/contact" },
  ]

  return (
    <header className="flex h-9 items-center border-b border-[#333] bg-[#252526]">
      <div className="flex items-center px-4">
        <FileCode size={16} className="mr-2 text-[#569cd6]" />
        <span className="text-sm">Portfolio</span>
      </div>

      <div className="flex flex-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className="group flex h-9 items-center border-r border-[#333] bg-[#1e1e1e] px-4 text-sm hover:bg-[#2d2d2d]"
          >
            <span className="mr-2">{tab.name}</span>
            <X size={14} className="opacity-0 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </header>
  )
}

