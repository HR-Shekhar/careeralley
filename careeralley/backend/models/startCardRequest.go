package models

type StartCardRequest struct {
	CardID uint `json:"card_id"`

	Level string `json:"level"`
}
