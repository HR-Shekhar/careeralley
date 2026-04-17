package controllers

import (
	"careeralley/config"
	"careeralley/models"
	"careeralley/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type SignupInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {

	var input SignupInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User

	result := config.DB.Where("email = ?", input.Email).First(&user)

	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Email)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	// NEW: check onboarding status
	onboarded := user.Onboarded

	c.JSON(http.StatusOK, gin.H{
		"token":     token,
		"onboarded": onboarded,
	})

}

func GoogleLogin(c *gin.Context) {

	url := config.GoogleConfig.AuthCodeURL("randomstate")

	c.Redirect(http.StatusTemporaryRedirect, url)
}
func GoogleCallback(c *gin.Context) {

	code := c.Query("code")

	token, err := exchangeCodeForToken(code)
	if err != nil {
		c.JSON(500, gin.H{"error": "Google auth failed"})
		return
	}

	user, err := getGoogleUser(token)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to get user"})
		return
	}

	var dbUser models.User

	err = config.DB.Where("email = ?", user.Email).First(&dbUser).Error

	onboarded := true

	if err != nil {

		dbUser = models.User{
			Email:    user.Email,
			Name:     user.Name,
			Provider: "google",
		}

		config.DB.Create(&dbUser)

		onboarded = false
	}

	jwtToken, _ := utils.GenerateToken(dbUser.ID, dbUser.Email)

	redirectURL := fmt.Sprintf(
		"http://localhost:3000/auth-success?token=%s&onboarded=%t",
		jwtToken,
		onboarded,
	)

	c.Redirect(http.StatusTemporaryRedirect, redirectURL)

}

func Signup(c *gin.Context) {

	var input SignupInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
		Provider: "local",
	}

	config.DB.Create(&user)

	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
	})
}
