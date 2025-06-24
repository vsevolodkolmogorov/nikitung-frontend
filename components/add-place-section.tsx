"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Check, Loader2, Heart, Sparkles, AlertCircle } from "lucide-react"
import { validation, sanitizeInput, checkSuspiciousContent } from "@/lib/validation"
import { useAuth } from "@/hooks/use-auth"
import { BASE_URL } from '@/lib/config';

interface AccessZone {
    value: string
    label: string
}

interface InfrastructureFeature {
    value: string
    label: string
}


export default function AddPlaceSection() {
    const { user, token } = useAuth()
    const [isExpanded, setIsExpanded] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    // Form data
    const [formData, setFormData] = useState({
        title: "",
        region: "",
        city: "",
        description: "",
        accessZone: "",
        publicTransportDescription: "",
        infrastructure: [] as string[],
    })

    // Validation states
    const [fieldErrors, setFieldErrors] = useState<{
        title?: string
        region?: string
        city?: string
        description?: string
        accessZone?: string
        publicTransportDescription?: string
    }>({})

    const [touched, setTouched] = useState<{
        title?: boolean
        region?: boolean
        city?: boolean
        description?: boolean
        accessZone?: boolean
        publicTransportDescription?: boolean
    }>({})

    // Options for dropdowns
    const [accessZones, setAccessZones] = useState<AccessZone[]>([])
    const [infrastructureFeatures, setInfrastructureFeatures] = useState<InfrastructureFeature[]>([])
    const [loadingOptions, setLoadingOptions] = useState(false)

    useEffect(() => {
        if (isExpanded && accessZones.length === 0) {
            fetchOptions()
        }
    }, [isExpanded, accessZones.length])

    const fetchOptions = async () => {
        setLoadingOptions(true)
        try {
            const [zonesResponse, featuresResponse] = await Promise.all([
                fetch(`${BASE_URL}/place-service/place/access-zones-labeled`),
                fetch(`${BASE_URL}/place-service/place/infrastructure-features-labeled`),
            ])

            if (zonesResponse.ok && featuresResponse.ok) {
                const zonesData = await zonesResponse.json()
                const featuresData = await featuresResponse.json()
                setAccessZones(zonesData)
                setInfrastructureFeatures(featuresData)
            }
        } catch (error) {
            console.error("Error fetching options:", error)
        } finally {
            setLoadingOptions(false)
        }
    }

    const validateField = (field: string, value: string) => {
        let error = null

        switch (field) {
            case "title":
                error = validation.placeTitle.validate(value)
                break
            case "region":
                error = validation.location.validate(value, "Регион")
                break
            case "city":
                error = validation.location.validate(value, "Город")
                break
            case "description":
                error = validation.description.validate(value, false)
                break
            case "accessZone":
                error = validation.accessZone.validate(value)
                break
            case "publicTransportDescription":
                error = validation.transportDescription.validate(value)
                break
        }

        const suspiciousError = checkSuspiciousContent(value)
        if (suspiciousError) error = suspiciousError

        setFieldErrors((prev) => ({ ...prev, [field]: error }))
        return error === null
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const sanitizedValue =
            name === "description" || name === "publicTransportDescription" ? value : sanitizeInput(value)

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }))

        if (touched[name as keyof typeof touched]) {
            validateField(name, sanitizedValue)
        }
    }

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
        const value = formData[field as keyof typeof formData] as string
        validateField(field, value)
    }

    const handleAccessZoneChange = (value: string) => {
        setFormData((prev) => ({ ...prev, accessZone: value }))
        if (touched.accessZone) {
            validateField("accessZone", value)
        }
    }

    const handleInfrastructureChange = (value: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            infrastructure: checked ? [...prev.infrastructure, value] : prev.infrastructure.filter((item) => item !== value),
        }))
    }

    const handleNext = () => {
        let isValid = true

        if (currentStep === 0) {
            const titleValid = validateField("title", formData.title)
            const regionValid = validateField("region", formData.region)
            const cityValid = validateField("city", formData.city)
            const descriptionValid = validateField("description", formData.description)

            setTouched({ title: true, region: true, city: true, description: true })
            isValid = titleValid && regionValid && cityValid && descriptionValid
        } else if (currentStep === 1) {
            const accessZoneValid = validateField("accessZone", formData.accessZone)
            const transportValid = validateField("publicTransportDescription", formData.publicTransportDescription)

            setTouched((prev) => ({ ...prev, accessZone: true, publicTransportDescription: true }))
            isValid = accessZoneValid && transportValid
        }

        if (isValid && currentStep < 2) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return (
                    validation.placeTitle.validate(formData.title) === null &&
                    validation.location.validate(formData.region, "Регион") === null &&
                    validation.location.validate(formData.city, "Город") === null &&
                    validation.description.validate(formData.description, false) === null &&
                    checkSuspiciousContent(formData.title) === null &&
                    checkSuspiciousContent(formData.region) === null &&
                    checkSuspiciousContent(formData.city) === null &&
                    checkSuspiciousContent(formData.description) === null
                )
            case 1:
                return (
                    validation.accessZone.validate(formData.accessZone) === null &&
                    validation.transportDescription.validate(formData.publicTransportDescription) === null &&
                    checkSuspiciousContent(formData.publicTransportDescription) === null
                )
            case 2:
                return true
            default:
                return false
        }
    }


    const handleAddPlaceClick = () => {
        if (!user) {
            window.location.href = "/auth?mode=login&redirect=/"
            return
        }
        setIsExpanded(true)
    }

    const handleSubmit = async () => {
        if (!user || !token) {
            // Redirect to auth if not logged in
            window.location.href = "/auth?mode=login&redirect=/"
            return
        }

        // Final validation
        const allFieldsValid =
            validateField("title", formData.title) &&
            validateField("region", formData.region) &&
            validateField("city", formData.city) &&
            validateField("description", formData.description) &&
            validateField("accessZone", formData.accessZone) &&
            validateField("publicTransportDescription", formData.publicTransportDescription)

        if (!allFieldsValid) {
            setTouched({
                title: true,
                region: true,
                city: true,
                description: true,
                accessZone: true,
                publicTransportDescription: true,
            })
            return
        }

        setSubmitting(true)

        try {
            const response = await fetch(`${BASE_URL}/place-service/place/create-with-rating`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: sanitizeInput(formData.title),
                    region: sanitizeInput(formData.region),
                    city: sanitizeInput(formData.city),
                    description: formData.description.trim() || "-",
                    accessZone: formData.accessZone,
                    publicTransportDescription: formData.publicTransportDescription.trim() || "-",
                    infrastructure: formData.infrastructure,
                }),
            })

            if (response.ok) {
                setSuccess(true)
                // Reset form after success
                setTimeout(() => {
                    setFormData({
                        title: "",
                        region: "",
                        city: "",
                        description: "",
                        accessZone: "",
                        publicTransportDescription: "",
                        infrastructure: [],
                    })
                    setFieldErrors({})
                    setTouched({})
                    setCurrentStep(0)
                    setIsExpanded(false)
                    setSuccess(false)
                    // Refresh places list
                    window.location.reload()
                }, 3000)
            } else {
                throw new Error("Ошибка при создании места")
            }
        } catch (error) {
            console.error("Error creating place:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            region: "",
            city: "",
            description: "",
            accessZone: "",
            publicTransportDescription: "",
            infrastructure: [],
        })
        setFieldErrors({})
        setTouched({})
        setCurrentStep(0)
        setIsExpanded(false)
    }

    if (success) {
        return (
            <section
                id="add-place-section"
                className="py-16 bg-gradient-to-b from-transparent via-cyan-50/20 to-blue-50/30 relative overflow-hidden"
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-2xl will-change-transform"></div>
                    <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl will-change-transform"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <Card className="max-w-lg mx-auto bg-gradient-to-br from-white/95 via-cyan-50/50 to-teal-50/50 backdrop-blur-sm border-2 border-cyan-200/50 shadow-2xl rounded-3xl overflow-hidden">
                        <CardContent className="p-8 text-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-green-200/40 to-teal-200/40 rounded-full blur-lg animate-pulse-slow"></div>
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                                Ура! Место добавлено! 🎉
                            </h3>
                            <p className="text-gray-600 text-lg">Спасибо, что делаете наш мир лучше!</p>
                            <div className="mt-4 flex justify-center">
                                <Heart className="w-6 h-6 text-red-400 animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        )
    }

    return (
        <section
            id="add-place-section"
            className="py-16 bg-gradient-to-b from-transparent via-cyan-50/20 to-blue-50/30 relative overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-float-slow will-change-transform"></div>
                <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-2xl animate-float-slow will-change-transform"></div>
                <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-xl animate-float will-change-transform"></div>
                <div className="absolute top-1/3 right-10 w-28 h-28 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-xl animate-float-gentle will-change-transform"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl mx-auto">
                    {!isExpanded ? (
                        <Card className="group bg-gradient-to-br from-white/90 via-cyan-50/30 to-blue-50/30 backdrop-blur-sm border-2 border-cyan-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden hover:scale-105 hover:-translate-y-2">
                            <CardContent className="p-8 text-center relative">
                                {/* Decorative elements */}
                                <div className="absolute top-4 right-4 opacity-20">
                                    <Sparkles className="w-8 h-8 text-cyan-500 animate-pulse" />
                                </div>
                                <div className="absolute bottom-4 left-4 opacity-20">
                                    <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
                                </div>

                                <div className="mb-6">
                                    <div className="relative inline-block">
                                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-wiggle">
                                            <Plus className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-200/40 to-teal-200/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
                                        Знаете отличное место? 🏊‍♀️
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                        Поделитесь своим любимым водоёмом и помогите другим найти идеальное место для летнего отдыха
                                    </p>
                                </div>

                                <Button
                                    onClick={handleAddPlaceClick}
                                    className="group/btn bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
                                >
                                    <Plus className="w-5 h-5 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                                    Добавить место
                                </Button>

                                {!user && (
                                    <p className="text-sm text-gray-500 mt-4 italic">Требуется регистрация для добавления мест</p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-gradient-to-br from-white/95 via-cyan-50/30 to-blue-50/30 backdrop-blur-sm border-2 border-cyan-200/50 shadow-2xl rounded-3xl overflow-hidden">
                            <CardHeader className="text-center pb-4 bg-gradient-to-r from-cyan-100/50 to-teal-100/50">
                                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                    Расскажите о вашем месте ✨
                                </CardTitle>
                                <p className="text-gray-600">Каждое место особенное по-своему</p>
                            </CardHeader>

                            <CardContent className="p-8">
                                {loadingOptions ? (
                                    <div className="flex justify-center py-12">
                                        <div className="relative">
                                            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                                            <div className="absolute -inset-2 bg-cyan-200/30 rounded-full blur-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Steps indicator */}
                                        <div className="flex justify-center mb-8">
                                            {[0, 1, 2].map((step) => (
                                                <div key={step} className="flex items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center mx-2 text-sm font-bold transition-all duration-300 ${
                                                            currentStep === step
                                                                ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg scale-110"
                                                                : currentStep > step
                                                                    ? "bg-gradient-to-r from-green-400 to-teal-400 text-white"
                                                                    : "bg-gray-200 text-gray-500"
                                                        }`}
                                                    >
                                                        {currentStep > step ? <Check className="w-5 h-5" /> : step + 1}
                                                    </div>
                                                    {step < 2 && (
                                                        <div
                                                            className={`w-8 h-1 rounded-full ${currentStep > step ? "bg-gradient-to-r from-green-400 to-teal-400" : "bg-gray-200"}`}
                                                        ></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Step content */}
                                        <div className="py-6">
                                            {currentStep === 0 && (
                                                <div className="space-y-6">
                                                    <div className="text-center mb-6">
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Основная информация 📍</h3>
                                                        <p className="text-gray-600">Расскажите нам о вашем месте</p>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="title" className="text-gray-700 font-medium">
                                                            Название места *
                                                        </Label>
                                                        <Input
                                                            id="title"
                                                            name="title"
                                                            value={formData.title}
                                                            onChange={handleInputChange}
                                                            onBlur={() => handleBlur("title")}
                                                            className={`mt-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-xl px-4 py-3 text-lg ${
                                                                fieldErrors.title ? "border-red-300 focus:border-red-400" : ""
                                                            }`}
                                                            placeholder="Озеро Светлое, Голубые пруды..."
                                                            required
                                                            maxLength={validation.placeTitle.maxLength}
                                                        />
                                                        {fieldErrors.title && touched.title && (
                                                            <p className="text-red-600 text-sm flex items-center mt-1">
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                                {fieldErrors.title}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="region" className="text-gray-700 font-medium">
                                                                Регион *
                                                            </Label>
                                                            <Input
                                                                id="region"
                                                                name="region"
                                                                value={formData.region}
                                                                onChange={handleInputChange}
                                                                onBlur={() => handleBlur("region")}
                                                                className={`mt-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-xl px-4 py-3 ${
                                                                    fieldErrors.region ? "border-red-300 focus:border-red-400" : ""
                                                                }`}
                                                                placeholder="Московская область"
                                                                required
                                                                maxLength={validation.location.maxLength}
                                                            />
                                                            {fieldErrors.region && touched.region && (
                                                                <p className="text-red-600 text-xs flex items-center mt-1">
                                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                                    {fieldErrors.region}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="city" className="text-gray-700 font-medium">
                                                                Город *
                                                            </Label>
                                                            <Input
                                                                id="city"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleInputChange}
                                                                onBlur={() => handleBlur("city")}
                                                                className={`mt-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-xl px-4 py-3 ${
                                                                    fieldErrors.city ? "border-red-300 focus:border-red-400" : ""
                                                                }`}
                                                                placeholder="Москва"
                                                                required
                                                                maxLength={validation.location.maxLength}
                                                            />
                                                            {fieldErrors.city && touched.city && (
                                                                <p className="text-red-600 text-xs flex items-center mt-1">
                                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                                    {fieldErrors.city}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="description" className="text-gray-700 font-medium">
                                                            Что особенного в этом месте? 💭
                                                        </Label>
                                                        <Textarea
                                                            id="description"
                                                            name="description"
                                                            value={formData.description}
                                                            onChange={handleInputChange}
                                                            onBlur={() => handleBlur("description")}
                                                            className={`mt-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-xl px-4 py-3 ${
                                                                fieldErrors.description ? "border-red-300 focus:border-red-400" : ""
                                                            }`}
                                                            placeholder="Чистая вода, красивые виды, тихое место для отдыха..."
                                                            rows={4}
                                                            maxLength={validation.description.maxLength}
                                                        />
                                                        <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {formData.description.length}/{validation.description.maxLength}
                              </span>
                                                            {fieldErrors.description && touched.description && (
                                                                <span className="text-red-600 text-xs flex items-center">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                                                    {fieldErrors.description}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStep === 1 && (
                                                <div className="space-y-6">
                                                    <div className="text-center mb-6">
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Расположение и доступ 🚗</h3>
                                                        <p className="text-gray-600">Как туда добраться?</p>
                                                    </div>

                                                    <div>
                                                        <Label className="text-gray-700 font-medium block mb-4">Где находится место? *</Label>
                                                        <RadioGroup
                                                            value={formData.accessZone}
                                                            onValueChange={handleAccessZoneChange}
                                                            className="space-y-3"
                                                        >
                                                            {accessZones.map((zone) => (
                                                                <div
                                                                    key={zone.value}
                                                                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-cyan-50/50 transition-colors"
                                                                >
                                                                    <RadioGroupItem
                                                                        value={zone.label}
                                                                        id={zone.value}
                                                                        className="border-2 border-cyan-300"
                                                                    />
                                                                    <Label htmlFor={zone.value} className="cursor-pointer font-medium">
                                                                        {zone.label}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                        {fieldErrors.accessZone && touched.accessZone && (
                                                            <p className="text-red-600 text-sm flex items-center mt-2">
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                                {fieldErrors.accessZone}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="publicTransportDescription" className="text-gray-700 font-medium">
                                                            Как лучше добираться? 🚌
                                                        </Label>
                                                        <Textarea
                                                            id="publicTransportDescription"
                                                            name="publicTransportDescription"
                                                            value={formData.publicTransportDescription}
                                                            onChange={handleInputChange}
                                                            onBlur={() => handleBlur("publicTransportDescription")}
                                                            className={`mt-2 border-2 border-cyan-200 focus:border-cyan-400 rounded-xl px-4 py-3 ${
                                                                fieldErrors.publicTransportDescription ? "border-red-300 focus:border-red-400" : ""
                                                            }`}
                                                            placeholder="Автобус №22 до остановки 'Озеро', далее 5 минут пешком..."
                                                            rows={3}
                                                            maxLength={validation.transportDescription.maxLength}
                                                        />
                                                        <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {formData.publicTransportDescription.length}/{validation.transportDescription.maxLength}
                              </span>
                                                            {fieldErrors.publicTransportDescription && touched.publicTransportDescription && (
                                                                <span className="text-red-600 text-xs flex items-center">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                                                    {fieldErrors.publicTransportDescription}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStep === 2 && (
                                                <div className="space-y-6">
                                                    <div className="text-center mb-6">
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Что есть рядом? 🏖️</h3>
                                                        <p className="text-gray-600">Выберите удобства и инфраструктуру</p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        {infrastructureFeatures.map((feature) => (
                                                            <div
                                                                key={feature.value}
                                                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-cyan-50/50 transition-colors"
                                                            >
                                                                <Checkbox
                                                                    id={feature.value}
                                                                    checked={formData.infrastructure.includes(feature.label)}
                                                                    onCheckedChange={(checked) =>
                                                                        handleInfrastructureChange(feature.label, checked === true)
                                                                    }
                                                                    className="border-2 border-cyan-300"
                                                                />
                                                                <Label htmlFor={feature.value} className="cursor-pointer text-sm font-medium">
                                                                    {feature.label}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation buttons */}
                                        <div className="flex justify-between mt-8 pt-6 border-t border-cyan-200/50">
                                            <Button
                                                variant="outline"
                                                onClick={currentStep === 0 ? resetForm : handlePrevious}
                                                className="border-2 border-gray-300 hover:border-gray-400 rounded-xl px-6 py-3"
                                            >
                                                {currentStep === 0 ? "Отмена" : "Назад"}
                                            </Button>

                                            {currentStep < 2 ? (
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={!isStepValid()}
                                                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Далее →
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={submitting || !isStepValid()}
                                                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                            Добавляем...
                                                        </>
                                                    ) : (
                                                        <>Добавить место ✨</>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    )
}
