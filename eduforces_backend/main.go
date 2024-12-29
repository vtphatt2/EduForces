package main

import (
	"context"
	"log"

	"github.com/joho/godotenv"
	"github.com/vtphatt2/EduForces/controllers"
	"github.com/vtphatt2/EduForces/initializers"
	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repositories"
	"github.com/vtphatt2/EduForces/routes"
	"github.com/vtphatt2/EduForces/services"
	"github.com/vtphatt2/EduForces/sessions"
)

func init() {
	// Load environment variables from .env file if present
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database connection
	initializers.ConnectToDatabase()
}

func main() {
	// Initialize session manager
	sessionManager := sessions.NewSessionManager()

	// Initialize sqlc.Queries using the database connection
	queries := sqlc.New(initializers.DB) // Pass the *sql.DB connection to sqlc.New()

	// Initialize repositories
	accountRepo := repositories.NewAccountRepository(queries) // Pass the queries instance to the repository
	postRepo := repositories.NewPostRepository(queries)       // Initialize PostRepository
	contestRepo := repositories.NewContestRepository(queries)
	questionRepo := repositories.NewQuestionRepository(queries)
	commentRepo := repositories.NewCommentRepository(queries)
	// Initialize services
	authService := services.NewAuthService(accountRepo)
	postService := services.NewPostService(postRepo, accountRepo) // Initialize PostService with both postRepo and accountRepo
	commentService := services.NewCommentService(commentRepo, accountRepo)

	contestService := services.NewContestService(contestRepo, questionRepo, accountRepo)
	// Initialize controllers
	authController := controllers.NewAuthController(authService, sessionManager)
	postController := controllers.NewPostController(postService) // Initialize PostController
	commenController := controllers.NewCommentController(commentService, sessionManager)
	contestController := controllers.NewContestController(contestService)
	// Register routes
	router := routes.RegisterRoutes(authController, postController, commenController, contestController, sessionManager)

	// Schedule update status contest
	contestController.ScheduleContestStatusUpdates(context.Background())

	// Start the server
	log.Println("Server is running on port 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
