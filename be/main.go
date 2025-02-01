package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Commission struct {
	MarketingID   int     `json:"marketing_id"`
	MarketingName string  `json:"marketing_name"`
	Omzet         int64   `json:"omzet"`
	Commission    float64 `json:"commission"`
}

func connectDB() {
	var err error
	connStr := "user=postgres dbname=herca password=postgres sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
}

func calculateCommission(omzet int64) float64 {
	var commissionRate float64

	switch {
	case omzet <= 100000000:
		commissionRate = 0.0
	case omzet > 100000000 && omzet <= 200000000:
		commissionRate = 0.025
	case omzet > 200000000 && omzet <= 500000000:
		commissionRate = 0.05
	default:
		commissionRate = 0.10
	}

	return float64(omzet) * commissionRate
}

func getMarketingCommissions(c *gin.Context) {
	month := c.DefaultQuery("month", "06")
	year := c.DefaultQuery("year", "2023")

	query := `
		SELECT m.id, m.name, SUM(p.grand_total) as total_sales
		FROM penjualan p
		JOIN marketing m ON p.marketing_Id = m.id
		WHERE EXTRACT(MONTH FROM p.date) = $1 AND EXTRACT(YEAR FROM p.date) = $2
		GROUP BY m.id, m.name
	`

	rows, err := db.Query(query, month, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var commissions []Commission

	for rows.Next() {
		var marketingID int
		var marketingName string
		var totalSales int64

		if err := rows.Scan(&marketingID, &marketingName, &totalSales); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		commissionAmount := calculateCommission(totalSales)

		commissions = append(commissions, Commission{
			MarketingID:   marketingID,
			MarketingName: marketingName,
			Omzet:         totalSales,
			Commission:    commissionAmount,
		})
	}

	c.JSON(http.StatusOK, commissions)
}

func main() {
	connectDB()
	defer db.Close()

	r := gin.Default()

	r.GET("/commissions", getMarketingCommissions)

	r.Run(":8080")
}
