# Debug Guide - Notification Bell Issue

## Step-by-Step Debugging

### 1. Clear Browser Cache & Storage
**Before anything else, do this:**
1. Open DevTools (F12)
2. Right-click the refresh button → "Empty Cache and Hard Reload"
3. Go to Application tab → Storage → Click "Clear site data"
4. Close and reopen the browser

### 2. Check Authentication Status

**Open Browser Console (F12 → Console tab) and run these commands:**

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Check current user
console.log('User:', JSON.parse(localStorage.getItem('user') || 'null'));

// Test API directly
fetch('http://localhost:8080/api/notifications/unread-count', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

### 3. Login Test Procedure

**Follow these exact steps:**

1. **Logout completely**
   - Click Logout button
   - Verify you're redirected to home/login
   - Check console: `localStorage.getItem('token')` should be `null`

2. **Login again**
   - Enter valid credentials
   - Click Sign In
   - **WAIT** for dashboard to fully load
   - Check console for this log: `NotificationBell - Auth State: {...}`

3. **Check the console logs:**
   You should see:
   ```
   NotificationBell - Auth State: {
     user: "your-username",
     isAuthenticated: true,
     loading: false,
     token: "exists"
   }
   ```

4. **Click the notification bell**
   - If it redirects, check console for: `401 Error received: ...`
   - Check Network tab (F12 → Network) for failed requests

### 4. Backend Verification

**Check if backend is running properly:**

1. Open a new terminal
2. Run: `curl http://localhost:8080/api/notifications/unread-count -H "Authorization: Bearer YOUR_TOKEN_HERE"`
   (Replace YOUR_TOKEN_HERE with actual token from localStorage)

OR use browser:
1. Open: http://localhost:8080/swagger-ui/index.html
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Test `/api/notifications/unread-count` endpoint

### 5. Check Console Logs

After clicking the notification bell, you should see these logs in order:

**Expected logs (WORKING):**
```
NotificationBell - Auth State: { user: "username", isAuthenticated: true, loading: false, token: "exists" }
(No 401 errors)
(Dropdown opens)
```

**Problem logs (NOT WORKING):**
```
NotificationBell - Auth State: { user: null, isAuthenticated: false, loading: false, token: "missing" }
OR
401 Error received: /notifications/unread-count
Redirecting to login...
```

## Common Issues & Solutions

### Issue 1: Token Missing
**Symptoms:**
- Console shows: `token: "missing"`
- User is null

**Solution:**
```javascript
// 1. Check if login is actually setting the token
// Add this after login in AuthContext.js line 43:
console.log('Login response:', response.data);
console.log('Token being saved:', response.data.token);
```

### Issue 2: Token Invalid/Expired
**Symptoms:**
- Token exists but still getting 401
- Console shows: `401 Error received:`

**Solution:**
1. Token might be expired - logout and login again
2. Check backend logs for JWT errors
3. Verify backend JWT secret matches

### Issue 3: CORS Issues
**Symptoms:**
- Network tab shows CORS errors
- Console shows cross-origin errors

**Solution:**
Check backend `SecurityConfig.java` has CORS enabled:
```java
@CrossOrigin(origins = "*", maxAge = 3600)
```

### Issue 4: React Query Not Working
**Symptoms:**
- Notifications don't load even without 401

**Solution:**
Check if QueryClient is provided in App.js:
```javascript
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## Manual Fix - Remove NotificationBell Temporarily

If nothing works, test without the NotificationBell:

1. **Edit `Layout.js`:**
```javascript
// Comment out NotificationBell
// import NotificationBell from './NotificationBell';

// Line 110 and 214 - comment out:
// <NotificationBell />
```

2. **Restart frontend:**
```bash
cd frontend
npm start
```

3. **Test if you can now use the app without redirect**

If this fixes it, the issue is definitely in NotificationBell component.

## Test Notification API Manually

**Create a test button in Dashboard.js:**

```javascript
const testNotifications = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/notifications/unread-count', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    console.log('Notifications count:', data);
    alert('Success! Count: ' + data);
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
};

// Add button in JSX:
<button onClick={testNotifications}>Test Notifications API</button>
```

## Backend Logs to Check

Check Spring Boot console for:

```
Starting collection reminder job...
Found X schedules for tomorrow (DAY_NAME)
```

Also check for any JWT errors:
```
JWT token is expired
Invalid JWT signature
```

## Final Checklist

- [ ] Browser cache cleared
- [ ] Logged out and logged in fresh
- [ ] Token exists in localStorage
- [ ] User object exists in AuthContext
- [ ] No 401 errors in console before clicking bell
- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 3000
- [ ] CORS is enabled in backend
- [ ] JWT token is valid (not expired)

## Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Share the console output** - Copy all console logs
2. **Share the Network tab** - Check F12 → Network → Filter by "notifications"
3. **Check backend logs** - Any errors when notification endpoint is called?
4. **Verify token format** - Should start with "eyJ..." (JWT format)

## Quick Fix - Disable Auto-Fetch

Temporarily disable auto-fetching until we fix the root cause:

**In `NotificationBell.js` line 27-40:**
```javascript
const { data: unreadCountData } = useQuery(
  'unreadNotificationsCount',
  () => notificationsAPI.getUnreadCount(),
  {
    refetchInterval: false, // ✅ Disable auto-refresh
    enabled: false, // ✅ Disable automatic fetching
    retry: false,
    onError: (error) => {
      console.error('Error fetching unread count:', error);
    }
  }
);
```

This will prevent any automatic API calls until you manually open the dropdown.

