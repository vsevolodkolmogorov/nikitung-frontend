"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { User, AlertCircle } from "lucide-react"
import { validation, sanitizeInput, checkSuspiciousContent } from "@/lib/validation"

interface Comment {
  text: string
  userId: number
  placeId: number
  userEmail: string
}

interface CommentsListProps {
  comments: Comment[]
  placeId: number
}

export default function CommentsList({ comments: initialComments, placeId }: CommentsListProps) {
  const { user, token } = useAuth()
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const validateComment = (comment: string) => {
    const validationError = validation.comment.validate(comment)
    if (validationError) return validationError

    const suspiciousError = checkSuspiciousContent(comment)
    if (suspiciousError) return suspiciousError

    return null
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNewComment(value)

    if (touched) {
      const error = validateComment(value)
      setCommentError(error)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    const error = validateComment(newComment)
    setCommentError(error)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/auth?mode=login")
      return
    }

    const sanitizedComment = sanitizeInput(newComment)
    const error = validateComment(sanitizedComment)

    if (error) {
      setCommentError(error)
      setTouched(true)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:8080/comment-service/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: sanitizedComment,
          userId: user.id,
          placeId: placeId,
        }),
      })

      if (response.ok) {
        // Refresh comments after successful submission
        const commentsResponse = await fetch(`http://localhost:8080/comment-service/comment/getAllByPlaceId/${placeId}`)
        if (commentsResponse.ok) {
          const updatedComments = await commentsResponse.json()
          setComments(updatedComments)
        }
        setNewComment("")
        setCommentError(null)
        setTouched(false)
      } else {
        throw new Error("Ошибка при отправке комментария")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      setCommentError("Произошла ошибка при отправке комментария")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatUserName = (email: string) => {
    return email.replace(/@.*$/, "")
  }

  const isCommentValid = () => {
    const sanitizedComment = sanitizeInput(newComment)
    return validateComment(sanitizedComment) === null
  }

  return (
      <div className="space-y-6">
        {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-gray-700">Оставить комментарий</h3>
              <div className="space-y-2">
                <Textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    onBlur={handleBlur}
                    placeholder="Поделитесь своим мнением об этом месте..."
                    className={`border-cyan-200 focus:border-cyan-400 text-base h-24 sm:h-32 resize-none ${
                        commentError ? "border-red-300 focus:border-red-400" : ""
                    }`}
                    maxLength={validation.comment.maxLength}
                />

                <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
              <span>
                {newComment.length}/{validation.comment.maxLength}
              </span>
                  {commentError && touched && (
                      <span className="text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                        {commentError}
                </span>
                  )}
                </div>
              </div>

              <Button
                  type="submit"
                  disabled={isSubmitting || !isCommentValid()}
                  className="mt-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white h-10 sm:h-12 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </form>
        ) : (
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 text-center">
                <p className="text-blue-700 mb-2 text-sm sm:text-base">Войдите, чтобы оставить комментарий</p>
                <Button
                    onClick={() => router.push("/auth?mode=login")}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 h-10 sm:h-12 text-sm sm:text-base"
                >
                  Войти
                </Button>
              </CardContent>
            </Card>
        )}

        <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-700">Комментарии ({comments.length})</h3>

        {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm sm:text-base">Пока нет комментариев. Будьте первым!</p>
        ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-cyan-100">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="ml-2 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {comment.userEmail === user?.email ? "Вы" : formatUserName(comment.userEmail)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">{comment.text}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  )
}
