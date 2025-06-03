"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100/50 dark:bg-slate-900/90 dark:border-slate-800/50">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="flex h-24 items-center justify-between">
          {/* Logo mejorado */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full transition-all group-hover:scale-110"></div>
              <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full transition-all group-hover:scale-110 delay-75"></div>
              <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full transition-all group-hover:scale-110 delay-150"></div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-black dark:text-white tracking-tight">CivicaIA</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
                MUNICIPALIDAD DE YAU
              </div>
            </div>
          </Link>

          {/* Navegación horizontal mejorada */}
          <nav className="flex items-center space-x-10">
            <Link
              href="/"
              className="relative text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 group"
            >
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/postulacion/vacantes"
              className="relative text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 group"
            >
              Vacantes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/tramites"
              className="relative text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 group"
            >
              Trámites
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>


            {/* <Link
              href="/seguimiento"
              className="relative text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 group"
            >
              Seguimiento
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/ayuda"
              className="relative text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 group"
            >
              Ayuda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link> */}
          </nav>

          {/* Botones de acción mejorados */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-11 w-11 rounded-full text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              size="default"
              asChild
              className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Link href="/login">
                <User className="h-4 w-4 mr-2" />
                Acceso Ciudadano
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
