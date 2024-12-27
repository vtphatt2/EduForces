package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/vtphatt2/EduForces/models/sqlc"
	"github.com/vtphatt2/EduForces/repositories"
)

type PostService struct {
	PostRepository    *repositories.PostRepository
	AccountRepository *repositories.AccountRepository
}

func NewPostService(postRepository *repositories.PostRepository, accountRepository *repositories.AccountRepository) *PostService {
	return &PostService{PostRepository: postRepository, AccountRepository: accountRepository}
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type UpdatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func (ps *PostService) GetAllPosts(ctx context.Context, page, limit int) ([]sqlc.Post, map[string]int, error) {
	posts, total, err := ps.PostRepository.GetAllPosts(ctx, page, limit)
	if err != nil {
		return nil, nil, err
	}
	meta := map[string]int{
		"total": total,
		"page":  page,
		"limit": limit,
	}
	return posts, meta, nil
}

func (ps *PostService) CreatePost(ctx context.Context, accountID uuid.UUID, req CreatePostRequest) (sqlc.Post, error) {

	post := sqlc.Post{
		PostID:    uuid.New(),
		AuthorID:  uuid.NullUUID{UUID: accountID, Valid: true},
		Title:     req.Title,
		Content:   req.Content,
		Timestamp: time.Now(),
	}
	err := ps.PostRepository.CreatePost(ctx, post)
	if err != nil {
		return sqlc.Post{}, err
	}
	return post, nil
}

func (ps *PostService) GetPostDetails(ctx context.Context, id uuid.UUID) (sqlc.Post, error) {
	return ps.PostRepository.GetPostDetails(ctx, id)
}

func (ps *PostService) UpdatePost(ctx context.Context, id uuid.UUID, req UpdatePostRequest) (sqlc.Post, error) {
	post, err := ps.PostRepository.GetPostDetails(ctx, id)
	if err != nil {
		return sqlc.Post{}, err
	}
	post.Title = req.Title
	post.Content = req.Content
	err = ps.PostRepository.UpdatePost(ctx, post)
	if err != nil {
		return sqlc.Post{}, err
	}
	return post, nil
}

func (ps *PostService) DeletePost(ctx context.Context, id uuid.UUID) error {
	return ps.PostRepository.DeletePost(ctx, id)
}
