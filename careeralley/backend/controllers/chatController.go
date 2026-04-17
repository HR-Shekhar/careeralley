package controllers

import (
	"careeralley/config"
	"careeralley/models"
	"careeralley/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/livekit/protocol/auth"
	"os"
	"strings"
)

// ------------------------------------
// WebSocket Upgrader
// ------------------------------------

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins (tighten in production)
	},
}

// ------------------------------------
// Hub — manages all connected clients
// ------------------------------------

type Client struct {
	conn     *websocket.Conn
	cardID   uint
	userID   uint
	userName string
	send     chan []byte
}

type Hub struct {
	// cardID → set of clients
	rooms map[uint]map[*Client]bool
	mu    sync.RWMutex

	register   chan *Client
	unregister chan *Client
	broadcast  chan *BroadcastMessage
}

type BroadcastMessage struct {
	cardID  uint
	payload []byte
}

var GlobalHub = &Hub{
	rooms:      make(map[uint]map[*Client]bool),
	register:   make(chan *Client, 256),
	unregister: make(chan *Client, 256),
	broadcast:  make(chan *BroadcastMessage, 512),
}

func (h *Hub) Run() {
	for {
		select {

		case client := <-h.register:
			h.mu.Lock()
			if h.rooms[client.cardID] == nil {
				h.rooms[client.cardID] = make(map[*Client]bool)
			}
			h.rooms[client.cardID][client] = true
			h.mu.Unlock()
			fmt.Printf("[WS] User %s joined card %d room\n", client.userName, client.cardID)

		case client := <-h.unregister:
			h.mu.Lock()
			if room, ok := h.rooms[client.cardID]; ok {
				if _, ok := room[client]; ok {
					delete(room, client)
					close(client.send)
					if len(room) == 0 {
						delete(h.rooms, client.cardID)
					}
				}
			}
			h.mu.Unlock()
			fmt.Printf("[WS] User %s left card %d room\n", client.userName, client.cardID)

		case msg := <-h.broadcast:
			h.mu.RLock()
			room := h.rooms[msg.cardID]
			h.mu.RUnlock()
			for client := range room {
				select {
				case client.send <- msg.payload:
				default:
					// Slow client — drop and disconnect
					h.mu.Lock()
					delete(h.rooms[client.cardID], client)
					close(client.send)
					h.mu.Unlock()
				}
			}
		}
	}
}

// ------------------------------------
// Per-client goroutines
// ------------------------------------

type IncomingMessage struct {
	Content string `json:"content"`
}

type OutgoingMessage struct {
	ID        uint      `json:"id"`
	CardID    uint      `json:"card_id"`
	UserID    uint      `json:"user_id"`
	UserName  string    `json:"user_name"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func (c *Client) readPump() {
	defer func() {
		GlobalHub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(4096)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, rawMsg, err := c.conn.ReadMessage()
		if err != nil {
			break
		}

		var incoming IncomingMessage
		if err := json.Unmarshal(rawMsg, &incoming); err != nil || incoming.Content == "" {
			continue
		}

		// Save to DB
		msg := models.ChatMessage{
			CardID:   c.cardID,
			UserID:   c.userID,
			UserName: c.userName,
			Content:  incoming.Content,
		}
		config.DB.Create(&msg)

		// Build outgoing payload
		out := OutgoingMessage{
			ID:        msg.ID,
			CardID:    msg.CardID,
			UserID:    msg.UserID,
			UserName:  msg.UserName,
			Content:   msg.Content,
			CreatedAt: msg.CreatedAt,
		}

		payload, _ := json.Marshal(out)

		GlobalHub.broadcast <- &BroadcastMessage{
			cardID:  c.cardID,
			payload: payload,
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// ------------------------------------
// HTTP Handlers
// ------------------------------------

// GET /chat/:card_id/ws?token=...
func ChatWebSocket(c *gin.Context) {

	cardIDStr := c.Param("card_id")
	cardID, err := strconv.Atoi(cardIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid card ID"})
		return
	}

	// Auth via query param token (WebSocket can't send headers easily)
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token required"})
		return
	}

	claims, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	userID := uint(claims["user_id"].(float64))

	// Fetch user name
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Upgrade to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("[WS] Upgrade error:", err)
		return
	}

	client := &Client{
		conn:     conn,
		cardID:   uint(cardID),
		userID:   userID,
		userName: user.Name,
		send:     make(chan []byte, 256),
	}

	GlobalHub.register <- client

	go client.writePump()
	go client.readPump()
}

// GET /chat/:card_id/history — last 50 messages
func GetChatHistory(c *gin.Context) {

	cardID := c.Param("card_id")

	var messages []models.ChatMessage

	config.DB.
		Where("card_id = ?", cardID).
		Order("created_at ASC").
		Limit(50).
		Find(&messages)

	c.JSON(http.StatusOK, messages)
}

// GET /chat/my-cards — cards the user has joined (has a roadmap for)
func GetMyChatCards(c *gin.Context) {

	userIDRaw, _ := c.Get("user_id")
	userID := uint(userIDRaw.(float64))

	var roadmaps []models.Roadmap
	config.DB.Where("user_id = ?", userID).Find(&roadmaps)

	type CardInfo struct {
		CardID   uint   `json:"card_id"`
		CardName string `json:"card_name"`
		Icon     string `json:"icon"`
	}

	var cards []CardInfo
	seen := make(map[uint]bool)

	for _, r := range roadmaps {
		if seen[r.CardID] {
			continue
		}
		seen[r.CardID] = true

		var card models.CareerCard
		if err := config.DB.First(&card, r.CardID).Error; err == nil {
			cards = append(cards, CardInfo{
				CardID:   card.ID,
				CardName: card.Name,
				Icon:     card.Icon,
			})
		}
	}

	c.JSON(http.StatusOK, cards)
}

// GET /chat/:card_id/voice/token
func GenerateVoiceToken(c *gin.Context) {
	cardIDStr := c.Param("card_id")
	cardID, err := strconv.Atoi(cardIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid card ID"})
		return
	}

	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uint(userIDRaw.(float64))

	// Ensure the user actually has access to this community
	var count int64
	config.DB.Model(&models.Roadmap{}).Where("user_id = ? AND card_id = ?", userID, cardID).Count(&count)
	if count == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not belong to this community"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	apiKey := strings.TrimSpace(os.Getenv("LIVEKIT_API_KEY"))
	apiSecret := strings.TrimSpace(os.Getenv("LIVEKIT_API_SECRET"))
	if apiKey == "" || apiSecret == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "LiveKit credentials not configured on server"})
		return
	}

	roomName := fmt.Sprintf("card-voice-%d", cardID)
	identity := fmt.Sprintf("user-%d", user.ID)

	at := auth.NewAccessToken(apiKey, apiSecret)
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     roomName,
	}
	at.SetName(user.Name).SetVideoGrant(grant).SetIdentity(identity).SetValidFor(2 * time.Hour)

	token, err := at.ToJWT()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
