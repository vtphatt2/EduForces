migrateup:
	migrate -path ./migrations -database "postgresql://postgres:khoa@localhost:5432/eduforces?sslmode=disable" -verbose up 
migratedown:
	migrate -path ./migrations -database "postgresql://postgres:khoa@localhost:5432/eduforces?sslmode=disable" -verbose down
sqlc:
	sqlc generate