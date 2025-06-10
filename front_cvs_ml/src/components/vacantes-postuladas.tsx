"use client"

import { Upload, Brain, Bell, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export function HowItWorks() {
    const steps = [
        {
            icon: Upload,
            title: "Sube Documentos",
            description:
                "Carga tu CV, certificados y documentos necesarios de forma segura. El sistema acepta PDF, Word e imágenes.",
            color: "from-blue-500 to-blue-600",
        },
        {
            icon: Brain,
            title: "Análisis Automático",
            description:
                "La IA analiza tus documentos, extrae información relevante y verifica que cumples con los requisitos.",
            color: "from-purple-500 to-purple-600",
        },
        {
            icon: Bell,
            title: "Seguimiento Real",
            description:
                "Recibe notificaciones instantáneas sobre el estado de tu postulación o trámite en cada etapa del proceso.",
            color: "from-green-500 to-green-600",
        },
        {
            icon: CheckCircle,
            title: "Resultado Final",
            description:
                "Obtén tu respuesta final con detalles completos y, si es necesario, instrucciones para los siguientes pasos.",
            color: "from-emerald-500 to-emerald-600",
        },
    ]

    return (
        <section className="py-24 lg:py-32 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-8 lg:px-16">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl lg:text-7xl font-bold text-black dark:text-white mb-8 leading-tight">
                        Cómo Funciona el
                        <br />
                        <span className="text-gray-500 dark:text-gray-400">Sistema</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Proceso simple y automatizado para gestionar tus documentos, postular a vacantes y realizar trámites
                        municipales con inteligencia artificial.
                    </p>
                </motion.div>

                {/* Grid de pasos del proceso en cards */}
                <div className="grid lg:grid-cols-4 gap-8 mt-20">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                        >
                            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                                <CardContent className="p-8 text-center space-y-6">
                                    <motion.div
                                        className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <step.icon className="h-10 w-10 text-white" />
                                    </motion.div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-black dark:text-white">
                                            {index + 1}. {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Sección adicional explicativa en card */}
                <motion.div
                    className="mt-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        <CardContent className="p-12">
                            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                                ¿Qué puedes hacer en el sistema?
                            </h3>
                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Card 1: Postulaciones */}
                                <motion.div className="space-y-6" whileHover={{ scale: 1.02 }}>
                                    <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                        <CardContent className="p-6">
                                            <h4 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                                Postulaciones Laborales
                                            </h4>
                                            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                                                {[
                                                    "Subir tu CV y documentos de respaldo",
                                                    "Postular a múltiples vacantes simultáneamente",
                                                    "Recibir evaluación automática de tu perfil",
                                                    "Seguimiento del proceso de selección",
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-center space-x-3">
                                                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Card 2: Trámites */}
                                <motion.div className="space-y-6" whileHover={{ scale: 1.02 }}>
                                    <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 transition-colors">
                                        <CardContent className="p-6">
                                            <h4 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                                Trámites Municipales
                                            </h4>
                                            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                                                {[
                                                    "Solicitar certificados y constancias",
                                                    "Gestionar licencias y permisos",
                                                    "Realizar pagos en línea",
                                                    "Descargar documentos procesados",
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-center space-x-3">
                                                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </section>
    )
}
