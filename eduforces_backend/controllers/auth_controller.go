package controllers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
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

	// Return the user profile information and session details to the frontend
	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"message":    "Login successful",
		"session_id": sessionID,
		"user": gin.H{
			"email":    userInfo.Email,
			"name":     userInfo.Name,
			"username": userInfo.Name,
		},
	})
}

// LogoutHandler clears the session
func (ctrl *AuthController) LogoutHandler(c *gin.Context) {
	// Retrieve the session ID from the request body
	var request struct {
		SessionID string `json:"session_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body"})
		return
	}

	// Delete the session
	err := ctrl.session.DeleteSession(request.SessionID)
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
