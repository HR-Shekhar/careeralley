package models

import "time"

type UserCardAnswer struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UserID uint `json:"user_id"`

	QuestionID uint `json:"question_id"`

	OptionID uint `json:"option_id"`

	CreatedAt time.Time `json:"created_at"`
}
