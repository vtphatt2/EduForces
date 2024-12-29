package controllers

import (
	"context"
	"fmt"
	"log"
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

func (cc *ContestController) FilterQuestions(c *gin.Context) {
	var request struct {
		Subjects []string `json:"subjects" binding:"required"`
		Done     int32    `json:"done"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	fmt.Println("donecontrol=", request.Done)
	questions, err := cc.ContestService.FilterQuestions(c.Request.Context(), services.FilterQuestionsParams{
		Subjects:  request.Subjects,
		AccountID: uuid.MustParse(user.(string)),
		Done:      request.Done,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, questions)
}

func (cc *ContestController) UpdateUserDoneStatus(c *gin.Context) {
	var request struct {
		QuestionID string `json:"question_id" binding:"required,uuid"`
		Done       int32  `json:"done" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	questionID, err := uuid.Parse(request.QuestionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	err = cc.ContestService.UpdateUserDoneStatus(context.Background(), uuid.MustParse(user.(string)), questionID, request.Done)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
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
func (cc *ContestController) UpdateContest(c *gin.Context) {
	var req services.UpdateContestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contestID := c.Param("id")
	if contestID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Contest ID is required"})
		return
	}

	updateReq := services.UpdateContestRequestParam{
		ContestID:   uuid.MustParse(contestID),
		Name:        req.Name,
		Description: req.Description,
		StartTime:   req.StartTime,
		Duration:    req.Duration,
		Difficulty:  req.Difficulty,
		Questions:   req.Questions,
	}

	err := cc.ContestService.UpdateContest(c.Request.Context(), updateReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contest updated successfully"})
}
func (cc *ContestController) SubmitContest(c *gin.Context) {
	log.Println("SubmitContest called")
	contestID := c.Param("id")
	if contestID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Contest ID is required"})
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	var submission services.Submission
	if err := c.ShouldBindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Submission received: %+v\n", submission)

	submissionParams, err := cc.ContestService.SubmitContest(c.Request.Context(), uuid.MustParse(contestID), uuid.MustParse(user.(string)), submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, submissionParams)
}
