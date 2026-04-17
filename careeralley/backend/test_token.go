// package main

// import (
// 	"fmt"
// 	"os"
// 	"strings"
// 	"time"

// 	"github.com/joho/godotenv"
// 	"github.com/livekit/protocol/auth"
// )

// func main() {
// 	godotenv.Load(".env")
// 	apiKey := strings.TrimSpace(os.Getenv("LIVEKIT_API_KEY"))
// 	apiSecret := strings.TrimSpace(os.Getenv("LIVEKIT_API_SECRET"))
// 	apiKey = strings.Trim(apiKey, "\"'")
// 	apiSecret = strings.Trim(apiSecret, "\"'")

// 	fmt.Printf("Key: '%s'\n", apiKey)
// 	fmt.Printf("Secret: '%s'\n", apiSecret)

// 	at := auth.NewAccessToken(apiKey, apiSecret)
// 	grant := &auth.VideoGrant{
// 		RoomJoin: true,
// 		Room:     "test-room",
// 	}
// 	at.SetVideoGrant(grant).SetIdentity("test-user").SetValidFor(2 * time.Hour)

// 	token, err := at.ToJWT()
// 	if err != nil {
// 		fmt.Println("Error:", err)
// 		return
// 	}
// 	fmt.Println("Token:", token)
// }
