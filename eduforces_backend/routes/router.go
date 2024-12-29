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
	postCtrl *controllers.PostController,
	commentCtrl *controllers.CommentController,
	contestCtrl *controllers.ContestController,
	sessionManager *sessions.SessionManager, // Pass the session manager here
) *gin.Engine {
	// Create a new Gin router
	router := gin.Default()

	router.Static("/uploads", "./uploads")

	// Apply global middlewares if needed (e.g., CORS, logging)
	router.Use(middleware.CORSMiddleware())

	// Preconfigure the session middleware
	sessionMiddleware := middleware.SessionMiddleware(sessionManager)

	// Register feature-specific routes
	RegisterAuthRoutes(router, authCtrl, sessionMiddleware)
	RegisterPostRoutes(router, postCtrl, commentCtrl, sessionMiddleware)
	RegisterCommentRoutes(router, commentCtrl, sessionMiddleware)
	RegisterContestRoutes(router, contestCtrl, sessionMiddleware)
	// Return the fully initialized router
	return router
}
