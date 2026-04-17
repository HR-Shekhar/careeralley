package models

type Resource struct {
	ID uint `gorm:"primaryKey" json:"id"`

	SubtopicID uint `json:"subtopic_id"`

	Title string `json:"title"`

	Link string `json:"link"`

	Type string `json:"type"`
}
