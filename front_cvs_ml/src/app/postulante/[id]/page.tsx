"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    Briefcase,
    FileText,
    Upload,
    CheckCircle,
    User,
    Mail,
    Phone,
    GraduationCap,
    Star,
    Send,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Types and apis
import { obtnerVacanteId } from "@/service/VacantesService"
import { obtnerCvIdUsuario } from "@/service/cv_Docs"
import { postulacionUser } from "@/service/PostulacionService"
import { useAuthStore } from "@/service/store/auth"
import { Vacante } from "@/components/types/Vacantes"
import { UserDoCv } from "@/components/types/userData"

export default function PostulacionPage() {

    const profile = useAuthStore((state) => state.profile);

    const params = useParams()
    const router = useRouter()
    const vacanteId = params.id as string

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [postulacionEnviada, setPostulacionEnviada] = useState(false)


    // Consultas // Vacante y cv user
    const [vacante, setVacante] = useState<Vacante | null>(null);
    const [cvPostulante, setCvPostulante] = useState<UserDoCv | null>(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [errorVacante, setErrorVacante] = useState(false);

    const [postulacionError, setPostulacionError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setErrorVacante(false); // Resetear estado de error al inicio de cada fetch
            setVacante(null); // Limpiar vacante anterior
            setCvPostulante(null); // Limpiar CV anterior

            try {
                // PRIMERA LLAMADA: Obtener la vacante
                const vacanteResponse = await obtnerVacanteId(vacanteId);
                setVacante(vacanteResponse);

                // SEGUNDA LLAMADA: Intentar obtener el CV del postulante
                let cvData: UserDoCv | null = null;
                if (profile?.id) { // Solo intentar si hay un usuario logueado
                    try {
                        cvData = await obtnerCvIdUsuario();
                        console.log("CV del postulante obtenido:", cvData);
                    } catch (cvError) {
                        // Este catch maneja solo los errores de la llamada al CV
                        console.warn("No se pudo obtener el CV del postulante. La vacante se mostrará de todas formas.", cvError);
                        // cvData ya es null, no es necesario hacer setCvPostulante(null) aquí
                    }
                }
                setCvPostulante(cvData); // Establece el CV (será null si falló o no existe)

            } catch (mainError) {
                // Este catch solo se ejecuta si falló la obtención de la VACANTE
                console.error("Error crítico al obtener la vacante:", mainError);
                setVacante(null); // Asegurarse de que la vacante es null
                setErrorVacante(true); // Marcar que hubo un error con la vacante
            } finally {
                setLoading(false); // Finalmente, la carga ha terminado
            }
        };
        if (vacanteId) { // Asegurarse de que hay un ID de vacante para buscar
            fetchData();
        } else {
            setLoading(false);
            setVacante(null);
            setErrorVacante(true); // Si no hay ID, se considera un error o no encontrada
        }
    }, [vacanteId, profile?.id]);
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="py-16">
                    <div className="container mx-auto px-8 lg:px-16 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cargando vacante...</h1>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    if (!vacante) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="py-16">
                    <div className="container mx-auto px-8 lg:px-16 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vacante no encontrada</h1>
                        <Link href="/postulacion/vacantes">
                            <Button className="mt-4">Ver todas las vacantes</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleSubmitPostulacion = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!vacanteId) {
            setPostulacionError("No se pudo obtener el ID de la vacante.");
            return;
        }
        setIsSubmitting(true);
        setPostulacionError(null); // Limpiar errores anteriores
        try {
            const response = await postulacionUser(vacanteId);
            console.log("Respuesta de la postulación:", response); // Aquí puedes ver la respuesta de tu backend
            setPostulacionEnviada(true);
            // Opcional: Redirigir o hacer algo después de una postulación exitosa
            // setTimeout(() => {
            //     router.push("/postulante/mis-postulaciones");
            // }, 2000);
        } catch (error) {
            console.error("Error al postular:", error);
            setPostulacionError("Error desconocido al postular.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (postulacionEnviada) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="py-16">
                    <div className="container mx-auto px-8 lg:px-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                                <CardContent className="p-12">
                                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        ¡Postulación Enviada Exitosamente!
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                                        Tu postulación para <strong>{vacante.titulo}</strong> ha sido recibida. Te contactaremos pronto con
                                        actualizaciones sobre el proceso de selección.
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
                                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                                            Puedes seguir el estado de tu postulación desde tu dashboard. Te enviaremos notificaciones por
                                            correo electrónico sobre cada etapa del proceso.
                                        </p>
                                    </div>
                                    <Button
                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                        size="lg"
                                        onClick={() => router.push("/postulante/dashboard")}
                                    >
                                        Ir al Dashboard
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="py-12">
                <div className="container mx-auto px-8 lg:px-16">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <Button variant="ghost" asChild className="mb-4">
                            <Link href="/postulacion/vacantes">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a vacantes
                            </Link>
                        </Button>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Información de la vacante */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                                                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">{vacante.titulo}</CardTitle>
                                                <p className="text-gray-600 dark:text-gray-300">{vacante.area}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {vacante.ubicacion}
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                {vacante.salario}
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2" />
                                                {vacante.puestos} vacante(s)
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Requisitos</h3>
                                            <ul className="space-y-2">
                                                {vacante.requisitos.map((requisito, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                        <span className="text-gray-600 dark:text-gray-300">{requisito}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Formulario de postulación */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                                            <Send className="h-5 w-5 mr-2" />
                                            Enviar Postulación
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <form onSubmit={handleSubmitPostulacion} className="space-y-6">
                                            {/* Datos del usuario */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Tus Datos</h4>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-3">
                                                    <div className="flex items-center">
                                                        <User className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-gray-700 dark:text-gray-300">{profile.name}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-gray-700 dark:text-gray-300">{profile.telefono}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CV */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Currículum Vitae</h4>
                                                {cvPostulante ? (
                                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                                                <span className="text-green-700 dark:text-green-300 font-medium">
                                                                    {cvPostulante.nombreOriginal}
                                                                </span>
                                                            </div>
                                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                Listo
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-600 dark:text-gray-400 mb-2">No tienes CV subido</p>
                                                        <Link href={"/postulante/cv"}>
                                                            <Button variant="outline" size="sm">
                                                                Subir CV
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>


                                            {/* Botón de envío */}
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                                                disabled={!cvPostulante || isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Enviando postulación...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <Send className="h-5 w-5 mr-2" />
                                                        Enviar Postulación
                                                    </div>
                                                )}
                                            </Button>

                                            {!cvPostulante && (
                                                <p className="text-amber-600 dark:text-amber-400 text-sm text-center">
                                                    Necesitas subir tu CV para poder postular
                                                </p>
                                            )}
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Información adicional */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                    <CardContent className="p-6">
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Proceso de Selección</h4>
                                        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
                                            <li className="flex items-center">
                                                <Star className="h-4 w-4 mr-2" />
                                                Revisión de CV y su perfil
                                            </li>
                                            <li className="flex items-center">
                                                <Star className="h-4 w-4 mr-2" />
                                                Evaluación por nuestro agente IA
                                            </li>
                                            <li className="flex items-center">
                                                <Star className="h-4 w-4 mr-2" />
                                                Entrevista personal
                                            </li>
                                            <li className="flex items-center">
                                                <Star className="h-4 w-4 mr-2" />
                                                Resultado final
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}