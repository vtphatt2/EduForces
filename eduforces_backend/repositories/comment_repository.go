package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
)

type CommentRepository struct {
	Queries *sqlc.Queries
}

func NewCommentRepository(queries *sqlc.Queries) *CommentRepository {
	return &CommentRepository{Queries: queries}
}

func (cr *CommentRepository) GetAllCommentsForPost(ctx context.Context, postID uuid.UUID, limit, offset int) ([]sqlc.Comment, error) {
	return cr.Queries.GetCommentsForPost(ctx, sqlc.GetCommentsForPostParams{
		PostID: uuid.NullUUID{UUID: postID, Valid: true},
		Limit:  int32(limit),
		Offset: int32(offset),
	})
}

func (cr *CommentRepository) GetCommentDetails(ctx context.Context, id uuid.UUID) (sqlc.Comment, error) {
	return cr.Queries.GetCommentDetails(ctx, id)
}

func (cr *CommentRepository) CreateComment(ctx context.Context, comment sqlc.Comment) error {
	params := sqlc.AddCommentToPostParams{
		CommentID:       comment.CommentID,
		AuthorID:        comment.AuthorID,
		Content:         comment.Content,
		Timestamp:       comment.Timestamp,
		PostID:          comment.PostID,
		ParentCommentID: comment.ParentCommentID,
	}
	return cr.Queries.AddCommentToPost(ctx, params)
}

func (cr *CommentRepository) UpdateComment(ctx context.Context, comment sqlc.Comment) error {
	params := sqlc.UpdateCommentParams{
		Content:   comment.Content,
		CommentID: comment.CommentID,
	}
	return cr.Queries.UpdateComment(ctx, params)
}

func (cr *CommentRepository) DeleteComment(ctx context.Context, id uuid.UUID) error {
	return cr.Queries.DeleteComment(ctx, id)
}

func (cr *CommentRepository) GetReactionForComment(ctx context.Context, commentID, accountID uuid.UUID) (sqlc.Reaction, error) {
	return cr.Queries.GetReactionForComment(ctx, sqlc.GetReactionForCommentParams{
		CommentID: uuid.NullUUID{UUID: commentID, Valid: true},
		AccountID: uuid.NullUUID{UUID: accountID, Valid: true},
	})
}

func (cr *CommentRepository) CountReactionsForComment(ctx context.Context, commentID uuid.UUID) (sqlc.CountReactionsForCommentRow, error) {
	return cr.Queries.CountReactionsForComment(ctx, uuid.NullUUID{UUID: commentID, Valid: true})
}

func (cr *CommentRepository) GetCommentsForComment(ctx context.Context, parentCommentID uuid.UUID) ([]sqlc.Comment, error) {
	return cr.Queries.GetCommentsForComment(ctx, uuid.NullUUID{UUID: parentCommentID, Valid: true})
}
