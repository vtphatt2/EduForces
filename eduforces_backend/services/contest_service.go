package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/robfig/cron/v3"
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
	StartTime   time.Time  `json:"start_time"`
	Duration    int32      `json:"duration"`
	Difficulty  int32      `json:"difficulty"`
	Questions   []Question `json:"questions"`
}

type UpdateContestRequest struct {
	Name        string     `json:"name"`
	Description string     `json:"description"`
	StartTime   time.Time  `json:"start_time"`
	Duration    int32      `json:"duration"`
	Difficulty  int32      `json:"difficulty"`
	Questions   []Question `json:"questions"`
}

type UpdateContestRequestParam struct {
	ContestID   uuid.UUID `json:"contest_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	Duration    int32     `json:"duration"`
	Difficulty  int32     `json:"difficulty"`

	Questions []Question `json:"questions"`
}

type Contest struct {
	ContestID   uuid.UUID     `json:"contest_id"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	StartTime   time.Time     `json:"start_time"`
	Duration    int32         `json:"duration"`
	Difficulty  int32         `json:"difficulty"`
	AuthorID    uuid.NullUUID `json:"author_id"`
	UpdatedAt   time.Time     `json:"updated_at"`
	Questions   []Question    `json:"questions"`
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

	if account.Role != sqlc.RoleEnumCoordinator {
		return sqlc.CreateContestParams{}, errors.New("only coordinator can create contest")
	}

	contestParams := sqlc.CreateContestParams{
		ContestID:   uuid.New(),
		Name:        req.Name,
		Description: req.Description,
		StartTime:   req.StartTime,
		Duration:    req.Duration,
		Difficulty:  req.Difficulty,
		AuthorID:    uuid.NullUUID{UUID: account.AccountID, Valid: true},
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
				log.Println("Error checking if contest exists with subject:", err)
				return sqlc.CreateContestParams{}, err
			} else if exists {
				q, err := s.QuestionRepository.GetLatestQuestionWithSubject(ctx, subject)
				if err != nil {
					log.Println("Error getting latest question with subject:", err)
					return sqlc.CreateContestParams{}, err
				}
				index := strings.Index(q.QuestionTag, "-")
				substr := q.QuestionTag[index+1:]
				num, err := strconv.Atoi(substr)
				if err != nil {
					log.Println("Error converting substring to integer:", substr, err)
					return sqlc.CreateContestParams{}, err
				}
				subjectCount[subject] = (int32)(num)
			}
			subjectCount[subject] += 1
		}

		questionParam := sqlc.CreateQuestionParams{
			ContestID:     uuid.NullUUID{UUID: contestParams.ContestID, Valid: true},
			Description:   question.Description,
			Answers:       question.Answers,
			CorrectAnswer: question.CorrectAnswer,
			UpdatedAt:     time.Now(),
			Subject:       question.Subject,
			QuestionTag:   fmt.Sprintf("%s%d", questionTag, subjectCount[subject]),
		}
		// Create question in db
		err = s.QuestionRepository.CreateQuestion(ctx, questionParam)
		if err != nil {
			log.Println("Error creating question in db:", err)
			return sqlc.CreateContestParams{}, err
		}
	}

	return contestParams, nil
}

func (s *ContestService) GetContest(ctx context.Context, contestID uuid.UUID) (Contest, error) {
	contest, err := s.ContestRepository.GetContest(ctx, contestID)
	if err != nil {
		return Contest{}, err
	}

	questions, err := s.QuestionRepository.ListQuestionOfContest(ctx, uuid.NullUUID{UUID: contestID, Valid: true})
	if err != nil {
		return Contest{}, err
	}

	var questionList []Question
	for _, q := range questions {
		questionList = append(questionList, Question{
			Description:   q.Description,
			Answers:       q.Answers,
			CorrectAnswer: q.CorrectAnswer,
			UpdatedAt:     q.UpdatedAt,
			Subject:       q.Subject,
		})
	}

	return Contest{
		ContestID:   contest.ContestID,
		Name:        contest.Name,
		Description: contest.Description,
		StartTime:   contest.StartTime,
		Duration:    contest.Duration,
		Difficulty:  contest.Difficulty,
		AuthorID:    contest.AuthorID,
		UpdatedAt:   contest.UpdatedAt,
		Questions:   questionList,
	}, nil
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

func (s *ContestService) ListContests(ctx context.Context, accountID uuid.UUID) ([]sqlc.Contest, error) {
	account, err := s.AccountRepository.GetAccount(ctx, accountID)
	if err != nil {
		log.Fatal("Cannot find account id")
		return nil, err
	}

	switch account.Role {
	case sqlc.RoleEnumAdmin:
		return s.ContestRepository.ListContests(ctx)
	case sqlc.RoleEnumCoordinator:
		authorID := uuid.NullUUID{UUID: accountID, Valid: true}
		return s.ContestRepository.ListContestsOfAuthor(ctx, authorID)
	case sqlc.RoleEnumUser:
		return s.ContestRepository.ListContests(ctx)
	default:
		return nil, fmt.Errorf("unknown role: %s", account.Role)
	}
}

func (s *ContestService) DeleteContest(ctx context.Context, contestID uuid.UUID) error {
	// Get the contest by contestID
	contest, err := s.ContestRepository.GetContest(ctx, contestID)
	if err != nil {
		return err
	}
	if contest == nil {
		return errors.New("contest not found")
	}

	// Delete all questions of this contest
	err = s.QuestionRepository.DeleteQuestionsByContestId(ctx, uuid.NullUUID{UUID: contestID, Valid: true})
	if err != nil {
		return err
	}

	// Delete the contest
	return s.ContestRepository.DeleteContest(ctx, contestID)
}

func (s *ContestService) ScheduleContestStatusUpdates(ctx context.Context) {
	c := cron.New()

	// Schedule function to update Pending contests to Live
	c.AddFunc("@every 1s", func() {
		log.Println("Updating Pending contests to Live")
		s.updatePendingContestsToLive(context.Background())
	})

	// Schedule function to update Live contests to Ended
	c.AddFunc("@every 1s", func() {
		log.Println("Updating Live contests to Ended")
		s.updateLiveContestsToEnded(context.Background())
	})

	c.Start()
}

func (s *ContestService) updatePendingContestsToLive(ctx context.Context) {
	contests, err := s.ContestRepository.ListContestsByStatus(ctx, sqlc.StatusEnumPending)
	if err != nil {
		log.Println("Error listing pending contests:", err)
		return
	}

	for _, contest := range contests {
		log.Printf("Checking contest: %s with start time: %s", contest.ContestID, contest.StartTime)
		log.Println("Current time:", time.Now())
		if contest.StartTime.Before(time.Now()) {
			// log.Println("Current time:", time.Now())
			log.Printf("Updating contest: %s to Live", contest.ContestID)
			err := s.ContestRepository.UpdateContestStatus(ctx, sqlc.UpdateContestStatusParams{
				Status:    sqlc.StatusEnumLive,
				ContestID: contest.ContestID,
			})
			if err != nil {
				log.Println("Error updating contest status to Live:", err)
			} else {
				log.Printf("Successfully updated contest: %s to Live", contest.ContestID)
			}
		}
	}
}

func (s *ContestService) updateLiveContestsToEnded(ctx context.Context) {
	contests, err := s.ContestRepository.ListContestsByStatus(ctx, sqlc.StatusEnumLive)
	if err != nil {
		log.Println("Error listing live contests:", err)
		return
	}

	for _, contest := range contests {
		log.Printf("Checking contest: %s with end time: %s", contest.ContestID, contest.StartTime.Add(time.Duration(contest.Duration)*time.Minute))
		if contest.StartTime.Add(time.Duration(contest.Duration) * time.Minute).Before(time.Now()) {
			log.Printf("Updating contest: %s to Ended", contest.ContestID)
			err := s.ContestRepository.UpdateContestStatus(ctx, sqlc.UpdateContestStatusParams{
				Status:    sqlc.StatusEnumEnded,
				ContestID: contest.ContestID,
			})
			if err != nil {
				log.Println("Error updating contest status to Ended:", err)
			} else {
				log.Printf("Successfully updated contest: %s to Ended", contest.ContestID)
				err := s.QuestionRepository.UpdateQuestionToPublic(ctx, uuid.NullUUID{UUID: contest.ContestID, Valid: true})
				if err != nil {
					log.Println("Error updating questions to public:", err)
				} else {
					log.Printf("Successfully updated questions of contest: %s to public", contest.ContestID)
				}
			}
		}
	}
}
func (s *ContestService) UpdateContest(ctx context.Context, req UpdateContestRequestParam) error {
	// Extract the contest ID
	contestID := req.ContestID

	// Prepare the update contest parameters
	updateParams := sqlc.UpdateContestParams{
		ContestID:   contestID,
		Name:        req.Name,
		Description: req.Description,
		StartTime:   req.StartTime,
		Duration:    req.Duration,
		Difficulty:  req.Difficulty,
		UpdatedAt:   time.Now(),
	}

	// Update the contest in the database
	err := s.ContestRepository.UpdateContest(ctx, updateParams)
	if err != nil {
		return fmt.Errorf("failed to update contest: %w", err)
	}

	// Delete all questions associated with the contest
	err = s.QuestionRepository.DeleteQuestionsByContestId(ctx, uuid.NullUUID{UUID: contestID, Valid: true})
	if err != nil {
		return fmt.Errorf("failed to delete questions: %w", err)
	}

	// Iterate each question and create them in the database
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
				return fmt.Errorf("error checking if contest exists with subject: %w", err)
			} else if exists {
				q, err := s.QuestionRepository.GetLatestQuestionWithSubject(ctx, subject)
				if err != nil {
					return fmt.Errorf("error getting latest question with subject: %w", err)
				}
				index := strings.Index(q.QuestionTag, "-")
				substr := q.QuestionTag[index+1:]
				num, err := strconv.Atoi(substr)
				if err != nil {
					return fmt.Errorf("error converting substring to integer: %w", err)
				}
				subjectCount[subject] = int32(num)
			}
			subjectCount[subject] += 1
		}

		questionParam := sqlc.CreateQuestionParams{
			ContestID:     uuid.NullUUID{UUID: contestID, Valid: true},
			Description:   question.Description,
			Answers:       question.Answers,
			CorrectAnswer: question.CorrectAnswer,
			UpdatedAt:     time.Now(),
			Subject:       question.Subject,
			QuestionTag:   fmt.Sprintf("%s%d", questionTag, subjectCount[subject]),
		}
		// Create question in db
		err = s.QuestionRepository.CreateQuestion(ctx, questionParam)
		if err != nil {
			return fmt.Errorf("error creating question in db: %w", err)
		}
	}

	return nil
}
