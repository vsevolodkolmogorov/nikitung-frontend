"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function Header() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-cyan-200/30 shadow-sm">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-full blur-2xl animate-float-header"></div>
          <div className="absolute top-0 right-1/3 w-24 h-24 bg-gradient-to-br from-teal-100/20 to-cyan-100/20 rounded-full blur-2xl animate-float-header-delayed"></div>
        </div>

        <div className="container mx-auto px-4 py-3 relative z-10">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link href="/" className="group flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-110 duration-300">
                  <Image src="/nikitung-main.png" alt="Nikitung" fill className="object-contain" />
                </div>
                {/* Ripple effect on hover */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-300/0 to-teal-300/0 group-hover:from-cyan-300/20 group-hover:to-teal-300/20 rounded-full transition-all duration-500 blur-sm"></div>
              </div>
              <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent group-hover:from-cyan-700 group-hover:to-teal-700 transition-all duration-300">
                Nikitung
              </span>
                <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-3">
              {user ? (
                  <div className="flex items-center space-x-3">
                    <Link href="/profile">
                      <Button
                          variant="ghost"
                          className="text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50/80 rounded-full transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span className="hidden lg:inline">Профиль</span>
                      </Button>
                    </Link>
                    <div className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-full border border-cyan-200/50">
                      <span className="text-sm text-gray-600">Привет, {user.email.split("@")[0]}! 👋</span>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50/80 rounded-full transition-all duration-300 hover:scale-105"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hidden lg:inline">Выйти</span>
                    </Button>
                  </div>
              ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/auth?mode=login">
                      <Button
                          variant="ghost"
                          className="text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50/80 rounded-full transition-all duration-300 hover:scale-105"
                      >
                        Войти
                      </Button>
                    </Link>
                    <Link href="/auth?mode=register">
                      <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Регистрация
                      </Button>
                    </Link>
                  </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full hover:bg-cyan-50/80 transition-all duration-300 w-10 h-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 border-t border-cyan-200/50 pt-4 bg-white/50 rounded-xl backdrop-blur-sm">
                {user ? (
                    <div className="flex flex-col space-y-3">
                      <div className="px-3 py-2 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200/50">
                        <span className="text-sm text-gray-600">Привет, {user.email.split("@")[0]}! 👋</span>
                      </div>
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-cyan-700 hover:bg-cyan-50/80 rounded-lg h-12"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Профиль
                        </Button>
                      </Link>
                      <Button
                          variant="ghost"
                          onClick={() => {
                            logout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full justify-start text-cyan-700 hover:bg-cyan-50/80 rounded-lg h-12"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Выйти
                      </Button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-3">
                      <Link href="/auth?mode=login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-cyan-700 hover:bg-cyan-50/80 rounded-lg h-12"
                        >
                          Войти
                        </Button>
                      </Link>
                      <Link href="/auth?mode=register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg h-12">
                          Регистрация
                        </Button>
                      </Link>
                    </div>
                )}
              </nav>
          )}
        </div>
      </header>
  )
}
