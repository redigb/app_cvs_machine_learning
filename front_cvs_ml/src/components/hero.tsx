"use client"

import Link from "next/link"
import { CardContent } from "@/components/ui/card"
import { Briefcase, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { ButtonGlowEffect } from "./mi_ui/ButtonGlowEffect"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center bg-gray-50 dark:bg-gray-900">
            {/* Patrón de cuadrícula de fondo */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container mx-auto px-8 lg:px-16 relative z-10 mt-12">
                {/* Badge superior mejorado */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm shadow-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        Sistema habilitado para
                        <div className="ml-3 flex items-center space-x-1">
                            <div className="w-1 h-1 bg-black dark:bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-black dark:bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-black dark:bg-white rounded-full"></div>
                            <span className="ml-2 font-semibold">MUNICIPALIDAD DE YAU</span>
                        </div>
                    </div>
                </motion.div>

                {/* Layout principal de tres columnas */}
                <div className="grid lg:grid-cols-3 gap-20 items-start">
                    {/* Columna izquierda - Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div>
                            <h2 className="text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
                                Gestión de
                                <br />
                                Documentos y
                                <br />
                                <span className="text-gray-500 dark:text-gray-400">Trámites IA</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                Sistema inteligente para: subir tu CV y realizar trámites municipales de
                                forma automatizada.
                            </p>
                        </div>
                    </motion.div>

                    {/* Elemento visual central con animación */}
                    <motion.div
                        className="flex flex-col items-center space-y-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        {/* Forma 3D abstracta con animación mejorada */}
                        <div className="relative w-80 h-80 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl transform rotate-45 shadow-2xl"
                                animate={{
                                    rotate: [45, 50, 45],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="absolute inset-4 bg-gradient-to-tr from-purple-300 via-white to-purple-200 rounded-3xl transform -rotate-45 shadow-xl"
                                animate={{
                                    rotate: [-45, -40, -45],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                            />
                            <motion.div
                                className="absolute inset-8 bg-gradient-to-bl from-purple-600 via-purple-700 to-black rounded-2xl transform rotate-12 shadow-lg"
                                animate={{
                                    rotate: [12, 17, 12],
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                            />
                            <motion.div
                                className="relative z-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-2xl"
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                                    rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                                }}
                            />
                        </div>

                        {/* Dos botones principales en card */}
                        <div className="flex flex-row items-center justify-center space-x-6 mt-10">
                            {/* Botón OUTLINE */}
                            <div className="w-[280px]">
                                <ButtonGlowEffect
                                    variant="outline"
                                    glowColor="rgba(148, 163, 184, 0.6)"
                                    className="w-full relative inline-flex items-center justify-center
                                    border-2 border-slate-700 text-slate-700 dark:text-slate-300
                                    bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent
                                    dark:hover:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent
                                    hover:text-slate-900 dark:hover:text-white
                                    px-6 py-7 text-lg font-semibold rounded-2xl 
                                    shadow-[0_0_20px_rgba(148,163,184,0.6)]
                                    transition-all duration-300 ease-in-out hover:scale-105"
                                    disabled
                                >
                                    <Link href="/postulacion/vacantes" className="w-full flex justify-center items-center">
                                        <span className="flex items-center">
                                            Tramitar sus documentos.
                                            <FileText className="h-5 w-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                </ButtonGlowEffect>
                            </div>

                            {/* Botón RELLENO */}
                            <div className="w-[280px]">
                                <ButtonGlowEffect
                                    glowColor="rgba(148, 163, 184, 0.6)"
                                    className="w-full bg-gradient-to-r from-slate-600 to-slate-800
                                    hover:from-slate-700 hover:to-slate-900 text-white
                                    px-6 py-7 text-lg font-semibold rounded-2xl 
                                    shadow-xl shadow-slate-600/30
                                    transition-all duration-300 transform hover:scale-105"
                                >
                                    <Link href="/postulacion/vacantes" className="w-full flex justify-center items-center">
                                        <span className="flex items-center">
                                            Postular para una vacante
                                            <Briefcase className="h-5 w-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                </ButtonGlowEffect>
                            </div>
                        </div>
                    </motion.div>

                    {/* Columna derecha - Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <div>
                            <CardContent className="p-8 space-y-8">
                                <h2 className="text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
                                    Centro de
                                    <br />
                                    <span className="text-gray-500 dark:text-gray-400">Servicios</span>
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Accede a todos los servicios municipales, sube tu currículum para postulaciones y realiza seguimiento
                                    en tiempo real.
                                </p>

                                {/* <motion.div whileHover={{ x: 5 }}>
                                    <Link
                                        href="/tramites"
                                        className="inline-flex items-center text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-medium"
                                    >
                                        Ver todos los servicios
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </motion.div>*/}
                            </CardContent>
                        </div>
                    </motion.div>
                </div>

                {/* Iconos inferiores mejorados */}
                <motion.div
                    className="flex justify-center space-x-6 mt-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <motion.div
                        className="w-3 h-3 bg-purple-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <motion.div
                        className="w-3 h-3 bg-purple-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                    />
                </motion.div>
            </div>
        </section>
    )
}
