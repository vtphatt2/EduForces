package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repositories"
)

type CommentService struct {
	CommentRepository *repositories.CommentRepository
	AccountRepository *repositories.AccountRepository
}

func NewCommentService(commentRepository *repositories.CommentRepository, accountRepository *repositories.AccountRepository) *CommentService {
	return &CommentService{CommentRepository: commentRepository, AccountRepository: accountRepository}
}

type CreateCommentRequest struct {
	Content string `json:"content"`
}

type UpdateCommentRequest struct {
	Content string `json:"content"`
}

func (cs *CommentService) GetAllCommentsForPost(ctx context.Context, postID uuid.UUID, page, size int) ([]sqlc.Comment, error) {
	offset := (page - 1) * size
	return cs.CommentRepository.GetAllCommentsForPost(ctx, postID, size, offset)
}

func (cs *CommentService) CreateComment(ctx context.Context, authorID, postID uuid.UUID, req CreateCommentRequest) (sqlc.Comment, error) {
	comment := sqlc.Comment{
		CommentID: uuid.New(),
		AuthorID:  uuid.NullUUID{UUID: authorID, Valid: true},
		Content:   req.Content,
		Timestamp: time.Now(),
		PostID:    uuid.NullUUID{UUID: postID, Valid: true},
	}
	err := cs.CommentRepository.CreateComment(ctx, comment)
	if err != nil {
		return sqlc.Comment{}, err
	}
	return comment, nil
}

func (cs *CommentService) UpdateComment(ctx context.Context, id uuid.UUID, req UpdateCommentRequest) (sqlc.Comment, error) {
	comment, err := cs.CommentRepository.GetCommentDetails(ctx, id)
	if err != nil {
		return sqlc.Comment{}, err
	}
	comment.Content = req.Content
	err = cs.CommentRepository.UpdateComment(ctx, comment)
	if err != nil {
		return sqlc.Comment{}, err
	}
	return comment, nil
}

func (cs *CommentService) DeleteComment(ctx context.Context, id uuid.UUID) error {
	return cs.CommentRepository.DeleteComment(ctx, id)
}

func (cs *CommentService) CountReactionsForComment(ctx context.Context, commentID uuid.UUID) (sqlc.CountReactionsForCommentRow, error) {
	return cs.CommentRepository.CountReactionsForComment(ctx, commentID)
}
