package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/vtphatt2/EduForces/initializers"
	"github.com/vtphatt2/EduForces/routes"
)

func init() {
	// Initialize database connection
	initializers.ConnectToDataBase()
}

func main() {
	// Register all routes
	r := mux.NewRouter()

	// Register all routes
	routes.RegisterRoutes(r)

	// Use CORS middleware
	// http.Handle("/", routes.CORS(r))
	r.Use(routes.CORS)

	// Start the server
	// Start the server
	log.Println("Server is running on port 8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
