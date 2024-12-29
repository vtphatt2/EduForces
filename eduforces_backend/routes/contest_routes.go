package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterContestRoutes(router *gin.Engine, contestCtrl *controllers.ContestController, sessionMiddleware gin.HandlerFunc) {
	contestRoutes := router.Group("/api/v1/contests")
	{
		// contestRoutes.GET("/", sessionMiddleware, postCtrl.GetAllPosts)
		contestRoutes.POST("", sessionMiddleware, contestCtrl.CreateContest)
		contestRoutes.GET("", sessionMiddleware, contestCtrl.ListContests)
		contestRoutes.GET("/:id", sessionMiddleware, contestCtrl.GetContest)
		// contestRoutes.GET("/:id", sessionMiddleware, postCtrl.GetPostDetails)
		// contestRoutes.PUT("/:id", sessionMiddleware, postCtrl.UpdatePost)
		// contestRoutes.DELETE("/:id", sessionMiddleware, postCtrl.DeletePost)
	}
}
