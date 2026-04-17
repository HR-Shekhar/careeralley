package controllers

import (
	"careeralley/config"
	"careeralley/models"
	"careeralley/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetCareerCards(c *gin.Context) {

	var cards []models.CareerCard

	result := config.DB.Find(&cards)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch career cards",
		})
		return
	}

	c.JSON(http.StatusOK, cards)
}

func StartCard(c *gin.Context) {

	var req models.StartCardRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	// Prevent duplicate roadmap
	var existing models.Roadmap
	err := config.DB.
		Where("user_id = ? AND card_id = ?", userID, req.CardID).
		First(&existing).Error

	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"message":    "Card already started",
			"roadmap_id": existing.ID,
		})
		return
	}

	roadmap := models.Roadmap{
		UserID:        userID,
		CardID:        req.CardID,
		Level:         req.Level,
		IsAIGenerated: false,
		StartedAt:     time.Now(),
	}

	config.DB.Create(&roadmap)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Card started successfully",
		"roadmap_id": roadmap.ID,
	})
}

func GenerateRoadmap(c *gin.Context) {

	var req models.GenerateRoadmapRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	var card models.CareerCard

	if err := config.DB.First(&card, req.CardID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Card not found"})
		return
	}

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	// ---------------------------
	// Generate AI roadmap
	// ---------------------------

	roadmapAI, err := services.GenerateRoadmap(card.Name, req.Level, req.Answers)

	if err != nil {
		c.JSON(500, gin.H{"error": "AI generation failed"})
		return
	}

	// ---------------------------
	// Delete previous roadmap
	// ---------------------------

	var oldRoadmaps []models.Roadmap

	config.DB.
		Where("user_id = ? AND card_id = ?", userID, req.CardID).
		Find(&oldRoadmaps)

	for _, r := range oldRoadmaps {

		var topics []models.Topic

		config.DB.
			Where("roadmap_id = ?", r.ID).
			Find(&topics)

		for _, t := range topics {
			config.DB.Where("topic_id = ?", t.ID).Delete(&models.Subtopic{})
		}

		config.DB.Where("roadmap_id = ?", r.ID).Delete(&models.Topic{})

		config.DB.Delete(&r)
	}

	// ---------------------------
	// Create new roadmap
	// ---------------------------

	roadmap := models.Roadmap{
		UserID:        userID,
		CardID:        req.CardID,
		Level:         req.Level,
		IsAIGenerated: true,
		StartedAt:     time.Now(),
	}

	config.DB.Create(&roadmap)

	// ---------------------------
	// Insert AI topics
	// ---------------------------

	for i, topic := range roadmapAI.Topics {

		t := models.Topic{
			RoadmapID:     roadmap.ID,
			Title:         topic.Title,
			EstimatedTime: topic.EstimatedTime,
			Difficulty:    topic.Difficulty,
			OrderIndex:    i,
		}

		config.DB.Create(&t)

		for _, sub := range topic.Subtopics {

			s := models.Subtopic{
				TopicID: t.ID,
				Title:   sub.Title,
			}

			config.DB.Create(&s)
		}
	}

	c.JSON(200, gin.H{
		"message": "Roadmap generated successfully",
	})
}

func GetRoadmap(c *gin.Context) {

	cardID := c.Param("card_id")

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var roadmap models.Roadmap

	err := config.DB.
		Preload("Topics.Subtopics").
		Where("card_id = ? AND user_id = ?", cardID, userID).
		First(&roadmap).Error

	if err != nil {
		c.JSON(404, gin.H{"error": "Roadmap not found"})
		return
	}

	// load completed progress
	var progresses []models.UserProgress

	config.DB.
		Where("user_id = ? AND completed = true", userID).
		Find(&progresses)

	completedMap := make(map[uint]bool)

	for _, p := range progresses {
		completedMap[p.SubtopicID] = true
	}

	// attach completion state
	for ti := range roadmap.Topics {

		for si := range roadmap.Topics[ti].Subtopics {

			subID := roadmap.Topics[ti].Subtopics[si].ID

			if completedMap[subID] {
				roadmap.Topics[ti].Subtopics[si].Completed = true
			}

		}

	}

	c.JSON(200, roadmap)
}

func StartStudySession(c *gin.Context) {

	var req models.StartStudyRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	session := models.StudySession{
		UserID:     userID,
		SubtopicID: req.SubtopicID,
		StartTime:  time.Now(),
	}

	config.DB.Create(&session)

	c.JSON(200, gin.H{
		"message":    "Study session started",
		"session_id": session.ID,
	})
}

func EndStudySession(c *gin.Context) {

	var req models.EndStudyRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	var session models.StudySession

	if err := config.DB.First(&session, req.SessionID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Session not found"})
		return
	}

	now := time.Now()

	duration := int(now.Sub(session.StartTime).Minutes())

	session.EndTime = &now
	session.Duration = duration

	config.DB.Save(&session)

	c.JSON(200, gin.H{
		"message":          "Study session ended",
		"duration_minutes": duration,
	})
}

func GetStudyStats(c *gin.Context) {

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var todayMinutes int
	var weeklyMinutes int
	var totalMinutes int

	now := time.Now()

	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	weekStart := now.AddDate(0, 0, -7)

	config.DB.
		Model(&models.StudySession{}).
		Where("user_id = ? AND start_time >= ?", userID, todayStart).
		Select("COALESCE(SUM(duration),0)").
		Scan(&todayMinutes)

	config.DB.
		Model(&models.StudySession{}).
		Where("user_id = ? AND start_time >= ?", userID, weekStart).
		Select("COALESCE(SUM(duration),0)").
		Scan(&weeklyMinutes)

	config.DB.
		Model(&models.StudySession{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(duration),0)").
		Scan(&totalMinutes)

	c.JSON(200, gin.H{
		"today_minutes":  todayMinutes,
		"weekly_minutes": weeklyMinutes,
		"total_minutes":  totalMinutes,
	})
}

func GetRoadmapProgress(c *gin.Context) {

	cardID := c.Param("card_id")

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var totalSubtopics int64
	var completedSubtopics int64

	// total subtopics in roadmap
	config.DB.
		Model(&models.Subtopic{}).
		Joins("JOIN topics ON topics.id = subtopics.topic_id").
		Joins("JOIN roadmaps ON roadmaps.id = topics.roadmap_id").
		Where("roadmaps.card_id = ? AND roadmaps.user_id = ?", cardID, userID).
		Count(&totalSubtopics)

	// completed subtopics
	config.DB.
		Model(&models.UserProgress{}).
		Where("user_id = ? AND completed = true", userID).
		Count(&completedSubtopics)

	progress := 0

	if totalSubtopics > 0 {
		progress = int((completedSubtopics * 100) / totalSubtopics)
	}

	c.JSON(200, gin.H{
		"total_subtopics":     totalSubtopics,
		"completed_subtopics": completedSubtopics,
		"progress_percent":    progress,
	})
}

func GetUserDashboard(c *gin.Context) {

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	// -------------------
	// Study statistics
	// -------------------

	var todayMinutes int
	var weeklyMinutes int

	now := time.Now()

	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	weekStart := now.AddDate(0, 0, -7)

	config.DB.
		Model(&models.StudySession{}).
		Where("user_id = ? AND start_time >= ?", userID, todayStart).
		Select("COALESCE(SUM(duration),0)").
		Scan(&todayMinutes)

	config.DB.
		Model(&models.StudySession{}).
		Where("user_id = ? AND start_time >= ?", userID, weekStart).
		Select("COALESCE(SUM(duration),0)").
		Scan(&weeklyMinutes)

	// -------------------
	// Active cards
	// -------------------

	var roadmaps []models.Roadmap

	config.DB.
		Preload("Topics.Subtopics").
		Where("user_id = ?", userID).
		Order("id DESC").
		Find(&roadmaps)

	// -------------------
	// Prepare response
	// -------------------

	type CardProgress struct {
		RoadmapID uint   `json:"roadmap_id"`
		CardID    uint   `json:"card_id"`
		CardName  string `json:"card_name"`
		Level     string `json:"level"`
		Progress  int    `json:"progress_percent"`
	}

	var cards []CardProgress

	for _, roadmap := range roadmaps {

		total := 0
		completed := 0

		for _, topic := range roadmap.Topics {

			for _, sub := range topic.Subtopics {

				total++

				var progress models.UserProgress

				err := config.DB.
					Where("user_id = ? AND subtopic_id = ? AND completed = true",
						userID, sub.ID).
					First(&progress).Error

				if err == nil {
					completed++
				}
			}
		}

		progressPercent := 0

		if total > 0 {
			progressPercent = (completed * 100) / total
		}

		var card models.CareerCard
		config.DB.First(&card, roadmap.CardID)

		cards = append(cards, CardProgress{
			RoadmapID: roadmap.ID,
			CardID:    roadmap.CardID,
			CardName:  card.Name,
			Level:     roadmap.Level,
			Progress:  progressPercent,
		})
	}

	c.JSON(200, gin.H{
		"today_minutes":  todayMinutes,
		"weekly_minutes": weeklyMinutes,
		"active_cards":   cards,
	})
}

func GenerateCardQuestions(c *gin.Context) {

	cardID := c.Param("card_id")

	var card models.CareerCard

	if err := config.DB.First(&card, cardID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Card not found"})
		return
	}

	questions, err := services.GenerateCardQuestions(card.Name)

	if err != nil {
		c.JSON(500, gin.H{"error": "AI question generation failed"})
		return
	}

	c.JSON(200, questions)
}

func UpdateProgress(c *gin.Context) {

	var req models.ProgressRequest

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(400, gin.H{
			"error": "Invalid request",
		})

		return
	}

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var progress models.UserProgress

	err := config.DB.
		Where("user_id = ? AND subtopic_id = ?", userID, req.SubtopicID).
		First(&progress).Error

	now := time.Now()

	if err != nil {

		progress = models.UserProgress{
			UserID:      userID,
			SubtopicID:  req.SubtopicID,
			Completed:   req.Completed,
			CompletedAt: &now,
		}

		config.DB.Create(&progress)

	} else {

		progress.Completed = req.Completed

		if req.Completed {
			progress.CompletedAt = &now
		}

		config.DB.Save(&progress)
	}

	c.JSON(200, gin.H{
		"message": "Progress updated",
	})
}
