"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Users, Search, Filter, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

// consumo-api
import { useAuthStore } from "@/service/store/auth"
import { useGlobalStore } from "@/service/store/GlobalState"
import { Vacante } from "./types/Vacantes"

interface VacantesGridProps {
  vacantesData: Vacante[];
}

export function VacantesGrid({ vacantesData }: VacantesGridProps) {

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState("all")
  const isAuth = useAuthStore((state) => state.isAuth);
  const router = useRouter()

  // Filtrar vacantes por búsqueda y área
  const filteredVacantes = vacantesData.filter((vacante) => {
    const matchesSearch =
      vacante.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacante.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "all" || vacante.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const getGradientByArea = (area: string): string => {
    switch (area.toLowerCase()) {
      case "administración":
        return "from-blue-500 to-blue-600";
      case "desarrollo social":
        return "from-green-500 to-green-600";
      case "tecnología":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  }

  const setSelectedVacanteId = useGlobalStore((state) => state.setSelectedVacanteId);
  const handlePostular = (IdVacante: string) => {
    if (isAuth) { return router.replace(`/postulante/${IdVacante}`); }
    setSelectedVacanteId(IdVacante); // almacenar la vacante - selecionada solo ID
    router.push("/login")
  }

  return (
    <div className="space-y-8">
      {/* Filtros en card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar por título o área..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="h-12 border-gray-300 dark:border-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                    <SelectItem value="Finanzas">Finanzas</SelectItem>
                    <SelectItem value="Desarrollo Social">Desarrollo Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid de vacantes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVacantes.map((vacante, index) => (
          <motion.div
            key={vacante.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 leading-tight">
                    {vacante.titulo}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1"
                  >
                    {vacante.estado}
                  </Badge>
                </div>

                {/* Información básica en mini cards */}
                <div className="space-y-3">
                  <div className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{vacante.ubicacion}</span>
                  </div>

                  <div className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Users className="h-4 w-4 mr-3 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{vacante.puestos} vacante(s)</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-sm">
                    {vacante.area}
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{vacante.modalidad}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Requisitos principales:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    {vacante.requisitos.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <span className="font-semibold text-green-700 dark:text-green-400">{vacante.salario}</span>
                    </div>
                  </CardContent>
                </Card>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className={`w-full bg-gradient-to-r ${getGradientByArea(vacante.area)} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    size="lg"
                    onClick={() => handlePostular(vacante.id)}
                  >
                    Postular ahora
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredVacantes.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xl">
                No se encontraron vacantes que coincidan con tu búsqueda.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}


