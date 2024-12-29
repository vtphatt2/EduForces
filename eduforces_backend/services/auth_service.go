package services

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repositories"
)

type AuthService struct {
	repo *repositories.AccountRepository
}

func NewAuthService(repo *repositories.AccountRepository) *AuthService {
	return &AuthService{repo: repo}
}

type GoogleTokenResponse struct {
	AccessToken string `json:"access_token"`
	IDToken     string `json:"id_token"`
	ExpiresIn   int    `json:"expires_in"`
}

type GoogleUserInfo struct {
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// ExchangeGoogleCode exchanges the authorization code for user info
func (s *AuthService) ExchangeGoogleCode(ctx context.Context, code string) (*GoogleUserInfo, error) {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")
	fmt.Println("ID=", clientID, clientSecret, redirectURI)

	tokenURL := "https://oauth2.googleapis.com/token"
	fmt.Println("code=", code)
	body := map[string]string{
		"code":          code,
		"client_id":     clientID,
		"client_secret": clientSecret,
		"redirect_uri":  redirectURI,
		"grant_type":    "authorization_code",
	}

	bodyJSON, _ := json.Marshal(body)
	resp, err := http.Post(tokenURL, "application/json", bytes.NewBuffer(bodyJSON))
	fmt.Println("resp=", resp)

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var tokenResponse GoogleTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return nil, err
	}

	// Fetch user info using the access token
	userInfoURL := "https://www.googleapis.com/oauth2/v2/userinfo"
	req, _ := http.NewRequest("GET", userInfoURL, nil)
	req.Header.Set("Authorization", "Bearer "+tokenResponse.AccessToken)

	client := &http.Client{}
	userInfoResp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer userInfoResp.Body.Close()

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(userInfoResp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}

// CreateOrFindUser creates a new user if they don't exist or finds an existing user
func (s *AuthService) CreateOrFindUser(ctx context.Context, userInfo *GoogleUserInfo) (string, error) {
	account, err := s.repo.GetAccountByEmail(ctx, userInfo.Email)
	if err != nil {
		return "", err
	}

	// If the user doesn't exist, create a new one
	if account == nil {
		if userInfo.Email == "" {
			return "", fmt.Errorf("email is required")
		}
		err = s.repo.CreateAccount(ctx, sqlc.CreateAccountParams{
			Email:      userInfo.Email,
			Name:       userInfo.Name,
			Role:       "User",
			AvatarPath: userInfo.Picture,
		})
		if err != nil {
			return "", err
		}

		// Fetch the newly created account
		account, err = s.repo.GetAccountByEmail(ctx, userInfo.Email)
		if err != nil {
			return "", err
		}

		// Download the user's avatar image
		avatarResp, err := http.Get(userInfo.Picture)
		if err != nil {
			return "", err
		}
		defer avatarResp.Body.Close()

		// Define the path to save the file
		avatarPath := filepath.Join("uploads", "avatars", account.AccountID.String())
		avatarAccessPath := "uploads/avatars/" + account.AccountID.String()

		// Create the file
		out, err := os.Create(avatarPath)
		if err != nil {
			return "", err
		}
		defer out.Close()

		// Write the content to the file
		_, err = io.Copy(out, avatarResp.Body)
		if err != nil {
			return "", err
		}

		// Update the avatar path in the database
		if err := s.UpdateAvatarPath(ctx, account.AccountID, avatarAccessPath); err != nil {
			return "", err
		}
	}

	s.UpdateAccountName(ctx, userInfo.Name, userInfo.Email)

	return account.AccountID.String(), nil
}

func (s *AuthService) GetAccountDetails(ctx context.Context, accountID uuid.UUID) (*sqlc.Account, error) {
	return s.repo.GetAccountDetails(ctx, accountID)
}

func (s *AuthService) UpdateUsername(ctx context.Context, accountID uuid.UUID, username string) error {
	return s.repo.UpdateUsername(ctx, accountID, username)
}

func (s *AuthService) UpdateAccountLastActive(ctx context.Context, accountID uuid.UUID, lastActive sql.NullTime) error {
	return s.repo.UpdateAccountLastActive(ctx, accountID, lastActive)
}

func (s *AuthService) UpdateAvatarPath(ctx context.Context, accountID uuid.UUID, avatarPath string) error {
	return s.repo.UpdateAvatarPath(ctx, accountID, avatarPath)
}

func (s *AuthService) UpdateSchool(ctx context.Context, accountID uuid.UUID, school string) error {
	return s.repo.UpdateSchool(ctx, accountID, school)
}

func (s *AuthService) UpdateEloRating(ctx context.Context, accountID uuid.UUID, eloRating int) error {
	return s.repo.UpdateEloRating(ctx, accountID, eloRating)
}

func (s *AuthService) UpdateAccountName(ctx context.Context, name string, email string) error {
	return s.repo.UpdateAccountName(ctx, name, email)
}

func (s *AuthService) UpdateAccountRole(ctx context.Context, accountID uuid.UUID, role string) error {
	// Update the account role
	return s.repo.UpdateAccountRole(ctx, accountID, role)
}

func (s *AuthService) UpdateDeactivation(ctx context.Context, accountID uuid.UUID, isDeactivated bool) error {
	return s.repo.UpdateDeactivation(ctx, accountID, isDeactivated)
}
