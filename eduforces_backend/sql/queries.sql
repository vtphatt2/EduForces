----- Account

-- name: GetAccount :one
SELECT * FROM accounts WHERE account_id = $1;

-- name: ListAccounts :many
SELECT * FROM accounts;

-- name: CreateAccount :exec
INSERT INTO accounts (email, name, role) VALUES ($1, $2, $3);

-- name: DeleteAccount :exec
DELETE FROM accounts WHERE account_id = $1; 

-- name: UpdateAccountName :exec
UPDATE accounts SET name = $1 WHERE email = $2;


---- Forum

-- name: GetAccountByEmail :one
SELECT * FROM accounts WHERE email = $1;

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

-- name: GetCommentsForPost :many
SELECT * FROM comments WHERE post_id = $1;

-- name: AddCommentToPost :exec
INSERT INTO comments (comment_id, author_id, content, timestamp, post_id, parent_comment_id) VALUES ($1, $2, $3, $4, $5, $6);

-- name: GetReactionsForPost :many
SELECT * FROM reactions WHERE post_id = $1;

-- name: AddReactionToPost :exec
INSERT INTO reactions (reaction_id, type, account_id, timestamp, post_id, comment_id) VALUES ($1, $2, $3, $4, $5, $6);


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

