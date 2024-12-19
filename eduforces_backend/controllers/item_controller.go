package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

// Item represents a simple data model
type Item struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Value string `json:"value"`
}

// In-memory store for items
var items = make(map[string]Item)

// GetItems handles GET requests to retrieve all items
func GetItems(w http.ResponseWriter, r *http.Request) {
	var itemList []Item
	for _, item := range items {
		itemList = append(itemList, item)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(itemList)
}

// GetItem handles GET requests to retrieve a single item by ID
func GetItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	item, exists := items[id]
	if !exists {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// CreateItem handles POST requests to create a new item
func CreateItem(w http.ResponseWriter, r *http.Request) {
	var item Item
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	items[item.ID] = item
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// UpdateItem handles PUT requests to update an existing item
func UpdateItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	var item Item
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if _, exists := items[id]; !exists {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}
	item.ID = id
	items[id] = item
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// DeleteItem handles DELETE requests to delete an item
func DeleteItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if _, exists := items[id]; !exists {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}
	delete(items, id)
	w.WriteHeader(http.StatusNoContent)
}
