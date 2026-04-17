// package controllers

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"os"
// 	"strings"

// 	"github.com/gin-gonic/gin"
// )

// type ChatMessage struct {
// 	Role    string `json:"role"`
// 	Content string `json:"content"`
// }

// type AssistantChatRequest struct {
// 	Messages []ChatMessage `json:"messages"`
// }

// type AssistantChatResponse struct {
// 	Reply      string `json:"reply"`
// 	HasRoadmap bool   `json:"has_roadmap"`
// 	RoadmapID  *uint  `json:"roadmap_id,omitempty"`
// }

// func AssistantChat(c *gin.Context) {

// 	var req AssistantChatRequest

// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
// 		return
// 	}

// 	apiKey := os.Getenv("GROQ_API_KEY")

// 	// System prompt — keeps the assistant focused on CareerAlley
// 	systemPrompt := `You are CareerAlley Assistant, a helpful AI guide built into the CareerAlley learning platform.

// CareerAlley helps students create personalized learning roadmaps based on their goals, interests, and skill level.

// Your job is to:
// 1. Help users decide what career path or skill to learn
// 2. Recommend topics and learning strategies
// 3. Answer questions about fields like Web Development, Data Science, Cloud Computing, Machine Learning, DevOps, Cybersecurity, Mobile Development, UI/UX Design, etc.
// 4. Guide users through their learning journey
// 5. If a user wants a roadmap generated based on your conversation, end your reply with exactly this tag: [GENERATE_ROADMAP]

// Rules:
// - Stay focused on learning, careers, and tech topics
// - Be concise, friendly, and encouraging
// - If the user asks about something unrelated to learning or careers, gently redirect them
// - When you detect the user wants a full structured roadmap created for them, add [GENERATE_ROADMAP] at the very end of your response`

// 	// Build messages array with system prompt prepended
// 	groqMessages := []map[string]string{
// 		{"role": "system", "content": systemPrompt},
// 	}

// 	for _, msg := range req.Messages {
// 		groqMessages = append(groqMessages, map[string]string{
// 			"role":    msg.Role,
// 			"content": msg.Content,
// 		})
// 	}

// 	body := map[string]interface{}{
// 		"model":       "llama-3.3-70b-versatile",
// 		"messages":    groqMessages,
// 		"max_tokens":  1024,
// 		"temperature": 0.7,
// 	}

// 	jsonBody, _ := json.Marshal(body)

// 	groqReq, err := http.NewRequest(
// 		"POST",
// 		"https://api.groq.com/openai/v1/chat/completions",
// 		bytes.NewBuffer(jsonBody),
// 	)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AI request"})
// 		return
// 	}

// 	groqReq.Header.Set("Authorization", "Bearer "+apiKey)
// 	groqReq.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(groqReq)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI request failed"})
// 		return
// 	}

// 	defer resp.Body.Close()

// 	var result map[string]interface{}
// 	json.NewDecoder(resp.Body).Decode(&result)

// 	fmt.Println("ASSISTANT AI RESPONSE:", result)

// 	choices, ok := result["choices"].([]interface{})
// 	if !ok || len(choices) == 0 {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI response missing choices"})
// 		return
// 	}

// 	choice := choices[0].(map[string]interface{})
// 	message := choice["message"].(map[string]interface{})
// 	content := message["content"].(string)
// 	content = strings.TrimSpace(content)

// 	// Check if AI wants to trigger roadmap generation
// 	hasRoadmap := strings.Contains(content, "[GENERATE_ROADMAP]")
// 	content = strings.ReplaceAll(content, "[GENERATE_ROADMAP]", "")
// 	content = strings.TrimSpace(content)

// 	c.JSON(http.StatusOK, AssistantChatResponse{
// 		Reply:      content,
// 		HasRoadmap: hasRoadmap,
// 	})
// }

// func AssistantGenerateRoadmap(c *gin.Context) {

// 	// This endpoint takes the conversation history and generates
// 	// a full roadmap based on what the user discussed with the assistant

// 	var req AssistantChatRequest

// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
// 		return
// 	}

// 	userIDRaw, _ := c.Get("user_id")
// 	userID := uint(userIDRaw.(float64))

// 	apiKey := os.Getenv("GROQ_API_KEY")

// 	// Build conversation summary for roadmap generation
// 	var conversationText strings.Builder
// 	for _, msg := range req.Messages {
// 		conversationText.WriteString(fmt.Sprintf("%s: %s\n", msg.Role, msg.Content))
// 	}

// 	prompt := fmt.Sprintf(`Based on this conversation between a user and an AI assistant, extract the career path and skill level, then generate a personalized learning roadmap.

// Conversation:
// %s

// Generate a structured roadmap. Return ONLY valid JSON in this exact format, no extra text:

// {
//   "card_name": "Career/Skill name derived from conversation",
//   "level": "beginner or intermediate or advanced",
//   "topics": [
//     {
//       "title": "Topic name",
//       "estimated_time": 10,
//       "difficulty": "beginner",
//       "subtopics": [
//         {"title": "Subtopic name"}
//       ]
//     }
//   ]
// }`, conversationText.String())

// 	body := map[string]interface{}{
// 		"model": "llama-3.3-70b-versatile",
// 		"messages": []map[string]string{
// 			{"role": "user", "content": prompt},
// 		},
// 		"max_tokens":  2048,
// 		"temperature": 0.3,
// 	}

// 	jsonBody, _ := json.Marshal(body)

// 	groqReq, err := http.NewRequest(
// 		"POST",
// 		"https://api.groq.com/openai/v1/chat/completions",
// 		bytes.NewBuffer(jsonBody),
// 	)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AI request"})
// 		return
// 	}

// 	groqReq.Header.Set("Authorization", "Bearer "+apiKey)
// 	groqReq.Header.Set("Content-Type", "application/json")

// 	client := &http.Client{}
// 	resp, err := client.Do(groqReq)

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI request failed"})
// 		return
// 	}

// 	defer resp.Body.Close()

// 	var result map[string]interface{}
// 	json.NewDecoder(resp.Body).Decode(&result)

// 	choices, ok := result["choices"].([]interface{})
// 	if !ok || len(choices) == 0 {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI response missing choices"})
// 		return
// 	}

// 	choice := choices[0].(map[string]interface{})
// 	message := choice["message"].(map[string]interface{})
// 	content := message["content"].(string)
// 	content = strings.TrimSpace(content)
// 	content = strings.ReplaceAll(content, "```json", "")
// 	content = strings.ReplaceAll(content, "```", "")

// 	jsonStart := strings.Index(content, "{")
// 	jsonEnd := strings.LastIndex(content, "}")
// 	if jsonStart != -1 && jsonEnd != -1 {
// 		content = content[jsonStart : jsonEnd+1]
// 	}

// 	// Parse the AI roadmap response
// 	var aiRoadmap struct {
// 		CardName string `json:"card_name"`
// 		Level    string `json:"level"`
// 		Topics   []struct {
// 			Title         string `json:"title"`
// 			EstimatedTime int    `json:"estimated_time"`
// 			Difficulty    string `json:"difficulty"`
// 			Subtopics     []struct {
// 				Title string `json:"title"`
// 			} `json:"subtopics"`
// 		} `json:"topics"`
// 	}

// 	if err := json.Unmarshal([]byte(content), &aiRoadmap); err != nil {
// 		fmt.Println("JSON PARSE ERROR:", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI roadmap"})
// 		return
// 	}

// 	// Return the roadmap data to frontend — frontend will call /generate-roadmap
// 	// with the existing flow, or we return structured data for display
// 	c.JSON(http.StatusOK, gin.H{
// 		"user_id":   userID,
// 		"card_name": aiRoadmap.CardName,
// 		"level":     aiRoadmap.Level,
// 		"topics":    aiRoadmap.Topics,
// 		"message":   "Roadmap generated from conversation",
// 	})
// }

package controllers

import (
	"bytes"
	"careeralley/config"
	"careeralley/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type AssistantChatRequest struct {
	Messages []ChatMessage `json:"messages"`
}

type AssistantChatResponse struct {
	Reply      string `json:"reply"`
	HasRoadmap bool   `json:"has_roadmap"`
	RoadmapID  *uint  `json:"roadmap_id,omitempty"`
}

func AssistantChat(c *gin.Context) {

	var req AssistantChatRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	apiKey := os.Getenv("GROQ_API_KEY")

	systemPrompt := `You are CareerAlley Assistant, a helpful AI guide built into the CareerAlley learning platform.

CareerAlley helps students create personalized learning roadmaps based on their goals, interests, and skill level.

Your job is to:
1. Help users decide what career path or skill to learn
2. Recommend topics and learning strategies
3. Answer questions about fields like Web Development, Data Science, Cloud Computing, Machine Learning, DevOps, Cybersecurity, Mobile Development, UI/UX Design, etc.
4. Guide users through their learning journey
5. If a user wants a roadmap generated based on your conversation, end your reply with exactly this tag: [GENERATE_ROADMAP]

Rules:
- Stay focused on learning, careers, and tech topics
- Be concise, friendly, and encouraging
- If the user asks about something unrelated to learning or careers, gently redirect them
- When you detect the user wants a full structured roadmap created for them, add [GENERATE_ROADMAP] at the very end of your response`

	groqMessages := []map[string]string{
		{"role": "system", "content": systemPrompt},
	}

	for _, msg := range req.Messages {
		groqMessages = append(groqMessages, map[string]string{
			"role":    msg.Role,
			"content": msg.Content,
		})
	}

	body := map[string]interface{}{
		"model":       "llama-3.3-70b-versatile",
		"messages":    groqMessages,
		"max_tokens":  1024,
		"temperature": 0.7,
	}

	jsonBody, _ := json.Marshal(body)

	groqReq, err := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/chat/completions",
		bytes.NewBuffer(jsonBody),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AI request"})
		return
	}

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

	fmt.Println("ASSISTANT AI RESPONSE:", result)

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI response missing choices"})
		return
	}

	choice := choices[0].(map[string]interface{})
	message := choice["message"].(map[string]interface{})
	content := message["content"].(string)
	content = strings.TrimSpace(content)

	hasRoadmap := strings.Contains(content, "[GENERATE_ROADMAP]")
	content = strings.ReplaceAll(content, "[GENERATE_ROADMAP]", "")
	content = strings.TrimSpace(content)

	c.JSON(http.StatusOK, AssistantChatResponse{
		Reply:      content,
		HasRoadmap: hasRoadmap,
	})
}

func AssistantGenerateRoadmap(c *gin.Context) {

	var req AssistantChatRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	apiKey := os.Getenv("GROQ_API_KEY")

	var conversationText strings.Builder
	for _, msg := range req.Messages {
		conversationText.WriteString(fmt.Sprintf("%s: %s\n", msg.Role, msg.Content))
	}

	prompt := fmt.Sprintf(`Based on this conversation between a user and an AI assistant, extract the career path and skill level, then generate a personalized learning roadmap.

Conversation:
%s

Generate a structured roadmap. Return ONLY valid JSON in this exact format, no extra text:

{
  "card_name": "Career/Skill name derived from conversation",
  "level": "beginner or intermediate or advanced",
  "topics": [
    {
      "title": "Topic name",
      "estimated_time": 10,
      "difficulty": "beginner",
      "subtopics": [
        {"title": "Subtopic name"}
      ]
    }
  ]
}`, conversationText.String())

	body := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"max_tokens":  2048,
		"temperature": 0.3,
	}

	jsonBody, _ := json.Marshal(body)

	groqReq, err := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/chat/completions",
		bytes.NewBuffer(jsonBody),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create AI request"})
		return
	}

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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI response missing choices"})
		return
	}

	choice := choices[0].(map[string]interface{})
	message := choice["message"].(map[string]interface{})
	content := message["content"].(string)
	content = strings.TrimSpace(content)
	content = strings.ReplaceAll(content, "```json", "")
	content = strings.ReplaceAll(content, "```", "")

	jsonStart := strings.Index(content, "{")
	jsonEnd := strings.LastIndex(content, "}")
	if jsonStart != -1 && jsonEnd != -1 {
		content = content[jsonStart : jsonEnd+1]
	}

	var aiRoadmap struct {
		CardName string `json:"card_name"`
		Level    string `json:"level"`
		Topics   []struct {
			Title         string `json:"title"`
			EstimatedTime int    `json:"estimated_time"`
			Difficulty    string `json:"difficulty"`
			Subtopics     []struct {
				Title string `json:"title"`
			} `json:"subtopics"`
		} `json:"topics"`
	}

	if err := json.Unmarshal([]byte(content), &aiRoadmap); err != nil {
		fmt.Println("JSON PARSE ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse AI roadmap"})
		return
	}

	// Return the roadmap data to frontend — frontend will call /generate-roadmap
	// with the existing flow, or we return structured data for display
	c.JSON(http.StatusOK, gin.H{
		"user_id":   userID,
		"card_name": aiRoadmap.CardName,
		"level":     aiRoadmap.Level,
		"topics":    aiRoadmap.Topics,
		"message":   "Roadmap generated from conversation",
	})
}

// ------------------------------------
// SaveAssistantRoadmap
// POST /assistant/save-roadmap
// Persists the AI-generated roadmap to the DB exactly like GenerateRoadmap does
// ------------------------------------

type SaveRoadmapRequest struct {
	CardName string `json:"card_name"`
	Level    string `json:"level"`
	Topics   []struct {
		Title         string `json:"title"`
		EstimatedTime int    `json:"estimated_time"`
		Difficulty    string `json:"difficulty"`
		Subtopics     []struct {
			Title string `json:"title"`
		} `json:"subtopics"`
	} `json:"topics"`
}

func SaveAssistantRoadmap(c *gin.Context) {

	var req SaveRoadmapRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	if req.CardName == "" || len(req.Topics) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "card_name and topics are required"})
		return
	}

	// ------------------------------------------
	// Find or create a CareerCard for this topic
	// ------------------------------------------
	var card models.CareerCard
	err := config.DB.
		Where("name = ?", req.CardName).
		First(&card).Error

	if err != nil {
		// Card doesn't exist — create it
		card = models.CareerCard{
			Name:        req.CardName,
			Description: "AI-generated career path from assistant conversation",
			Field:       "AI Generated",
			Icon:        "🤖",
		}
		if createErr := config.DB.Create(&card).Error; createErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create career card"})
			return
		}
	}

	// ------------------------------------------
	// Delete any existing roadmap for this user + card
	// (same pattern as GenerateRoadmap in careerController)
	// ------------------------------------------
	var oldRoadmaps []models.Roadmap
	config.DB.
		Where("user_id = ? AND card_id = ?", userID, card.ID).
		Find(&oldRoadmaps)

	for _, r := range oldRoadmaps {
		var topics []models.Topic
		config.DB.Where("roadmap_id = ?", r.ID).Find(&topics)
		for _, t := range topics {
			config.DB.Where("topic_id = ?", t.ID).Delete(&models.Subtopic{})
		}
		config.DB.Where("roadmap_id = ?", r.ID).Delete(&models.Topic{})
		config.DB.Delete(&r)
	}

	// ------------------------------------------
	// Create new roadmap
	// ------------------------------------------
	roadmap := models.Roadmap{
		UserID:        userID,
		CardID:        card.ID,
		Level:         req.Level,
		IsAIGenerated: true,
		StartedAt:     time.Now(),
	}

	if err := config.DB.Create(&roadmap).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create roadmap"})
		return
	}

	// ------------------------------------------
	// Insert topics and subtopics
	// ------------------------------------------
	for i, topicData := range req.Topics {
		topic := models.Topic{
			RoadmapID:     roadmap.ID,
			Title:         topicData.Title,
			EstimatedTime: topicData.EstimatedTime,
			Difficulty:    topicData.Difficulty,
			OrderIndex:    i,
		}
		config.DB.Create(&topic)

		for _, subData := range topicData.Subtopics {
			sub := models.Subtopic{
				TopicID: topic.ID,
				Title:   subData.Title,
			}
			config.DB.Create(&sub)
		}
	}

	fmt.Printf("[ASSISTANT] Saved roadmap '%s' (level: %s) for user %d — card_id: %d, roadmap_id: %d\n",
		req.CardName, req.Level, userID, card.ID, roadmap.ID)

	c.JSON(http.StatusOK, gin.H{
		"message":    "Roadmap saved successfully",
		"roadmap_id": roadmap.ID,
		"card_id":    card.ID,
	})
}
