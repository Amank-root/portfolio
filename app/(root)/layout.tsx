import type React from "react"
import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/toaster"

export const metadata: Metadata = {
  title: "Aman Kushwaha ~ Portfolio",
  description: "Aman Kushwaha a passionate Full Stack Developer specializing in MERN stack development, Machine Learning, etc.",
  icons: "/ak-logo.svg"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <div>
          <div className="flex min-h-screen flex-col bg-[#1e1e1e] text-white">
            <Header />
            <MobileNav />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <footer className="flex h-6 items-center justify-between border-t border-[#333] bg-[#1e1e1e] px-4 text-xs text-[#888]">
              <div className="hidden items-center gap-2 sm:flex">
                <span>main</span>
                <span>UTF-8</span>
              </div>
              <div className="flex w-full items-center justify-between sm:w-auto sm:gap-2">
                <span className="sm:hidden">main</span>
                <span>JavaScript</span>
                <span className="hidden sm:inline">Ln 1, Col 1</span>
              </div>
            </footer>
          </div>
          <Toaster />
      </div>
  )
}

