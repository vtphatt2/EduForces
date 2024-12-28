package controllers

import (
	"context"
	"net/http"

	"github.com/vtphatt2/EduForces/services"

	"github.com/gin-gonic/gin"
)

type AccountController struct {
	service *services.AccountService
}

func NewAccountController(service *services.AccountService) *AccountController {
	return &AccountController{service: service}
}

// CreateAccountIfNotExistHandler handles account creation if it doesn't already exist
func (ctrl *AccountController) CreateAccountIfNotExistHandler(c *gin.Context) {
	var payload struct {
		Email string `json:"email" binding:"required"`
		Name  string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	err := ctrl.service.CreateAccountIfNotExist(context.Background(), payload.Email, payload.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Account created successfully or already exists"})
}
