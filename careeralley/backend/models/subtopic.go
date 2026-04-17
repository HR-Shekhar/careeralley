package models

type Subtopic struct {
	ID uint `json:"id" gorm:"primaryKey"`

	TopicID uint `json:"topic_id"`

	Title string `json:"title"`

	Resource string `json:"resource"`

	Completed bool `json:"completed" gorm:"-"`
}
