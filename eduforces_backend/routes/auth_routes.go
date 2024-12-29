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
		authRoutes.POST("/logout", authCtrl.LogoutHandler)
		authRoutes.GET("/validate-session", authCtrl.ValidateSessionHandler)
	}

	// Account management routes
	accountRoutes := router.Group("/api/v1/accounts")
	{
		accountRoutes.GET("/account-details", sessionMiddleware, authCtrl.GetAccountDetails)
		accountRoutes.GET("/account-details/:id", sessionMiddleware, authCtrl.GetAccountDetailsFromID)
		accountRoutes.PUT("/update-username", sessionMiddleware, authCtrl.UpdateUsername)
		accountRoutes.PUT("/upload-avatar", sessionMiddleware, authCtrl.UploadAvatar)
		accountRoutes.PUT("/update-role", sessionMiddleware, authCtrl.UpdateAccountRole)
		accountRoutes.PUT("/update-deactivation", sessionMiddleware, authCtrl.UpdateAccountDeactivation)
	}
}
