package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ConvertUserIDToUUID converts the user ID to a UUID and stores it in the context.
func ConvertUserIDToUUID(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	accountIDStr := user.(string)

	// Convert accountID to UUID
	accountID, err := uuid.Parse(accountIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		c.Abort()
		return
	}

	// Store the UUID in the context
	c.Set("accountID", accountID)
}
