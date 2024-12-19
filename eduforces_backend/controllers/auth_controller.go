package controllers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
)

var store *sessions.CookieStore

type GoogleUserInfo struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type GoogleTokenResponse struct {
	IDToken string `json:"id_token"`
}

func init() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	sessionKey := os.Getenv("SESSION_KEY")
	if sessionKey == "" {
		fmt.Println("SESSION_KEY not set in environment")
		return
	}

	store = sessions.NewCookieStore([]byte(sessionKey))
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Authorization code not found", http.StatusBadRequest)
		return
	}

	// Exchange the authorization code for tokens
	// fmt.Println("code", code)
	tokenResp, err := exchangeCodeForTokens(code)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to exchange code for tokens: %v", err), http.StatusInternalServerError)
		return
	}

	// Decode the ID Token
	userInfo, err := getUserInfoFromIDToken(tokenResp.IDToken)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to decode ID token: %v", err), http.StatusInternalServerError)
		return
	}

	// Debug: Log user info
	fmt.Printf("User Info: %+v\n", userInfo)

	err = UpdateOrCreateAccount(userInfo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to update or create account: %v", err), http.StatusInternalServerError)
		return
	}

	//Create a new session and set user info
	err = createSession(w, r, userInfo)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to create session: %v", err), http.StatusInternalServerError)
		return
	}

	//Redirect to frontend home page
	frontendURL := os.Getenv("FRONTEND_URL")
	http.Redirect(w, r, frontendURL, http.StatusSeeOther)
}

func createSession(w http.ResponseWriter, r *http.Request, userInfo *GoogleUserInfo) error {
	session, _ := store.Get(r, "session-name")
	session.Values["email"] = userInfo.Email
	session.Values["name"] = userInfo.Name
	return session.Save(r, w)
}
func exchangeCodeForTokens(code string) (*GoogleTokenResponse, error) {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURL := os.Getenv("GOOGLE_REDIRECT_URL")

	// fmt.Println("clientID", clientID)
	// fmt.Println("clientSecret", clientSecret)
	// fmt.Println("redirectURL", redirectURL)

	resp, err := http.PostForm("https://oauth2.googleapis.com/token", map[string][]string{
		"client_id":     {clientID},
		"client_secret": {clientSecret},
		"code":          {code},
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {redirectURL},
	})
	// fmt.Println("resp", resp)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var tokenResp GoogleTokenResponse
	err = json.NewDecoder(resp.Body).Decode(&tokenResp)
	if err != nil {
		return nil, err
	}

	// Debug: Check the response
	// fmt.Printf("Token Response: %+v\n", tokenResp)

	return &tokenResp, nil
}

func getUserInfoFromIDToken(idToken string) (*GoogleUserInfo, error) {
	if idToken == "" {
		return nil, fmt.Errorf("ID token is empty")
	}

	// Split the ID Token into parts
	parts := strings.Split(idToken, ".")
	if len(parts) < 3 {
		return nil, fmt.Errorf("invalid ID token format")
	}

	// Decode the payload (second part of the token)
	payload, err := base64.RawStdEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("failed to decode ID token payload: %v", err)
	}

	// Parse the JSON payload
	var userInfo GoogleUserInfo
	err = json.Unmarshal(payload, &userInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to parse ID token payload: %v", err)
	}

	return &userInfo, nil
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Print the session ID
	fmt.Println("Session ID:", session)

	email, ok := session.Values["email"].(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	name, ok := session.Values["name"].(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userInfo := map[string]string{
		"email": email,
		"name":  name,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userInfo)
}
