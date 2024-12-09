import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  testimonial?: {
    quote: string
    author: string
  }
}

export function AuthLayout({
  children,
  testimonial = {
    quote: "HireHub has transformed how we recruit talent. The platform is intuitive and powerful.",
    author: "Sofia Davis - HR Manager"
  }
}: AuthLayoutProps) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-primary p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <h2>HireHub</h2>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">{testimonial.quote}</p>
            <footer className="text-sm">{testimonial.author}</footer>
          </blockquote>
        </div>
        <div className="absolute inset-0 bg-primary/90" />
        <Image
          src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1600&auto=format&fit=crop"
          alt="Authentication background"
          width={1200}
          height={800}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          priority
        />
      </div>
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  )
}