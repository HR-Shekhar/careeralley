package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

type OptionAI struct {
	Text  string `json:"text"`
	Level string `json:"level"`
}

type QuestionAI struct {
	Question string     `json:"question"`
	Options  []OptionAI `json:"options"`
}

type CardQuestionsAI struct {
	Questions []QuestionAI `json:"questions"`
}

func GenerateCardQuestions(cardName string) (CardQuestionsAI, error) {

	apiKey := os.Getenv("GROQ_API_KEY")

	prompt := fmt.Sprintf(`
Generate 3 skill assessment questions for someone pursuing %s.

Each question must determine whether the user is beginner, intermediate or advanced.

Return ONLY JSON in this format:

{
 "questions":[
  {
   "question":"...",
   "options":[
    {"text":"...", "level":"beginner"},
    {"text":"...", "level":"intermediate"},
    {"text":"...", "level":"advanced"}
   ]
  }
 ]
}
`, cardName)

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
		return CardQuestionsAI{}, err
	}

	defer resp.Body.Close()

	var result map[string]interface{}

	json.NewDecoder(resp.Body).Decode(&result)

	choices := result["choices"].([]interface{})

	message := choices[0].(map[string]interface{})["message"].(map[string]interface{})

	content := message["content"].(string)

	content = strings.TrimSpace(content)

	content = strings.ReplaceAll(content, "```json", "")
	content = strings.ReplaceAll(content, "```", "")

	jsonStart := strings.Index(content, "{")
	jsonEnd := strings.LastIndex(content, "}")

	if jsonStart != -1 && jsonEnd != -1 {
		content = content[jsonStart : jsonEnd+1]
	}

	var questions CardQuestionsAI

	err = json.Unmarshal([]byte(content), &questions)

	if err != nil {
		fmt.Println("JSON ERROR:", err)
		return questions, err
	}

	return questions, nil

}
