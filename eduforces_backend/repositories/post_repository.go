package repositories

import (
	"context"

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
