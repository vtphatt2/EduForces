package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/sessions"
)

// SessionMiddleware is a Gin middleware that checks for a valid session.
func SessionMiddleware(sm *sessions.SessionManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the session ID from the cookie
		sessionID, err := c.Cookie("session_id")
		if err != nil {
			// If the session cookie is not present, continue with the request
			c.Next()
			return
		}

		// Retrieve the session from the session manager
		session, valid := sm.GetSession(sessionID)
		if !valid {
			// If the session is invalid, clear the cookie and continue
			c.SetCookie("session_id", "", -1, "/", "", false, true)
			c.Next()
			return
		}

		// Attach the user to the context
		c.Set("user", session.UserID)

		// Continue with the request
		c.Next()
	}
}
