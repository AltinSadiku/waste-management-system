# Fix: Get Fresh JWT Token

## The Problem
Your current JWT token was created before your account was activated/verified.
The token contains old account status (isActive=false), so backend rejects it.

## The Solution
Get a NEW token by logging in fresh.

## Steps:

### 1. Clear Current Token (Choose ONE method):

**Option A - Using Browser Console (Easiest):**
1. Press F12 to open DevTools
2. Go to Console tab
3. Type this and press Enter:
```javascript
localStorage.clear();
alert('Token cleared! Please close this tab and login again.');
```

**Option B - Using Application Storage:**
1. Press F12
2. Go to Application tab
3. Click "Storage" in left sidebar
4. Click "Clear site data" button
5. Confirm

**Option C - Manual:**
1. Press F12
2. Go to Application tab → Local Storage
3. Find and delete the "token" key

### 2. Close Browser Completely
- Close ALL browser tabs
- Close the browser completely

### 3. Open Fresh Browser
- Open browser again
- Go to: http://localhost:3001/login (or your frontend URL)

### 4. Login Again
- Enter your username: AltinSadiku
- Enter your password
- Click Sign In
- Wait for dashboard to load

### 5. Test Notification Bell
- Look for bell icon in navbar
- Click it
- Should work without errors!

## What This Does:
- ❌ Removes OLD token (with isActive=false)
- ✅ Creates NEW token (with isActive=true)
- ✅ Notification bell will work

## If Still Getting Error:
1. Check backend logs for JWT validation errors
2. Verify your database has is_active=1 for your user
3. Make sure you're using the CORRECT username/password

