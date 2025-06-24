"use client"

import { useState, useEffect } from "react"
import PlaceCard from "@/components/place-card"
import { Loader2, Waves, Search, Filter, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BASE_URL } from '@/lib/config';

interface Place {
  title: string
  region: string
  city: string
  description: string
  accessZone: string
  publicTransportDescription: string
  infrastructure: string[]
  averageScore: number
}

export default function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [accessZoneFilter, setAccessZoneFilter] = useState("all")
  const [sortBy, setSortBy] = useState("default")

  useEffect(() => {
    fetchPlaces()
  }, [])

  useEffect(() => {
    filterAndSortPlaces()
  }, [places, searchTerm, accessZoneFilter, sortBy])

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${BASE_URL}/place-service/place/with-average-score`)
      if (!response.ok) {
        throw new Error("Не удалось загрузить места")
      }
      const data = await response.json()
      setPlaces(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPlaces = () => {
    let filtered = [...places]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
          (place) =>
              place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              place.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
              place.region.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Access zone filter
    if (accessZoneFilter !== "all") {
      filtered = filtered.filter((place) => place.accessZone === accessZoneFilter)
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "city-asc":
        filtered.sort((a, b) => a.city.localeCompare(b.city))
        break
      case "city-desc":
        filtered.sort((a, b) => b.city.localeCompare(a.city))
        break
      default:
        // Keep original order
        break
    }

    setFilteredPlaces(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setAccessZoneFilter("all")
    setSortBy("default")
  }

  if (loading) {
    return (
        <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/30 to-cyan-50/30 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                <div className="absolute -inset-3 bg-cyan-200/30 rounded-full blur-lg animate-pulse"></div>
              </div>
              <span className="ml-2 text-gray-600 text-base sm:text-lg mt-4 animate-pulse">
              Ищем лучшие места для вас...
            </span>
            </div>
          </div>
        </section>
    )
  }

  if (error) {
    return (
        <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/30 to-cyan-50/30 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😔</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Что-то пошло не так</h3>
              <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
              <button
                  onClick={fetchPlaces}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </section>
    )
  }

  return (
      <section
          id="places-section"
          className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/30 via-cyan-50/20 to-teal-50/30 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float-slow will-change-transform"></div>
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl animate-float will-change-transform"></div>
          <div className="absolute top-1/3 right-10 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-2xl animate-float-gentle will-change-transform"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500 mr-2 sm:mr-3 animate-float" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Места для купания
              </h2>
              <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500 ml-2 sm:ml-3 animate-float" />
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Каждое место проверено и оценено нашим сообществом любителей водного отдыха
            </p>
          </div>

          {/* Mobile-optimized Filters */}
          <div className="mb-6 sm:mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-cyan-200/50 shadow-lg">
            <div className="flex flex-col gap-4">
              {/* Search - Full width on mobile */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Поиск по названию или городу..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base border-cyan-200 focus:border-cyan-400 rounded-xl"
                />
              </div>

              {/* Filters row - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Access Zone Filter */}
                <div className="flex items-center gap-2 flex-1">
                  <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <Select value={accessZoneFilter} onValueChange={setAccessZoneFilter}>
                    <SelectTrigger className="w-full h-12 border-cyan-200 focus:border-cyan-400 rounded-xl text-base">
                      <SelectValue placeholder="Расположение" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все места</SelectItem>
                      <SelectItem value="Город">Город</SelectItem>
                      <SelectItem value="Пригород">Пригород</SelectItem>
                      <SelectItem value="За городом">За городом</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 flex-1">
                  <ArrowUpDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full h-12 border-cyan-200 focus:border-cyan-400 rounded-xl text-base">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="name-asc">Название А-Я</SelectItem>
                      <SelectItem value="name-desc">Название Я-А</SelectItem>
                      <SelectItem value="city-asc">Город А-Я</SelectItem>
                      <SelectItem value="city-desc">Город Я-А</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear filters */}
                {(searchTerm || accessZoneFilter !== "all" || sortBy !== "default") && (
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 rounded-xl h-12 px-4 sm:px-6 text-base whitespace-nowrap"
                    >
                      Сбросить
                    </Button>
                )}
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Найдено: <span className="font-semibold text-cyan-700">{filteredPlaces.length}</span> из{" "}
                <span className="font-semibold">{places.length}</span> мест
              </p>
            </div>
          </div>

          {filteredPlaces.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Waves className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  {places.length === 0 ? "Пока здесь пусто" : "Ничего не найдено"}
                </h3>
                <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">
                  {places.length === 0
                      ? "Станьте первым, кто поделится отличным местом!"
                      : "Попробуйте изменить параметры поиска"}
                </p>
                {places.length > 0 && (
                    <Button
                        onClick={clearFilters}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full px-6 py-3 h-12 text-base"
                    >
                      Показать все места
                    </Button>
                )}
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlaces.map((place, index) => (
                    <PlaceCard key={index} place={place} placeId={String(index + 1)}/>
                ))}
              </div>
          )}
        </div>
      </section>
  )
}
