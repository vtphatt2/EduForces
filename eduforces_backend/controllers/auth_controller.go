package controllers

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/services"
	"github.com/vtphatt2/EduForces/sessions"
)

type AuthController struct {
	service *services.AuthService
	session *sessions.SessionManager
}

func NewAuthController(service *services.AuthService, session *sessions.SessionManager) *AuthController {
	return &AuthController{service: service, session: session}
}

// GoogleAuthHandler handles Google OAuth login
func (ctrl *AuthController) GoogleAuthHandler(c *gin.Context) {
	var request struct {
		Code string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body"})
		return
	}

	// Step 1: Exchange code for user info
	fmt.Println("request.Code: ", request.Code)
	userInfo, err := ctrl.service.ExchangeGoogleCode(context.Background(), request.Code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to authenticate with Google"})
		return
	}

	fmt.Print("userInfo: ", userInfo)

	// Step 2: Create or find user in the database
	userID, err := ctrl.service.CreateOrFindUser(context.Background(), userInfo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create or find user"})
		return
	}

	// Step 3: Generate session
	sessionID, err := ctrl.session.CreateSession(userID)
	fmt.Println("Session ID: ", sessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create session"})
		return
	}

	// Step 4: Update account last active = null
	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to parse user ID"})
		return
	}

	err = ctrl.service.UpdateAccountLastActive(context.Background(), parsedUserID, sql.NullTime{Valid: false})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update account last active"})
		return
	}

	// Return the user profile information and session details to the frontend

	account, err := ctrl.service.GetAccountDetails(c.Request.Context(), parsedUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if account == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"message":    "Login successful",
		"session_id": sessionID,
		"user": gin.H{
			"account_id": account.AccountID,
			"email":      account.Email,
			"name":       account.Name,
			"username":   account.Username,
		},
	})
}

// LogoutHandler clears the session
func (ctrl *AuthController) LogoutHandler(c *gin.Context) {
	// Retrieve the session ID from the request body
	sessionID := c.GetHeader("Authorization")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No session found"})
		return
	}

	// Validate the session using the session manager
	session, exists := ctrl.session.GetSession(sessionID)

	fmt.Println("Logout Session ID: ", sessionID)
	fmt.Println("exists: ", exists)

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid session"})
		return
	}

	// Update account last active = now
	userID, err := uuid.Parse(session.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to parse user ID"})
		return
	}

	err = ctrl.service.UpdateAccountLastActive(c.Request.Context(), userID, sql.NullTime{Time: time.Now(), Valid: true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update account last active"})
		return
	}

	// Delete the session
	err = ctrl.session.DeleteSession(sessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to logout"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Logged out successfully"})
}

// ValidateSessionHandler checks if the session is valid
func (ctrl *AuthController) ValidateSessionHandler(c *gin.Context) {
	// Retrieve the session ID from the Authorization header
	sessionID := c.GetHeader("Authorization")
	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No session found"})
		return
	}

	// Validate the session using the session manager
	session, exists := ctrl.session.GetSession(sessionID)

	fmt.Println("Session ID: ", sessionID)
	fmt.Println("exists: ", exists)

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid session"})
		return
	}

	// If the session is valid, return the user information
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"user": gin.H{
			"user_id": session.UserID,
		},
	})
}

func (ctrl *AuthController) GetAccountDetails(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	account, err := ctrl.service.GetAccountDetails(c.Request.Context(), uuid.MustParse(user.(string)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if account == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"account_id":     account.AccountID,
		"email":          account.Email,
		"name":           account.Name,
		"username":       account.Username,
		"role":           account.Role,
		"avatar_path":    account.AvatarPath,
		"elo_rating":     account.EloRating,
		"last_active":    account.LastActive,
		"school":         account.School,
		"is_deactivated": account.IsDeactivated,
		"gold_amount":    account.GoldAmount,
	})
}

func (ctrl *AuthController) GetAccountDetailsFromID(c *gin.Context) {
	accountID := c.Param("id")
	if accountID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Account ID is required"})
		return
	}

	account, err := ctrl.service.GetAccountDetails(c.Request.Context(), uuid.MustParse(accountID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if account == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"account_id":     account.AccountID,
		"name":           account.Name,
		"username":       account.Username,
		"role":           account.Role,
		"avatar_path":    account.AvatarPath,
		"elo_rating":     account.EloRating,
		"last_active":    account.LastActive,
		"school":         account.School,
		"is_deactivated": account.IsDeactivated,
	})
}

func (ctrl *AuthController) UpdateUsername(c *gin.Context) {
	var request struct {
		Username string `json:"username" binding:"required"`
		School   string `json:"school" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	err := ctrl.service.UpdateUsername(c.Request.Context(), uuid.MustParse(user.(string)), request.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = ctrl.service.UpdateSchool(c.Request.Context(), uuid.MustParse(user.(string)), request.School)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Username and School updated successfully"})
}

func (ctrl *AuthController) UploadAvatar(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
		return
	}

	// Define the path to save the file
	avatarPath := filepath.Join("uploads", "avatars", user.(string))
	avatarAccessPath := "uploads/avatars/" + user.(string)

	// Save the file locally
	if err := c.SaveUploadedFile(file, avatarPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Update the avatar path in the database
	if err := ctrl.service.UpdateAvatarPath(c.Request.Context(), uuid.MustParse(user.(string)), avatarAccessPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Avatar uploaded successfully", "avatar_path": avatarPath})
}
