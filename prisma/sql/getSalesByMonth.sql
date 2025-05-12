SELECT date_trunc('month', created_at) AS month, sum(total_price) as total_amount
FROM orders
WHERE merchant_id = $1
GROUP BY month