package routes

import (
	"careeralley/controllers"
	"careeralley/middleware"

	"github.com/gin-gonic/gin"
)

func CareerRoutes(router *gin.Engine) {

	router.GET("/career-cards", controllers.GetCareerCards)
	router.POST("/start-card", middleware.JWTAuthMiddleware(), controllers.StartCard)
	router.GET("/fields", controllers.GetFields)
	router.GET("/onboarding-questions", controllers.GetOnboardingQuestions)
	router.POST("/onboarding-answers", middleware.JWTAuthMiddleware(), controllers.SubmitOnboardingAnswers)
	router.GET("/card-questions/:card_id", controllers.GetCardQuestions)
	router.POST("/card-answers", middleware.JWTAuthMiddleware(), controllers.SubmitCardAnswers)
	router.POST("/generate-roadmap", middleware.JWTAuthMiddleware(), controllers.GenerateRoadmap)
	router.GET("/roadmap/:card_id", middleware.JWTAuthMiddleware(), controllers.GetRoadmap)
	router.POST("/progress", middleware.JWTAuthMiddleware(), controllers.UpdateProgress)
	router.POST("/study-session/start", middleware.JWTAuthMiddleware(), controllers.StartStudySession)
	router.POST("/study-session/end", middleware.JWTAuthMiddleware(), controllers.EndStudySession)
	router.GET("/study-stats", middleware.JWTAuthMiddleware(), controllers.GetStudyStats)
	router.GET("/roadmap-progress/:card_id", middleware.JWTAuthMiddleware(), controllers.GetRoadmapProgress)
	router.GET("/user-dashboard", middleware.JWTAuthMiddleware(), controllers.GetUserDashboard)
	router.GET("/ai-card-questions/:card_id", controllers.GenerateCardQuestions)
}
