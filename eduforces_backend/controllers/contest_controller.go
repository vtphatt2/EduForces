package controllers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	newContest, err := cc.ContestService.CreateContest(c.Request.Context(), contest, uuid.MustParse(user.(string)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newContest)
}

func (cc *ContestController) ListContests(c *gin.Context) {
	fmt.Println("GetContest function called")
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	contests, err := cc.ContestService.ListContests(c.Request.Context(), uuid.MustParse(user.(string)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, contests)

}

func (cc *ContestController) GetContest(c *gin.Context) {
	fmt.Println("GetContest function called")
	contestID := c.Param("id")
	if contestID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Contest ID is required"})
		return
	}

	contest, err := cc.ContestService.GetContest(c.Request.Context(), uuid.MustParse(contestID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, contest)
}
func (cc *ContestController) ScheduleContestStatusUpdates(c context.Context) {
	cc.ContestService.ScheduleContestStatusUpdates(c)
}

func (cc *ContestController) DeleteContest(c *gin.Context) {
	contestID := c.Param("id")
	if contestID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Contest ID is required"})
		return
	}

	err := cc.ContestService.DeleteContest(c.Request.Context(), uuid.MustParse(contestID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contest deleted successfully"})
}
