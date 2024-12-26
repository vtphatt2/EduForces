// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlc

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type RoleEnum string

const (
	RoleEnumAdmin       RoleEnum = "Admin"
	RoleEnumCoordinator RoleEnum = "Coordinator"
	RoleEnumUser        RoleEnum = "User"
)

func (e *RoleEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = RoleEnum(s)
	case string:
		*e = RoleEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for RoleEnum: %T", src)
	}
	return nil
}

type NullRoleEnum struct {
	RoleEnum RoleEnum `json:"role_enum"`
	Valid    bool     `json:"valid"` // Valid is true if RoleEnum is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullRoleEnum) Scan(value interface{}) error {
	if value == nil {
		ns.RoleEnum, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.RoleEnum.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullRoleEnum) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.RoleEnum), nil
}

type Account struct {
	AccountID uuid.UUID `json:"account_id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Role      RoleEnum  `json:"role"`
}

type Comment struct {
	CommentID       uuid.UUID     `json:"comment_id"`
	AuthorID        uuid.NullUUID `json:"author_id"`
	Content         string        `json:"content"`
	Timestamp       time.Time     `json:"timestamp"`
	PostID          uuid.NullUUID `json:"post_id"`
	ParentCommentID uuid.NullUUID `json:"parent_comment_id"`
}

type Contest struct {
	ContestID   uuid.UUID `json:"contest_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	UploadTime  time.Time `json:"upload_time"`
	Duration    int64     `json:"duration"`
	Difficulty  int32     `json:"difficulty"`
	Author      string    `json:"author"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ContestDetail struct {
	ContestDetailID uuid.UUID     `json:"contest_detail_id"`
	ContestID       uuid.NullUUID `json:"contest_id"`
	IsPublic        bool          `json:"is_public"`
}

type ContestQuestion struct {
	ContestDetailID uuid.UUID `json:"contest_detail_id"`
	QuestionID      uuid.UUID `json:"question_id"`
}

type ContestRegistration struct {
	RegistrationID   uuid.UUID     `json:"registration_id"`
	AccountID        uuid.NullUUID `json:"account_id"`
	ContestID        uuid.NullUUID `json:"contest_id"`
	RegistrationTime time.Time     `json:"registration_time"`
}

type DailyTask struct {
	DailyTaskID  uuid.UUID     `json:"daily_task_id"`
	AccountID    uuid.NullUUID `json:"account_id"`
	IsCompleted  bool          `json:"is_completed"`
	RewardAmount string        `json:"reward_amount"`
	Description  string        `json:"description"`
}

type EventTask struct {
	EventTaskID            uuid.UUID `json:"event_task_id"`
	EventDate              time.Time `json:"event_date"`
	SpecialGiftDescription string    `json:"special_gift_description"`
}

type Post struct {
	PostID    uuid.UUID     `json:"post_id"`
	AuthorID  uuid.NullUUID `json:"author_id"`
	Title     string        `json:"title"`
	Content   string        `json:"content"`
	Timestamp time.Time     `json:"timestamp"`
}

type Question struct {
	QuestionID    uuid.UUID `json:"question_id"`
	Description   string    `json:"description"`
	Answers       []string  `json:"answers"`
	CorrectAnswer string    `json:"correct_answer"`
	UpdatedAt     time.Time `json:"updated_at"`
	Subject       string    `json:"subject"`
}

type QuestionPhoto struct {
	PhotoID    uuid.UUID     `json:"photo_id"`
	QuestionID uuid.NullUUID `json:"question_id"`
	PhotoName  string        `json:"photo_name"`
	PhotoPath  string        `json:"photo_path"`
	UpdatedAt  time.Time     `json:"updated_at"`
}

type Reaction struct {
	ReactionID uuid.UUID      `json:"reaction_id"`
	Type       sql.NullString `json:"type"`
	AccountID  uuid.NullUUID  `json:"account_id"`
	Timestamp  time.Time      `json:"timestamp"`
	PostID     uuid.NullUUID  `json:"post_id"`
	CommentID  uuid.NullUUID  `json:"comment_id"`
}

type Submission struct {
	SubmissionID uuid.UUID `json:"submission_id"`
	ContestID    uuid.UUID `json:"contest_id"`
	AccountID    string    `json:"account_id"`
	Time         time.Time `json:"time"`
}

type SubmissionDetail struct {
	SubmissionDetailID uuid.UUID     `json:"submission_detail_id"`
	SubmissionID       uuid.NullUUID `json:"submission_id"`
	QuestionNumber     string        `json:"question_number"`
	Choice             string        `json:"choice"`
}
