package models

import "time"

type UserProgress struct {
	ID uint `gorm:"primaryKey"`

	UserID     uint
	SubtopicID uint

	Completed bool

	CompletedAt *time.Time
}
