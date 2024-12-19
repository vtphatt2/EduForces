package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoleEnum string

const (
	RoleAdmin       RoleEnum = "Admin"
	RoleCoordinator RoleEnum = "Coordinator"
	RoleUser        RoleEnum = "User"
)

type Account struct {
	AccountID uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()" json:"account_id"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Name      string    `gorm:"size:255;not null" json:"name"`
	Role      RoleEnum  `gorm:"type:varchar(20); default:'User'" json:"role"`
}

func (a *Account) BeforeCreate(tx *gorm.DB) (err error) {
	a.AccountID = uuid.New()
	return
}

// If I models/AccountModel/account_model.go, should it is package models or package AccountModel?
