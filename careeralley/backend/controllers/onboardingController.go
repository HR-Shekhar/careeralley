package controllers

import (
	"net/http"

	"careeralley/config"
	"careeralley/models"

	"github.com/gin-gonic/gin"
)

func GetOnboardingQuestions(c *gin.Context) {

	var questions []models.OnboardingQuestion

	config.DB.Where("stage = ?", 1).Find(&questions)

	type Option struct {
		ID   uint   `json:"id"`
		Text string `json:"text"`
	}

	type QuestionResponse struct {
		ID       uint     `json:"id"`
		Question string   `json:"question"`
		Options  []Option `json:"options"`
	}

	var response []QuestionResponse

	for _, q := range questions {

		var options []models.OnboardingOption
		config.DB.Where("question_id = ?", q.ID).Find(&options)

		var optionList []Option

		for _, o := range options {
			optionList = append(optionList, Option{
				ID:   o.ID,
				Text: o.OptionText,
			})
		}

		response = append(response, QuestionResponse{
			ID:       q.ID,
			Question: q.Question,
			Options:  optionList,
		})
	}

	c.JSON(http.StatusOK, response)
}
func SubmitOnboardingAnswers(c *gin.Context) {

	type Answer struct {
		QuestionID uint `json:"question_id"`
		OptionID   uint `json:"option_id"`
	}

	type Request struct {
		Answers []Answer `json:"answers"`
	}

	var req Request

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not found in token",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	for _, ans := range req.Answers {

		record := models.UserOnboardingAnswer{
			UserID:     userID,
			QuestionID: ans.QuestionID,
			OptionID:   ans.OptionID,
		}

		config.DB.Create(&record)
	}

	/* -------------------------------
	   NEW: Mark user as onboarded
	--------------------------------*/

	config.DB.Model(&models.User{}).
		Where("id = ?", userID).
		Update("onboarded", true)

	/* -------------------------------- */

	tagCount := make(map[string]int)

	for _, ans := range req.Answers {

		var option models.OnboardingOption
		config.DB.First(&option, ans.OptionID)

		tagCount[option.Tag]++
	}

	var cards []models.CareerCard

	if tagCount["data"] >= tagCount["web"] &&
		tagCount["data"] >= tagCount["security"] {

		config.DB.Where("name IN ?", []string{
			"AI / Machine Learning",
			"Data Science",
			"Cloud Computing",
		}).Find(&cards)

	} else if tagCount["security"] > tagCount["web"] {

		config.DB.Where("name IN ?", []string{
			"Cybersecurity",
			"Computer Networks",
			"Cloud Computing",
		}).Find(&cards)

	} else {

		config.DB.Where("name IN ?", []string{
			"Web Development",
			"Software Engineering",
			"DevOps",
		}).Find(&cards)

	}

	c.JSON(http.StatusOK, gin.H{
		"recommended_cards": cards,
	})
}

func GetCardQuestions(c *gin.Context) {

	cardID := c.Param("card_id")

	var questions []models.CardQuestion

	config.DB.Where("card_id = ?", cardID).Find(&questions)

	type Option struct {
		ID   uint   `json:"id"`
		Text string `json:"text"`
	}

	type Response struct {
		ID       uint     `json:"id"`
		Question string   `json:"question"`
		Options  []Option `json:"options"`
	}

	var result []Response

	for _, q := range questions {

		var options []models.CardOption
		config.DB.Where("question_id = ?", q.ID).Find(&options)

		var list []Option

		for _, o := range options {
			list = append(list, Option{
				ID:   o.ID,
				Text: o.OptionText,
			})
		}

		result = append(result, Response{
			ID:       q.ID,
			Question: q.Question,
			Options:  list,
		})
	}

	c.JSON(200, result)
}

func SubmitCardAnswers(c *gin.Context) {

	type Answer struct {
		QuestionID uint `json:"question_id"`
		OptionID   uint `json:"option_id"`
	}

	type Request struct {
		Answers []Answer `json:"answers"`
	}

	var req Request

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	userValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(401, gin.H{
			"error": "User not found",
		})
		return
	}

	userID := uint(userValue.(float64))

	levelScore := map[string]int{
		"beginner":     0,
		"intermediate": 0,
		"advanced":     0,
	}

	for _, ans := range req.Answers {

		var option models.CardOption

		config.DB.First(&option, ans.OptionID)

		levelScore[option.LevelTag]++

		record := models.UserCardAnswer{
			UserID:     userID,
			QuestionID: ans.QuestionID,
			OptionID:   ans.OptionID,
		}

		config.DB.Create(&record)
	}

	userLevel := "beginner"

	if levelScore["advanced"] >= levelScore["intermediate"] &&
		levelScore["advanced"] >= levelScore["beginner"] {

		userLevel = "advanced"

	} else if levelScore["intermediate"] >= levelScore["beginner"] {

		userLevel = "intermediate"
	}

	c.JSON(200, gin.H{
		"user_level": userLevel,
	})
}
