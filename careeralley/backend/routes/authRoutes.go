package routes

import (
	"careeralley/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {

	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)
	router.GET("/auth/google", controllers.GoogleLogin)
	router.GET("/auth/google/callback", controllers.GoogleCallback)

}
