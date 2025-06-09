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


export default function CiudadanoDashboardPage() {
    const [activeTab, setActiveTab] = useState("tramites")

    const client = useRef<Client | null>(null);
    const userId = "ce56d0c4-ed50-4577-aa4f-e5f403231752";
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
                    toast("s🔔 Notificación: Su fue revisado")
                    // Aquí puedes mostrar toast, actualizar estado, etc.
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
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="py-12">
                 <Toaster />
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
                                        <h1 className="text-3xl font-bold">Bienvenido, Juan Pérez</h1>
                                        <p className="text-purple-200">Panel de postulante - Gestiona tus aplicaciones laborales</p>
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

                        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-7">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold">Bienvenido, Juan Pérez</h1>
                                        <p className="text-purple-200">Panel de postulante - Gestiona tus aplicaciones laborales</p>
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
                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center space-x-3">
                                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                                        Analista de Sistemas
                                                                    </h3>
                                                                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                                        En evaluación
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="h-4 w-4 mr-1" />
                                                                        Yau, Perú
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Calendar className="h-4 w-4 mr-1" />
                                                                        Postulado: 10/01/2024
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                                        S/. 3,500 - S/. 4,500
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="shrink-0" asChild>
                                                                <Link href="/postulante/postulacion/1">
                                                                    Ver detalles
                                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center space-x-3">
                                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                                        Contador Público
                                                                    </h3>
                                                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                        Entrevista programada
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="h-4 w-4 mr-1" />
                                                                        Yau, Perú
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Calendar className="h-4 w-4 mr-1" />
                                                                        Postulado: 05/01/2024
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                                        S/. 4,000 - S/. 5,000
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="shrink-0" asChild>
                                                                <Link href="/postulante/postulacion/2">
                                                                    Ver detalles
                                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="border border-gray-200 dark:border-gray-700">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center space-x-3">
                                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                                        Asistente Social
                                                                    </h3>
                                                                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                                        No seleccionado
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="h-4 w-4 mr-1" />
                                                                        Yau, Perú
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Calendar className="h-4 w-4 mr-1" />
                                                                        Postulado: 20/12/2023
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                                        S/. 2,800 - S/. 3,500
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="shrink-0" asChild>
                                                                <Link href="/postulante/postulacion/3">
                                                                    Ver detalles
                                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
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
                                                        <Button variant="outline" className="w-full">
                                                            Actualizar CV
                                                        </Button>
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
            <Footer />
        </div>
    );
}