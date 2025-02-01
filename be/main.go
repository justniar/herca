package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Marketing struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type Commission struct {
	MarketingName     string  `json:"marketing_name"`
	Month             string  `json:"month"`
	Omzet             int64   `json:"omzet"`
	CommissionPct     float64 `json:"commission_pct"`
	CommissionNominal float64 `json:"commission_nominal"`
}

type PaymentRequest struct {
	PenjualanID int   `json:"penjualan_id"`
	AmountPaid  int64 `json:"amount_paid"`
}

type Payment struct {
	ID               int64  `json:"id"`
	PenjualanID      int    `json:"penjualan_id"`
	PaymentDate      string `json:"payment_date"`
	AmountPaid       int64  `json:"amount_paid"`
	RemainingBalance int64  `json:"remaining_balance"`
}

func connectDB() {
	var err error
	connStr := "user=postgres dbname=herca password=postgres sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
}

func getMarketing(c *gin.Context) {
	rows, err := db.Query("SELECT id, name FROM marketing")
	if err != nil {
		log.Println("Error querying database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	defer rows.Close()

	var marketingList []Marketing
	for rows.Next() {
		var marketing Marketing
		if err := rows.Scan(&marketing.ID, &marketing.Name); err != nil {
			log.Println("Error scanning row:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse data"})
			return
		}
		marketingList = append(marketingList, marketing)
	}

	c.JSON(http.StatusOK, marketingList)
}

func calculateCommission(omzet int64) (float64, float64) {
	var commissionRate float64
	var commissionNominal float64

	switch {
	case omzet <= 100000000:
		commissionRate = 0.0
		commissionNominal = 0
	case omzet > 100000000 && omzet <= 200000000:
		commissionRate = 0.025
		commissionNominal = float64(omzet) * commissionRate
	case omzet > 200000000 && omzet <= 500000000:
		commissionRate = 0.05
		commissionNominal = float64(omzet) * commissionRate
	default:
		commissionRate = 0.10
		commissionNominal = float64(omzet) * commissionRate
	}

	return commissionRate, commissionNominal
}

func getMarketingCommissions(c *gin.Context) {
	query := `
		SELECT m.name, EXTRACT(MONTH FROM p.date) AS month, SUM(p.grand_total) as total_sales
		FROM penjualan p
		JOIN marketing m ON p.marketing_Id = m.id
		GROUP BY m.name, EXTRACT(MONTH FROM p.date)
		ORDER BY m.name, EXTRACT(MONTH FROM p.date)
	`

	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var commissions []Commission

	for rows.Next() {
		var marketingName string
		var month float64
		var totalSales int64

		if err := rows.Scan(&marketingName, &month, &totalSales); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		commissionPct, commissionNominal := calculateCommission(totalSales)

		commissions = append(commissions, Commission{
			MarketingName:     marketingName,
			Month:             fmt.Sprintf("%02.0f", month),
			Omzet:             totalSales,
			CommissionPct:     commissionPct * 100,
			CommissionNominal: commissionNominal,
		})
	}

	c.JSON(http.StatusOK, commissions)
}

func makePayment(c *gin.Context) {
	var req PaymentRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var remainingBalance int64
	err := db.QueryRow("SELECT grand_total FROM penjualan WHERE id = $1", req.PenjualanID).Scan(&remainingBalance)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	if req.AmountPaid > remainingBalance {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Amount exceeds remaining balance"})
		return
	}

	newBalance := remainingBalance - req.AmountPaid

	_, err = db.Exec(`
		INSERT INTO pembayaran (penjualan_id, payment_date, amount_paid, remaining_balance)
		VALUES ($1, $2, $3, $4)`, req.PenjualanID, time.Now(), req.AmountPaid, newBalance)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process payment"})
		return
	}

	_, err = db.Exec("UPDATE penjualan SET grand_total = $1 WHERE id = $2", newBalance, req.PenjualanID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update transaction balance"})
		return
	}

	if newBalance == 0 {
		_, err = db.Exec("UPDATE penjualan SET status_pembayaran = 'Lunas' WHERE id = $1", req.PenjualanID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment status"})
			return
		}
	}

	statusPembayaran := "Belum Lunas"
	if newBalance == 0 {
		statusPembayaran = "Lunas"
	}

	c.JSON(http.StatusOK, gin.H{
		"message":           "Payment successful",
		"remaining_balance": newBalance,
		"status_pembayaran": statusPembayaran,
	})

}

func checkTransactionStatus(c *gin.Context) {
	penjualanID := c.Param("id")

	var status string
	err := db.QueryRow("SELECT status_pembayaran FROM penjualan WHERE id = $1", penjualanID).Scan(&status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status_pembayaran": status})
}

func GetPembayaran(c *gin.Context) {
	var payments []Payment
	rows, err := db.Query("SELECT id, penjualan_id, payment_date, amount_paid, remaining_balance FROM pembayaran")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch payments"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var payment Payment
		if err := rows.Scan(&payment.ID, &payment.PenjualanID, &payment.PaymentDate, &payment.AmountPaid, &payment.RemainingBalance); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}
		payments = append(payments, payment)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Row error"})
		return
	}

	c.JSON(http.StatusOK, payments)
}

func main() {
	connectDB()
	defer db.Close()

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/marketing", getMarketing)
	r.GET("/commissions", getMarketingCommissions)
	r.POST("/payment", makePayment)
	r.GET("/payment", GetPembayaran)
	r.GET("/transaction/:id/status", checkTransactionStatus)

	r.Run(":8080")
}
