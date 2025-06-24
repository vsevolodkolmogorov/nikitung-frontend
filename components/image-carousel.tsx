"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Placeholder images for the carousel
const placeholderImages = [
  { url: "/placeholder.svg?height=600&width=1200", alt: "Фото места 1" },
  { url: "/placeholder.svg?height=600&width=1200", alt: "Фото места 2" },
  { url: "/placeholder.svg?height=600&width=1200", alt: "Фото места 3" },
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const images = placeholderImages

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full bg-gradient-to-br from-cyan-100 to-teal-100 group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex].url})` }}
        className="w-full h-full bg-center bg-cover duration-500"
      ></div>

      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden group-hover:flex absolute top-1/2 left-4 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 rounded-full"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden group-hover:flex absolute top-1/2 right-4 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 rounded-full"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`cursor-pointer w-3 h-3 rounded-full ${
              currentIndex === slideIndex ? "bg-white" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}
