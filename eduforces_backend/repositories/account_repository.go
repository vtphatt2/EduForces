package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/vtphatt2/EduForces/models/sqlc"

	"github.com/google/uuid"
)

type AccountRepository struct {
	queries *sqlc.Queries
}

func NewAccountRepository(queries *sqlc.Queries) *AccountRepository {
	return &AccountRepository{queries: queries}
}

func (r *AccountRepository) CreateAccount(ctx context.Context, params sqlc.CreateAccountParams) error {
	return r.queries.CreateAccount(ctx, params)
}

func (r *AccountRepository) GetAccountByEmail(ctx context.Context, email string) (*sqlc.Account, error) {
	fmt.Println("GetAccountByEmail", email)
	account, err := r.queries.GetAccountByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No account found
		}
		return nil, err // Other errors
	}
	return &account, nil
}

func (r *AccountRepository) GetAccount(ctx context.Context, accountID uuid.UUID) (*sqlc.Account, error) {
	account, err := r.queries.GetAccount(ctx, accountID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No account found
		}
		return nil, err // Other errors
	}
	return &account, nil
}

func (r *AccountRepository) ListAccounts(ctx context.Context) ([]sqlc.Account, error) {
	return r.queries.ListAccounts(ctx)
}

func (r *AccountRepository) DeleteAccount(ctx context.Context, accountID uuid.UUID) error {
	return r.queries.DeleteAccount(ctx, accountID)
}

func (r *AccountRepository) GetAccountDetails(ctx context.Context, accountID uuid.UUID) (*sqlc.Account, error) {
	account, err := r.queries.GetAccount(ctx, accountID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // No account found
		}
		return nil, err // Other errors
	}
	return &account, nil
}

func (r *AccountRepository) UpdateAccountName(ctx context.Context, name string, email string) error {
	return r.queries.UpdateAccountName(ctx, sqlc.UpdateAccountNameParams{
		Name:  name,
		Email: email,
	})
}
func (r *AccountRepository) UpdateUsername(ctx context.Context, accountID uuid.UUID, username string) error {
	return r.queries.UpdateAccountUsername(ctx, sqlc.UpdateAccountUsernameParams{
		AccountID: accountID,
		Username:  username,
	})
}

func (r *AccountRepository) UpdateAvatar(ctx context.Context, accountID uuid.UUID, avatarPath string) error {
	return r.queries.UpdateAccountAvatar(ctx, sqlc.UpdateAccountAvatarParams{
		AccountID:  accountID,
		AvatarPath: avatarPath,
	})
}

func (r *AccountRepository) UpdateEloRating(ctx context.Context, accountID uuid.UUID, eloRating int) error {
	return r.queries.UpdateAccountEloRating(ctx, sqlc.UpdateAccountEloRatingParams{
		AccountID: accountID,
		EloRating: int32(eloRating),
	})
}

func (r *AccountRepository) UpdateAccountLastActive(ctx context.Context, accountID uuid.UUID, lastActive sql.NullTime) error {
	return r.queries.UpdateAccountLastActive(ctx, sqlc.UpdateAccountLastActiveParams{
		AccountID:  accountID,
		LastActive: lastActive,
	})
}

func (r *AccountRepository) UpdateSchool(ctx context.Context, accountID uuid.UUID, school string) error {
	return r.queries.UpdateAccountSchool(ctx, sqlc.UpdateAccountSchoolParams{
		AccountID: accountID,
		School:    school,
	})
}

func (r *AccountRepository) UpdateDeactivation(ctx context.Context, accountID uuid.UUID, isDeactivated bool) error {
	return r.queries.UpdateAccountDeactivation(ctx, sqlc.UpdateAccountDeactivationParams{
		AccountID:     accountID,
		IsDeactivated: isDeactivated,
	})
}

func (r *AccountRepository) UpdateAvatarPath(ctx context.Context, accountID uuid.UUID, avatarPath string) error {
	fmt.Println("UpdateAvatarPath", accountID, avatarPath)
	return r.queries.UpdateAvatarPath(ctx, sqlc.UpdateAvatarPathParams{
		AvatarPath: avatarPath,
		AccountID:  accountID,
	})
}

func (r *AccountRepository) UpdateAccountRole(ctx context.Context, accountID uuid.UUID, role string) error {
	return r.queries.UpdateAccountRole(ctx, sqlc.UpdateAccountRoleParams{
		AccountID: accountID,
		Role:      sqlc.RoleEnum(role),
	})
}

func (r *AccountRepository) ListAccountsByDeactivationStatus(ctx context.Context, isDeactivated bool) ([]sqlc.Account, error) {
	return r.queries.ListAccountsByDeactivationStatus(ctx, isDeactivated)
}

func (r *AccountRepository) ListAccountsByRole(ctx context.Context, role sqlc.RoleEnum) ([]sqlc.Account, error) {
	return r.queries.ListAccountsByRole(ctx, role)
}

func (r *AccountRepository) ListAccountsByUsernamePrefix(ctx context.Context, usernamePrefix string) ([]sqlc.Account, error) {
	return r.queries.ListAccountsByUsernamePrefix(ctx, sql.NullString{String: usernamePrefix, Valid: true})
}

type ListAccountsByFiltersParams struct {
	Column1 string
	Column2 string
	Column3 int32
}

func (r *AccountRepository) ListAccountsByFilters(ctx context.Context, params ListAccountsByFiltersParams) ([]sqlc.Account, error) {
	return r.queries.ListAccountsByFilters(ctx, sqlc.ListAccountsByFiltersParams{
		Column1: params.Column1,
		Column2: params.Column2,
		Column3: params.Column3,
	})
}
