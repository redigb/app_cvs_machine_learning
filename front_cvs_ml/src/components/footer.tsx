import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información principal */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">CivicaIA</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                Estamos aquí para amplificar tu juego de participación, forjar conexiones más profundas, y hacer
                despegar tu marca con la magia de Web3.
              </p>
            </div>

            {/* Iconos sociales minimalistas */}
            <div className="flex space-x-4">
              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Enlaces y contacto */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Enlaces */}
            <div>
              <h4 className="font-bold text-black dark:text-white mb-6">Enlaces</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/postulacion/vacantes"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Vacantes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tramites"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Trámites
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seguimiento"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Seguimiento
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ayuda"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Ayuda
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold text-black dark:text-white mb-6">Contacto</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Plaza de Armas s/n, Yau, Perú</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">(01) 234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">contacto@municipalidadyau.gob.pe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2024 Municipalidad Provincial de Yau. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacidad"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
            >
              Términos y condiciones
            </Link>
            <Link
              href="/terminos"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
