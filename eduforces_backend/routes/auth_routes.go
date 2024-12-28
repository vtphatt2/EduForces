package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterAuthRoutes(router *gin.Engine, authCtrl *controllers.AuthController, sessionMiddleware gin.HandlerFunc) {
	// Authentication routes
	authRoutes := router.Group("/api/v1/auth")
	{
		authRoutes.POST("/google", authCtrl.GoogleAuthHandler)
		authRoutes.GET("/logout", sessionMiddleware, authCtrl.LogoutHandler)
		authRoutes.GET("/validate-session", authCtrl.ValidateSessionHandler)
	}

	// Account management routes
	accountRoutes := router.Group("/api/v1/accounts")
	{
		accountRoutes.GET("/account-details", sessionMiddleware, authCtrl.GetAccountDetails)
		accountRoutes.PUT("/update-username", sessionMiddleware, authCtrl.UpdateUsername)
	}
}
