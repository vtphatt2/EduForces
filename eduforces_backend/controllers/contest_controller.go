package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/helpers"
	"github.com/vtphatt2/EduForces/services"
)

type ContestController struct {
	ContestService *services.ContestService
}

func NewContestController(contestService *services.ContestService) *ContestController {
	return &ContestController{ContestService: contestService}
}

func (cc *ContestController) CreateContest(c *gin.Context) {
	var contest services.CreateContestRequest
	if err := c.ShouldBindJSON(&contest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	helpers.ConvertUserIDToUUID(c)

	accountID, exists := c.Get("accountID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	newContest, err := cc.ContestService.CreateContest(c.Request.Context(), contest, accountID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newContest)
}
