package repositories

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
)

type ContestRepository struct {
	queries *sqlc.Queries
}

func NewContestRepository(queries *sqlc.Queries) *ContestRepository {
	return &ContestRepository{queries: queries}
}

func (r *ContestRepository) CreateContest(ctx context.Context, params sqlc.CreateContestParams) error {
	return r.queries.CreateContest(ctx, params)
}

func (r *ContestRepository) GetContest(ctx context.Context, contestID uuid.UUID) (*sqlc.Contest, error) {
	contest, err := r.queries.GetContest(ctx, contestID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No contest found
		}
		return nil, err // Other errors
	}
	return &contest, nil
}

func (r *ContestRepository) UpdateContestDescription(ctx context.Context, params sqlc.UpdateContestDescriptionParams) error {
	return r.queries.UpdateContestDescription(ctx, params)
}

func (r *ContestRepository) ListContests(ctx context.Context) ([]sqlc.Contest, error) {
	return r.queries.ListContests(ctx)
}

func (r *ContestRepository) DeleteContest(ctx context.Context, contestID uuid.UUID) error {
	return r.queries.DeleteContest(ctx, contestID)
}

func (r *ContestRepository) GetContestDetails(ctx context.Context, contestID uuid.UUID) (*sqlc.ContestDetail, error) {
	contestDetail, err := r.queries.GetContestDetails(ctx, uuid.NullUUID{UUID: contestID, Valid: true})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No contest detail found
		}
		return nil, err // Other errors
	}
	return &contestDetail, nil
}

func (r *ContestRepository) AddContestDetail(ctx context.Context, params sqlc.AddContestDetailParams) error {
	return r.queries.AddContestDetail(ctx, params)
}

func (r *ContestRepository) AddContestQuestion(ctx context.Context, params sqlc.AddContestQuestionParams) error {
	return r.queries.AddContestQuestion(ctx, params)
}

func (r *ContestRepository) GetContestQuestions(ctx context.Context, contestDetailID uuid.UUID) ([]sqlc.Question, error) {
	return r.queries.GetContestQuestions(ctx, contestDetailID)
}

func (r *ContestRepository) RegisterForContest(ctx context.Context, params sqlc.RegisterForContestParams) error {
	return r.queries.RegisterForContest(ctx, params)
}

func (r *ContestRepository) GetContestRegistrations(ctx context.Context, contestID uuid.UUID) ([]sqlc.ContestRegistration, error) {
	return r.queries.GetContestRegistrations(ctx, uuid.NullUUID{UUID: contestID, Valid: true})
}
