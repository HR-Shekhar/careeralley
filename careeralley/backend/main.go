package main

import (
	"careeralley/config"
	"careeralley/controllers"
	"careeralley/middleware"
	"careeralley/models"
	"careeralley/routes"
	"errors"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

func main() {
	godotenv.Load()

	config.ConnectDB()

	// Start WebSocket hub in background
	go controllers.GlobalHub.Run()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.AuthRoutes(router)
	routes.CareerRoutes(router)
	routes.AssistantRoutes(router)
	routes.ChatRoutes(router)
	routes.MockInterviewRoutes(router) // ← NEW

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Careeralley backend running",
		})
	})

	router.GET("/profile", middleware.JWTAuthMiddleware(), func(c *gin.Context) {

		userID, exists := c.Get("user_id")

		if !exists {
			c.JSON(401, gin.H{"error": "User not found in token"})
			return
		}

		var user models.User
		result := config.DB.First(&user, userID)

		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}

		c.JSON(200, gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
		})
	})

	router.Run(":8080")
}
