import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { FullPageLoading } from '@/components/ui/full-page-loading'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, BookOpen, Clock, Calendar } from 'lucide-react'

export const Route = createFileRoute('/ident-insights')({
  pendingComponent: FullPageLoading,
  component: IdentInsightsPage,
})

const insights = [
  {
    title: "The Future of Third-Party Risk Management in 2026",
    excerpt: "Discover how AI and machine learning are revolutionizing the way companies assess and mitigate risks in their supply chains.",
    category: "Strategy",
    author: "Elena Rodriguez",
    date: "May 15, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Navigating Global Compliance Regulations",
    excerpt: "A comprehensive guide to staying compliant with evolving international standards and local regulations across different jurisdictions.",
    category: "Compliance",
    author: "Marcus Chen",
    date: "May 10, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "The Impact of Blockchain on Supply Chain Transparency",
    excerpt: "Exploring how distributed ledger technology is creating immutable records for vendor verification and tracking.",
    category: "Technology",
    author: "Sarah Jenkins",
    date: "May 5, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Building a Resilient Vendor Ecosystem",
    excerpt: "Strategies for diversifying your supplier base and ensuring business continuity in an increasingly volatile global market.",
    category: "Operations",
    author: "David Thorne",
    date: "April 28, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "ESG Reporting: What You Need to Know",
    excerpt: "Understanding the new environmental, social, and governance reporting requirements and how to automate data collection.",
    category: "Sustainability",
    author: "Lisa Wong",
    date: "April 22, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Cybersecurity in the Age of Remote Audits",
    excerpt: "How to maintain high security standards when conducting virtual site visits and digital due diligence.",
    category: "Security",
    author: "Alex Rivera",
    date: "April 15, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
  }
]

function IdentInsightsPage() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <HomeHeader user={user ?? undefined} />

        <main className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-primary mb-6">
              <BookOpen className="h-3 w-3" />
              <span>Ident Insights Hub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Insights to power your <span className="text-primary italic">compliance journey</span>.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Stay ahead of the curve with our latest research, industry trends, and expert analysis on third-party risk and global compliance.
            </p>
          </div>

          {/* Featured Post */}
          <div className="group relative mb-20 overflow-hidden rounded-[2.5rem] border bg-card shadow-2xl transition-all hover:shadow-primary/5">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 overflow-hidden lg:h-auto">
                <img 
                  src={insights[0].image} 
                  alt={insights[0].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-16">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                    Featured
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {insights[0].readTime}
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {insights[0].title}
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {insights[0].excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted border flex items-center justify-center font-bold text-sm">
                      {insights[0].author[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{insights[0].author}</div>
                      <div className="text-xs text-muted-foreground">{insights[0].date}</div>
                    </div>
                  </div>
                  <Button variant="ghost" className="gap-2 group/btn">
                    Read Article
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.slice(1).map((insight, idx) => (
              <div key={idx} className="group flex flex-col rounded-3xl border bg-card p-4 transition-all hover:shadow-xl hover:border-primary/20">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                  <img 
                    src={insight.image} 
                    alt={insight.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-black hover:bg-white border-none shadow-sm backdrop-blur-sm">
                      {insight.category}
                    </Badge>
                  </div>
                </div>
                <div className="px-2 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {insight.date}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {insight.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {insight.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <span className="text-sm font-medium">{insight.author}</span>
                    <Button size="sm" variant="ghost" className="h-8 px-2 group/btn">
                      Read
                      <ArrowUpRight className="h-3 w-3 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mt-32 relative rounded-[3rem] bg-foreground text-background p-8 lg:p-20 overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-[120px]" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-[120px]" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Stay informed.</h2>
              <p className="text-background/70 text-lg mb-10">
                Subscribe to Ident Insights to get the latest articles, reports, and compliance updates delivered directly to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 rounded-2xl bg-background/10 border border-background/20 px-6 py-4 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button className="rounded-2xl h-auto px-10 py-4 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </main>

        <HomeFooter />
      </div>
    </div>
  )
}
