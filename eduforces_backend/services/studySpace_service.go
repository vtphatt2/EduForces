package services

import (
	// "context"
	// "log"
	// "time"

	// "github.com/google/uuid"
	// "github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repositories"
)

type StudySpaceService struct {
	AccountRepository  *repositories.AccountRepository
	QuestionRepository *repositories.QuestionRepository
}

type CreateStudySpaceRequest struct {
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Questions   []Question `json:"questions"`
}

func NewStudySpaceService(accountRepository *repositories.AccountRepository, questionRepository *repositories.QuestionRepository) *StudySpaceService {
	return &StudySpaceService{

		AccountRepository:  accountRepository,
		QuestionRepository: questionRepository,
	}
}
