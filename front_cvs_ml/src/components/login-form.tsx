"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

// login & register
import { loginRequest, registerUserRequest } from "@/service/auth"
import { useAuthStore } from "@/service/store/auth"
import { RegisterUser } from "./types/userData"
import { toast } from 'sonner';


export function LoginForm() {


  const [tabValue, setTabValue] = useState("login");
  //secion de usuario
  const isAuth = useAuthStore((state) => state.isAuth);
  const profile = useAuthStore((state) => state.profile);

  const [errorMessage, setErrorMessage] = useState("");
  // Login Form
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register form
  const [userRegister, setUserRegister] = useState<RegisterUser>({
    name: "",
    email: "",
    password: "",
    telefono: "",
    role_user: "POSTULANTE", // o "CIUDADANO"
  });

  const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setUserRegister((prev) => ({
      ...prev,
      role_user: value,
    }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  // si ya tiene una secion rediriigir a su panel:
  useEffect(() => {
    if (isAuth && profile) {
      if (profile.user_rol === "POSTULANTE") {
        router.replace("/postulante/dashboard");
      } else {
        router.replace("/ciudadano/dashboard");
      }
    }
  }, [isAuth, profile, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await loginRequest(email, password);
      const { token, user } = response.data.data;

      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setProfile(user);

      if (user.user_rol === "POSTULANTE") {
        router.push("/postulante/dashboard");
      } else {
        router.push("/ciudadano/dashboard");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        console.log("respuest svL: ", error.response.data.message);
        setErrorMessage("Credenciales incorrectas");
      } else {
        setErrorMessage("No se pudo conectar con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUserRequest(userRegister);
      setIsLoading(false); 
      /*toast("🔔 Notificación: Su formulario fue revisado", {
        duration: 4000,
        position: "top-center",
        className: `
        text-sm shadow-lg font-medium
        bg-white text-gray-900 border border-gray-200
        dark:bg-neutral-900 dark:text-white dark:border-neutral-700
        rounded-lg px-4 py-3
      `,
      });*/
      toast.success("Registro exitoso. Ahora inicia sesión.");
      setTabValue("login");
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error en registro:", error);
      toast.error(
        error?.response?.data?.message || "No se pudo completar el registro."
      );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <Tabs value={tabValue} className="w-full" onValueChange={setTabValue}>
          {/* Cabecera */}
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r from-purple-500 to-purple-600">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Acceso al Sistema</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Selecciona tu tipo de acceso para continuar
            </CardDescription>
            <TabsList className="grid grid-cols-2 w-fit mx-auto mt-6 gap-4 text-center">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-6">
            <TabsContent value="login" className="space-y-6">
              {errorMessage && (
                <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-md border border-red-300 dark:border-red-700">
                  {errorMessage}
                </div>
              )}
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

               {/* <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">
                      Recordarme
                    </Label>
                  </div>
                  <Link
                    href=""
                    className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div> */}

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
                <RadioGroup value={userRegister.role_user} onValueChange={handleRoleChange} className="grid grid-cols-1 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label
                      htmlFor="POSTULANTE"
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${userRegister.role_user === "POSTULANTE"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                        }`}
                    >
                      <RadioGroupItem value="POSTULANTE" id="POSTULANTE" />
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
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${userRegister.role_user === "CIUDADANO"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                    >
                      <RadioGroupItem value="CIUDADANO" id="ciudadano" />
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
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre y Apellido
                  </Label>
                  <Input
                    id="telefono"
                    name="name"
                    type="text"
                    placeholder="su nombre completo aqui!"
                    value={userRegister.name}
                    onChange={handleChangeRegister}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    N° Telefonico
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="text"
                    placeholder="9872533651"
                    value={userRegister.telefono}
                    onChange={handleChangeRegister}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input id="register-email"
                      type="email"
                      name="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      onChange={handleChangeRegister}
                      required />
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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={userRegister.password}
                      onChange={handleChangeRegister}
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
                  {/* <Checkbox id="terms" required />
                 <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                    Acepto los{" "}
                    <Link
                      href="/terminos"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      términos y condiciones
                    </Link>
                  </Label> */}
                </div>

                <Button
                  type="submit"
                  className={`w-full shadow-lg hover:shadow-xl transition-all duration-300 ${userRegister.role_user === "POSTULANTE"
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


        </Tabs>
      </Card>
    </motion.div>
  )
}
