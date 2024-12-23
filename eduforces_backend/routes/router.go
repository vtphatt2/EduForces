package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
	"github.com/vtphatt2/EduForces/middleware"
	"github.com/vtphatt2/EduForces/sessions"
)

// RegisterRoutes sets up all feature-specific routes and returns the router.
func RegisterRoutes(
	authCtrl *controllers.AuthController,
	sessionManager *sessions.SessionManager, // Pass the session manager here
) *gin.Engine {
	// Create a new Gin router
	router := gin.Default()

	// Apply global middlewares if needed (e.g., CORS, logging)
	router.Use(middleware.CORSMiddleware())

	// Preconfigure the session middleware
	sessionMiddleware := middleware.SessionMiddleware(sessionManager)

	// Register feature-specific routes
	RegisterAuthRoutes(router, authCtrl, sessionMiddleware)

	// Return the fully initialized router
	return router
}
