"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { validation, sanitizeInput, checkSuspiciousContent } from "@/lib/validation"

function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})

  const { login, register, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "register" || modeParam === "login") {
      setMode(modeParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const validateField = (field: "email" | "password", value: string) => {
    let error = null

    if (field === "email") {
      error = validation.email.validate(value)
      const suspiciousError = checkSuspiciousContent(value)
      if (suspiciousError) error = suspiciousError
    } else if (field === "password") {
      if (mode === "register") {
        error = validation.password.validate(value)
      } else {
        // Для логина менее строгая валидация
        if (!value) error = "Пароль обязателен"
        else if (value.length > 128) error = "Пароль слишком длинный"
      }
      const suspiciousError = checkSuspiciousContent(value)
      if (suspiciousError) error = suspiciousError
    }

    setFieldErrors((prev) => ({ ...prev, [field]: error }))
    return error === null
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeInput(e.target.value)
    setEmail(value)
    if (touched.email) {
      validateField("email", value)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value // Не обрезаем пробелы в пароле при вводе
    setPassword(value)
    if (touched.password) {
      validateField("password", value)
    }
  }

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === "email") {
      validateField("email", email)
    } else {
      validateField("password", password)
    }
  }

  const isFormValid = () => {
    const emailValid = validation.email.validate(email) === null && checkSuspiciousContent(email) === null
    let passwordValid = false

    if (mode === "register") {
      passwordValid = validation.password.validate(password) === null && checkSuspiciousContent(password) === null
    } else {
      passwordValid = password.length > 0 && password.length <= 128 && checkSuspiciousContent(password) === null
    }

    return emailValid && passwordValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Финальная валидация
    const emailValid = validateField("email", email)
    const passwordValid = validateField("password", password)

    if (!emailValid || !passwordValid) {
      setTouched({ email: true, password: true })
      return
    }

    setLoading(true)

    try {
      const success = mode === "login" ? await login(email, password) : await register(email, password)

      if (success) {
        router.push("/")
      } else {
        setError(mode === "login" ? "Неверный email или пароль" : "Ошибка регистрации. Попробуйте другой email")
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте позже")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-zA-Zа-яА-Я]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (password.length >= 8) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)

  return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-cyan-200/50 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image src="/nikitung-main.png" alt="Nikitung" fill className="object-contain" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {mode === "login" ? "Добро пожаловать!" : "Присоединяйтесь к нам!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6">
            {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-sm sm:text-base">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur("email")}
                      className={`pl-10 h-12 text-base border-cyan-200 focus:border-cyan-400 ${
                          fieldErrors.email ? "border-red-300 focus:border-red-400" : ""
                      }`}
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                  />
                  {!fieldErrors.email && email && validation.email.validate(email) === null && (
                      <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                  )}
                </div>
                {fieldErrors.email && touched.email && (
                    <p className="text-red-600 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {fieldErrors.email}
                    </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 text-sm sm:text-base">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => handleBlur("password")}
                      className={`pl-10 pr-12 h-12 text-base border-cyan-200 focus:border-cyan-400 ${
                          fieldErrors.password ? "border-red-300 focus:border-red-400" : ""
                      }`}
                      placeholder="••••••••"
                      required
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {mode === "register" && password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className={`h-1 flex-1 rounded ${
                                    passwordStrength >= level
                                        ? passwordStrength <= 1
                                            ? "bg-red-400"
                                            : passwordStrength <= 2
                                                ? "bg-yellow-400"
                                                : passwordStrength <= 3
                                                    ? "bg-blue-400"
                                                    : "bg-green-400"
                                        : "bg-gray-200"
                                }`}
                            />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        Сила пароля:{" "}
                        {passwordStrength <= 1
                            ? "Слабый"
                            : passwordStrength <= 2
                                ? "Средний"
                                : passwordStrength <= 3
                                    ? "Хороший"
                                    : "Отличный"}
                      </p>
                      <p className="text-xs text-gray-500">Минимум 6 символов, буквы и цифры</p>
                    </div>
                )}

                {fieldErrors.password && touched.password && (
                    <p className="text-red-600 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {fieldErrors.password}
                    </p>
                )}
              </div>

              <Button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="w-full h-12 text-base bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === "login" ? "Вход..." : "Регистрация..."}
                    </>
                ) : mode === "login" ? (
                    "Войти"
                ) : (
                    "Зарегистрироваться"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                  variant="ghost"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login")
                    setFieldErrors({})
                    setTouched({})
                    setError("")
                  }}
                  className="text-cyan-600 hover:text-cyan-700 text-sm sm:text-base h-auto p-2"
              >
                {mode === "login" ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default function AuthPage() {
  return (
      <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          }
      >
        <AuthForm />
      </Suspense>
  )
}
