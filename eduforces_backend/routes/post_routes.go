package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterPostRoutes(router *gin.Engine, postCtrl *controllers.PostController, commentCtrl *controllers.CommentController, sessionMiddleware gin.HandlerFunc) {
	postRoutes := router.Group("/api/v1/posts")
	{
		postRoutes.GET("", sessionMiddleware, postCtrl.GetAllPosts)

		postRoutes.GET("/:id/comments", sessionMiddleware, commentCtrl.GetAllCommentsForPost)
		postRoutes.POST("/:id/comments", sessionMiddleware, commentCtrl.CreateComment)

		postRoutes.PUT("/:id/comments/:commentId", sessionMiddleware, commentCtrl.UpdateComment)
		postRoutes.DELETE("/:id/comments/:commentId", sessionMiddleware, commentCtrl.DeleteComment)
		postRoutes.POST("/:id/comments/:commentId/add-reaction", sessionMiddleware, postCtrl.AddReactionForPostOrComment)
		postRoutes.POST("/:id/add-reaction", sessionMiddleware, postCtrl.AddReactionForPostOrComment)

		postRoutes.POST("/", sessionMiddleware, postCtrl.CreatePost)
		postRoutes.GET("/:id", sessionMiddleware, postCtrl.GetPostDetails)
		postRoutes.GET("/:id/count-reaction", sessionMiddleware, postCtrl.CountReactionsForPost)
		postRoutes.PUT("/:id", sessionMiddleware, postCtrl.UpdatePost)
		postRoutes.DELETE("/:id", sessionMiddleware, postCtrl.DeletePost)
	}
}
