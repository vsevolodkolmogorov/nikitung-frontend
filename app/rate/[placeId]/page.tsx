"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, ArrowRight, Check, Waves, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import RatingSlider from "@/components/rating-slider"
import { BASE_URL } from '@/lib/config';

interface PlaceBasic {
  title: string
  city: string
}

const categories = [
  {
    id: "purity",
    name: "Чистота воды",
    description: "Насколько чистая вода в этом месте?",
    emoji: "💧",
  },
  {
    id: "logistics",
    name: "Удобство добраться",
    description: "Легко ли добраться до этого места?",
    emoji: "🗺️",
  },
  {
    id: "vibe",
    name: "Атмосфера места",
    description: "Какие ощущения от этого места?",
    emoji: "🌊",
  },
  {
    id: "temperature",
    name: "Температура воды",
    description: "Комфортная ли температура для купания?",
    emoji: "🌡️",
  },
  {
    id: "impression",
    name: "Общее впечатление",
    description: "Ваше общее мнение о месте",
    emoji: "✨",
  },
]

export default function RatePlacePage() {
  const { placeId } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [place, setPlace] = useState<PlaceBasic | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({
    purity: 3,
    logistics: 3,
    vibe: 3,
    temperature: 3,
    impression: 3,
  })

  useEffect(() => {
    if (!user && !loading) {
      router.push(`/auth?mode=login&redirect=/rate/${placeId}`)
    }
  }, [user, loading, router, placeId])

  useEffect(() => {
    const fetchPlaceBasic = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/aggregated/places/${placeId}`)
        if (!response.ok) {
          throw new Error("Не удалось загрузить информацию о месте")
        }
        const data = await response.json()
        setPlace({ title: data.title, city: data.city })
      } catch (err) {
        console.error("Error fetching place:", err)
      } finally {
        setLoading(false)
      }
    }

    if (placeId) {
      fetchPlaceBasic()
    }
  }, [placeId])

  const handleRatingChange = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }))
  }

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getAverageRating = () => {
    const values = Object.values(ratings)
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  const getNikitungVerdict = () => {
    const avg = getAverageRating()
    if (avg >= 4.5) {
      return {
        verdict: "ЛЕГЕНДАРНОЕ МЕСТО! 🏆",
        quote: "Это место достойно стать моим домом! Здесь я готов плавать вечно!",
        color: "from-yellow-400 via-orange-500 to-red-500",
        bgColor: "from-yellow-50 to-orange-50",
      }
    } else if (avg >= 4) {
      return {
        verdict: "ОТЛИЧНОЕ МЕСТО! ⭐",
        quote: "Вау! Здесь я чувствую себя как рыба в воде!",
        color: "from-green-400 to-cyan-500",
        bgColor: "from-green-50 to-cyan-50",
      }
    } else if (avg >= 3) {
      return {
        verdict: "ХОРОШЕЕ МЕСТО 👍",
        quote: "Неплохо, неплохо! Можно искупаться с удовольствием!",
        color: "from-blue-400 to-teal-500",
        bgColor: "from-blue-50 to-teal-50",
      }
    } else if (avg >= 2) {
      return {
        verdict: "СРЕДНЕНЬКОЕ МЕСТО 🤔",
        quote: "Ну... можно попробовать, но есть места и получше!",
        color: "from-yellow-500 to-orange-500",
        bgColor: "from-yellow-50 to-orange-50",
      }
    } else {
      return {
        verdict: "НЕ ОЧЕНЬ МЕСТО 😔",
        quote: "Лучше поискать другое местечко для купания...",
        color: "from-gray-500 to-slate-600",
        bgColor: "from-gray-50 to-slate-50",
      }
    }
  }

  const handleSubmit = async () => {
    if (!user || !token) {
      router.push(`/auth?mode=login&redirect=/rate/${placeId}`)
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/rating-service/rating/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id || 1,
          placeId: Number(placeId),
          scores: ratings,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/place/${placeId}`)
        }, 4000)
      } else {
        throw new Error("Ошибка при отправке оценки")
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          </div>

          <Header />
          <div className="container mx-auto px-4 py-16 flex justify-center items-center relative z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
              <span className="text-gray-600 text-lg">Никитунг готовится к оценке...</span>
            </div>
          </div>
        </div>
    )
  }

  if (success) {
    const verdict = getNikitungVerdict()

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          </div>

          <Header />
          <div className="container mx-auto px-4 py-16 flex justify-center items-center relative z-10">
            <Card
                className={`w-full max-w-2xl bg-gradient-to-br ${verdict.bgColor} backdrop-blur-sm border-2 border-cyan-200/50 shadow-2xl rounded-3xl overflow-hidden`}
            >
              <CardContent className="p-8 text-center">
                {/* Никитунг */}
                <div className="relative mb-6">
                  <div className="relative w-24 h-24 mx-auto animate-float-gentle">
                    <Image src="/nikitung-main.png" alt="Nikitung" fill className="object-contain" />
                  </div>
                  <div
                      className={`absolute -inset-4 bg-gradient-to-r ${verdict.color} opacity-20 rounded-full blur-xl animate-pulse-slow`}
                  ></div>
                </div>

                {/* Вердикт */}
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${verdict.color} bg-clip-text text-transparent mb-4`}>
                  {verdict.verdict}
                </h2>

                {/* Оценка в Никитунгах */}
                <div className="mb-6">
                  <span className="text-2xl font-bold text-gray-700">{getAverageRating().toFixed(1)} Никитунгов</span>
                </div>

                {/* Цитата Никитунга */}
                <div className="bg-white/60 rounded-2xl p-6 mb-6 border border-cyan-200/50">
                  <p className="text-gray-700 italic text-lg leading-relaxed mb-2">"{verdict.quote}"</p>
                  <p className="text-sm text-gray-500 text-right">— Никитунг</p>
                </div>

                {/* Спасибо */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Спасибо за оценку! 🎉</h3>
                  <p className="text-gray-600">Ваше мнение поможет другим найти лучшие места</p>
                </div>

                <div className="flex justify-center space-x-2 mb-4">
                  <Waves className="w-6 h-6 text-cyan-500 animate-float" />
                  <Sparkles className="w-6 h-6 text-blue-500 animate-float-slow" />
                  <Waves className="w-6 h-6 text-teal-500 animate-float-gentle" />
                </div>

                <p className="text-gray-500 text-sm">Перенаправляем на страницу места...</p>
              </CardContent>
            </Card>
          </div>
        </div>
    )
  }

  const currentCategory = categories[currentStep]

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
        </div>

        <Header />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <Button
                variant="ghost"
                onClick={() => router.push(`/place/${placeId}`)}
                className="mb-6 text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50/80 rounded-full transition-all duration-300 hover:scale-105 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Назад к месту
            </Button>

            <Card className="bg-gradient-to-br from-white/95 via-cyan-50/30 to-blue-50/30 backdrop-blur-sm border-2 border-cyan-200/50 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Оцените место в Никитунгах! 🌊
                </CardTitle>
                {place && (
                    <p className="text-gray-600 font-medium">
                      {place.title}, {place.city}
                    </p>
                )}
              </CardHeader>

              <CardContent className="p-8">
                {/* Progress indicator */}
                <div className="mb-8">
                  <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {currentStep + 1} из {categories.length}
                  </span>
                    <span className="text-sm font-medium text-cyan-600">
                    {Math.round(((currentStep + 1) / categories.length) * 100)}%
                  </span>
                  </div>
                  <div className="w-full h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStep + 1) / categories.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Category header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-3xl mr-3">{currentCategory.emoji}</span>
                    <h3 className="text-xl font-bold text-gray-800">{currentCategory.name}</h3>
                  </div>
                  <p className="text-gray-600">{currentCategory.description}</p>
                </div>

                {/* Rating component */}
                <RatingSlider
                    value={ratings[currentCategory.id]}
                    onChange={(value) => handleRatingChange(currentCategory.id, value)}
                    category={currentCategory.id}
                />

                {/* Navigation buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-cyan-200/50">
                  <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="border-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50/80 rounded-full px-6 py-3 transition-all duration-300 hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>

                  {currentStep < categories.length - 1 ? (
                      <Button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        Далее
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                  ) : (
                      <Button
                          onClick={handleSubmit}
                          disabled={submitting}
                          className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Отправляем...
                            </>
                        ) : (
                            <>
                              Получить вердикт!
                              <Check className="w-4 h-4 ml-2" />
                            </>
                        )}
                      </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  )
}
