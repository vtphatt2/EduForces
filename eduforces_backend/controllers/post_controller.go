package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/services"
)

type PostController struct {
	PostService *services.PostService
}

func NewPostController(postService *services.PostService) *PostController {
	return &PostController{PostService: postService}
}

func (pc *PostController) GetAllPosts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	posts, meta, err := pc.PostService.GetAllPosts(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": posts, "meta": meta})
}

func (pc *PostController) CreatePost(c *gin.Context) {
	var post services.CreatePostRequest
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	newPost, err := pc.PostService.CreatePost(c.Request.Context(), uuid.MustParse(user.(string)), post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, newPost)
}

func (pc *PostController) GetPostDetails(c *gin.Context) {
	id := c.Param("id")
	post, err := pc.PostService.GetPostDetails(c.Request.Context(), uuid.MustParse(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, post)
}

func (pc *PostController) UpdatePost(c *gin.Context) {
	id := c.Param("id")
	var post services.UpdatePostRequest
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	updatedPost, err := pc.PostService.UpdatePost(c.Request.Context(), uuid.MustParse(id), post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedPost)
}

func (pc *PostController) DeletePost(c *gin.Context) {
	id := c.Param("id")
	err := pc.PostService.DeletePost(c.Request.Context(), uuid.MustParse(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

func (pc *PostController) AddReactionForPostOrComment(c *gin.Context) {
	var request struct {
		ReactionType string `json:"reaction_type"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	postIDParam := c.Param("id")
	var postID uuid.UUID
	if postIDParam != "" {
		var err error
		postID, err = uuid.Parse(postIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post_id"})
			return
		}
	}

	commentIDParam := c.Param("commentId")
	var commentID uuid.UUID
	if commentIDParam != "" {
		var err error
		commentID, err = uuid.Parse(commentIDParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment_id"})
			return
		}

		postID = uuid.UUID{}
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		c.Abort()
		return
	}

	err := pc.PostService.AddReactionForPostOrComment(c.Request.Context(), uuid.MustParse(user.(string)), postID, commentID, request.ReactionType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reaction added successfully"})
}

func (pc *PostController) CountReactionsForPost(c *gin.Context) {
	id := c.Param("id")
	count, err := pc.PostService.CountReactionsForPost(c.Request.Context(), uuid.MustParse(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": count})
}
