package routes

import (
	"github.com/gorilla/mux"
	"github.com/vtphatt2/EduForces/controllers"
)

// RegisterRoutes sets up all the routes for the application.
func RegisterRoutes(r *mux.Router) {
	// Authentication routes
	r.HandleFunc("/callback", controllers.GoogleCallback).Methods("GET")

	// Route for getting user information
	r.HandleFunc("/api/user", controllers.GetUser).Methods("GET")

	// CRUD routes for items
	r.HandleFunc("/api/items", controllers.GetItems).Methods("GET")
	r.HandleFunc("/api/items/{id}", controllers.GetItem).Methods("GET")
	r.HandleFunc("/api/items", controllers.CreateItem).Methods("POST")
	r.HandleFunc("/api/items/{id}", controllers.UpdateItem).Methods("PUT")
	r.HandleFunc("/api/items/{id}", controllers.DeleteItem).Methods("DELETE")
}
