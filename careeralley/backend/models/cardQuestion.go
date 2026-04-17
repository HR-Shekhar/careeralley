package models

import "time"

type CardQuestion struct {
	ID uint `gorm:"primaryKey" json:"id"`

	CardID uint `json:"card_id"`

	Question string `json:"question"`

	CreatedAt time.Time `json:"created_at"`
}
