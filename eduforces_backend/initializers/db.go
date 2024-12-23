package initializers

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv" // For loading .env files
	_ "github.com/lib/pq"      // PostgreSQL driver
)

var DB *sql.DB

func ConnectToDatabase() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found or could not be loaded, proceeding with system environment variables")
	}

	log.Println("Starting database connection...")

	// Get the database connection string
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("Environment variable DB_URL is not set")
	}

	// Connect to the database
	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	// Verify the connection
	err = DB.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("Connected to the database successfully")
}
