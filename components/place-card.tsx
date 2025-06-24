import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Sparkles, MapPin } from "lucide-react"

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

interface PlaceCardProps {
  place: Place
  placeId: string
}

export default function PlaceCard({ place, placeId }: PlaceCardProps) {
  const getAccessZoneColor = (zone: string) => {
    switch (zone) {
      case "Город":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      case "Пригород":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200"
      case "За городом":
        return "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200"
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200"
    }
  }

  const getRatingColor = (score: number) => {
    if (score >= 4) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 3) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 2) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (score > 0) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-gray-500 bg-gray-50 border-gray-200"
  }

  return (
      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-105 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 backdrop-blur-sm border-2 border-cyan-200/50 overflow-hidden rounded-3xl">
        {/* Enhanced Image Placeholder */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-cyan-100 via-blue-100 to-teal-100 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 via-blue-200/20 to-teal-200/20"></div>
          <div className="text-4xl sm:text-6xl opacity-40 group-hover:scale-110 transition-transform duration-500">
            🏊‍♂️
          </div>

          {/* Rating Badge */}
          {place.averageScore > 0 ? (
              <div
                  className={`absolute top-4 left-4 px-5 py-1 rounded-full border ${getRatingColor(place.averageScore)} flex items-center text-xs font-semibold`}
              >
                <Star className="w-3 h-3 mr-2 fill-current"/>
                <span className="text-sm font-medium truncate">{place.averageScore.toFixed(1)}</span>
              </div>
            ) : (
              <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full border ${getRatingColor(place.averageScore)} flex items-center text-xs font-semibold`}
              >
                <Star className="w-3 h-3 mr-2 fill-current"/>
                <span className="text-sm font-small truncate">{"Без оценок"}</span>
              </div>
            )}

          {/* Floating decorative elements */}
          <div className="absolute top-4 right-4 opacity-30">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 animate-pulse"/>
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/50 rounded-full animate-float-slow"></div>
          </div>

          {/* Water ripple effect */}
          <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 bg-gradient-to-t from-cyan-200/30 to-transparent animate-pulse-slow"></div>
        </div>

        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors duration-300 leading-tight line-clamp-2">
            {place.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
            <span className="text-sm font-medium truncate">
            {place.city}, {place.region}
          </span>
          </div>

          {place.description && place.description !== "-" && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{place.description}</p>
          )}

          {/* Enhanced Access Zone Badge */}
          <div className="mb-4">
            <Badge
                className={`${getAccessZoneColor(place.accessZone)} border font-medium px-3 py-1 rounded-full text-xs sm:text-sm`}
            >
              {place.accessZone}
            </Badge>
          </div>

          {/* Enhanced Infrastructure Tags */}
          {place.infrastructure && place.infrastructure.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {place.infrastructure.slice(0, 2).map((item, idx) => (
                    <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs border-cyan-300 text-cyan-700 bg-cyan-50/50 hover:bg-cyan-100/50 transition-colors rounded-full px-2 py-1 truncate max-w-[120px]"
                    >
                      {item}
                    </Badge>
                ))}
                {place.infrastructure.length > 2 && (
                    <Badge
                        variant="outline"
                        className="text-xs border-cyan-300 text-cyan-700 bg-cyan-50/50 rounded-full px-2 py-1"
                    >
                      +{place.infrastructure.length - 2}
                    </Badge>
                )}
              </div>
          )}
        </CardContent>

        <CardFooter className="p-4 sm:p-6 pt-0">
          <Link href={`/place/${placeId}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full py-3 h-12 text-sm sm:text-base font-medium border-2 border-white/20 group-hover:scale-105">
              Узнать больше ✨
            </Button>
          </Link>
        </CardFooter>
      </Card>
  )
}

