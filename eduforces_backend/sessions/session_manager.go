package sessions

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"sync"
	"time"
)

type Session struct {
	UserID    string
	CreatedAt time.Time
}

type SessionManager struct {
	sessions map[string]Session
	mutex    sync.Mutex
}

func NewSessionManager() *SessionManager {
	return &SessionManager{
		sessions: make(map[string]Session),
	}
}

// GenerateSessionID generates a new session ID using a secure random string
func (sm *SessionManager) GenerateSessionID() (string, error) {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", fmt.Errorf("failed to generate session ID: %v", err)
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

// CreateSession creates a new session for the user
func (sm *SessionManager) CreateSession(userID string) (string, error) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	sessionID, err := sm.GenerateSessionID()
	if err != nil {
		return "", err
	}

	sm.sessions[sessionID] = Session{
		UserID:    userID,
		CreatedAt: time.Now(),
	}

	return sessionID, nil
}

// GetSession retrieves the session data for a given session ID
func (sm *SessionManager) GetSession(sessionID string) (*Session, bool) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	session, exists := sm.sessions[sessionID]
	if !exists {
		return nil, false
	}
	return &session, true
}

// DeleteSession deletes a session by ID
func (sm *SessionManager) DeleteSession(sessionID string) error {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	if _, exists := sm.sessions[sessionID]; !exists {
		return errors.New("session ID not found")
	}

	delete(sm.sessions, sessionID)
	return nil
}
