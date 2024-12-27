package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/helpers"
	"github.com/vtphatt2/EduForces/services"
	"github.com/vtphatt2/EduForces/sessions"
)

type CommentController struct {
	CommentService *services.CommentService
	SessionManager *sessions.SessionManager
}

func NewCommentController(commentService *services.CommentService, sessionManager *sessions.SessionManager) *CommentController {
	return &CommentController{CommentService: commentService, SessionManager: sessionManager}
}

func (cc *CommentController) GetAllCommentsForPost(c *gin.Context) {
	postID := c.Param("id")
	fmt.Println(("GetAllCommentsForPost"))
	fmt.Println("postID=", postID)
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page parameter"})
		return
	}
	size, err := strconv.Atoi(c.DefaultQuery("size", "10"))
	if err != nil || size < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid size parameter"})
		return
	}

	comments, err := cc.CommentService.GetAllCommentsForPost(c.Request.Context(), uuid.MustParse(postID), page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": comments})
}

func (cc *CommentController) CreateComment(c *gin.Context) {
	var comment services.CreateCommentRequest
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	helpers.ConvertUserIDToUUID(c)

	accountID, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	// postID get from the json body
	postID := c.Param("id")
	fmt.Println(postID)

	newComment, err := cc.CommentService.CreateComment(c.Request.Context(), uuid.MustParse(accountID.(string)), uuid.MustParse(postID), comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newComment)
}

func (cc *CommentController) UpdateComment(c *gin.Context) {
	id := c.Param("id")
	var comment services.UpdateCommentRequest
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	updatedComment, err := cc.CommentService.UpdateComment(c.Request.Context(), uuid.MustParse(id), comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedComment)
}

func (cc *CommentController) DeleteComment(c *gin.Context) {
	id := c.Param("id")
	err := cc.CommentService.DeleteComment(c.Request.Context(), uuid.MustParse(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
