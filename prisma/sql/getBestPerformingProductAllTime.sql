SELECT
    ua.product_id,
    SUM(
        CASE
            WHEN ua.action = 'VIEW' THEN rs.view
            WHEN ua.action = 'FAVORITE' THEN rs.favorite
            WHEN ua.action = 'ADD_TO_CART' THEN rs.cart
            WHEN ua.action = 'ORDER' then rs.order
        END
    )::INT as score
FROM user_actions ua
JOIN public.recommendations_settings rs on ua.merchant_id = rs.merchant_id
WHERE ua.merchant_id = $1
GROUP BY ua.product_id
ORDER BY score DESC
LIMIT 1
