package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
)

type QuestionRepository struct {
	queries *sqlc.Queries
}

func NewQuestionRepository(queries *sqlc.Queries) *QuestionRepository {
	return &QuestionRepository{queries: queries}
}

func (r *QuestionRepository) CreateQuestion(ctx context.Context, params sqlc.CreateQuestionParams) error {
	return r.queries.CreateQuestion(ctx, params)
}

func (r *QuestionRepository) GetQuestion(ctx context.Context, questionID uuid.UUID) (*sqlc.Question, error) {
	question, err := r.queries.GetQuestion(ctx, questionID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No question found
		}
		return nil, err // Other errors
	}
	return &question, nil
}

func (r *QuestionRepository) GetLatestQuestionWithSubject(ctx context.Context, subject string) (*sqlc.Question, error) {
	question, err := r.queries.GetLatestQuestionWithSubject(ctx, subject)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No question found
		}
		return nil, err // Other errors
	}
	return &question, nil
}

func (r *QuestionRepository) CheckContestExistsWithSubject(ctx context.Context, subject string) (bool, error) {
	return r.queries.CheckContestExistsWithSubject(ctx, subject)
}

func (r *QuestionRepository) UpdateQuestionDescription(ctx context.Context, params sqlc.UpdateQuestionDescriptionParams) error {
	return r.queries.UpdateQuestionDescription(ctx, params)
}

func (r *QuestionRepository) ListQuestions(ctx context.Context) ([]sqlc.Question, error) {
	return r.queries.ListQuestions(ctx)
}

func (r *QuestionRepository) DeleteQuestion(ctx context.Context, questionID uuid.UUID) error {
	return r.queries.DeleteQuestion(ctx, questionID)
}
func (r *QuestionRepository) ListQuestionOfContest(ctx context.Context, contestID uuid.NullUUID) ([]sqlc.Question, error) {
	return r.queries.ListQuestionsOfContest(ctx, contestID)
}

type FilterQuestionsParams struct {
	Subjects  []string  `json:"subjects"`
	AccountID uuid.UUID `json:"account_id"`
	Done      int32     `json:"done"`
}

func (r *QuestionRepository) FilterQuestions(ctx context.Context, params FilterQuestionsParams) ([]sqlc.Question, error) {
	fmt.Println("donerepos=", params.Done)
	return r.queries.FilterQuestionsBySubjectsAndDoneStatus(ctx, sqlc.FilterQuestionsBySubjectsAndDoneStatusParams{
		Column1:   params.Subjects,
		AccountID: params.AccountID,
		Column3:   params.Done,
	})
}

func (r *QuestionRepository) UpdateUserDoneStatus(ctx context.Context, params sqlc.UpdateUserDoneStatusParams) error {
	return r.queries.UpdateUserDoneStatus(ctx, params)
}

func (r *QuestionRepository) UserDoneQuestionExists(ctx context.Context, accountID uuid.UUID, questionID uuid.UUID) (bool, error) {
	exists, err := r.queries.UserDoneQuestionExists(ctx, sqlc.UserDoneQuestionExistsParams{
		AccountID:  accountID,
		QuestionID: questionID,
	})
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *QuestionRepository) CreateUserDoneQuestion(ctx context.Context, accountID uuid.UUID, questionID uuid.UUID, done int32) error {
	return r.queries.CreateUserDoneQuestion(ctx, sqlc.CreateUserDoneQuestionParams{
		AccountID:  accountID,
		QuestionID: questionID,
		Done:       done,
	})
}

func (r *QuestionRepository) DeleteQuestionsByContestId(ctx context.Context, contestID uuid.NullUUID) error {
	return r.queries.DeleteQuestionsByContestId(ctx, contestID)
}
func (r *QuestionRepository) UpdateQuestionToPublic(ctx context.Context, contestID uuid.NullUUID) error {
	return r.queries.UpdateQuestionToPublic(ctx, contestID)
}
