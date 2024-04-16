package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Item struct {
	gorm.Model
	Name  string
	Price float64
}

type User struct {
	gorm.Model
	Username string
	Password string
	Cart     Cart
}

type Cart struct {
	gorm.Model
	UserID uint
	Items  []Item `gorm:"many2many:cart_items;"`
}

type Order struct {
	gorm.Model
	UserID uint
	Items  []Item `gorm:"many2many:order_items;"`
}

func main() {
	db, err := gorm.Open(postgres.Open("postgres://kfecfbfo:Raa5DfodAdUnnmfY67IK6wuOwDJeQu7W@mahmud.db.elephantsql.com/kfecfbfo"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	db.AutoMigrate(&Item{}, &User{}, &Cart{}, &Order{})

	r := gin.Default()

	r.Use(cors.Default())

	r.POST("/users", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.Password = string(hashedPassword)

		db.Create(&user)

		c.JSON(http.StatusOK, gin.H{"data": user})
	})

	r.POST("/users/login", func(c *gin.Context) {
		var loginInfo User
		if err := c.ShouldBindJSON(&loginInfo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user User
		if err := db.Where("username = ?", loginInfo.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginInfo.Password)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"username": user.Username, "data": user})
	})

	r.POST("/carts", func(c *gin.Context) {
		var cartInput struct {
			Username string `json:"username"`
			Item     Item   `json:"item"`
		}

		if err := c.ShouldBindJSON(&cartInput); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user User
		if err := db.Where("username = ?", cartInput.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Associate the item with the user's cart
		cart := Cart{
			UserID: user.ID,
			Items:  []Item{cartInput.Item}, // Add the item to the cart
		}

		// Create the cart in the database
		if err := db.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": cart})
	})

	r.POST("/orders", func(c *gin.Context) {
		var order Order
		if err := c.ShouldBindJSON(&order); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		db.Create(&order)

		c.JSON(http.StatusOK, gin.H{"data": order})
	})

	r.Run(":9000")

}
