package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/vtphatt2/EduForces/controllers"
)

func RegisterContestRoutes(router *gin.Engine, contestCtrl *controllers.ContestController, sessionMiddleware gin.HandlerFunc) {
	contestRoutes := router.Group("/api/v1/contests")
	{
		contestRoutes.GET("", sessionMiddleware, contestCtrl.ListContests)
		contestRoutes.GET("/:id", sessionMiddleware, contestCtrl.GetContest)
		contestRoutes.POST("", sessionMiddleware, contestCtrl.CreateContest)
		contestRoutes.POST("/submit/:id", sessionMiddleware, contestCtrl.SubmitContest)
		contestRoutes.DELETE("/:id", sessionMiddleware, contestCtrl.DeleteContest)
		contestRoutes.PUT("/:id", sessionMiddleware, contestCtrl.UpdateContest)
	}
}
