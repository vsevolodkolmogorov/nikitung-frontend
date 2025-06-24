"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface RatingData {
  category: string
  score: number
}

interface PlaceRatingChartProps {
  ratings: RatingData[]
}

export default function PlaceRatingChart({ ratings }: PlaceRatingChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clear any existing content
    chartRef.current.innerHTML = ""

    ratings.forEach((rating) => {
      // Create the rating bar container
      const barContainer = document.createElement("div")
      barContainer.className = "flex items-center mb-4"

      // Category label
      const label = document.createElement("div")
      label.className = "w-1/3 text-sm font-medium text-gray-700"
      label.textContent = rating.category

      // Bar container
      const progressContainer = document.createElement("div")
      progressContainer.className = "w-2/3 flex items-center"

      // Progress bar background
      const barBg = document.createElement("div")
      barBg.className = "flex-1 h-4 bg-gray-100 rounded-full overflow-hidden"

      // Progress bar fill
      const barFill = document.createElement("div")
      const percentage = (rating.score / 5) * 100
      barFill.className = "h-full rounded-full transition-all duration-1000"
      barFill.style.width = "0%"

      // Set color based on score
      if (rating.score >= 4) {
        barFill.className += " bg-gradient-to-r from-teal-400 to-teal-500"
      } else if (rating.score >= 3) {
        barFill.className += " bg-gradient-to-r from-cyan-400 to-cyan-500"
      } else if (rating.score >= 2) {
        barFill.className += " bg-gradient-to-r from-yellow-400 to-yellow-500"
      } else {
        barFill.className += " bg-gradient-to-r from-red-400 to-red-500"
      }

      // Score value
      const scoreValue = document.createElement("div")
      scoreValue.className = "ml-3 text-sm font-semibold text-gray-700"
      scoreValue.textContent = rating.score.toFixed(1)

      // Append elements
      barBg.appendChild(barFill)
      progressContainer.appendChild(barBg)
      progressContainer.appendChild(scoreValue)
      barContainer.appendChild(label)
      barContainer.appendChild(progressContainer)
      chartRef.current.appendChild(barContainer)

      // Animate the bar fill
      setTimeout(() => {
        barFill.style.width = `${percentage}%`
      }, 100)
    })
  }, [ratings])

  return (
      <Card className="bg-white/50 border-cyan-100">
        <CardContent className="p-6">
          {ratings.length === 0 ? (
              <p className="text-center text-gray-500">Нет оценок</p>
          ) : (
              <div ref={chartRef} className="space-y-4"></div>
          )}
        </CardContent>
      </Card>
  )
}
