SELECT
    DISTINCT ON (user_id)
    COUNT(user_id)
FROM user_actions
WHERE created_at  > current_date - interval '30' day
AND merchant_id = $1
GROUP BY user_id;