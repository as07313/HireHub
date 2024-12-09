import { SquareAsterisk } from "lucide-react"

interface AuthHeaderProps {
  title: string
  subtitle?: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-2 text-center">
      <div className="bg-primary text-white p-3 rounded-xl mb-4">
        <SquareAsterisk className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}