import { Header } from "@/components/Header"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
