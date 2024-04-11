package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/rs/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string
	Password string
	Token    string
	Cart     Cart
}

type Cart struct {
	gorm.Model
	UserID uint
	Status string
	Items  []Item `gorm:"many2many:cart_items;"`
}

type Item struct {
	gorm.Model
	Name   string
	Status string
}

type Order struct {
	gorm.Model
	CartID uint
	UserID uint
}

type CartItem struct {
	CartID uint `gorm:"primaryKey"`
	ItemID uint `gorm:"primaryKey"`
}

var db *gorm.DB

func main() {
	// Connect to the database
	var err error
	db, err = gorm.Open(postgres.Open("postgres://irwhukxw:wLDgXVnNikoFUNJK0P7xGgpONLh_Lg5p@bubble.db.elephantsql.com/irwhukxw"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Connected to the database")

	// Auto Migrate
	db.AutoMigrate(&User{}, &Cart{}, &Item{}, &Order{}, &CartItem{})

	// Start HTTP server
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/add", addHandler)
	http.HandleFunc("/view", viewHandler)
	http.HandleFunc("/checkout", checkoutHandler)
	http.HandleFunc("/signin", signinHandler)
	http.HandleFunc("/signup", signupHandler)

	c := cors.Default()

	// Wrap your HTTP handler with the CORS handler
	handler := c.Handler(http.DefaultServeMux)

	fmt.Println("Server is running on port 8080...")
	http.ListenAndServe(":8080", handler)
}

var store = sessions.NewCookieStore([]byte("your-secret-key"))

func signinHandler(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse form data
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Failed to parse form data", http.StatusInternalServerError)
		return
	}

	// Get username and password from the form
	username := r.Form.Get("username")
	password := r.Form.Get("password")

	// Validate username and password (you may want to add more validation)
	if username == "" || password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	var user User
	result := db.Where("username = ? AND password = ?", username, password).First(&user)
	if result.Error != nil {
		http.Error(w, "Invalid username or password", http.StatusBadRequest)
		return
	}
	session, _ := store.Get(r, "session-name")
	session.Values["userID"] = user.ID
	session.Save(r, w)

	// Check if the user exists in the database (you need to implement this)
	// If the user exists, you can generate a token and return it
	// If the user does not exist, return an error or redirect to the signup page
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse form data
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Failed to parse form data", http.StatusInternalServerError)
		return
	}

	// Get username and password from the form
	username := r.Form.Get("username")
	password := r.Form.Get("password")

	fmt.Println(username + " " + password)
	// Validate username and password (you may want to add more validation)
	if username == "" || password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	newUser := User{
		Username: username,
		Password: password, // Make sure to hash the password before storing it
	}
	result := db.Create(&newUser)
	if result.Error != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	fmt.Println(newUser)
	// Create a new user in the database (you need to implement this)
	session, _ := store.Get(r, "session-name")
	session.Values["userID"] = newUser.ID
	session.Save(r, w)
	// You may also want to generate a token for the new user
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the shopping cart!")
}

func addHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve item name from the request
	itemName := r.URL.Query().Get("item")
	if itemName == "" {
		http.Error(w, "Please provide an item", http.StatusBadRequest)
		return
	}

	// Retrieve user ID from the session
	session, _ := store.Get(r, "session-name")
	userID, ok := session.Values["userID"].(uint)
	if !ok {
		http.Error(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	// Retrieve the user's cart
	var cart Cart
	result := db.Where("user_id = ?", userID).First(&cart)
	if result.Error != nil {
		// If no cart was found, create a new cart for the user
		cart = Cart{
			UserID: userID,
			Status: "Active",
		}
		db.Create(&cart)
	}
	// Create a new item
	newItem := Item{
		Name:   itemName,
		Status: "pending",
	}

	// Save the item to the database
	result = db.Create(&newItem)
	if result.Error != nil {
		http.Error(w, "Failed to add item", http.StatusInternalServerError)
		return
	}

	// Add the item to the user's cart
	cart.Items = append(cart.Items, newItem)

	// Save the updated cart to the database
	result = db.Save(&cart)
	if result.Error != nil {
		http.Error(w, "Failed to update cart", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Item added to cart successfully!")

}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve user ID from the session
	session, _ := store.Get(r, "session-name")
	userID, ok := session.Values["userID"].(uint)
	if !ok {
		http.Error(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	// Retrieve the user's cart
	var cart Cart
	result := db.Where("user_id = ?", userID).First(&cart)
	if result.Error != nil {
		http.Error(w, "Failed to retrieve cart", http.StatusInternalServerError)
		return
	}

	// Display the items in the cart
	fmt.Fprintf(w, "Items in the cart:\n")
	for _, item := range cart.Items {
		fmt.Fprintf(w, "- %s\n", item.Name)
	}
}

// Handler for checkout
func checkoutHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve user ID from the session
	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, "Failed to retrieve session", http.StatusInternalServerError)
		return
	}

	userID, ok := session.Values["userID"].(uint)
	if !ok {
		http.Error(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	// Retrieve the user's cart
	var cart Cart
	result := db.Preload("Items").Where("user_id = ?", userID).First(&cart)
	if result.Error != nil {
		http.Error(w, "Failed to retrieve cart", http.StatusInternalServerError)
		return
	}

	// Create an order for the user
	order := Order{
		UserID: userID,
		CartID: cart.ID,
	}
	db.Create(&order)

	// Clear the user's cart
	cart.Items = nil
	db.Save(&cart)

	// Return a response indicating successful checkout
	fmt.Fprintf(w, "Checkout successful. Your order has been placed.")
}

// Handler for retrieving order details
