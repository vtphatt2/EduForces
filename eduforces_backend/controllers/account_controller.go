package controllers

import (
	"github.com/vtphatt2/EduForces/initializers"
	"github.com/vtphatt2/EduForces/models"
	"gorm.io/gorm"
)

func UpdateOrCreateAccount(userInfo *GoogleUserInfo) error {
	db := initializers.DB
	var account models.Account

	// Check if account exists
	err := db.First(&account, "email = ?", userInfo.Email).Error
	if err == gorm.ErrRecordNotFound {
		// Create a new account
		account = models.Account{
			Email: userInfo.Email,
			Name:  userInfo.Name,
			Role:  models.RoleUser,
		}
		return db.Create(&account).Error
	} else if err != nil {
		return err
	}

	// Update existing account
	account.Name = userInfo.Name
	return db.Save(&account).Error
}
