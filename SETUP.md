# Waste Management System - Setup Instructions

## Features Implemented

### 1. Email Verification System
- Users must verify their email before account activation
- Email verification tokens with 24-hour expiration
- Beautiful Thymeleaf email templates
- Welcome email after successful verification

### 2. Collection Schedule Management
- Admin can create collection schedules for different areas
- Schedules include waste type, day of week, and collection time
- Automatic reminders sent via email

### 3. Notification System
- Email notifications for collection reminders
- In-app notification system
- Collection schedule alerts

### 4. API Documentation
- Interactive Swagger UI documentation
- Complete API endpoint documentation
- Authentication examples
- Request/response schemas

## Backend Setup

### 1. Database Configuration
Update `src/main/resources/application.yml` with your database credentials:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/waste_management_system
    username: your_username
    password: your_password
```

### 2. Email Configuration
Configure email settings in `application.yml`:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password

app:
  mail:
    from: noreply@wastemanagement.com
  frontend:
    url: http://localhost:3000
```


### 4. Environment Variables
Create a `.env` file or set environment variables:
```bash
# Database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

```

## Database Migration

The system uses Liquibase for database migrations. New tables and fields will be automatically created:

- `email_verification_tokens` - Stores email verification tokens
- `collection_schedules` - Stores waste collection schedules
- Updated `users` table with email verification fields

## API Documentation

### Swagger UI
Once your application is running, you can access the interactive API documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

The Swagger UI provides:
- Interactive API testing
- Complete endpoint documentation
- Authentication examples
- Request/response schemas
- Try-it-out functionality

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user (sends verification email)
- `POST /api/auth/signin` - Login user
- `GET /api/auth/verify-email?token=xxx` - Verify email with token
- `POST /api/auth/resend-verification?email=xxx` - Resend verification email

### Collection Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/area/{areaId}` - Get schedules by area
- `GET /api/schedules/day/{dayOfWeek}` - Get schedules by day
- `POST /api/schedules` - Create schedule (Admin only)
- `PUT /api/schedules/{id}` - Update schedule (Admin only)
- `DELETE /api/schedules/{id}` - Delete schedule (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread` - Get unread notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Email Testing (Admin Only)
- `POST /api/test/email/verification?email=xxx` - Test verification email
- `POST /api/test/email/welcome?email=xxx` - Test welcome email
- `POST /api/test/email/collection-reminder?email=xxx` - Test collection reminder

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API URL
Update `frontend/src/services/api.js` if needed:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

### 3. New Pages Added
- `/verify-email` - Email verification page
- Updated login page with verification success messages

## Email Templates

Beautiful Thymeleaf templates are included:
- `verification.html` - Email verification template
- `welcome.html` - Welcome email after verification
- `collection-reminder.html` - Collection schedule reminders

## Scheduled Tasks

The system includes scheduled tasks:
- Collection reminders sent daily at 6 PM for next day's collection
- Automatic cleanup of expired verification tokens

## Testing the System

### 1. Register a New User
1. Go to `/register`
2. Fill in the registration form
3. Check your email for verification link
4. Click the verification link
5. Login with your credentials

### 2. Create Collection Schedule (Admin)
1. Login as admin
2. Use the collection schedule API endpoints
3. Schedule will automatically send reminders

### 3. Test Notifications
1. Create a collection schedule for tomorrow
2. Wait for 6 PM (or modify the cron schedule for testing)
3. Check email notifications

## Troubleshooting

### Email Not Working
1. Check email credentials in `application.yml`
2. Ensure Gmail app password is used (not regular password)
3. Check firewall settings for SMTP ports


### Database Issues
1. Ensure MySQL is running
2. Check database credentials
3. Verify Liquibase migrations are running

## Security Notes

- Email verification tokens expire after 24 hours
- All sensitive data is stored securely
- CORS is properly configured
