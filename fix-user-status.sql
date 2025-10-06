-- Quick Fix: Update your user account to be active and verified
-- Replace 'AltinSadiku' with your actual username

-- Step 1: Check current status
SELECT 
    id,
    username,
    email,
    is_active,
    email_verified,
    role,
    created_at
FROM users
WHERE username = 'AltinSadiku';

-- Step 2: Update to active and verified
UPDATE users
SET 
    is_active = TRUE,
    email_verified = TRUE
WHERE username = 'AltinSadiku';

-- Step 3: Confirm the update
SELECT 
    id,
    username,
    email,
    is_active,
    email_verified,
    'SUCCESS - User is now active and verified!' AS status
FROM users
WHERE username = 'AltinSadiku';

