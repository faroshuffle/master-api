SELECT
    ua.product_id,
    COUNT(ua.product_id) AS count
FROM user_actions ua
WHERE ua.merchant_id = $1 AND ua.action = 'ORDER'
GROUP BY ua.product_id
ORDER BY count DESC
LIMIT 1