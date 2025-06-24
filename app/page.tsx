import { Suspense } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import PlacesList from "@/components/places-list"
import AddPlaceSection from "@/components/add-place-section"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
            <Header />
            <main>
                <HeroSection />
                <AddPlaceSection />
                <Suspense fallback={<div className="flex justify-center p-8">Загружаем места...</div>}>
                    <PlacesList />
                </Suspense>
            </main>
        </div>
    )
}