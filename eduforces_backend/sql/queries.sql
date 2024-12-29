----- Account

-- name: GetAccount :one
SELECT * FROM accounts WHERE account_id = $1;

-- name: GetAccountByEmail :one
SELECT * FROM accounts WHERE email = $1;

-- name: ListAccounts :many
SELECT * FROM accounts;

-- name: CreateAccount :exec
INSERT INTO accounts (email, name, role, avatar_path)
VALUES ($1, $2, $3, $4);

-- name: DeleteAccount :exec
DELETE FROM accounts WHERE account_id = $1;

-- name: UpdateAccountName :exec
UPDATE accounts SET name = $1 WHERE email = $2;

-- name: UpdateAccountUsername :exec
UPDATE accounts SET username = $1 WHERE account_id = $2;

-- name: UpdateAccountAvatar :exec
UPDATE accounts SET avatar_path = $1 WHERE account_id = $2;

-- name: UpdateAccountEloRating :exec
UPDATE accounts SET elo_rating = $1 WHERE account_id = $2;

-- name: UpdateAccountLastActive :exec
UPDATE accounts SET last_active = $1 WHERE account_id = $2;

-- name: UpdateAccountSchool :exec
UPDATE accounts SET school = $1 WHERE account_id = $2;

-- name: UpdateAccountDeactivation :exec
UPDATE accounts SET is_deactivated = $1 WHERE account_id = $2;

-- name: UpdateAvatarPath :exec
UPDATE accounts
SET avatar_path = $1
WHERE account_id = $2;

---- Forum

-- name: GetPost :one
SELECT * FROM posts WHERE post_id = $1;

-- name: ListPosts :many
SELECT * FROM posts;

-- name: CreatePost :exec
INSERT INTO posts (post_id, author_id, title, content, timestamp) VALUES ($1, $2, $3, $4, $5);

-- name: DeletePost :exec
DELETE FROM posts WHERE post_id = $1;

-- name: UpdatePostContent :exec
UPDATE posts SET content = $1 WHERE post_id = $2;

-- -- nameee: GetCommentsForPost :many
-- SELECT * FROM comments WHERE post_id = $1;

-- name: GetCommentsForPost :many
SELECT *
FROM comments
WHERE post_id = $1
ORDER BY timestamp DESC
LIMIT $2 OFFSET $3;

-- name: GetCommentDetails :one
SELECT * FROM comments WHERE comment_id = $1;

-- name: AddCommentToPost :exec
INSERT INTO comments (comment_id, author_id, content, timestamp, post_id, parent_comment_id) VALUES ($1, $2, $3, $4, $5, $6);

-- name: UpdateComment :exec
UPDATE comments SET content = $1 WHERE comment_id = $2;

-- name: DeleteComment :exec
DELETE FROM comments WHERE comment_id = $1;

-- name: GetReactionsForPost :many
SELECT * FROM reactions WHERE post_id = $1;

-- name: AddReactionToPost :exec
INSERT INTO reactions (reaction_id, type, account_id, timestamp, post_id, comment_id) VALUES ($1, $2, $3, $4, $5, $6);

-- name: CheckReactionExists :one
SELECT reaction_id FROM reactions
WHERE account_id = $1 AND (post_id = $2 OR comment_id = $3);

-- name: GetReactionExist :one
SELECT type FROM reactions
WHERE account_id = $1 AND (post_id = $2 OR comment_id = $3);

-- name: DeleteReaction :exec
DELETE FROM reactions WHERE reaction_id = $1;

-- name: GetReactionForPost :one
SELECT * FROM reactions WHERE post_id = $1 AND account_id = $2;

-- name: GetReactionForComment :one
SELECT * FROM reactions WHERE comment_id = $1 AND account_id = $2;

-- name: CountReactionsForComment :one
SELECT 
    COALESCE(SUM(CASE WHEN type = 'UPVOTE' THEN 1 ELSE 0 END), 0) AS upvotes,
    COALESCE(SUM(CASE WHEN type = 'DOWNVOTE' THEN 1 ELSE 0 END), 0) AS downvotes
FROM reactions
WHERE comment_id = $1;

-- name: CountReactionsForPost :one
SELECT 
    COALESCE(SUM(CASE WHEN type = 'UPVOTE' THEN 1 ELSE 0 END), 0) AS upvotes,
    COALESCE(SUM(CASE WHEN type = 'DOWNVOTE' THEN 1 ELSE 0 END), 0) AS downvotes
FROM reactions
WHERE post_id = $1;

-- name: GetCommentsForComment :many
SELECT * FROM comments WHERE parent_comment_id = $1;


---Question

-- name: UpdatePublicQuestion :exec
UPDATE questions SET is_public = TRUE WHERE question_id = $1;

-- name: GetQuestion :one
SELECT * FROM questions WHERE question_id = $1;

-- name: ListQuestionsOfContest :many
SELECT * FROM questions WHERE contest_id = $1;

-- name: GetLatestQuestionWithSubject :one
SELECT *
FROM questions
WHERE subject = $1 -- Replace 'Math' with the desired subject
ORDER BY updated_at DESC -- Assuming updated_at stores the timestamp of the last update
LIMIT 1;

-- name: CheckContestExistsWithSubject :one
SELECT EXISTS (
    SELECT 1
    FROM questions
    WHERE subject = $1
);

-- name: ListQuestions :many
SELECT * FROM questions;

-- name: CreateQuestion :exec
INSERT INTO questions (contest_id,description, answers, correct_answer, updated_at, subject, question_tag) VALUES ($1, $2, $3, $4, $5, $6,$7);

-- name: DeleteQuestion :exec
DELETE FROM questions WHERE question_id = $1;

-- name: DeleteQuestionsByContestId :exec
DELETE FROM questions WHERE contest_id = $1;

-- name: UpdateQuestionToPublic :exec
UPDATE questions SET is_public = TRUE WHERE contest_id = $1;

-- name: UpdateQuestionDescription :exec
UPDATE questions SET description = $1, updated_at = $2 WHERE question_id = $3;

------ Submission

-- name: GetSubmission :one
SELECT * FROM submissions WHERE submission_id = $1;

-- name: ListSubmissions :many
SELECT * FROM submissions;

-- name: CreateSubmission :exec
INSERT INTO submissions (submission_id, contest_id, account_id, time) VALUES ($1, $2, $3, $4);

-- name: DeleteSubmission :exec
DELETE FROM submissions WHERE submission_id = $1;

-- name: UpdateSubmissionTime :exec
UPDATE submissions SET time = $1 WHERE submission_id = $2;

-- name: GetSubmissionDetails :many
SELECT * FROM submission_details WHERE submission_id = $1;

-- name: AddSubmissionDetail :exec
INSERT INTO submission_details (submission_detail_id, submission_id, question_number, choice) VALUES ($1, $2, $3, $4);



------ Contest
-- name: GetContest :one
SELECT * FROM contests WHERE contest_id = $1;

-- name: ListContests :many
SELECT * FROM contests;

-- name: ListContestsByStatus :many
SELECT * FROM contests WHERE status = $1;

-- name: UpdateContestStatus :exec
UPDATE contests SET status = $1 WHERE contest_id = $2;

-- name: ListContestsOfAuthor :many
SELECT * FROM contests WHERE author_id = $1;

-- name: CreateContest :exec
INSERT INTO contests (contest_id, name, description, start_time, duration, difficulty, author_id, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);

-- name: DeleteContest :exec
DELETE FROM contests WHERE contest_id = $1;

-- name: UpdateContestDescription :exec
UPDATE contests SET description = $1, updated_at = $2 WHERE contest_id = $3;

------ Daily Task

-- name: GetDailyTask :one
SELECT * FROM daily_tasks WHERE daily_task_id = $1;

-- name: ListDailyTasks :many
SELECT * FROM daily_tasks;

-- name: CreateDailyTask :exec
INSERT INTO daily_tasks (daily_task_id, account_id, is_completed, reward_amount, description) VALUES ($1, $2, $3, $4, $5);

-- name: UpdateDailyTaskStatus :exec
UPDATE daily_tasks SET is_completed = $1 WHERE daily_task_id = $2;

-- name: GetDailyTaskDetails :one
SELECT description, reward_amount FROM daily_tasks WHERE daily_task_id = $1;

-- name: GetEventTask :one
SELECT * FROM event_tasks WHERE event_task_id = $1;

-- name: CreateEventTask :exec
INSERT INTO event_tasks (event_task_id, event_date, special_gift_description) VALUES ($1, $2, $3);

-- name: GetSpecialGiftDescription :one
SELECT special_gift_description FROM event_tasks WHERE event_task_id = $1;

-- name: IsEventDate :one
SELECT CASE WHEN event_date = CURRENT_DATE THEN TRUE ELSE FALSE END AS is_event_date FROM event_tasks WHERE event_task_id = $1;

