// Утилиты для валидации
export const validation = {
    email: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        validate: (email: string) => {
            if (!email.trim()) return "Email обязателен"
            if (email.length < 5) return "Email слишком короткий"
            if (email.length > 254) return "Email слишком длинный"
            if (!validation.email.pattern.test(email)) return "Некорректный формат email"
            return null
        },
    },

    password: {
        minLength: 6,
        validate: (password: string) => {
            if (!password) return "Пароль обязателен"
            if (password.length < validation.password.minLength)
                return `Пароль должен содержать минимум ${validation.password.minLength} символов`
            if (password.length > 128) return "Пароль слишком длинный"
            if (!/[a-zA-Zа-яА-Я]/.test(password)) return "Пароль должен содержать буквы"
            if (!/\d/.test(password)) return "Пароль должен содержать цифры"
            if (/\s/.test(password)) return "Пароль не должен содержать пробелы"
            return null
        },
    },

    placeTitle: {
        minLength: 2,
        maxLength: 100,
        validate: (title: string) => {
            if (!title.trim()) return "Название места обязательно"
            if (title.trim().length < validation.placeTitle.minLength)
                return `Название должно содержать минимум ${validation.placeTitle.minLength} символа`
            if (title.length > validation.placeTitle.maxLength)
                return `Название не должно превышать ${validation.placeTitle.maxLength} символов`
            if (/^\d+$/.test(title.trim())) return "Название не может состоять только из цифр"
            return null
        },
    },

    location: {
        minLength: 2,
        maxLength: 50,
        validate: (location: string, fieldName: string) => {
            if (!location.trim()) return `${fieldName} обязателен`
            if (location.trim().length < validation.location.minLength)
                return `${fieldName} должен содержать минимум ${validation.location.minLength} символа`
            if (location.length > validation.location.maxLength)
                return `${fieldName} не должен превышать ${validation.location.maxLength} символов`
            if (/^\d+$/.test(location.trim())) return `${fieldName} не может состоять только из цифр`
            return null
        },
    },

    description: {
        maxLength: 1000,
        validate: (description: string) => {
            if (description && description.length > validation.description.maxLength) {
                return `Описание не должно превышать ${validation.description.maxLength} символов`
            }
            return null
        },
    },

    comment: {
        minLength: 3,
        maxLength: 500,
        validate: (comment: string) => {
            if (!comment.trim()) return "Комментарий не может быть пустым"
            if (comment.trim().length < validation.comment.minLength)
                return `Комментарий должен содержать минимум ${validation.comment.minLength} символа`
            if (comment.length > validation.comment.maxLength)
                return `Комментарий не должен превышать ${validation.comment.maxLength} символов`
            if (/^\d+$/.test(comment.trim())) return "Комментарий не может состоять только из цифр"
            return null
        },
    },

    transportDescription: {
        maxLength: 300,
        validate: (description: string) => {
            if (description && description.length > validation.transportDescription.maxLength) {
                return `Описание транспорта не должно превышать ${validation.transportDescription.maxLength} символов`
            }
            return null
        },
    },

    accessZone: {
        validate: (zone: string) => {
            if (!zone.trim()) return "Выберите зону доступа"
            return null
        },
    },
}

// Утилита для очистки и нормализации текста (убираем лишние пробелы, но сохраняем обычные)
export const sanitizeInput = (input: string): string => {
    return input.replace(/\s+/g, " ").trim()
}

// Проверка на подозрительный контент
export const checkSuspiciousContent = (text: string): string | null => {
    const suspiciousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /<iframe/i, /data:text\/html/i]

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) {
            return "Обнаружен подозрительный контент"
        }
    }
    return null
}
