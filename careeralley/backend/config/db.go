package config

import (
	"log"
	"os"

	"careeralley/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {

	// dsn := "host=localhost user=adityaray dbname=careeralley port=5432 sslmode=disable"

	dsn := os.Getenv("DATABASE_URL")

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	DB = database

	DB.AutoMigrate(
		&models.User{},
		&models.CareerCard{},
		&models.Roadmap{},
		&models.Topic{},
		&models.Subtopic{},
		&models.Resource{},
		&models.UserProgress{},
		&models.StudySession{},
		&models.OnboardingQuestion{},
		&models.OnboardingOption{},
		&models.UserOnboardingAnswer{},
		&models.CardQuestion{},
		&models.CardOption{},
		&models.UserCardAnswer{},
		&models.ChatMessage{},
		&models.MockInterview{},
		&models.MockInterviewQuestion{},
		&models.MockInterviewResult{},
	)

	log.Println("Database connected successfully")

}
