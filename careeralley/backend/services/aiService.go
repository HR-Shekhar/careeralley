package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

type SubtopicAI struct {
	Title string `json:"title"`
}

type TopicAI struct {
	Title         string       `json:"title"`
	EstimatedTime int          `json:"estimated_time"`
	Difficulty    string       `json:"difficulty"`
	Subtopics     []SubtopicAI `json:"subtopics"`
}

type RoadmapAI struct {
	Topics []TopicAI `json:"topics"`
}

func GenerateRoadmap(cardName string, level string, answers []string) (RoadmapAI, error) {

	apiKey := os.Getenv("GROQ_API_KEY")

	answersText := strings.Join(answers, "\n")

	prompt := fmt.Sprintf(`
Generate a personalized learning roadmap.

Career path: %s
Skill level: %s

User skill answers:
%s

Use these answers to adapt the roadmap difficulty and focus areas.

Return JSON in this format:

{
 "topics":[
  {
   "title":"Topic name",
   "estimated_time":10,
   "difficulty":"%s",
   "subtopics":[
     {"title":"Subtopic"}
   ]
  }
 ]
}
`, cardName, level, answersText, level)

	body := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
	}

	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(
		"POST",
		"https://api.groq.com/openai/v1/chat/completions",
		bytes.NewBuffer(jsonBody),
	)

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return RoadmapAI{}, err
	}

	defer resp.Body.Close()

	var result map[string]interface{}

	json.NewDecoder(resp.Body).Decode(&result)

	fmt.Println("AI RESPONSE:", result)

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return RoadmapAI{}, fmt.Errorf("AI response missing choices")
	}

	choice := choices[0].(map[string]interface{})
	message := choice["message"].(map[string]interface{})

	// ✅ Extract content correctly
	content := message["content"].(string)

	// ✅ Clean AI response
	content = strings.TrimSpace(content)
	content = strings.ReplaceAll(content, "```json", "")
	content = strings.ReplaceAll(content, "```", "")

	jsonStart := strings.Index(content, "{")
	jsonEnd := strings.LastIndex(content, "}")

	if jsonStart != -1 && jsonEnd != -1 {
		content = content[jsonStart : jsonEnd+1]
	}

	var roadmap RoadmapAI

	err = json.Unmarshal([]byte(content), &roadmap)

	if err != nil {
		fmt.Println("JSON PARSE ERROR:", err)
		return roadmap, err
	}

	return roadmap, nil
}
