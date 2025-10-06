# Debug Axios Error

## Step 1: Check Console for Detailed Error

Open browser console (F12) and look for logs starting with:
- ❌ API Error
- ❌ Network Error
- ❌ Request Error

## Common Axios Errors & Solutions:

### Error 1: "Network Error - No response from server"
**Cause:** Backend is not running or wrong URL

**Fix:**
1. Check if backend is running on http://localhost:8080
2. Check browser console for the baseURL being used
3. Start backend: `mvn spring-boot:run` or `./mvnw spring-boot:run`

### Error 2: "401 Unauthorized"
**Cause:** Token is invalid, expired, or account not active

**Fix:**
1. Clear token and login fresh:
```javascript
localStorage.removeItem('token');
window.location.href = '/login';
```

2. Check database:
```sql
SELECT username, is_active, email_verified FROM users WHERE username = 'YourUsername';
-- Should show is_active=1 and email_verified=1
```

### Error 3: "CORS Error"
**Cause:** Backend not allowing frontend origin

**Fix:**
Check backend SecurityConfig has CORS enabled (already done in your code)

### Error 4: "404 Not Found"
**Cause:** Endpoint doesn't exist or wrong URL

**Fix:**
1. Check if URL is correct: `http://localhost:8080/api/notifications`
2. Verify backend controller is mapped correctly

## Quick Test Commands:

### Test 1: Check if backend is running
```bash
curl http://localhost:8080/api/auth/signin
```
Should return 400 or 405, not connection refused

### Test 2: Check if notifications endpoint exists (with token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/notifications/unread-count
```

### Test 3: Check from browser console
```javascript
// Check what URL axios is using
console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:8080/api');

// Check if token exists
console.log('Token exists:', !!localStorage.getItem('token'));

// Test notification API directly
fetch('http://localhost:8080/api/notifications/unread-count', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Failed:', e));
```

## Share This Info:

When you see the axios error in console, tell me:
1. What type of error? (API Error / Network Error / Request Error)
2. What is the status code? (401, 404, 500, etc.)
3. What is the URL it's trying to call?
4. Is your backend running? (check terminal)

