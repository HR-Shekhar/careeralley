package models

import "time"

// Interview request created by a user
type MockInterview struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	RequesterID   uint      `gorm:"not null" json:"requester_id"`
	RequesterName string    `gorm:"not null" json:"requester_name"`
	Topic         string    `gorm:"not null" json:"topic"`
	Description   string    `gorm:"type:text" json:"description"`
	QuestionCount int       `gorm:"not null;default:5" json:"question_count"`
	Status        string    `gorm:"not null;default:'open'" json:"status"` // open, matched, in_progress, completed
	ResponderID   *uint     `json:"responder_id,omitempty"`
	ResponderName string    `json:"responder_name,omitempty"`
	JitsiRoom     string    `json:"jitsi_room,omitempty"`
	InterviewerID *uint     `json:"interviewer_id,omitempty"` // randomly chosen
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
	ScheduledAt   time.Time `json:"scheduled_at"`
}

// Each question in an interview session
type MockInterviewQuestion struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	InterviewID     uint      `gorm:"not null;index" json:"interview_id"`
	QuestionNumber  int       `gorm:"not null" json:"question_number"`
	ForUserID       uint      `gorm:"not null" json:"for_user_id"` // who is being interviewed
	Question        string    `gorm:"type:text" json:"question"`
	SuggestedAnswer string    `gorm:"type:text" json:"suggested_answer"`
	Score           int       `json:"score"` // 0-10, set after answer
	Round           string    `json:"round"` // "first" or "second"
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// Final scores per user
type MockInterviewResult struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	InterviewID uint      `gorm:"not null;index" json:"interview_id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	UserName    string    `json:"user_name"`
	TotalScore  int       `json:"total_score"`
	MaxScore    int       `json:"max_score"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}
