package services

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repositories"
)

type ContestService struct {
	ContestRepository  *repositories.ContestRepository
	QuestionRepository *repositories.QuestionRepository
	AccountRepository  *repositories.AccountRepository
}

type Question struct {
	Description   string    `json:"description"`
	Answers       []string  `json:"answers"`
	CorrectAnswer string    `json:"correct_answer"`
	UpdatedAt     time.Time `json:"updated_at"`
	Subject       string    `json:"subject"`
}

type CreateContestRequest struct {
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Duration    int64      `json:"duration"`
	Difficulty  int32      `json:"difficulty"`
	Questions   []Question `json:"questions"`
}

func NewContestService(ContestRepository *repositories.ContestRepository, QuestionRepository *repositories.QuestionRepository, AccountRepository *repositories.AccountRepository) *ContestService {
	return &ContestService{
		ContestRepository:  ContestRepository,
		QuestionRepository: QuestionRepository,
		AccountRepository:  AccountRepository}
}

func (s *ContestService) CreateContest(ctx context.Context, req CreateContestRequest, accountID uuid.UUID) (sqlc.CreateContestParams, error) {

	account, err := s.AccountRepository.GetAccount(ctx, accountID)
	if err != nil {
		log.Fatal("Cannot find account id")
		return sqlc.CreateContestParams{}, err
	}

	contestParams := sqlc.CreateContestParams{
		ContestID:   uuid.New(),
		Name:        req.Name,
		Description: req.Description,
		UploadTime:  time.Now(),
		Duration:    req.Duration,
		Difficulty:  req.Difficulty,
		Author:      account.Name,
		UpdatedAt:   time.Now(),
	}

	// Create contest in db
	err = s.ContestRepository.CreateContest(ctx, contestParams)
	if err != nil {
		log.Fatal("CreateContest in db failed.")
		return sqlc.CreateContestParams{}, err
	}

	// Iterate each question
	questions := req.Questions
	subjectCount := map[string]int32{
		"Math":      0,
		"Physics":   0,
		"Chemistry": 0,
		"Biology":   0,
		"History":   0,
		"Geography": 0,
		"English":   0,
	}
	for _, question := range questions {
		var questionTag string = "" + question.Subject + "-"
		subject := question.Subject
		if subjectCount[subject] != 0 {
			subjectCount[subject] += 1
		} else {
			if exists, err := s.QuestionRepository.CheckContestExistsWithSubject(ctx, subject); err != nil {
				return sqlc.CreateContestParams{}, err
			} else if exists {
				q, err := s.QuestionRepository.GetLatestQuestionWithSubject(ctx, subject)
				if err != nil {
					return sqlc.CreateContestParams{}, err
				}
				index := strings.Index(q.QuestionTag, "-")
				substr := q.QuestionTag[index:]
				num, err := strconv.Atoi(substr)
				if err != nil {
					return sqlc.CreateContestParams{}, err
				}
				subjectCount[subject] = (int32)(num + 1)
			} else
		}

		questionParam := sqlc.CreateQuestionParams{
			ContestID:     uuid.NullUUID{UUID: contestParams.ContestID, Valid: true},
			Description:   question.Description,
			Answers:       question.Answers,
			CorrectAnswer: question.CorrectAnswer,
			UpdatedAt:     question.UpdatedAt,
			Subject:       question.Subject,
			QuestionTag:   fmt.Sprintf("%s%d", questionTag, subjectCount[subject]),
		}
		// Create question in db
		err = s.QuestionRepository.CreateQuestion(ctx, questionParam)
		if err != nil {
			return sqlc.CreateContestParams{}, err
		}
	}

	return contestParams, nil
}

func (s *ContestService) GetContest(ctx context.Context, contestID uuid.UUID) (*sqlc.Contest, error) {
	return s.ContestRepository.GetContest(ctx, contestID)
}

func (s *ContestService) UpdateContestDescription(ctx context.Context, contestID uuid.UUID, description string) error {
	updatedAt := time.Now()

	params := sqlc.UpdateContestDescriptionParams{
		Description: description,
		UpdatedAt:   updatedAt,
		ContestID:   contestID,
	}

	return s.ContestRepository.UpdateContestDescription(ctx, params)
}

func (s *ContestService) ListContests(ctx context.Context) ([]sqlc.Contest, error) {
	return s.ContestRepository.ListContests(ctx)
}

func (s *ContestService) DeleteContest(ctx context.Context, contestID uuid.UUID) error {
	return s.ContestRepository.DeleteContest(ctx, contestID)
}

func (s *ContestService) GetContestDetails(ctx context.Context, contestID uuid.UUID) (*sqlc.ContestDetail, error) {
	return s.ContestRepository.GetContestDetails(ctx, contestID)
}

func (s *ContestService) AddContestDetail(ctx context.Context, contestID uuid.UUID, isPublic bool) error {
	contestDetailID := uuid.New()

	params := sqlc.AddContestDetailParams{
		ContestDetailID: contestDetailID,
		ContestID:       uuid.NullUUID{},
		IsPublic:        isPublic,
	}

	return s.ContestRepository.AddContestDetail(ctx, params)
}

func (s *ContestService) AddContestQuestion(ctx context.Context, contestDetailID, questionID uuid.UUID) error {
	params := sqlc.AddContestQuestionParams{
		ContestDetailID: contestDetailID,
		QuestionID:      questionID,
	}

	return s.ContestRepository.AddContestQuestion(ctx, params)
}

func (s *ContestService) GetContestQuestions(ctx context.Context, contestDetailID uuid.UUID) ([]sqlc.Question, error) {
	return s.ContestRepository.GetContestQuestions(ctx, contestDetailID)
}

func (s *ContestService) RegisterForContest(ctx context.Context, accountID, contestID uuid.NullUUID) error {
	registrationID := uuid.New()
	registrationTime := time.Now()

	params := sqlc.RegisterForContestParams{
		RegistrationID:   registrationID,
		AccountID:        accountID,
		ContestID:        contestID,
		RegistrationTime: registrationTime,
	}

	return s.ContestRepository.RegisterForContest(ctx, params)
}

func (s *ContestService) GetContestRegistrations(ctx context.Context, contestID uuid.UUID) ([]sqlc.ContestRegistration, error) {
	return s.ContestRepository.GetContestRegistrations(ctx, contestID)
}
