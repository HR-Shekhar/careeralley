package models

import "time"

type CareerCard struct {
	ID uint `gorm:"primaryKey" json:"id"`

	Name string `gorm:"not null" json:"name"`

	Description string `json:"description"`

	Field string `json:"field"`

	Icon string `json:"icon"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
