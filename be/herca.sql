CREATE TABLE marketing (
    id SERIAL PRIMARY KEY,
    name VARCHAR(1000) NOT NULL
);

INSERT INTO marketing (name) VALUES ('Alfandy'), ('Mery'), ('Danang');
SELECT * FROM marketing;

CREATE TABLE penjualan (
    id SERIAL PRIMARY KEY,
    transaction_number VARCHAR(10) UNIQUE,
    marketing_Id INT NOT NULL,
    date DATE NOT NULL,
    cargo_fee INT NOT NULL,
    total_balance BIGINT NOT NULL,
    grand_total BIGINT NOT NULL,
    FOREIGN KEY (marketing_Id) REFERENCES marketing(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TRIGGER AS $$
DECLARE
    next_id INT;
BEGIN
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM penjualan;
    NEW.transaction_number := 'TRX' || LPAD(next_id::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_transaction
BEFORE INSERT ON penjualan
FOR EACH ROW
EXECUTE FUNCTION generate_transaction_number();

INSERT INTO penjualan (marketing_Id, date, cargo_fee, total_balance, grand_total)
VALUES
(1, '2023-05-22', 25000, 3000000, 3025000),
(3, '2023-05-22', 25000, 320000, 345000),
(1, '2023-05-22', 0, 65000000, 65000000),
(1, '2023-05-23', 10000, 70000000, 70010000),
(2, '2023-05-23', 10000, 80000000, 80010000),
(3, '2023-05-23', 12000, 44000000, 44012000),
(1, '2023-06-01', 0, 75000000, 75000000),
(2, '2023-06-02', 0, 85000000, 85000000),
(2, '2023-06-01', 0, 175000000, 175000000),
(3, '2023-06-01', 0, 75000000, 75000000),
(2, '2023-06-01', 0, 750020000, 750020000),
(3, '2023-06-01', 0, 130000000, 120000000);

select * from penjualan;

CREATE TABLE pembayaran (
    id SERIAL PRIMARY KEY,
    penjualan_id INT NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_paid BIGINT NOT NULL CHECK (amount_paid > 0),
    remaining_balance BIGINT NOT NULL,
    FOREIGN KEY (penjualan_id) REFERENCES penjualan(id) ON DELETE CASCADE
);

select * from pembayaran;
ALTER TABLE penjualan ADD COLUMN status_pembayaran VARCHAR(20) DEFAULT 'Belum Lunas';



