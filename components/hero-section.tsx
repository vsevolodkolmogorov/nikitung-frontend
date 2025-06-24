"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Waves } from "lucide-react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToPlaces = () => {
    document.getElementById("places-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
      <section className="relative py-12 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden">
        {/* Optimized Background Elements */}
        <div className="absolute inset-0">
          {/* Simplified water ripples */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-100/30 to-transparent will-change-transform"></div>
          <div className="absolute bottom-8 left-0 w-full h-24 bg-gradient-to-t from-teal-100/20 to-transparent will-change-transform"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div
              className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Optimized Mascot */}
            <div className="relative mb-6 sm:mb-8 flex justify-center">
              <div className="relative">
                {/* Simplified background effect */}
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-cyan-200/15 via-blue-200/20 to-teal-200/15 rounded-full blur-xl will-change-transform"></div>

                {/* Main mascot */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 will-change-transform">
                  <Image
                      src="/nikitung-main.png"
                      alt="Никитунг - ваш проводник по лучшим местам для купания"
                      fill
                      className="object-contain drop-shadow-xl"
                      priority
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Typography */}
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Лучшие места для купания
              </span>
                <span className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent font-medium">
                ждут вас этим летом! 🏊‍♂️
              </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium px-4">
                Открывайте новые водоёмы, делитесь впечатлениями и находите идеальные места для летнего отдыха вместе с
                Никитунгом
              </p>

              {/* Optimized CTA Button */}
              <div className="flex justify-center mt-6 sm:mt-8">
                <Button
                    size="lg"
                    onClick={scrollToPlaces}
                    className="group bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-white/20 will-change-transform h-12 sm:h-auto"
                >
                  <Waves className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Посмотреть места
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
