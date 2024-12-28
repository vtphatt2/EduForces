package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/sessions"
)

// SessionMiddleware is a Gin middleware that checks for a valid session.
func SessionMiddleware(sm *sessions.SessionManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the session ID from the Authorization header
		sessionID := c.GetHeader("Authorization")
		if sessionID == "" {
			// If the session ID is not present, return unauthorized
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session not found"})
			c.Abort()
			return
		}

		// Retrieve the session from the session manager
		session, valid := sm.GetSession(sessionID)
		if !valid {
			// If the session is invalid, return unauthorized
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid session"})
			c.Abort()
			return
		}

		// Attach the user to the context
		c.Set("user", session.UserID)

		// Continue with the request
		c.Next()
	}
}
