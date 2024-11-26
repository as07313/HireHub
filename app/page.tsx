import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="absolute right-4 top-4 flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Get Started</Button>
          </Link>
          <ModeToggle />
        </div>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
              Find Your Dream Job
            </h1>
            <p className="text-muted-foreground">
              Create an account to start applying for jobs
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg">Create Account</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}