package controllers

import (
	// "net/http"

	// "github.com/gin-gonic/gin"
	// "github.com/google/uuid"
	// "github.com/vtphatt2/EduForces/helpers"
	"github.com/vtphatt2/EduForces/services"
)

type StudySpaceController struct {
	StudySpaceService *services.StudySpaceService
}

func NewStudySpaceController(studySpaceService *services.StudySpaceService) *StudySpaceController {
	return &StudySpaceController{StudySpaceService: studySpaceService}
}

// func (sc *StudySpaceController) CreateStudySpace(c *gin.Context) {
// 	var studySpace services.CreateStudySpaceRequest
// 	if err := c.ShouldBindJSON(&studySpace); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	helpers.ConvertUserIDToUUID(c)

// 	accountID, exists := c.Get("accountID")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
// 		return
// 	}

// 	newStudySpace, err := sc.StudySpaceService.CreateStudySpace(c.Request.Context(), studySpace, accountID.(uuid.UUID))
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, newStudySpace)
// }
