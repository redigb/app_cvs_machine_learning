"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/footer"
import { VacantesGrid } from "@/components/vacantes-grid"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Briefcase, Users, TrendingUp } from "lucide-react"

// consumo-api
import { listVacantes } from "@/service/VacantesService"
import { Vacante } from "@/components/types/Vacantes"

export default function VacantesPage() {

  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  useEffect(() => {
    async function fetchVacantes() {
      try {
        const data = await listVacantes();
        setVacantes(data);
      } catch (error) {
        console.error("Error cargando vacantes:", error);
      }
    }
    fetchVacantes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-8 lg:px-16">
          {/* Hero section para vacantes */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h1 className="text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
                        Vacantes
                        <br />
                        <span className="text-gray-500 dark:text-gray-400">Laborales</span>
                      </h1>
                    </motion.div>
                    <motion.p
                      className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      Encuentra oportunidades de trabajo en la Municipalidad Provincial de Yau. Postula con IA y recibe
                      evaluación automática de tu perfil.
                    </motion.p>
                  </div>

                  {/* Estadísticas en cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Card className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                        <CardContent className="p-4 text-center">
                          <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{vacantes.length}</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Vacantes Activas</div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      <Card className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">95%</div>
                          <div className="text-sm text-purple-600 dark:text-purple-500">Éxito IA</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <VacantesGrid vacantesData={vacantes} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
