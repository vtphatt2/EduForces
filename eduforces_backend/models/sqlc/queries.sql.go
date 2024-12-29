// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: queries.sql

package sqlc

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

const addCommentToPost = `-- name: AddCommentToPost :exec
INSERT INTO comments (comment_id, author_id, content, timestamp, post_id, parent_comment_id) VALUES ($1, $2, $3, $4, $5, $6)
`

type AddCommentToPostParams struct {
	CommentID       uuid.UUID     `json:"comment_id"`
	AuthorID        uuid.NullUUID `json:"author_id"`
	Content         string        `json:"content"`
	Timestamp       time.Time     `json:"timestamp"`
	PostID          uuid.NullUUID `json:"post_id"`
	ParentCommentID uuid.NullUUID `json:"parent_comment_id"`
}

func (q *Queries) AddCommentToPost(ctx context.Context, arg AddCommentToPostParams) error {
	_, err := q.db.ExecContext(ctx, addCommentToPost,
		arg.CommentID,
		arg.AuthorID,
		arg.Content,
		arg.Timestamp,
		arg.PostID,
		arg.ParentCommentID,
	)
	return err
}

const addContestDetail = `-- name: AddContestDetail :exec
INSERT INTO contest_details (contest_detail_id, contest_id, is_public) VALUES ($1, $2, $3)
`

type AddContestDetailParams struct {
	ContestDetailID uuid.UUID     `json:"contest_detail_id"`
	ContestID       uuid.NullUUID `json:"contest_id"`
	IsPublic        bool          `json:"is_public"`
}

func (q *Queries) AddContestDetail(ctx context.Context, arg AddContestDetailParams) error {
	_, err := q.db.ExecContext(ctx, addContestDetail, arg.ContestDetailID, arg.ContestID, arg.IsPublic)
	return err
}

const addContestQuestion = `-- name: AddContestQuestion :exec
INSERT INTO contest_questions (contest_detail_id, question_id) VALUES ($1, $2)
`

type AddContestQuestionParams struct {
	ContestDetailID uuid.UUID `json:"contest_detail_id"`
	QuestionID      uuid.UUID `json:"question_id"`
}

func (q *Queries) AddContestQuestion(ctx context.Context, arg AddContestQuestionParams) error {
	_, err := q.db.ExecContext(ctx, addContestQuestion, arg.ContestDetailID, arg.QuestionID)
	return err
}

const addPhotoToQuestion = `-- name: AddPhotoToQuestion :exec
INSERT INTO question_photos (photo_id, question_id, photo_name, photo_path, updated_at) VALUES ($1, $2, $3, $4, $5)
`

type AddPhotoToQuestionParams struct {
	PhotoID    uuid.UUID     `json:"photo_id"`
	QuestionID uuid.NullUUID `json:"question_id"`
	PhotoName  string        `json:"photo_name"`
	PhotoPath  string        `json:"photo_path"`
	UpdatedAt  time.Time     `json:"updated_at"`
}

func (q *Queries) AddPhotoToQuestion(ctx context.Context, arg AddPhotoToQuestionParams) error {
	_, err := q.db.ExecContext(ctx, addPhotoToQuestion,
		arg.PhotoID,
		arg.QuestionID,
		arg.PhotoName,
		arg.PhotoPath,
		arg.UpdatedAt,
	)
	return err
}

const addReactionToPost = `-- name: AddReactionToPost :exec
INSERT INTO reactions (reaction_id, type, account_id, timestamp, post_id, comment_id) VALUES ($1, $2, $3, $4, $5, $6)
`

type AddReactionToPostParams struct {
	ReactionID uuid.UUID      `json:"reaction_id"`
	Type       sql.NullString `json:"type"`
	AccountID  uuid.NullUUID  `json:"account_id"`
	Timestamp  time.Time      `json:"timestamp"`
	PostID     uuid.NullUUID  `json:"post_id"`
	CommentID  uuid.NullUUID  `json:"comment_id"`
}

func (q *Queries) AddReactionToPost(ctx context.Context, arg AddReactionToPostParams) error {
	_, err := q.db.ExecContext(ctx, addReactionToPost,
		arg.ReactionID,
		arg.Type,
		arg.AccountID,
		arg.Timestamp,
		arg.PostID,
		arg.CommentID,
	)
	return err
}

const addSubmissionDetail = `-- name: AddSubmissionDetail :exec
INSERT INTO submission_details (submission_detail_id, submission_id, question_number, choice) VALUES ($1, $2, $3, $4)
`

type AddSubmissionDetailParams struct {
	SubmissionDetailID uuid.UUID     `json:"submission_detail_id"`
	SubmissionID       uuid.NullUUID `json:"submission_id"`
	QuestionNumber     string        `json:"question_number"`
	Choice             string        `json:"choice"`
}

func (q *Queries) AddSubmissionDetail(ctx context.Context, arg AddSubmissionDetailParams) error {
	_, err := q.db.ExecContext(ctx, addSubmissionDetail,
		arg.SubmissionDetailID,
		arg.SubmissionID,
		arg.QuestionNumber,
		arg.Choice,
	)
	return err
}

const checkReactionExists = `-- name: CheckReactionExists :one
SELECT reaction_id FROM reactions
WHERE account_id = $1 AND (post_id = $2 OR comment_id = $3)
`

type CheckReactionExistsParams struct {
	AccountID uuid.NullUUID `json:"account_id"`
	PostID    uuid.NullUUID `json:"post_id"`
	CommentID uuid.NullUUID `json:"comment_id"`
}

func (q *Queries) CheckReactionExists(ctx context.Context, arg CheckReactionExistsParams) (uuid.UUID, error) {
	row := q.db.QueryRowContext(ctx, checkReactionExists, arg.AccountID, arg.PostID, arg.CommentID)
	var reaction_id uuid.UUID
	err := row.Scan(&reaction_id)
	return reaction_id, err
}

const countReactionsForComment = `-- name: CountReactionsForComment :one
SELECT 
    COALESCE(SUM(CASE WHEN type = 'UPVOTE' THEN 1 ELSE 0 END), 0) AS upvotes,
    COALESCE(SUM(CASE WHEN type = 'DOWNVOTE' THEN 1 ELSE 0 END), 0) AS downvotes
FROM reactions
WHERE comment_id = $1
`

type CountReactionsForCommentRow struct {
	Upvotes   interface{} `json:"upvotes"`
	Downvotes interface{} `json:"downvotes"`
}

func (q *Queries) CountReactionsForComment(ctx context.Context, commentID uuid.NullUUID) (CountReactionsForCommentRow, error) {
	row := q.db.QueryRowContext(ctx, countReactionsForComment, commentID)
	var i CountReactionsForCommentRow
	err := row.Scan(&i.Upvotes, &i.Downvotes)
	return i, err
}

const countReactionsForPost = `-- name: CountReactionsForPost :one
SELECT 
    COALESCE(SUM(CASE WHEN type = 'UPVOTE' THEN 1 ELSE 0 END), 0) AS upvotes,
    COALESCE(SUM(CASE WHEN type = 'DOWNVOTE' THEN 1 ELSE 0 END), 0) AS downvotes
FROM reactions
WHERE post_id = $1
`

type CountReactionsForPostRow struct {
	Upvotes   interface{} `json:"upvotes"`
	Downvotes interface{} `json:"downvotes"`
}

func (q *Queries) CountReactionsForPost(ctx context.Context, postID uuid.NullUUID) (CountReactionsForPostRow, error) {
	row := q.db.QueryRowContext(ctx, countReactionsForPost, postID)
	var i CountReactionsForPostRow
	err := row.Scan(&i.Upvotes, &i.Downvotes)
	return i, err
}

const createAccount = `-- name: CreateAccount :exec
INSERT INTO accounts (email, name, role, avatar_path)
VALUES ($1, $2, $3, $4)
`

type CreateAccountParams struct {
	Email      string   `json:"email"`
	Name       string   `json:"name"`
	Role       RoleEnum `json:"role"`
	AvatarPath string   `json:"avatar_path"`
}

func (q *Queries) CreateAccount(ctx context.Context, arg CreateAccountParams) error {
	_, err := q.db.ExecContext(ctx, createAccount,
		arg.Email,
		arg.Name,
		arg.Role,
		arg.AvatarPath,
	)
	return err
}

const createContest = `-- name: CreateContest :exec
INSERT INTO contests (contest_id, name, description, upload_time, duration, difficulty, author, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

type CreateContestParams struct {
	ContestID   uuid.UUID `json:"contest_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	UploadTime  time.Time `json:"upload_time"`
	Duration    int64     `json:"duration"`
	Difficulty  int32     `json:"difficulty"`
	Author      string    `json:"author"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (q *Queries) CreateContest(ctx context.Context, arg CreateContestParams) error {
	_, err := q.db.ExecContext(ctx, createContest,
		arg.ContestID,
		arg.Name,
		arg.Description,
		arg.UploadTime,
		arg.Duration,
		arg.Difficulty,
		arg.Author,
		arg.UpdatedAt,
	)
	return err
}

const createDailyTask = `-- name: CreateDailyTask :exec
INSERT INTO daily_tasks (daily_task_id, account_id, is_completed, reward_amount, description) VALUES ($1, $2, $3, $4, $5)
`

type CreateDailyTaskParams struct {
	DailyTaskID  uuid.UUID     `json:"daily_task_id"`
	AccountID    uuid.NullUUID `json:"account_id"`
	IsCompleted  bool          `json:"is_completed"`
	RewardAmount string        `json:"reward_amount"`
	Description  string        `json:"description"`
}

func (q *Queries) CreateDailyTask(ctx context.Context, arg CreateDailyTaskParams) error {
	_, err := q.db.ExecContext(ctx, createDailyTask,
		arg.DailyTaskID,
		arg.AccountID,
		arg.IsCompleted,
		arg.RewardAmount,
		arg.Description,
	)
	return err
}

const createEventTask = `-- name: CreateEventTask :exec
INSERT INTO event_tasks (event_task_id, event_date, special_gift_description) VALUES ($1, $2, $3)
`

type CreateEventTaskParams struct {
	EventTaskID            uuid.UUID `json:"event_task_id"`
	EventDate              time.Time `json:"event_date"`
	SpecialGiftDescription string    `json:"special_gift_description"`
}

func (q *Queries) CreateEventTask(ctx context.Context, arg CreateEventTaskParams) error {
	_, err := q.db.ExecContext(ctx, createEventTask, arg.EventTaskID, arg.EventDate, arg.SpecialGiftDescription)
	return err
}

const createPost = `-- name: CreatePost :exec
INSERT INTO posts (post_id, author_id, title, content, timestamp) VALUES ($1, $2, $3, $4, $5)
`

type CreatePostParams struct {
	PostID    uuid.UUID     `json:"post_id"`
	AuthorID  uuid.NullUUID `json:"author_id"`
	Title     string        `json:"title"`
	Content   string        `json:"content"`
	Timestamp time.Time     `json:"timestamp"`
}

func (q *Queries) CreatePost(ctx context.Context, arg CreatePostParams) error {
	_, err := q.db.ExecContext(ctx, createPost,
		arg.PostID,
		arg.AuthorID,
		arg.Title,
		arg.Content,
		arg.Timestamp,
	)
	return err
}

const createQuestion = `-- name: CreateQuestion :exec
INSERT INTO questions (question_id, description, answers, correct_answer, updated_at, subject) VALUES ($1, $2, $3, $4, $5, $6)
`

type CreateQuestionParams struct {
	QuestionID    uuid.UUID `json:"question_id"`
	Description   string    `json:"description"`
	Answers       []string  `json:"answers"`
	CorrectAnswer string    `json:"correct_answer"`
	UpdatedAt     time.Time `json:"updated_at"`
	Subject       string    `json:"subject"`
}

func (q *Queries) CreateQuestion(ctx context.Context, arg CreateQuestionParams) error {
	_, err := q.db.ExecContext(ctx, createQuestion,
		arg.QuestionID,
		arg.Description,
		pq.Array(arg.Answers),
		arg.CorrectAnswer,
		arg.UpdatedAt,
		arg.Subject,
	)
	return err
}

const createSubmission = `-- name: CreateSubmission :exec
INSERT INTO submissions (submission_id, contest_id, account_id, time) VALUES ($1, $2, $3, $4)
`

type CreateSubmissionParams struct {
	SubmissionID uuid.UUID `json:"submission_id"`
	ContestID    uuid.UUID `json:"contest_id"`
	AccountID    string    `json:"account_id"`
	Time         time.Time `json:"time"`
}

func (q *Queries) CreateSubmission(ctx context.Context, arg CreateSubmissionParams) error {
	_, err := q.db.ExecContext(ctx, createSubmission,
		arg.SubmissionID,
		arg.ContestID,
		arg.AccountID,
		arg.Time,
	)
	return err
}

const deleteAccount = `-- name: DeleteAccount :exec
DELETE FROM accounts WHERE account_id = $1
`

func (q *Queries) DeleteAccount(ctx context.Context, accountID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteAccount, accountID)
	return err
}

const deleteComment = `-- name: DeleteComment :exec
DELETE FROM comments WHERE comment_id = $1
`

func (q *Queries) DeleteComment(ctx context.Context, commentID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteComment, commentID)
	return err
}

const deleteContest = `-- name: DeleteContest :exec
DELETE FROM contests WHERE contest_id = $1
`

func (q *Queries) DeleteContest(ctx context.Context, contestID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteContest, contestID)
	return err
}

const deletePost = `-- name: DeletePost :exec
DELETE FROM posts WHERE post_id = $1
`

func (q *Queries) DeletePost(ctx context.Context, postID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deletePost, postID)
	return err
}

const deleteQuestion = `-- name: DeleteQuestion :exec
DELETE FROM questions WHERE question_id = $1
`

func (q *Queries) DeleteQuestion(ctx context.Context, questionID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteQuestion, questionID)
	return err
}

const deleteReaction = `-- name: DeleteReaction :exec
DELETE FROM reactions WHERE reaction_id = $1
`

func (q *Queries) DeleteReaction(ctx context.Context, reactionID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteReaction, reactionID)
	return err
}

const deleteSubmission = `-- name: DeleteSubmission :exec
DELETE FROM submissions WHERE submission_id = $1
`

func (q *Queries) DeleteSubmission(ctx context.Context, submissionID uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteSubmission, submissionID)
	return err
}

const getAccount = `-- name: GetAccount :one

SELECT account_id, email, username, name, role, avatar_path, elo_rating, last_active, school, gold_amount, is_deactivated FROM accounts WHERE account_id = $1
`

// --- Account
func (q *Queries) GetAccount(ctx context.Context, accountID uuid.UUID) (Account, error) {
	row := q.db.QueryRowContext(ctx, getAccount, accountID)
	var i Account
	err := row.Scan(
		&i.AccountID,
		&i.Email,
		&i.Username,
		&i.Name,
		&i.Role,
		&i.AvatarPath,
		&i.EloRating,
		&i.LastActive,
		&i.School,
		&i.GoldAmount,
		&i.IsDeactivated,
	)
	return i, err
}

const getAccountByEmail = `-- name: GetAccountByEmail :one
SELECT account_id, email, username, name, role, avatar_path, elo_rating, last_active, school, gold_amount, is_deactivated FROM accounts WHERE email = $1
`

func (q *Queries) GetAccountByEmail(ctx context.Context, email string) (Account, error) {
	row := q.db.QueryRowContext(ctx, getAccountByEmail, email)
	var i Account
	err := row.Scan(
		&i.AccountID,
		&i.Email,
		&i.Username,
		&i.Name,
		&i.Role,
		&i.AvatarPath,
		&i.EloRating,
		&i.LastActive,
		&i.School,
		&i.GoldAmount,
		&i.IsDeactivated,
	)
	return i, err
}

const getCommentDetails = `-- name: GetCommentDetails :one
SELECT comment_id, author_id, content, timestamp, post_id, parent_comment_id FROM comments WHERE comment_id = $1
`

func (q *Queries) GetCommentDetails(ctx context.Context, commentID uuid.UUID) (Comment, error) {
	row := q.db.QueryRowContext(ctx, getCommentDetails, commentID)
	var i Comment
	err := row.Scan(
		&i.CommentID,
		&i.AuthorID,
		&i.Content,
		&i.Timestamp,
		&i.PostID,
		&i.ParentCommentID,
	)
	return i, err
}

const getCommentsForComment = `-- name: GetCommentsForComment :many
SELECT comment_id, author_id, content, timestamp, post_id, parent_comment_id FROM comments WHERE parent_comment_id = $1
`

func (q *Queries) GetCommentsForComment(ctx context.Context, parentCommentID uuid.NullUUID) ([]Comment, error) {
	rows, err := q.db.QueryContext(ctx, getCommentsForComment, parentCommentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.CommentID,
			&i.AuthorID,
			&i.Content,
			&i.Timestamp,
			&i.PostID,
			&i.ParentCommentID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getCommentsForPost = `-- name: GetCommentsForPost :many

SELECT comment_id, author_id, content, timestamp, post_id, parent_comment_id
FROM comments
WHERE post_id = $1
ORDER BY timestamp DESC
LIMIT $2 OFFSET $3
`

type GetCommentsForPostParams struct {
	PostID uuid.NullUUID `json:"post_id"`
	Limit  int32         `json:"limit"`
	Offset int32         `json:"offset"`
}

// -- nameee: GetCommentsForPost :many
// SELECT * FROM comments WHERE post_id = $1;
func (q *Queries) GetCommentsForPost(ctx context.Context, arg GetCommentsForPostParams) ([]Comment, error) {
	rows, err := q.db.QueryContext(ctx, getCommentsForPost, arg.PostID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.CommentID,
			&i.AuthorID,
			&i.Content,
			&i.Timestamp,
			&i.PostID,
			&i.ParentCommentID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getContest = `-- name: GetContest :one
SELECT contest_id, name, description, upload_time, duration, difficulty, author, updated_at FROM contests WHERE contest_id = $1
`

// ---- Contest
func (q *Queries) GetContest(ctx context.Context, contestID uuid.UUID) (Contest, error) {
	row := q.db.QueryRowContext(ctx, getContest, contestID)
	var i Contest
	err := row.Scan(
		&i.ContestID,
		&i.Name,
		&i.Description,
		&i.UploadTime,
		&i.Duration,
		&i.Difficulty,
		&i.Author,
		&i.UpdatedAt,
	)
	return i, err
}

const getContestDetails = `-- name: GetContestDetails :one
SELECT contest_detail_id, contest_id, is_public FROM contest_details WHERE contest_id = $1
`

func (q *Queries) GetContestDetails(ctx context.Context, contestID uuid.NullUUID) (ContestDetail, error) {
	row := q.db.QueryRowContext(ctx, getContestDetails, contestID)
	var i ContestDetail
	err := row.Scan(&i.ContestDetailID, &i.ContestID, &i.IsPublic)
	return i, err
}

const getContestQuestions = `-- name: GetContestQuestions :many
SELECT q.question_id, q.description, q.answers, q.correct_answer, q.updated_at, q.subject FROM questions q
JOIN contest_questions cq ON q.question_id = cq.question_id
WHERE cq.contest_detail_id = $1
`

func (q *Queries) GetContestQuestions(ctx context.Context, contestDetailID uuid.UUID) ([]Question, error) {
	rows, err := q.db.QueryContext(ctx, getContestQuestions, contestDetailID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Question
	for rows.Next() {
		var i Question
		if err := rows.Scan(
			&i.QuestionID,
			&i.Description,
			pq.Array(&i.Answers),
			&i.CorrectAnswer,
			&i.UpdatedAt,
			&i.Subject,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getContestRegistrations = `-- name: GetContestRegistrations :many
SELECT registration_id, account_id, contest_id, registration_time FROM contest_registrations WHERE contest_id = $1
`

func (q *Queries) GetContestRegistrations(ctx context.Context, contestID uuid.NullUUID) ([]ContestRegistration, error) {
	rows, err := q.db.QueryContext(ctx, getContestRegistrations, contestID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ContestRegistration
	for rows.Next() {
		var i ContestRegistration
		if err := rows.Scan(
			&i.RegistrationID,
			&i.AccountID,
			&i.ContestID,
			&i.RegistrationTime,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getDailyTask = `-- name: GetDailyTask :one

SELECT daily_task_id, account_id, is_completed, reward_amount, description FROM daily_tasks WHERE daily_task_id = $1
`

// ---- Daily Task
func (q *Queries) GetDailyTask(ctx context.Context, dailyTaskID uuid.UUID) (DailyTask, error) {
	row := q.db.QueryRowContext(ctx, getDailyTask, dailyTaskID)
	var i DailyTask
	err := row.Scan(
		&i.DailyTaskID,
		&i.AccountID,
		&i.IsCompleted,
		&i.RewardAmount,
		&i.Description,
	)
	return i, err
}

const getDailyTaskDetails = `-- name: GetDailyTaskDetails :one
SELECT description, reward_amount FROM daily_tasks WHERE daily_task_id = $1
`

type GetDailyTaskDetailsRow struct {
	Description  string `json:"description"`
	RewardAmount string `json:"reward_amount"`
}

func (q *Queries) GetDailyTaskDetails(ctx context.Context, dailyTaskID uuid.UUID) (GetDailyTaskDetailsRow, error) {
	row := q.db.QueryRowContext(ctx, getDailyTaskDetails, dailyTaskID)
	var i GetDailyTaskDetailsRow
	err := row.Scan(&i.Description, &i.RewardAmount)
	return i, err
}

const getEventTask = `-- name: GetEventTask :one
SELECT event_task_id, event_date, special_gift_description FROM event_tasks WHERE event_task_id = $1
`

func (q *Queries) GetEventTask(ctx context.Context, eventTaskID uuid.UUID) (EventTask, error) {
	row := q.db.QueryRowContext(ctx, getEventTask, eventTaskID)
	var i EventTask
	err := row.Scan(&i.EventTaskID, &i.EventDate, &i.SpecialGiftDescription)
	return i, err
}

const getPhotosForQuestion = `-- name: GetPhotosForQuestion :many
SELECT photo_id, question_id, photo_name, photo_path, updated_at FROM question_photos WHERE question_id = $1
`

func (q *Queries) GetPhotosForQuestion(ctx context.Context, questionID uuid.NullUUID) ([]QuestionPhoto, error) {
	rows, err := q.db.QueryContext(ctx, getPhotosForQuestion, questionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []QuestionPhoto
	for rows.Next() {
		var i QuestionPhoto
		if err := rows.Scan(
			&i.PhotoID,
			&i.QuestionID,
			&i.PhotoName,
			&i.PhotoPath,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPost = `-- name: GetPost :one

SELECT post_id, author_id, title, content, timestamp FROM posts WHERE post_id = $1
`

// -- Forum
func (q *Queries) GetPost(ctx context.Context, postID uuid.UUID) (Post, error) {
	row := q.db.QueryRowContext(ctx, getPost, postID)
	var i Post
	err := row.Scan(
		&i.PostID,
		&i.AuthorID,
		&i.Title,
		&i.Content,
		&i.Timestamp,
	)
	return i, err
}

const getQuestion = `-- name: GetQuestion :one

SELECT question_id, description, answers, correct_answer, updated_at, subject FROM questions WHERE question_id = $1
`

// -Question
func (q *Queries) GetQuestion(ctx context.Context, questionID uuid.UUID) (Question, error) {
	row := q.db.QueryRowContext(ctx, getQuestion, questionID)
	var i Question
	err := row.Scan(
		&i.QuestionID,
		&i.Description,
		pq.Array(&i.Answers),
		&i.CorrectAnswer,
		&i.UpdatedAt,
		&i.Subject,
	)
	return i, err
}

const getReactionExist = `-- name: GetReactionExist :one
SELECT type FROM reactions
WHERE account_id = $1 AND (post_id = $2 OR comment_id = $3)
`

type GetReactionExistParams struct {
	AccountID uuid.NullUUID `json:"account_id"`
	PostID    uuid.NullUUID `json:"post_id"`
	CommentID uuid.NullUUID `json:"comment_id"`
}

func (q *Queries) GetReactionExist(ctx context.Context, arg GetReactionExistParams) (sql.NullString, error) {
	row := q.db.QueryRowContext(ctx, getReactionExist, arg.AccountID, arg.PostID, arg.CommentID)
	var type_ sql.NullString
	err := row.Scan(&type_)
	return type_, err
}

const getReactionForComment = `-- name: GetReactionForComment :one
SELECT reaction_id, type, account_id, timestamp, post_id, comment_id FROM reactions WHERE comment_id = $1 AND account_id = $2
`

type GetReactionForCommentParams struct {
	CommentID uuid.NullUUID `json:"comment_id"`
	AccountID uuid.NullUUID `json:"account_id"`
}

func (q *Queries) GetReactionForComment(ctx context.Context, arg GetReactionForCommentParams) (Reaction, error) {
	row := q.db.QueryRowContext(ctx, getReactionForComment, arg.CommentID, arg.AccountID)
	var i Reaction
	err := row.Scan(
		&i.ReactionID,
		&i.Type,
		&i.AccountID,
		&i.Timestamp,
		&i.PostID,
		&i.CommentID,
	)
	return i, err
}

const getReactionForPost = `-- name: GetReactionForPost :one
SELECT reaction_id, type, account_id, timestamp, post_id, comment_id FROM reactions WHERE post_id = $1 AND account_id = $2
`

type GetReactionForPostParams struct {
	PostID    uuid.NullUUID `json:"post_id"`
	AccountID uuid.NullUUID `json:"account_id"`
}

func (q *Queries) GetReactionForPost(ctx context.Context, arg GetReactionForPostParams) (Reaction, error) {
	row := q.db.QueryRowContext(ctx, getReactionForPost, arg.PostID, arg.AccountID)
	var i Reaction
	err := row.Scan(
		&i.ReactionID,
		&i.Type,
		&i.AccountID,
		&i.Timestamp,
		&i.PostID,
		&i.CommentID,
	)
	return i, err
}

const getReactionsForPost = `-- name: GetReactionsForPost :many
SELECT reaction_id, type, account_id, timestamp, post_id, comment_id FROM reactions WHERE post_id = $1
`

func (q *Queries) GetReactionsForPost(ctx context.Context, postID uuid.NullUUID) ([]Reaction, error) {
	rows, err := q.db.QueryContext(ctx, getReactionsForPost, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Reaction
	for rows.Next() {
		var i Reaction
		if err := rows.Scan(
			&i.ReactionID,
			&i.Type,
			&i.AccountID,
			&i.Timestamp,
			&i.PostID,
			&i.CommentID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getSpecialGiftDescription = `-- name: GetSpecialGiftDescription :one
SELECT special_gift_description FROM event_tasks WHERE event_task_id = $1
`

func (q *Queries) GetSpecialGiftDescription(ctx context.Context, eventTaskID uuid.UUID) (string, error) {
	row := q.db.QueryRowContext(ctx, getSpecialGiftDescription, eventTaskID)
	var special_gift_description string
	err := row.Scan(&special_gift_description)
	return special_gift_description, err
}

const getSubmission = `-- name: GetSubmission :one

SELECT submission_id, contest_id, account_id, time FROM submissions WHERE submission_id = $1
`

// ---- Submission
func (q *Queries) GetSubmission(ctx context.Context, submissionID uuid.UUID) (Submission, error) {
	row := q.db.QueryRowContext(ctx, getSubmission, submissionID)
	var i Submission
	err := row.Scan(
		&i.SubmissionID,
		&i.ContestID,
		&i.AccountID,
		&i.Time,
	)
	return i, err
}

const getSubmissionDetails = `-- name: GetSubmissionDetails :many
SELECT submission_detail_id, submission_id, question_number, choice FROM submission_details WHERE submission_id = $1
`

func (q *Queries) GetSubmissionDetails(ctx context.Context, submissionID uuid.NullUUID) ([]SubmissionDetail, error) {
	rows, err := q.db.QueryContext(ctx, getSubmissionDetails, submissionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []SubmissionDetail
	for rows.Next() {
		var i SubmissionDetail
		if err := rows.Scan(
			&i.SubmissionDetailID,
			&i.SubmissionID,
			&i.QuestionNumber,
			&i.Choice,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const isEventDate = `-- name: IsEventDate :one
SELECT CASE WHEN event_date = CURRENT_DATE THEN TRUE ELSE FALSE END AS is_event_date FROM event_tasks WHERE event_task_id = $1
`

func (q *Queries) IsEventDate(ctx context.Context, eventTaskID uuid.UUID) (bool, error) {
	row := q.db.QueryRowContext(ctx, isEventDate, eventTaskID)
	var is_event_date bool
	err := row.Scan(&is_event_date)
	return is_event_date, err
}

const listAccounts = `-- name: ListAccounts :many
SELECT account_id, email, username, name, role, avatar_path, elo_rating, last_active, school, gold_amount, is_deactivated FROM accounts
`

func (q *Queries) ListAccounts(ctx context.Context) ([]Account, error) {
	rows, err := q.db.QueryContext(ctx, listAccounts)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Account
	for rows.Next() {
		var i Account
		if err := rows.Scan(
			&i.AccountID,
			&i.Email,
			&i.Username,
			&i.Name,
			&i.Role,
			&i.AvatarPath,
			&i.EloRating,
			&i.LastActive,
			&i.School,
			&i.GoldAmount,
			&i.IsDeactivated,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listContests = `-- name: ListContests :many
SELECT contest_id, name, description, upload_time, duration, difficulty, author, updated_at FROM contests
`

func (q *Queries) ListContests(ctx context.Context) ([]Contest, error) {
	rows, err := q.db.QueryContext(ctx, listContests)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Contest
	for rows.Next() {
		var i Contest
		if err := rows.Scan(
			&i.ContestID,
			&i.Name,
			&i.Description,
			&i.UploadTime,
			&i.Duration,
			&i.Difficulty,
			&i.Author,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listDailyTasks = `-- name: ListDailyTasks :many
SELECT daily_task_id, account_id, is_completed, reward_amount, description FROM daily_tasks
`

func (q *Queries) ListDailyTasks(ctx context.Context) ([]DailyTask, error) {
	rows, err := q.db.QueryContext(ctx, listDailyTasks)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []DailyTask
	for rows.Next() {
		var i DailyTask
		if err := rows.Scan(
			&i.DailyTaskID,
			&i.AccountID,
			&i.IsCompleted,
			&i.RewardAmount,
			&i.Description,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listPosts = `-- name: ListPosts :many
SELECT post_id, author_id, title, content, timestamp FROM posts
`

func (q *Queries) ListPosts(ctx context.Context) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, listPosts)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.PostID,
			&i.AuthorID,
			&i.Title,
			&i.Content,
			&i.Timestamp,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listQuestions = `-- name: ListQuestions :many
SELECT question_id, description, answers, correct_answer, updated_at, subject FROM questions
`

func (q *Queries) ListQuestions(ctx context.Context) ([]Question, error) {
	rows, err := q.db.QueryContext(ctx, listQuestions)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Question
	for rows.Next() {
		var i Question
		if err := rows.Scan(
			&i.QuestionID,
			&i.Description,
			pq.Array(&i.Answers),
			&i.CorrectAnswer,
			&i.UpdatedAt,
			&i.Subject,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listSubmissions = `-- name: ListSubmissions :many
SELECT submission_id, contest_id, account_id, time FROM submissions
`

func (q *Queries) ListSubmissions(ctx context.Context) ([]Submission, error) {
	rows, err := q.db.QueryContext(ctx, listSubmissions)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Submission
	for rows.Next() {
		var i Submission
		if err := rows.Scan(
			&i.SubmissionID,
			&i.ContestID,
			&i.AccountID,
			&i.Time,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const registerForContest = `-- name: RegisterForContest :exec
INSERT INTO contest_registrations (registration_id, account_id, contest_id, registration_time) VALUES ($1, $2, $3, $4)
`

type RegisterForContestParams struct {
	RegistrationID   uuid.UUID     `json:"registration_id"`
	AccountID        uuid.NullUUID `json:"account_id"`
	ContestID        uuid.NullUUID `json:"contest_id"`
	RegistrationTime time.Time     `json:"registration_time"`
}

func (q *Queries) RegisterForContest(ctx context.Context, arg RegisterForContestParams) error {
	_, err := q.db.ExecContext(ctx, registerForContest,
		arg.RegistrationID,
		arg.AccountID,
		arg.ContestID,
		arg.RegistrationTime,
	)
	return err
}

const updateAccountAvatar = `-- name: UpdateAccountAvatar :exec
UPDATE accounts SET avatar_path = $1 WHERE account_id = $2
`

type UpdateAccountAvatarParams struct {
	AvatarPath string    `json:"avatar_path"`
	AccountID  uuid.UUID `json:"account_id"`
}

func (q *Queries) UpdateAccountAvatar(ctx context.Context, arg UpdateAccountAvatarParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountAvatar, arg.AvatarPath, arg.AccountID)
	return err
}

const updateAccountDeactivation = `-- name: UpdateAccountDeactivation :exec
UPDATE accounts SET is_deactivated = $1 WHERE account_id = $2
`

type UpdateAccountDeactivationParams struct {
	IsDeactivated bool      `json:"is_deactivated"`
	AccountID     uuid.UUID `json:"account_id"`
}

func (q *Queries) UpdateAccountDeactivation(ctx context.Context, arg UpdateAccountDeactivationParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountDeactivation, arg.IsDeactivated, arg.AccountID)
	return err
}

const updateAccountEloRating = `-- name: UpdateAccountEloRating :exec
UPDATE accounts SET elo_rating = $1 WHERE account_id = $2
`

type UpdateAccountEloRatingParams struct {
	EloRating int32     `json:"elo_rating"`
	AccountID uuid.UUID `json:"account_id"`
}

func (q *Queries) UpdateAccountEloRating(ctx context.Context, arg UpdateAccountEloRatingParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountEloRating, arg.EloRating, arg.AccountID)
	return err
}

const updateAccountLastActive = `-- name: UpdateAccountLastActive :exec
UPDATE accounts SET last_active = $1 WHERE account_id = $2
`

type UpdateAccountLastActiveParams struct {
	LastActive sql.NullTime `json:"last_active"`
	AccountID  uuid.UUID    `json:"account_id"`
}

func (q *Queries) UpdateAccountLastActive(ctx context.Context, arg UpdateAccountLastActiveParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountLastActive, arg.LastActive, arg.AccountID)
	return err
}

const updateAccountName = `-- name: UpdateAccountName :exec
UPDATE accounts SET name = $1 WHERE email = $2
`

type UpdateAccountNameParams struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func (q *Queries) UpdateAccountName(ctx context.Context, arg UpdateAccountNameParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountName, arg.Name, arg.Email)
	return err
}

const updateAccountSchool = `-- name: UpdateAccountSchool :exec
UPDATE accounts SET school = $1 WHERE account_id = $2
`

type UpdateAccountSchoolParams struct {
	School    string    `json:"school"`
	AccountID uuid.UUID `json:"account_id"`
}

func (q *Queries) UpdateAccountSchool(ctx context.Context, arg UpdateAccountSchoolParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountSchool, arg.School, arg.AccountID)
	return err
}

const updateAccountUsername = `-- name: UpdateAccountUsername :exec
UPDATE accounts SET username = $1 WHERE account_id = $2
`

type UpdateAccountUsernameParams struct {
	Username  string    `json:"username"`
	AccountID uuid.UUID `json:"account_id"`
}

func (q *Queries) UpdateAccountUsername(ctx context.Context, arg UpdateAccountUsernameParams) error {
	_, err := q.db.ExecContext(ctx, updateAccountUsername, arg.Username, arg.AccountID)
	return err
}

const updateAvatarPath = `-- name: UpdateAvatarPath :exec
UPDATE accounts
SET avatar_path = $1
WHERE account_id = $2
`

type UpdateAvatarPathParams struct {
	AvatarPath string    `json:"avatar_path"`
	AccountID  uuid.UUID `json:"account_id"`
}

func (q *Queries) UpdateAvatarPath(ctx context.Context, arg UpdateAvatarPathParams) error {
	_, err := q.db.ExecContext(ctx, updateAvatarPath, arg.AvatarPath, arg.AccountID)
	return err
}

const updateComment = `-- name: UpdateComment :exec
UPDATE comments SET content = $1 WHERE comment_id = $2
`

type UpdateCommentParams struct {
	Content   string    `json:"content"`
	CommentID uuid.UUID `json:"comment_id"`
}

func (q *Queries) UpdateComment(ctx context.Context, arg UpdateCommentParams) error {
	_, err := q.db.ExecContext(ctx, updateComment, arg.Content, arg.CommentID)
	return err
}

const updateContestDescription = `-- name: UpdateContestDescription :exec
UPDATE contests SET description = $1, updated_at = $2 WHERE contest_id = $3
`

type UpdateContestDescriptionParams struct {
	Description string    `json:"description"`
	UpdatedAt   time.Time `json:"updated_at"`
	ContestID   uuid.UUID `json:"contest_id"`
}

func (q *Queries) UpdateContestDescription(ctx context.Context, arg UpdateContestDescriptionParams) error {
	_, err := q.db.ExecContext(ctx, updateContestDescription, arg.Description, arg.UpdatedAt, arg.ContestID)
	return err
}

const updateDailyTaskStatus = `-- name: UpdateDailyTaskStatus :exec
UPDATE daily_tasks SET is_completed = $1 WHERE daily_task_id = $2
`

type UpdateDailyTaskStatusParams struct {
	IsCompleted bool      `json:"is_completed"`
	DailyTaskID uuid.UUID `json:"daily_task_id"`
}

func (q *Queries) UpdateDailyTaskStatus(ctx context.Context, arg UpdateDailyTaskStatusParams) error {
	_, err := q.db.ExecContext(ctx, updateDailyTaskStatus, arg.IsCompleted, arg.DailyTaskID)
	return err
}

const updatePostContent = `-- name: UpdatePostContent :exec
UPDATE posts SET content = $1 WHERE post_id = $2
`

type UpdatePostContentParams struct {
	Content string    `json:"content"`
	PostID  uuid.UUID `json:"post_id"`
}

func (q *Queries) UpdatePostContent(ctx context.Context, arg UpdatePostContentParams) error {
	_, err := q.db.ExecContext(ctx, updatePostContent, arg.Content, arg.PostID)
	return err
}

const updateQuestionDescription = `-- name: UpdateQuestionDescription :exec
UPDATE questions SET description = $1, updated_at = $2 WHERE question_id = $3
`

type UpdateQuestionDescriptionParams struct {
	Description string    `json:"description"`
	UpdatedAt   time.Time `json:"updated_at"`
	QuestionID  uuid.UUID `json:"question_id"`
}

func (q *Queries) UpdateQuestionDescription(ctx context.Context, arg UpdateQuestionDescriptionParams) error {
	_, err := q.db.ExecContext(ctx, updateQuestionDescription, arg.Description, arg.UpdatedAt, arg.QuestionID)
	return err
}

const updateSubmissionTime = `-- name: UpdateSubmissionTime :exec
UPDATE submissions SET time = $1 WHERE submission_id = $2
`

type UpdateSubmissionTimeParams struct {
	Time         time.Time `json:"time"`
	SubmissionID uuid.UUID `json:"submission_id"`
}

func (q *Queries) UpdateSubmissionTime(ctx context.Context, arg UpdateSubmissionTimeParams) error {
	_, err := q.db.ExecContext(ctx, updateSubmissionTime, arg.Time, arg.SubmissionID)
	return err
}
