package routes

import (
	"careeralley/controllers"
	"careeralley/middleware"

	"github.com/gin-gonic/gin"
)

func ChatRoutes(router *gin.Engine) {
	// WebSocket — auth via ?token= query param
	router.GET("/chat/:card_id/ws", controllers.ChatWebSocket)

	// REST
	router.GET("/chat/:card_id/history", middleware.JWTAuthMiddleware(), controllers.GetChatHistory)
	router.GET("/chat/my-cards", middleware.JWTAuthMiddleware(), controllers.GetMyChatCards)
	router.GET("/chat/:card_id/voice/token", middleware.JWTAuthMiddleware(), controllers.GenerateVoiceToken)
}
