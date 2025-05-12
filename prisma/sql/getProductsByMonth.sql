SELECT
    ua.product_id as productId,
    date_trunc('month', ua.created_at) AS month,
    SUM(
        CASE
            WHEN ua.action = 'VIEW' THEN rs.view
            WHEN ua.action = 'FAVORITE' THEN rs.favorite
            WHEN ua.action = 'ADD_TO_CART' THEN rs.cart
            WHEN ua.action = 'ORDER' then rs.order
        END
    )::INT as score
FROM user_actions ua
JOIN recommendations_settings rs ON rs.merchant_id = ua.merchant_id
WHERE ua.merchant_id = $1
GROUP BY ua.product_id, date_trunc('month', ua.created_at)
ORDER BY score DESC
