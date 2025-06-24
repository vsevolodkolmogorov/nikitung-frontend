"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin, Star, ArrowLeft, Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import PlaceRatingChart from "@/components/place-rating-chart"
import CommentsList from "@/components/comments-list"
import ImageCarousel from "@/components/image-carousel"

interface PlaceDetails {
  title: string
  region: string
  city: string
  description: string
  accessZone: string
  publicTransportDescription: string
  infrastructure: string[]
  averageRating: number
  totalRatings: number
  placeCategoryAVG: {
    category: string
    averageScore: number
  }[]
}

interface Comment {
  text: string
  userId: number
  placeId: number
  userEmail: string
}

export default function PlaceDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [place, setPlace] = useState<PlaceDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)

  const fetchComments = async () => {
    try {
      setLoadingComments(true)
      const response = await fetch(`http://localhost:8080/comment-service/comment/getAllByPlaceId/${id}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (err) {
      console.error("Error fetching comments:", err)
    } finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/aggregated/places/${id}`)
        if (!response.ok) {
          throw new Error("Не удалось загрузить информацию о месте")
        }
        const data = await response.json()
        setPlace(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPlaceDetails()
      fetchComments()
    }
  }, [id])

  const handleRateClick = () => {
    if (!user) {
      router.push("/auth?mode=login&redirect=/place/" + id)
    } else {
      router.push(`/rate/${id}`)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl will-change-transform"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl will-change-transform"></div>
          </div>

          <Header />
          <div className="container mx-auto px-4 py-16 flex justify-center items-center relative z-10">
            <div className="text-center">
              <div className="relative mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
                <div className="absolute -inset-3 bg-cyan-200/30 rounded-full blur-lg animate-pulse"></div>
              </div>
              <span className="text-gray-600 text-lg">Загружаем информацию о месте...</span>
            </div>
          </div>
        </div>
    )
  }

  if (error || !place) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl will-change-transform"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl will-change-transform"></div>
          </div>

          <Header />
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😔</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Что-то пошло не так</h2>
              <p className="text-red-600 mb-4">{error || "Место не найдено"}</p>
              <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full px-6 py-3"
              >
                Вернуться на главную
              </Button>
            </div>
          </div>
        </div>
    )
  }

  // Translate category names to Russian
  const categoryTranslations: Record<string, string> = {
    purity: "Чистота",
    logistics: "Логистика",
    vibe: "Атмосфера",
    temperature: "Температура",
    impression: "Впечатление",
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 relative overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl will-change-transform"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl will-change-transform"></div>
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl will-change-transform"></div>
          <div className="absolute top-1/3 right-10 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-2xl will-change-transform"></div>
        </div>

        <Header />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Back button */}
            <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="mb-6 text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50/80 rounded-full transition-all duration-300 hover:scale-105 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Назад к списку мест
            </Button>

            {/* Enhanced Image Carousel */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-white/80 to-cyan-50/50 backdrop-blur-sm border border-cyan-200/50">
              <ImageCarousel />
            </div>

            {/* Enhanced Place Header */}
            <div className="mb-8 bg-gradient-to-br from-white/90 to-cyan-50/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-cyan-200/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3 leading-tight">
                    {place.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center text-gray-600 bg-white/60 rounded-full px-3 py-1">
                      <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                      <span className="font-medium">
                      {place.city}, {place.region}
                    </span>
                    </div>

                    <Badge className="bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 border-cyan-200 rounded-full px-3 py-1">
                      {place.accessZone}
                    </Badge>

                    {place.averageRating > 0 && (
                        <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full px-3 py-1 shadow-sm border border-yellow-200/50">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-yellow-700">{place.averageRating.toFixed(1)}</span>
                          <span className="text-yellow-600 text-sm ml-1">({place.totalRatings} оценок)</span>
                        </div>
                    )}
                  </div>
                </div>

                {/* Floating mascot */}
                <div className="hidden md:block relative w-16 h-16 ml-4">
                  <Image src="/nikitung-main.png" alt="Nikitung" fill className="object-contain opacity-60" />
                </div>
              </div>

              {place.description && place.description !== "-" && (
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg bg-white/40 rounded-xl p-4 border border-cyan-100/50">
                    {place.description}
                  </p>
              )}

              {/* Infrastructure Tags */}
              {place.infrastructure && place.infrastructure.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Что есть на месте:</h3>
                    <div className="flex flex-wrap gap-2">
                      {place.infrastructure.map((item, idx) => (
                          <Badge
                              key={idx}
                              variant="outline"
                              className="border-cyan-200/60 text-cyan-700 bg-cyan-50/50 hover:bg-cyan-100/60 transition-colors duration-300 rounded-full"
                          >
                            {item}
                          </Badge>
                      ))}
                    </div>
                  </div>
              )}

              {/* Public Transport */}
              {place.publicTransportDescription && place.publicTransportDescription !== "-" && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">🚌 Как добраться:</h3>
                    <p className="text-blue-600">{place.publicTransportDescription}</p>
                  </div>
              )}
            </div>

            {/* Enhanced Rate Button */}
            <div className="mb-8 flex justify-center">
              <Button
                  onClick={handleRateClick}
                  className="group bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl px-8 py-4 text-lg rounded-full transform transition-all duration-300 hover:scale-105 border-2 border-white/20"
              >
                <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Оценить это место
              </Button>
            </div>

            {/* Enhanced Tabs */}
            <Tabs defaultValue="ratings" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-sm rounded-full p-1 border border-cyan-200/50">
                <TabsTrigger
                    value="ratings"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300"
                >
                  Оценки
                </TabsTrigger>
                <TabsTrigger
                    value="comments"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300"
                >
                  Комментарии
                </TabsTrigger>
              </TabsList>

              <TabsContent
                  value="ratings"
                  className="bg-gradient-to-br from-white/90 to-cyan-50/60 backdrop-blur-sm rounded-2xl shadow-lg border border-cyan-200/50 p-6"
              >
                <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 flex items-center justify-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Оценки по категориям
                </h2>
                {place.placeCategoryAVG && place.placeCategoryAVG.length > 0 ? (
                    <PlaceRatingChart
                        ratings={place.placeCategoryAVG.map((cat) => ({
                          category: categoryTranslations[cat.category] || cat.category,
                          score: cat.averageScore,
                        }))}
                    />
                ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">Пока нет оценок для этого места</p>
                      <p className="text-gray-400 text-sm mt-2">Станьте первым, кто оценит это место!</p>
                    </div>
                )}
              </TabsContent>

              <TabsContent
                  value="comments"
                  className="bg-gradient-to-br from-white/90 to-cyan-50/60 backdrop-blur-sm rounded-2xl shadow-lg border border-cyan-200/50 p-6"
              >
                {loadingComments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                    </div>
                ) : (
                    <CommentsList comments={comments} placeId={Number(id)} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
  )
}