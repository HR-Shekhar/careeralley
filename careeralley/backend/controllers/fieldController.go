package controllers

import (
	"net/http"

	"careeralley/config"
	"careeralley/models"

	"github.com/gin-gonic/gin"
)

func GetFields(c *gin.Context) {

	var fields []models.Field

	config.DB.Find(&fields)

	c.JSON(http.StatusOK, fields)

}
