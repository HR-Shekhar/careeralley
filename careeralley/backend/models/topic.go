package models

type Topic struct {
	ID uint `gorm:"primaryKey" json:"id"`

	RoadmapID uint `json:"roadmap_id"`

	Title string `json:"title"`

	EstimatedTime int `json:"estimated_time"`

	Difficulty string `json:"difficulty"`

	OrderIndex int `json:"order_index"`

	Subtopics []Subtopic `gorm:"foreignKey:TopicID"`
}
