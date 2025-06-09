'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

import { motion } from "framer-motion"
import { FileText, Upload, CheckCircle, ArrowRight } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/Header"
import { Footer } from "@/components/footer"

export default function PostulanteSubirCVPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsUploading(true)

        // Simulación de carga
        setTimeout(() => {
            setIsUploading(false)
            setUploadComplete(true)

            // Redirigir al dashboard de postulante después de completar
            setTimeout(() => {
                router.push("/postulante/dashboard")
            }, 2000)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="py-16">
                <div className="container mx-auto px-8 lg:px-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm max-w-3xl mx-auto">
                            <CardHeader className="text-center pb-6">
                                <motion.div
                                    className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r from-purple-500 to-purple-600"
                                    whileHover={{ rotate: 5, scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <FileText className="h-10 w-10 text-white" />
                                </motion.div>
                                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Sube tu Currículum
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                                    Completa tu perfil profesional para poder postular a las vacantes disponibles
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8">
                                {!uploadComplete ? (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="profesion" className="text-gray-700 dark:text-gray-300">
                                                        Profesión
                                                    </Label>
                                                    <Input
                                                        id="profesion"
                                                        placeholder="Ej: Ingeniero de Sistemas"
                                                        className="border-gray-300 dark:border-gray-600"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="experiencia" className="text-gray-700 dark:text-gray-300">
                                                        Años de experiencia
                                                    </Label>
                                                    <Select required>
                                                        <SelectTrigger className="border-gray-300 dark:border-gray-600">
                                                            <SelectValue placeholder="Selecciona" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="0-1">Menos de 1 año</SelectItem>
                                                            <SelectItem value="1-3">1 - 3 años</SelectItem>
                                                            <SelectItem value="3-5">3 - 5 años</SelectItem>
                                                            <SelectItem value="5-10">5 - 10 años</SelectItem>
                                                            <SelectItem value="10+">Más de 10 años</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="habilidades" className="text-gray-700 dark:text-gray-300">
                                                    Principales habilidades
                                                </Label>
                                                <Textarea
                                                    id="habilidades"
                                                    placeholder="Describe tus principales habilidades y competencias profesionales"
                                                    className="border-gray-300 dark:border-gray-600 min-h-[100px]"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="cv" className="text-gray-700 dark:text-gray-300">
                                                    Archivo CV (PDF, DOC, DOCX)
                                                </Label>
                                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        className="flex flex-col items-center justify-center cursor-pointer"
                                                        onClick={() => document.getElementById("cv-upload")?.click()}
                                                    >
                                                        <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-4" />
                                                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                            {selectedFile ? selectedFile.name : "Arrastra tu archivo o haz clic para seleccionar"}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-500">Máximo 5MB</p>
                                                        <Input
                                                            id="cv-upload"
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            className="hidden"
                                                            onChange={handleFileChange}
                                                            required
                                                        />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg"
                                                disabled={isUploading}
                                            >
                                                {isUploading ? (
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                                        Subiendo archivo...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <Upload className="h-5 w-5 mr-2" />
                                                        Subir currículum
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <motion.div
                                        className="text-center py-8"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                            ¡CV subido correctamente!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                                            Tu currículum ha sido procesado y ahora puedes postular a las vacantes disponibles.
                                        </p>
                                        <Button
                                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                            size="lg"
                                            onClick={() => router.push("/postulante/dashboard")}
                                        >
                                            Ir al dashboard
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}