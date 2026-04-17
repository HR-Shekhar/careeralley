package models

type StartStudyRequest struct {
	SubtopicID uint `json:"subtopic_id"`
}

type EndStudyRequest struct {
	SessionID uint `json:"session_id"`
}
