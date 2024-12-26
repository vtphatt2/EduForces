package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterPostRoutes(router *gin.Engine, postCtrl *controllers.PostController, sessionMiddleware gin.HandlerFunc) {
	postRoutes := router.Group("/api/v1/posts")
	{
		postRoutes.GET("/", sessionMiddleware, postCtrl.GetAllPosts)
		postRoutes.POST("/", sessionMiddleware, postCtrl.CreatePost)
		postRoutes.GET("/:id", sessionMiddleware, postCtrl.GetPostDetails)
		postRoutes.PUT("/:id", sessionMiddleware, postCtrl.UpdatePost)
		postRoutes.DELETE("/:id", sessionMiddleware, postCtrl.DeletePost)
	}
}
