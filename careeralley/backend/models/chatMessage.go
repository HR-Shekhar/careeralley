package models

import "time"

type ChatMessage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CardID    uint      `gorm:"not null;index" json:"card_id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	UserName  string    `gorm:"not null" json:"user_name"`
	Content   string    `gorm:"not null;type:text" json:"content"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
