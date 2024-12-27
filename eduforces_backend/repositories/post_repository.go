package repositories

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
)

type PostRepository struct {
	Queries *sqlc.Queries
}

func NewPostRepository(queries *sqlc.Queries) *PostRepository {
	return &PostRepository{Queries: queries}
}

func (pr *PostRepository) GetAllPosts(ctx context.Context, page, limit int) ([]sqlc.Post, int, error) {
	posts, err := pr.Queries.ListPosts(ctx)
	if err != nil {
		return nil, 0, err
	}
	total := len(posts)
	start := (page - 1) * limit
	end := start + limit
	if start > total {
		return []sqlc.Post{}, total, nil
	}
	if end > total {
		end = total
	}
	return posts[start:end], total, nil
}

func (pr *PostRepository) CreatePost(ctx context.Context, post sqlc.Post) error {
	params := sqlc.CreatePostParams{
		PostID:    post.PostID,
		AuthorID:  post.AuthorID,
		Title:     post.Title,
		Content:   post.Content,
		Timestamp: post.Timestamp,
	}
	return pr.Queries.CreatePost(ctx, params)
}

func (pr *PostRepository) GetPostDetails(ctx context.Context, id uuid.UUID) (sqlc.Post, error) {
	return pr.Queries.GetPost(ctx, id)
}

func (pr *PostRepository) UpdatePost(ctx context.Context, post sqlc.Post) error {
	params := sqlc.UpdatePostContentParams{
		Content: post.Content,
		PostID:  post.PostID,
	}
	return pr.Queries.UpdatePostContent(ctx, params)
}

func (pr *PostRepository) DeletePost(ctx context.Context, id uuid.UUID) error {
	return pr.Queries.DeletePost(ctx, id)
}

func (pr *PostRepository) GetReactionForPost(ctx context.Context, postID, accountID uuid.UUID) (sqlc.Reaction, error) {
	return pr.Queries.GetReactionForPost(ctx, sqlc.GetReactionForPostParams{
		PostID:    uuid.NullUUID{UUID: postID},
		AccountID: uuid.NullUUID{UUID: accountID},
	})
}

func (pr *PostRepository) CountReactionsForPost(ctx context.Context, postID uuid.UUID) (sqlc.CountReactionsForPostRow, error) {
	return pr.Queries.CountReactionsForPost(ctx, uuid.NullUUID{UUID: postID, Valid: true})
}

func (pr *PostRepository) AddReactionForPostOrComment(ctx context.Context, arg sqlc.AddReactionToPostParams) error {
	// Check if the author already voted for that post/comment
	existingReactionID, err := pr.Queries.CheckReactionExists(ctx, sqlc.CheckReactionExistsParams{
		AccountID: arg.AccountID,
		PostID:    arg.PostID,
		CommentID: arg.CommentID,
	})
	if err != nil && err != sql.ErrNoRows {
		// Log the error and return it
		fmt.Println("Error checking existing reaction:", err)
		return err
	}

	// If an existing reaction is found, delete it
	if err == nil && existingReactionID != uuid.Nil {
		err = pr.Queries.DeleteReaction(ctx, existingReactionID)
		if err != nil {
			// Log the error and return it
			fmt.Println("Error deleting existing reaction:", err)
			return err
		}
	}

	// If the reaction type is "UNVOTE", stop here
	if arg.Type.String == "UNVOTE" {
		return nil
	}

	// Add the new reaction
	err = pr.Queries.AddReactionToPost(ctx, arg)
	if err != nil {
		// Log the error and return it
		fmt.Println("Error adding new reaction:", err)
		return err
	}

	return nil
}
