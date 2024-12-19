package initializers

import (
	"os"

	"github.com/vtphatt2/EduForces/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDataBase() {
	println("Start DB")
	var err error

	dsn := os.Getenv("DB_URL")
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	println("Connected to database")

	DB.AutoMigrate(&models.Account{})
}
