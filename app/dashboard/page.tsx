'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, Eye, MessageSquare, Heart, TrendingUp, FileText,
  Lock, ArrowUpRight, RefreshCw, Globe, Smartphone, Monitor, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AnalyticsData {
  totalViews: number
  blogViews: number
  totalReactions: number
  totalComments: number
  topPosts: { slug: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
}

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async (secretKey: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/analytics/stats', {
        headers: { 'x-dashboard-key': secretKey },
      })
      if (!res.ok) throw new Error('Unauthorized')
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
    } catch {
      setError('Invalid key or server error')
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    await fetchData(key)
    setAuthenticated(true)
    sessionStorage.setItem('dashboard-key', key)
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('dashboard-key')
    if (stored) {
      setKey(stored)
      fetchData(stored).then(() => setAuthenticated(true)).catch(() => {})
    }
  }, [fetchData])

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="glass rounded-2xl p-8 border border-border/50 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Enter your dashboard key to access analytics
            </p>
            <form onSubmit={login} className="space-y-4">
              <Input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Dashboard secret key"
                className="bg-background border-border/50 text-center font-mono"
                required
              />
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 justify-center">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? 'Verifying...' : 'Access Dashboard'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  const maxViews = data?.viewsByDay?.length ? Math.max(...data.viewsByDay.map(d => d.count), 1) : 1

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Portfolio & Blog Analytics
              {lastUpdated && <span className="ml-2">· Updated {lastUpdated.toLocaleTimeString()}</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchData(key)}
              disabled={loading}
              className="gap-2 border-border/50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAuthenticated(false); sessionStorage.removeItem('dashboard-key') }}
              className="text-muted-foreground text-xs"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Views', value: data?.totalViews || 0, icon: Eye, color: 'primary', change: '+12%' },
            { label: 'Blog Views', value: data?.blogViews || 0, icon: FileText, color: 'accent', change: '+8%' },
            { label: 'Reactions', value: data?.totalReactions || 0, icon: Heart, color: 'secondary', change: '+24%' },
            { label: 'Comments', value: data?.totalComments || 0, icon: MessageSquare, color: 'primary', change: '+5%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color === 'primary' ? 'bg-primary/10' : stat.color === 'accent' ? 'bg-accent/10' : 'bg-secondary/10'}`}>
                  <stat.icon size={16} className={stat.color === 'primary' ? 'text-primary' : stat.color === 'accent' ? 'text-accent' : 'text-secondary'} />
                </div>
                <span className="text-xs text-accent flex items-center gap-0.5">
                  <ArrowUpRight size={10} />{stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Views chart */}
          <div className="lg:col-span-2 glass rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Views (Last 30 Days)
              </h2>
              <span className="text-xs text-muted-foreground">{data?.viewsByDay?.length || 0} days</span>
            </div>
            {data?.viewsByDay && data.viewsByDay.length > 0 ? (
              <div className="flex items-end gap-1 h-40">
                {data.viewsByDay.slice(-30).map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-primary/20 rounded-t group-hover:bg-primary/40 transition-colors relative"
                      style={{ height: `${Math.max((day.count / maxViews) * 130, 4)}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-1.5 py-0.5 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {day.count} views
                        <br />
                        <span className="text-muted-foreground">{day.date}</span>
                      </div>
                    </div>
                    {i % 6 === 0 && (
                      <span className="text-[8px] text-muted-foreground rotate-45 origin-left absolute -bottom-5">
                        {day.date.slice(5)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                No view data yet
              </div>
            )}
          </div>

          {/* Top Posts */}
          <div className="glass rounded-xl p-5 border border-border/50">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-accent" />
              Top Blog Posts
            </h2>
            {data?.topPosts && data.topPosts.length > 0 ? (
              <div className="space-y-3">
                {data.topPosts.map((post, i) => {
                  const maxCount = data.topPosts[0]?.count || 1
                  return (
                    <div key={post.slug}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground truncate max-w-[140px]" title={post.slug}>
                          {i + 1}. {post.slug}
                        </span>
                        <span className="text-xs font-medium text-primary">{post.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                          style={{ width: `${(post.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                No blog data yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass rounded-xl p-5 border border-border/50">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/studio" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 text-xs border-border/50">
                Open Sanity Studio ↗
              </Button>
            </a>
            <a href="/blog" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 text-xs border-border/50">
                View Blog ↗
              </Button>
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs text-muted-foreground"
              onClick={() => {
                const info = `POST /api/blog/ingest\nHeader: x-api-key: BLOG_INGEST_API_KEY\nBody: { title, slug, content (markdown), excerpt?, tags?, readTime?, published?, featured? }`
                alert(info)
              }}
            >
              API Docs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
