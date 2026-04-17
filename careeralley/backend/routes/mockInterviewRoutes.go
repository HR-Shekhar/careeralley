package routes

import (
	"careeralley/controllers"
	"careeralley/middleware"

	"github.com/gin-gonic/gin"
)

func MockInterviewRoutes(router *gin.Engine) {
	auth := middleware.JWTAuthMiddleware()

	router.GET("/mock-interviews", auth, controllers.GetMockInterviews)
	router.POST("/mock-interviews", auth, controllers.CreateMockInterview)
	router.GET("/mock-interviews/:id", auth, controllers.GetMockInterview)
	router.POST("/mock-interviews/:id/join", auth, controllers.JoinMockInterview)
	router.POST("/mock-interviews/:id/generate-question", auth, controllers.GenerateInterviewQuestion)
	router.POST("/mock-interviews/:id/score", auth, controllers.ScoreInterviewQuestion)
	router.POST("/mock-interviews/:id/complete", auth, controllers.CompleteMockInterview)
	router.DELETE("/mock-interviews/:id", auth, controllers.DeleteMockInterview)
}
