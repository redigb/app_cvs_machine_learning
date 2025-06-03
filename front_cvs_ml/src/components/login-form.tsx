"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Eye, EyeOff, Mail, Lock, UserPlus, Briefcase, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [dni, setDni] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("postulante")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de login - aquí determinaríamos el tipo de usuario desde la BD
    setTimeout(() => {
      setIsLoading(false)
      // Por ahora usamos el tipo seleccionado en registro, en producción vendría de la BD
      if (tipoUsuario === "postulante") {
        router.push("/postulante/dashboard")
      } else {
        router.push("/ciudadano/dashboard")
      }
    }, 1500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de registro
    setTimeout(() => {
      setIsLoading(false)
      // Redirigir según el tipo de usuario
      if (tipoUsuario === "postulante") {
        router.push("/postulante/cv")
      } else {
        router.push("/ciudadano/dashboard")
      }
    }, 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r from-purple-500 to-purple-600">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Acceso al Sistema</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Selecciona tu tipo de acceso para continuar
            </CardDescription>
            <TabsList className="grid grid-cols-2 mt-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            <TabsContent value="login" className="space-y-6">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Selector de tipo de usuario en login también */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de usuario</Label>
                  <RadioGroup value={tipoUsuario} onValueChange={setTipoUsuario} className="grid grid-cols-1 gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Label
                        htmlFor="postulante-login"
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          tipoUsuario === "postulante"
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                        }`}
                      >
                        <RadioGroupItem value="postulante" id="postulante-login" />
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                            <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">Busco trabajo</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Quiero postular a vacantes laborales
                            </div>
                          </div>
                        </div>
                      </Label>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Label
                        htmlFor="ciudadano-login"
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          tipoUsuario === "ciudadano"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <RadioGroupItem value="ciudadano" id="ciudadano-login" />
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">Necesito trámites</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Quiero realizar gestiones municipales
                            </div>
                          </div>
                        </div>
                      </Label>
                    </motion.div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">
                      Recordarme
                    </Label>
                  </div>
                  <Link
                    href="/recuperar-password"
                    className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              {/* Selector de tipo de usuario */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ¿Qué tipo de usuario eres?
                </Label>
                <RadioGroup value={tipoUsuario} onValueChange={setTipoUsuario} className="grid grid-cols-1 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="postulante"
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        tipoUsuario === "postulante"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                      }`}
                    >
                      <RadioGroupItem value="postulante" id="postulante" />
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                          <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">Busco trabajo</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Quiero postular a vacantes laborales
                          </div>
                        </div>
                      </div>
                    </Label>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="ciudadano"
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        tipoUsuario === "ciudadano"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <RadioGroupItem value="ciudadano" id="ciudadano" />
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">Necesito trámites</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Quiero realizar gestiones municipales
                          </div>
                        </div>
                      </div>
                    </Label>
                  </motion.div>
                </RadioGroup>
              </div>

              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Juan"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Apellido
                    </Label>
                    <Input
                      id="apellido"
                      type="text"
                      placeholder="Pérez"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dni" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    DNI
                  </Label>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="12345678"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input id="register-email" type="email" placeholder="tu@email.com" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                    Acepto los{" "}
                    <Link
                      href="/terminos"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      términos y condiciones
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className={`w-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                    tipoUsuario === "postulante"
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  } text-white`}
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Registrando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Crear cuenta
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <div className="w-full text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Al acceder, aceptas nuestra{" "}
                <Link
                  href="/privacidad"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Política de Privacidad
                </Link>
              </p>
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </motion.div>
  )
}
