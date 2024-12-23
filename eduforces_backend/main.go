package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/vtphatt2/EduForces/controllers"
	"github.com/vtphatt2/EduForces/initializers"
	"github.com/vtphatt2/EduForces/middleware"
	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repository"
	"github.com/vtphatt2/EduForces/routes"
	"github.com/vtphatt2/EduForces/services"
	"github.com/vtphatt2/EduForces/sessions"
)

func init() {
	// Initialize database connection
	initializers.ConnectToDatabase()
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}
}

func main() {
	// Initialize Redis client

	// Initialize session manager
	sessionManager := sessions.NewSessionManager()

	// Initialize sqlc.Queries using the database connection
	queries := sqlc.New(initializers.DB) // Pass the *sql.DB connection to sqlc.New()

	// Initialize repositories
	accountRepo := repository.NewAccountRepository(queries) // Pass the queries instance to the repository

	// Initialize services
	authService := services.NewAuthService(accountRepo)

	// Initialize controllers
	authController := controllers.NewAuthController(authService, sessionManager)

	// Create a Gin router
	router := gin.Default()

	// Apply global middlewares
	router.Use(middleware.CORSMiddleware())

	// Register routes
	routes.RegisterAuthRoutes(router, authController, middleware.SessionMiddleware(sessionManager))

	// Start the server
	log.Println("Server is running on port 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
