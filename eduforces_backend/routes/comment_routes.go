package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterCommentRoutes(router *gin.Engine, commentCtrl *controllers.CommentController, sessionMiddleware gin.HandlerFunc) {
	// Group for general comment operations
}
