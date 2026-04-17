package models

import "time"

type Roadmap struct {
	ID uint `gorm:"primaryKey"`

	UserID uint

	CardID uint

	Level string

	IsAIGenerated bool

	StartedAt time.Time

	CompletedAt time.Time

	Topics []Topic `gorm:"foreignKey:RoadmapID"`
}
