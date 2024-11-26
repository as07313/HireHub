import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Job Portal',
  description: 'Authentication pages for job candidates',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-primary p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <h2>HireHub</h2>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "This platform has completely transformed how I search and apply for jobs. 
              The process is seamless and efficient."
            </p>
            <footer className="text-sm">Sofia Davis</footer>
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