package controllers

import (
	"bytes"
	"careeralley/config"
	"careeralley/models"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// --------------------------------------------------
// GET /mock-interviews
// Returns all open interviews + user's own interviews
// --------------------------------------------------
func GetMockInterviews(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var interviews []models.MockInterview

	// Get open interviews (not by this user) + all of this user's interviews
	config.DB.
		Where("status = 'open' AND requester_id != ? OR requester_id = ? OR responder_id = ?",
			userID, userID, userID).
		Order("created_at DESC").
		Find(&interviews)

	c.JSON(http.StatusOK, interviews)
}

// --------------------------------------------------
// POST /mock-interviews
// Create a new interview request
// --------------------------------------------------
func CreateMockInterview(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var req struct {
		Topic         string `json:"topic"`
		Description   string `json:"description"`
		QuestionCount int    `json:"question_count"`
		ScheduledAt   string `json:"scheduled_at"`
	}

	if err := c.ShouldBindJSON(&req); err != nil || req.Topic == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Topic is required"})
		return
	}

	if req.QuestionCount < 1 || req.QuestionCount > 20 {
		req.QuestionCount = 5
	}

	scheduledAt := time.Now()
	if req.ScheduledAt != "" {
		parsed, err := time.Parse(time.RFC3339, req.ScheduledAt)
		if err == nil {
			scheduledAt = parsed
		}
	}

	interview := models.MockInterview{
		RequesterID:   userID,
		RequesterName: user.Name,
		Topic:         req.Topic,
		Description:   req.Description,
		QuestionCount: req.QuestionCount,
		Status:        "open",
		ScheduledAt:   scheduledAt,
	}

	config.DB.Create(&interview)

	c.JSON(http.StatusOK, interview)
}

// --------------------------------------------------
// POST /mock-interviews/:id/join
// Second user joins — status becomes matched, Jitsi room generated
// --------------------------------------------------
func JoinMockInterview(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	interviewID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interview ID"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var interview models.MockInterview
	if err := config.DB.First(&interview, interviewID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Interview not found"})
		return
	}

	if interview.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Interview is no longer open"})
		return
	}

	if interview.RequesterID == userID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot join your own interview request"})
		return
	}

	// Generate unique Jitsi room
	jitsiRoom := fmt.Sprintf("careeralley-interview-%d-%d", interview.ID, time.Now().Unix())

	// Randomly pick who is the interviewer first
	participants := []uint{interview.RequesterID, userID}
	rand.Seed(time.Now().UnixNano())
	firstInterviewer := participants[rand.Intn(2)]

	interview.ResponderID = &userID
	interview.ResponderName = user.Name
	interview.JitsiRoom = jitsiRoom
	interview.Status = "matched"
	interview.InterviewerID = &firstInterviewer

	config.DB.Save(&interview)

	c.JSON(http.StatusOK, gin.H{
		"message":           "Joined successfully",
		"interview":         interview,
		"jitsi_url":         "https://meet.jit.si/" + jitsiRoom,
		"first_interviewer": firstInterviewer,
	})
}

// --------------------------------------------------
// GET /mock-interviews/:id
// Get interview details + questions if any
// --------------------------------------------------
func GetMockInterview(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	interviewID := c.Param("id")

	var interview models.MockInterview
	if err := config.DB.First(&interview, interviewID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Interview not found"})
		return
	}

	// Must be a participant
	if interview.RequesterID != userID &&
		(interview.ResponderID == nil || *interview.ResponderID != userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	var questions []models.MockInterviewQuestion
	config.DB.
		Where("interview_id = ?", interviewID).
		Order("question_number ASC").
		Find(&questions)

	var results []models.MockInterviewResult
	config.DB.Where("interview_id = ?", interviewID).Find(&results)

	c.JSON(http.StatusOK, gin.H{
		"interview": interview,
		"questions": questions,
		"results":   results,
		"jitsi_url": "https://meet.jit.si/" + interview.JitsiRoom,
	})
}

// --------------------------------------------------
// POST /mock-interviews/:id/generate-question
// Generate next AI question for the current interviewee
// --------------------------------------------------
func GenerateInterviewQuestion(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	interviewID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interview ID"})
		return
	}

	var req struct {
		Round          string `json:"round"`           // "first" or "second"
		ForUserID      uint   `json:"for_user_id"`     // who is being interviewed
		QuestionNumber int    `json:"question_number"` // which question (1-based)
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var interview models.MockInterview
	if err := config.DB.First(&interview, interviewID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Interview not found"})
		return
	}

	// Must be a participant
	if interview.RequesterID != userID &&
		(interview.ResponderID == nil || *interview.ResponderID != userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	// Get previous questions to avoid repeats
	var prevQuestions []models.MockInterviewQuestion
	config.DB.
		Where("interview_id = ? AND for_user_id = ?", interviewID, req.ForUserID).
		Find(&prevQuestions)

	var prevTitles []string
	for _, q := range prevQuestions {
		prevTitles = append(prevTitles, q.Question)
	}

	previousText := ""
	if len(prevTitles) > 0 {
		previousText = "Already asked (do NOT repeat these):\n- " + strings.Join(prevTitles, "\n- ")
	}

	// AI prompt
	prompt := fmt.Sprintf(`You are an expert technical interviewer.

Topic: %s
Description: %s
Question number: %d of %d
%s

Generate ONE interview question on this topic.
Also provide a detailed model answer the interviewer can use to evaluate the candidate.

Return ONLY valid JSON, no extra text:
{
  "question": "The interview question here",
  "suggested_answer": "Detailed model answer here"
}`,
		interview.Topic,
		interview.Description,
		req.QuestionNumber,
		interview.QuestionCount,
		previousText,
	)

	apiKey := os.Getenv("GROQ_API_KEY")

	body := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"max_tokens":  1024,
		"temperature": 0.6,
	}

	jsonBody, _ := json.Marshal(body)
	groqReq, _ := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonBody))
	groqReq.Header.Set("Authorization", "Bearer "+apiKey)
	groqReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(groqReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI request failed"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI response missing"})
		return
	}

	content := choices[0].(map[string]interface{})["message"].(map[string]interface{})["content"].(string)
	content = strings.TrimSpace(content)
	content = strings.ReplaceAll(content, "```json", "")
	content = strings.ReplaceAll(content, "```", "")

	jsonStart := strings.Index(content, "{")
	jsonEnd := strings.LastIndex(content, "}")
	if jsonStart != -1 && jsonEnd != -1 {
		content = content[jsonStart : jsonEnd+1]
	}

	var aiResp struct {
		Question        string `json:"question"`
		SuggestedAnswer string `json:"suggested_answer"`
	}

	if err := json.Unmarshal([]byte(content), &aiResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI response"})
		return
	}

	// Save question to DB
	question := models.MockInterviewQuestion{
		InterviewID:     uint(interviewID),
		QuestionNumber:  req.QuestionNumber,
		ForUserID:       req.ForUserID,
		Question:        aiResp.Question,
		SuggestedAnswer: aiResp.SuggestedAnswer,
		Round:           req.Round,
	}
	config.DB.Create(&question)

	c.JSON(http.StatusOK, question)
}

// --------------------------------------------------
// POST /mock-interviews/:id/score
// Submit score for a question (0-10)
// --------------------------------------------------
func ScoreInterviewQuestion(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	interviewID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req struct {
		QuestionID uint `json:"question_id"`
		Score      int  `json:"score"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Score < 0 || req.Score > 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Score must be between 0 and 10"})
		return
	}

	var interview models.MockInterview
	if err := config.DB.First(&interview, interviewID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Interview not found"})
		return
	}

	// Must be a participant
	if interview.RequesterID != userID &&
		(interview.ResponderID == nil || *interview.ResponderID != userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	var question models.MockInterviewQuestion
	if err := config.DB.First(&question, req.QuestionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	question.Score = req.Score
	config.DB.Save(&question)

	c.JSON(http.StatusOK, gin.H{"message": "Score saved", "score": req.Score})
}

// --------------------------------------------------
// POST /mock-interviews/:id/complete
// Mark interview as complete and calculate final scores
// --------------------------------------------------
func CompleteMockInterview(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	interviewID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var interview models.MockInterview
	if err := config.DB.First(&interview, interviewID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Interview not found"})
		return
	}

	// Must be a participant
	if interview.RequesterID != userID &&
		(interview.ResponderID == nil || *interview.ResponderID != userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	var questions []models.MockInterviewQuestion
	config.DB.Where("interview_id = ?", interviewID).Find(&questions)

	// Calculate score per user
	scoreMap := make(map[uint]int)
	countMap := make(map[uint]int)

	for _, q := range questions {
		scoreMap[q.ForUserID] += q.Score
		countMap[q.ForUserID]++
	}

	// Save results
	participants := []uint{interview.RequesterID}
	if interview.ResponderID != nil {
		participants = append(participants, *interview.ResponderID)
	}

	for _, uid := range participants {
		var user models.User
		config.DB.First(&user, uid)

		// Delete old result if exists
		config.DB.Where("interview_id = ? AND user_id = ?", interviewID, uid).
			Delete(&models.MockInterviewResult{})

		result := models.MockInterviewResult{
			InterviewID: uint(interviewID),
			UserID:      uid,
			UserName:    user.Name,
			TotalScore:  scoreMap[uid],
			MaxScore:    countMap[uid] * 10,
		}
		config.DB.Create(&result)
	}

	interview.Status = "completed"
	config.DB.Save(&interview)

	var results []models.MockInterviewResult
	config.DB.Where("interview_id = ?", interviewID).Find(&results)

	c.JSON(http.StatusOK, gin.H{
		"message": "Interview completed",
		"results": results,
	})
}

// --------------------------------------------------
// DELETE /mock-interviews/:id
// Cancel/delete an open interview request (requester only)
// --------------------------------------------------
func DeleteMockInterview(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	interviewID := c.Param("id")

	var interview models.MockInterview
	if err := config.DB.First(&interview, interviewID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Interview not found"})
		return
	}

	if interview.RequesterID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the requester can cancel"})
		return
	}

	if interview.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can only cancel open interviews"})
		return
	}

	config.DB.Delete(&interview)

	c.JSON(http.StatusOK, gin.H{"message": "Interview cancelled"})
}
