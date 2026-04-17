package models

type GenerateRoadmapRequest struct {
	CardID  uint     `json:"card_id"`
	Level   string   `json:"level"`
	Answers []string `json:"answers"`
}
