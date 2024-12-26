package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterAuthRoutes(router *gin.Engine, authCtrl *controllers.AuthController, sessionMiddleware gin.HandlerFunc) {
	authRoutes := router.Group("/api/v1/auth")
	{
		authRoutes.POST("/google", authCtrl.GoogleAuthHandler)
		authRoutes.GET("/logout", sessionMiddleware, authCtrl.LogoutHandler)
		authRoutes.GET("/validate-session", authCtrl.ValidateSessionHandler)
	}
}
