package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

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
	Email string `json:"email"`
	Name  string `json:"name"`
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
		err = s.repo.CreateAccount(ctx, sqlc.CreateAccountParams{
			Email: userInfo.Email,
			Name:  userInfo.Name,
			Role:  "User",
		})
		if err != nil {
			return "", err
		}

		// Fetch the newly created account
		account, err = s.repo.GetAccountByEmail(ctx, userInfo.Email)
		if err != nil {
			return "", err
		}
	}

	return account.AccountID.String(), nil
}

func (s *AuthService) GetAccountDetails(ctx context.Context, accountID uuid.UUID) (*sqlc.Account, error) {
	return s.repo.GetAccountDetails(ctx, accountID)
}

func (s *AuthService) UpdateUsername(ctx context.Context, accountID uuid.UUID, username string) error {
	return s.repo.UpdateUsername(ctx, accountID, username)
}
