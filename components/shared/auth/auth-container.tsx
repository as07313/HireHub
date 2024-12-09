interface AuthContainerProps {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg"
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg"
}

export function AuthContainer({ children, maxWidth = "sm" }: AuthContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className={`w-full ${maxWidthClasses[maxWidth]}`}>
        {children}
      </div>
    </div>
  )
}