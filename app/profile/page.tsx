"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Star, MapPin, History } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, loading } = useAuth()
  const [userStats, setUserStats] = useState({
    placesRated: 5,
    commentsPosted: 3,
    placesAdded: 1,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?mode=login&redirect=/profile")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="ml-2 text-gray-600">Загружаем профиль...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 mb-4">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl">
                {user.email.charAt(0).toUpperCase()}
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Привет, {user.email.split("@")[0]}!
            </h1>
            <p className="text-gray-600">Добро пожаловать в ваш личный кабинет</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-cyan-200/50">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Оценено мест</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.placesRated}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-cyan-200/50">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <History className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Комментариев</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.commentsPosted}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-cyan-200/50">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Добавлено мест</p>
                  <p className="text-2xl font-bold text-gray-800">{userStats.placesAdded}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Place Button */}
          <div className="mb-8 text-center">
            <Button
              onClick={() => router.push("/add-place")}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg px-8 py-6 text-lg rounded-full transform transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить новое место
            </Button>
          </div>

          {/* Mascot */}
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto">
              <Image src="/nikitung-main.png" alt="Nikitung" fill className="object-contain" />
            </div>
            <p className="text-gray-600 italic">"Спасибо, что помогаете делать нашу карту мест для купания лучше!"</p>
          </div>
        </div>
      </main>
    </div>
  )
}
