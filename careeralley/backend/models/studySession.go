package models

import "time"

type StudySession struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UserID uint `json:"user_id"`

	SubtopicID uint `json:"subtopic_id"`

	StartTime time.Time `json:"start_time"`

	EndTime *time.Time `json:"end_time"`

	Duration int `json:"duration"`
}
