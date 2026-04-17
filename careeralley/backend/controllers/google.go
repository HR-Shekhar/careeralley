package controllers

import (
	"context"
	"encoding/json"

	"careeralley/config"

	"golang.org/x/oauth2"
)

type GoogleUser struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func exchangeCodeForToken(code string) (*oauth2.Token, error) {

	token, err := config.GoogleConfig.Exchange(context.Background(), code)

	return token, err
}

func getGoogleUser(token *oauth2.Token) (*GoogleUser, error) {

	client := config.GoogleConfig.Client(context.Background(), token)

	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var user GoogleUser

	err = json.NewDecoder(resp.Body).Decode(&user)

	return &user, err
}
