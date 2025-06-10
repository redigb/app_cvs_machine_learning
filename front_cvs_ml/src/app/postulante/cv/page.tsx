'use client'
import { useEffect, useState } from "react"
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

// api - upload -type
import { useAuthStore } from "@/service/store/auth"
import { UserDoCv } from "@/components/types/userData"
import { uploadCv, updateCVIdUsuario, obtnerCvIdUsuario } from "@/service/cv_Docs"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"


export default function PostulanteSubirCVPage() {

    const profile = useAuthStore((state) => state.profile);
    const idUsuario = profile.id;

    const [isUploading, setIsUploading] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const [existingCv, setExistingCv] = useState<UserDoCv | null>(null); // Para almacenar el CV existente
    const [loadingCv, setLoadingCv] = useState(true); // Estado para cargar el CV existente
    const [uploadError, setUploadError] = useState<string | null>(null);
    const router = useRouter()

    // useEffect para verificar si el usuario ya tiene un CV al cargar la página
    useEffect(() => {
        const checkExistingCv = async () => {
            if (!idUsuario) {
                setLoadingCv(false);
                return;
            }
            try {
                const cv = await obtnerCvIdUsuario();
                setExistingCv(cv);
            } catch (error) {
                // Si hay un error (ej. 404 Not Found porque no hay CV), simplemente no se setea existingCv
                console.info("No se encontró un CV existente para el usuario o hubo un error al obtenerlo.", error);
                setExistingCv(null); // Aseguramos que no hay CV existente
            } finally {
                setLoadingCv(false);
            }
        };
        checkExistingCv();
    }, [idUsuario]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError(null); // Limpiar errores anteriores
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Opcional: Validar el tipo de archivo y tamaño aquí
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                setUploadError("Tipo de archivo no permitido. Solo se aceptan PDF, DOC, DOCX.");
                setSelectedFile(null);
                return;
            }
            if (file.size > maxSize) {
                setUploadError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadError("Por favor, selecciona un archivo CV.");
            return;
        }

        setIsUploading(true);
        setUploadError(null); // Limpiar errores antes de la subida

        try {
            if (existingCv && existingCv.id) {
                // Si ya existe un CV, se intenta actualizar
                await updateCVIdUsuario(profile.id, selectedFile);
                toast.success("CV actualizado correctamente.");
            } else {
                // Si no existe un CV, se sube uno nuevo
                await uploadCv(selectedFile);
                toast.success("CV subido correctamente.");
            }
            setUploadComplete(true);
        } catch (error) {
            console.error("Error al subir/actualizar el CV:", error);
            setUploadError("Error al procesar el CV. Por favor, inténtalo de nuevo.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!idUsuario) {
        // Manejar el caso donde no hay perfil de usuario (ej. redirigir a login)
        // Puedes agregar un useEffect aquí para redirigir si es necesario
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-gray-900 dark:text-gray-100">Cargando perfil de usuario o no autenticado...</p>
            </div>
        );
    }

    if (loadingCv) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="py-16">
                    <div className="container mx-auto px-8 lg:px-16 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verificando CV existente...</h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">Un momento por favor...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
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
                                    {existingCv ? "Actualiza tu Currículum" : "Sube tu Currículum"}
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                                    {existingCv
                                        ? "Ya tienes un CV subido. Puedes actualizarlo subiendo una nueva versión."
                                        : "Completa tu perfil profesional para poder postular a las vacantes disponibles."
                                    }
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8">
                                {!uploadComplete ? (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {existingCv && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-4">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                                    <p className="text-blue-700 dark:text-blue-300 font-medium">
                                                        CV actual: {existingCv.nombreOriginal}
                                                    </p>
                                                    {existingCv.urlPublica && (
                                                        <a href={existingCv.urlPublica} target="_blank" rel="noopener noreferrer"
                                                            className="ml-auto text-blue-500 hover:underline text-sm">
                                                            Ver actual
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

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
                                                     
                                                    />
                                                </motion.div>
                                            </div>
                                            {uploadError && (
                                                <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg"
                                                disabled={isUploading || !selectedFile} // Deshabilitar si no hay archivo seleccionado
                                            >
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                                        Subiendo archivo...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        <Upload className="h-5 w-5 mr-2" />
                                                        {existingCv ? "Actualizar currículum" : "Subir currículum"}
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
                                            ¡CV {existingCv ? "actualizado" : "subido"} correctamente!
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
            <Toaster />
        </div>
    );
}