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

func (r *ContestRepository) ListContestsOfAuthor(ctx context.Context, authorID uuid.NullUUID) ([]sqlc.Contest, error) {
	return r.queries.ListContestsOfAuthor(ctx, authorID)
}

func (r *ContestRepository) DeleteContest(ctx context.Context, contestID uuid.UUID) error {
	return r.queries.DeleteContest(ctx, contestID)
}
