-- SQL Script to Check and Fix User Status
-- Run these queries in your MySQL database

-- Step 1: Check your user's current status
SELECT 
    id,
    username,
    email,
    is_active,
    email_verified,
    role,
    created_at
FROM users
WHERE username = 'AltinSadiku'; -- Replace with your username

-- Step 2: If is_active = 0 or email_verified = 0, fix it:
-- ONLY RUN THIS IF THE ABOVE QUERY SHOWS is_active = 0
UPDATE users
SET 
    is_active = 1,
    email_verified = 1
WHERE username = 'AltinSadiku'; -- Replace with your username

-- Step 3: Verify the update worked
SELECT 
    id,
    username,
    email,
    is_active,
    email_verified,
    role
FROM users
WHERE username = 'AltinSadiku'; -- Replace with your username

-- Step 4: Check if there are any pending verification tokens
SELECT * FROM email_verification_tokens WHERE user_id IN (
    SELECT id FROM users WHERE username = 'AltinSadiku'
);

