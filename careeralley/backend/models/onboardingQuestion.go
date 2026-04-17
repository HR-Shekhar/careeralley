package models

import "time"

type OnboardingQuestion struct {
	ID uint `gorm:"primaryKey" json:"id"`

	Question string `json:"question"`

	Stage int `json:"stage"`

	CreatedAt time.Time `json:"created_at"`
}
