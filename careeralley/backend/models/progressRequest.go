package models

type ProgressRequest struct {
	SubtopicID uint `json:"subtopic_id"`
	Completed  bool `json:"completed"`
}
