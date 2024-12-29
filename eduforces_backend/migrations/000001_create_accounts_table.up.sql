CREATE TYPE role_enum AS ENUM ('Admin', 'Coordinator', 'User');
CREATE TYPE status_enum as ENUM ('Pending','Live','Ended');

CREATE SEQUENCE username_seq;

CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL DEFAULT 'user_' || nextval('username_seq'),
    name TEXT NOT NULL,
    role role_enum NOT NULL DEFAULT 'User',
    avatar_path TEXT NOT NULL DEFAULT 'default_avatar.png',
    elo_rating INT NOT NULL DEFAULT 1500,
    last_active TIMESTAMP,
    school TEXT NOT NULL DEFAULT 'Unknown',
    gold_amount NUMERIC NOT NULL DEFAULT 0,
    is_deactivated BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Post table
CREATE TABLE posts (
    post_id UUID PRIMARY KEY,
    author_id UUID REFERENCES accounts(account_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

-- Create Comment table
CREATE TABLE comments (
    comment_id UUID PRIMARY KEY,
    author_id UUID REFERENCES accounts(account_id),
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    post_id UUID REFERENCES posts(post_id),
    parent_comment_id UUID REFERENCES comments(comment_id)
);

-- Create Reaction table
CREATE TABLE reactions (
    reaction_id UUID PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('UPVOTE', 'DOWNVOTE')),
    account_id UUID REFERENCES accounts(account_id),
    timestamp TIMESTAMP NOT NULL,
    post_id UUID REFERENCES posts(post_id),
    comment_id UUID REFERENCES comments(comment_id)
);

--- Submission

-- Create Submission table
CREATE TABLE submissions (
    submission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    time TIMESTAMP NOT NULL
);

-- Create SubmissionDetail table
CREATE TABLE submission_details (
    submission_detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(submission_id),
    question_number VARCHAR(255) NOT NULL,
    choice VARCHAR(255) NOT NULL
);


----- Contest

-- Create Contest table
CREATE TABLE contests (
    contest_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration INT NOT NULL,
    difficulty INT NOT NULL,
    author_id UUID REFERENCES accounts(account_id),
    updated_at TIMESTAMP NOT NULL,
    status status_enum NOT NULL DEFAULT 'Pending'
);

-- Create ContestDetail table
CREATE TABLE contest_details (
    contest_detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES contests(contest_id),
    is_public BOOLEAN NOT NULL
);

-- Create ContestRegistration table
CREATE TABLE contest_registrations (
    registration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(account_id) ON DELETE CASCADE,
    contest_id UUID REFERENCES contests(contest_id) ON DELETE CASCADE,
    registration_time TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (account_id, contest_id) -- Ensure no duplicate registrations
);

------Daily Task

-- Create DailyTask table
CREATE TABLE daily_tasks (
    daily_task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(account_id),
    is_completed BOOLEAN NOT NULL,
    reward_amount NUMERIC NOT NULL,
    description TEXT NOT NULL
);

-- Create EventTask table
CREATE TABLE event_tasks (
    event_task_id UUID PRIMARY KEY REFERENCES daily_tasks(daily_task_id),
    event_date DATE NOT NULL,
    special_gift_description TEXT NOT NULL
);

CREATE TABLE questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID REFERENCES contests(contest_id),
    description TEXT NOT NULL,
    answers TEXT[] NOT NULL,
    correct_answer TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    subject VARCHAR(255) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    question_tag VARCHAR NOT NULL
);

CREATE TABLE user_done_question (
    account_id UUID NOT NULL,
    question_id UUID NOT NULL,
    done INT NOT NULL DEFAULT 0,
    PRIMARY KEY (account_id, question_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

-- Create the notifications table
CREATE TABLE notifications (
    notification_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- Create the account_read_notifications table to track if an account has read a notification
CREATE TABLE account_read_notifications (
    account_id UUID NOT NULL,
    notification_id UUID NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id, notification_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (notification_id) REFERENCES notifications(notification_id)
);