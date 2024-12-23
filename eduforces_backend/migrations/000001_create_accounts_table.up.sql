CREATE TYPE role_enum AS ENUM ('Admin', 'Coordinator', 'User');

CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role role_enum NOT NULL DEFAULT 'User'
);
