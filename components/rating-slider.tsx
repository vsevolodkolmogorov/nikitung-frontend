"use client"

import { useState } from "react"

interface RatingSliderProps {
  value: number
  onChange: (value: number) => void
  category: string
}

export default function RatingSlider({ value, onChange, category }: RatingSliderProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue !== null ? hoverValue : value

  // Водная тематика для разных категорий
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "purity":
        return {
          labels: [
            { value: 1, label: "Болото", color: "from-amber-600 to-yellow-700" },
            { value: 2, label: "Мутновато", color: "from-orange-500 to-amber-600" },
            { value: 3, label: "Сойдет", color: "from-yellow-400 to-orange-500" },
            { value: 4, label: "Чистенько", color: "from-cyan-400 to-blue-500" },
            { value: 5, label: "Кристалл", color: "from-blue-500 to-cyan-400" },
          ],
        }
      case "logistics":
        return {
          labels: [
            { value: 1, label: "Экспедиция", color: "from-red-500 to-orange-600" },
            { value: 2, label: "Квест", color: "from-orange-500 to-yellow-600" },
            { value: 3, label: "Прогулка", color: "from-yellow-400 to-green-500" },
            { value: 4, label: "Рядышком", color: "from-green-400 to-cyan-500" },
            { value: 5, label: "У дома", color: "from-cyan-400 to-blue-500" },
          ],
        }
      case "vibe":
        return {
          labels: [
            { value: 1, label: "Тоска", color: "from-gray-500 to-slate-600" },
            { value: 2, label: "Скучно", color: "from-slate-400 to-gray-500" },
            { value: 3, label: "Норм", color: "from-blue-400 to-cyan-500" },
            { value: 4, label: "Кайф", color: "from-cyan-400 to-teal-500" },
            { value: 5, label: "Магия", color: "from-teal-400 to-emerald-500" },
          ],
        }
      case "temperature":
        return {
          labels: [
            { value: 1, label: "Ледник", color: "from-blue-600 to-indigo-700" },
            { value: 2, label: "Бррр", color: "from-blue-500 to-cyan-600" },
            { value: 3, label: "Свежо", color: "from-cyan-400 to-blue-500" },
            { value: 4, label: "Тепло", color: "from-green-400 to-cyan-500" },
            { value: 5, label: "Парное", color: "from-orange-400 to-red-500" },
          ],
        }
      case "impression":
        return {
          labels: [
            { value: 1, label: "Ужас", color: "from-red-600 to-pink-700" },
            { value: 2, label: "Мимо", color: "from-orange-500 to-red-600" },
            { value: 3, label: "Зайдет", color: "from-yellow-400 to-orange-500" },
            { value: 4, label: "Супер", color: "from-green-400 to-cyan-500" },
            { value: 5, label: "Рай", color: "from-cyan-400 to-purple-500" },
          ],
        }
      default:
        return {
          labels: [
            { value: 1, label: "1 Никитунг", color: "from-red-500 to-orange-600" },
            { value: 2, label: "2 Никитунга", color: "from-orange-500 to-yellow-600" },
            { value: 3, label: "3 Никитунга", color: "from-yellow-400 to-green-500" },
            { value: 4, label: "4 Никитунга", color: "from-green-400 to-cyan-500" },
            { value: 5, label: "5 Никитунгов", color: "from-cyan-400 to-blue-500" },
          ],
        }
    }
  }

  const theme = getCategoryTheme(category)
  const currentLabel = theme.labels.find((item) => item.value === displayValue) || theme.labels[2]

  return (
      <div className="space-y-8">
        {/* Текущая оценка */}
        <div className="text-center py-6 bg-gradient-to-br from-white/60 to-cyan-50/40 rounded-2xl border border-cyan-200/50">
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${currentLabel.color} bg-clip-text text-transparent mb-2`}>
            {currentLabel.label}
          </h3>
          <p className="text-lg text-gray-600">
            {displayValue} Никитунг{displayValue > 1 && displayValue < 5 ? "а" : displayValue === 5 ? "ов" : ""}
          </p>
        </div>

        {/* Интерактивные кнопки оценки */}
        <div className="grid grid-cols-5 gap-3">
          {theme.labels.map((item) => {
            const isActive = displayValue === item.value
            const isHovered = hoverValue === item.value

            return (
                <button
                    key={item.value}
                    onClick={() => onChange(item.value)}
                    onMouseEnter={() => setHoverValue(item.value)}
                    onMouseLeave={() => setHoverValue(null)}
                    className={`group relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 border-2 ${
                        isActive || isHovered
                            ? `bg-gradient-to-br ${item.color} text-white border-white/50 scale-110 shadow-xl`
                            : "bg-white/60 hover:bg-white/80 border-cyan-200/50 hover:border-cyan-300/70 hover:scale-105 shadow-md hover:shadow-lg"
                    }`}
                >
                  {/* Фоновый эффект */}
                  {(isActive || isHovered) && (
                      <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} opacity-30 rounded-xl blur-sm`}></div>
                  )}

                  {/* Номер оценки */}
                  <span
                      className={`text-2xl font-bold z-10 mb-1 ${isActive || isHovered ? "text-white" : "text-gray-700"}`}
                  >
                {item.value}
              </span>

                  {/* Название */}
                  <span
                      className={`text-xs font-medium z-10 text-center ${isActive || isHovered ? "text-white/90" : "text-gray-600"}`}
                  >
                {item.label}
              </span>

                  {/* Водные капли для активной оценки */}
                  {(isActive || isHovered) && (
                      <>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white/60 rounded-full animate-float"></div>
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-slow"></div>
                      </>
                  )}
                </button>
            )
          })}
        </div>

        {/* Подсказка */}
        <div className="text-center">
          <p className="text-sm text-gray-500">Выберите оценку в Никитунгах 🌊</p>
        </div>
      </div>
  )
}
