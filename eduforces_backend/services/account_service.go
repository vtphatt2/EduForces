package services

import (
	"context"

	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repository"
)

type AccountService struct {
	repo *repository.AccountRepository
}

func NewAccountService(repo *repository.AccountRepository) *AccountService {
	return &AccountService{repo: repo}
}

// CreateAccountIfNotExist creates an account only if it doesn't already exist
func (s *AccountService) CreateAccountIfNotExist(ctx context.Context, email, name string) error {
	// Check if the account already exists
	account, err := s.repo.GetAccountByEmail(ctx, email)
	if err != nil {
		return err // Database error
	}
	if account != nil {
		// Account already exists, no action needed
		return nil
	}

	// Create the new account
	return s.repo.CreateAccount(ctx, sqlc.CreateAccountParams{
		Email: email,
		Name:  name,
		Role:  "User", // Default role
	})
}
