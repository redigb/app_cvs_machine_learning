

import { Footer } from "@/components/footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/vacantes-postuladas";


export default function Home() {
  return (
     <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main>
          <Hero />
          <HowItWorks />
        </main>
        <Footer />
    </div>
  );
}
