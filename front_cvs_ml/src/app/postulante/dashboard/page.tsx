"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
    FileText,
    Bell,
    User,
    Clock,
    CheckCircle,
    Calendar,
    ChevronRight,
    Settings,
    HelpCircle,
    Briefcase,
    TrendingUp,
    MapPin,
    DollarSign,
} from "lucide-react"
import Link from "next/link"

// Apertura de web scoket
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner"

// user Data -api
import { listPostulaciones } from "@/service/PostulacionService"
import { useAuthStore } from "@/service/store/auth"
import { PostulacionDTO } from "@/components/types/postualcionUser"


// Interfaz para la estructura de la respuesta del backend
interface BackendResponse {
    message: string;
    data: PostulacionDTO[]; // El array de postulaciones está dentro de 'data'
}

export default function CiudadanoDashboardPage() {
    const profile = useAuthStore((state) => state.profile);
    const [activeTab, setActiveTab] = useState("tramites")

    const client = useRef<Client | null>(null);
    const userId = profile.id;

    const [postulaciones, setPostulaciones] = useState<PostulacionDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // WebSocket (Tu código existente)
    useEffect(() => {
        const socket = new SockJS("http://localhost:3015/ws");

        client.current = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log("WS: ", str),
            onConnect: () => {
                console.log("✅ Conectado al WebSocket");
                client.current?.subscribe(`/topic/postulacion/${userId}`, (message) => {
                    const data = JSON.parse(message.body);
                    console.log("🔔 Notificación:", data);
                    toast("🔔 Notificación: Su CV fue revisado por nuestro agente");
                    // Opcional: Si recibes una actualización de una postulación, puedes actualizarla en el estado 'postulaciones'
                    // setPostulaciones(prev => prev.map(p => p.id === data.id ? data : p));
                    // O, para mayor simplicidad, recargar todas las postulaciones:
                    fetchPostulaciones();
                });
            },
            onStompError: (frame) => {
                console.error("❌ Error STOMP:", frame);
            },
        });

        client.current.activate();

        // 🔃 Cleanup al desmontar
        return () => {
            client.current?.deactivate();
        };
    }, [userId]); // Agregamos userId como dependencia para reconectar si cambia



    // Función para cargar las postulaciones
    const fetchPostulaciones = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await listPostulaciones();
            setPostulaciones(data);
        } catch (err) {
            console.error("Failed to fetch postulaciones:", err);
            setError("No se pudieron cargar las postulaciones. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar postulaciones cuando el componente se monte o el userId esté disponible
    useEffect(() => {
        if (userId) {
            fetchPostulaciones();
        }
    }, [userId]); // Dependencia del userId

    // Función auxiliar para obtener el color de la Badge según el estado
    const getBadgeClassNames = (estado: string) => {
        switch (estado.toUpperCase()) {
            case "PENDIENTE":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "EN_PROCESO": // Si tienes este estado
            case "OBSERVADO":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "APROBADO":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "RECHAZADO":
            case "NO_SELECCIONADO":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300";
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return dateString; // Devuelve la cadena original si hay error
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="py-12">
                <div className="container mx-auto px-8 lg:px-16">
                    {/* Cabecera del Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10"
                    >
                        <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold">Bienvenido, {profile.name}</h1>
                                        <p className="text-purple-200">Panel de postulante - Gestion de tus aplicaciones laborales</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                            <Bell className="h-6 w-6" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                            <Settings className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Estadísticas específicas para postulantes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                                        <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Postulaciones</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                                        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">En proceso</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">2</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Entrevistas</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                                        <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Compatibilidad</p>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">85%</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Contenido principal con tabs específicos para postulantes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                            <CardContent className="p-8">
                                <Tabs defaultValue="postulaciones" onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid grid-cols-3 mb-8">
                                        <TabsTrigger value="postulaciones" className="text-base">
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            Mis Postulaciones
                                        </TabsTrigger>
                                        <TabsTrigger value="perfil" className="text-base">
                                            <User className="h-4 w-4 mr-2" />
                                            Mi Perfil
                                        </TabsTrigger>
                                        <TabsTrigger value="ayuda" className="text-base">
                                            <HelpCircle className="h-4 w-4 mr-2" />
                                            Ayuda
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="postulaciones" className="space-y-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Postulaciones</h2>
                                            <Button
                                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                                                asChild
                                            >
                                                <Link href="/postulacion/vacantes">Nueva postulación</Link>
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {isLoading ? (
                                                <p className="text-center text-gray-600 dark:text-gray-300">Cargando postulaciones...</p>
                                            ) : error ? (
                                                <p className="text-center text-red-500">{error}</p>
                                            ) : postulaciones.length === 0 ? (
                                                <p className="text-center text-gray-600 dark:text-gray-300">No tienes postulaciones aún.</p>
                                            ) : (
                                                postulaciones.map((postulacion) => (
                                                    <motion.div
                                                        key={postulacion.id}
                                                        whileHover={{ y: -5 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <Card className="border border-gray-200 dark:border-gray-700">
                                                            <CardContent className="p-6">
                                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center space-x-3">
                                                                            {/* Título de la Vacante (No está en PostulacionDTO directamente, lo obtendrás si mapeas la Vacante también) */}
                                                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                                                {/* Aquí podrías mostrar el título de la vacante, si el backend te lo envía junto con la postulación.
                                                                        Por ahora, un placeholder o "Vacante ID: {postulacion.vacanteId}" */}
                                                                                Vacante ID: {postulacion.vacanteId.substring(0, 8)}...
                                                                            </h3>
                                                                            <Badge className={getBadgeClassNames(postulacion.estadoPostulacion)}>
                                                                                {postulacion.estadoPostulacion}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                                                                            {/* Estos datos (Ubicación, Salario) NO están en tu PostulacionDTO,
                                                                    son propiedades de la Vacante. Deberías obtenerlos junto con
                                                                    la Postulación (ej. un PostulacionDetalleDTO que incluya la VacanteDTO)
                                                                    o hacer una llamada adicional para obtener los detalles de la vacante.
                                                                    Por ahora, son placeholders. */}
                                                                            <div className="flex items-center">
                                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                                Ubicación de Vacante (N/A)
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                                Postulado: {formatDate(postulacion.enviadoEl)}
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <DollarSign className="h-4 w-4 mr-1" />
                                                                                Salario de Vacante (N/A)
                                                                            </div>
                                                                        </div>
                                                                        {/* Mostrar observación IA si existe */}
                                                                        {postulacion.observacionIa && (
                                                                            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                                                                                <h4 className="font-semibold mb-1">Observación de la IA:</h4>
                                                                                <p>{postulacion.observacionIa}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <Button variant="outline" size="sm" className="shrink-0" asChild>
                                                                        <Link href={`/postulante/postulacion/${postulacion.id}`}>
                                                                            Ver detalles
                                                                            <ChevronRight className="h-4 w-4 ml-1" />
                                                                        </Link>
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="perfil" className="space-y-6">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                                Mi Perfil Profesional
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Mantén tu información actualizada para mejorar tus oportunidades laborales.
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <CardContent className="p-6">
                                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                                                            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                            Currículum Vitae
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                            Actualiza tu CV para mejorar tu perfil profesional.
                                                        </p>
                                                        <Link href='/postulante/cv'>
                                                            <Button variant="outline" className="w-full">
                                                                Actualizar CV
                                                            </Button>
                                                        </Link>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <CardContent className="p-6">
                                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                                                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                            Datos Personales
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                            Edita tu información personal y de contacto.
                                                        </p>
                                                        <Button variant="outline" className="w-full">
                                                            Editar datos
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="ayuda" className="space-y-6">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                                Centro de Ayuda para Postulantes
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Encuentra información específica sobre el proceso de postulación y búsqueda de empleo.
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <CardContent className="p-6 flex flex-col h-full">
                                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                                                            <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                            Cómo Postular
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                                                            Guía paso a paso para postular a vacantes y optimizar tu perfil.
                                                        </p>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            Ver guía
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <CardContent className="p-6 flex flex-col h-full">
                                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                                                            <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Preparar CV</h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                                                            Consejos para crear un currículum efectivo y destacar entre los candidatos.
                                                        </p>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            Ver consejos
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <CardContent className="p-6 flex flex-col h-full">
                                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                                                            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                            Proceso de Selección
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                                                            Entiende las etapas del proceso y qué esperar en cada fase.
                                                        </p>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            Ver proceso
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <CardContent className="p-6 flex flex-col h-full">
                                                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                                                            <HelpCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                            Preguntas Frecuentes
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                                                            Respuestas a las dudas más comunes sobre postulaciones laborales.
                                                        </p>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            Ver FAQ
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
            <Toaster position="top-center" />
            <Footer />
        </div>
    );
}