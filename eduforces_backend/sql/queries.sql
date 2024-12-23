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

-- name: GetAccountByEmail :one
SELECT * FROM accounts WHERE email = $1;