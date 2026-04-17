package models

import "time"

type Field struct {
	ID uint `gorm:"primaryKey" json:"id"`

	Name string `json:"name"`

	Description string `json:"description"`

	Icon string `json:"icon"`

	Color string `json:"color"`

	CreatedAt time.Time `json:"created_at"`
}
