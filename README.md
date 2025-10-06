# Waste Management System for Kosovo 🇽🇰

A comprehensive waste management system designed for Kosovo municipalities to improve waste collection, citizen reporting, and administrative oversight.

## 🚀 Features

### For Citizens
- **Report Issues**: Submit waste-related problems with photos and GPS location
- **Track Progress**: Monitor report status from submission to resolution
- **Collection Schedules**: View waste collection schedules for your area
- **Notifications**: Receive updates about your reports and collection reminders

### For Workers
- **Task Management**: View assigned reports and update their status
- **Mobile-Friendly**: Access the system on mobile devices in the field
- **GPS Integration**: Navigate to reported locations
- **Status Updates**: Mark reports as in-progress, resolved, or closed

### For Administrators
- **Dashboard Analytics**: Comprehensive overview of system statistics
- **Report Management**: Assign reports to workers and track progress
- **User Management**: Manage citizens, workers, and administrators
- **Area Management**: Configure collection areas and schedules

## 🛠️ Technology Stack

### Backend
- **Java 21** with latest features (Records, Pattern Matching, etc.)
- **Spring Boot 3.2.0** with Spring Security
- **MySQL 8.0** database with Liquibase migrations
- **JWT** authentication
- **Maven** for dependency management

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Leaflet** for maps integration

## 📋 Prerequisites

- Java 21 or higher
- Node.js 16+ and npm
- MySQL 8.0+ or Docker
- Maven 3.6+

## 🚀 Quick Start

### 1. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start MySQL and phpMyAdmin
docker-compose up -d

# MySQL will be available at localhost:3306
# phpMyAdmin will be available at http://localhost:8081
```

#### Option B: Manual MySQL Setup
```sql
CREATE DATABASE waste_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'waste_user'@'localhost' IDENTIFIED BY 'waste_password';
GRANT ALL PRIVILEGES ON waste_management_db.* TO 'waste_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
# Navigate to project root
cd waste-management-system

# Update database configuration in src/main/resources/application.yml if needed
# Default credentials (if using Docker):
# spring.datasource.username=waste_user
# spring.datasource.password=waste_password

# Run the application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

**Note:** Liquibase will automatically create all database tables and insert sample data when the application starts for the first time.

## 📊 Database Migrations with Liquibase

The project uses Liquibase for database version control and migrations:

### Migration Files
- `src/main/resources/db/changelog/db.changelog-master.xml` - Master changelog
- `src/main/resources/db/changelog/db.changelog-1.0.xml` - Initial schema creation
- `src/main/resources/db/changelog/db.changelog-1.1.xml` - Sample areas and schedules
- `src/main/resources/db/changelog/db.changelog-1.2.xml` - Sample users and reports

### Adding New Migrations
1. Create a new changelog file (e.g., `db.changelog-1.3.xml`)
2. Add your changes using Liquibase XML syntax
3. Include the new file in the master changelog
4. Restart the application to apply migrations

### Liquibase Commands
```bash
# Check migration status
./mvnw liquibase:status

# Generate migration SQL (without applying)
./mvnw liquibase:updateSQL

# Rollback last migration
./mvnw liquibase:rollback -Dliquibase.rollbackCount=1
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
DB_USERNAME=waste_user
DB_PASSWORD=waste_password
JWT_SECRET=your_jwt_secret_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_password
```

### Application Configuration

Key configuration options in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/waste_management_db?useSSL=false&serverTimezone=UTC
    username: ${DB_USERNAME:waste_user}
    password: ${DB_PASSWORD:waste_password}

app:
  jwt:
    secret: ${JWT_SECRET:mySecretKey}
    expiration: 86400000 # 24 hours
```

## 📱 Mobile Support

The system is designed to be mobile-responsive and can be easily converted to a React Native app for native mobile deployment.

## 🗺️ Pilot Implementation Plan

### Phase 1: MVP (Months 1-2)
- [x] User registration and authentication
- [x] Basic report submission with photos
- [x] Admin dashboard for report management
- [x] Worker dashboard for task assignment
- [ ] Collection schedule management
- [ ] Email notifications

### Phase 2: Enhanced Features (Months 3-4)
- [ ] Push notifications
- [ ] Route optimization for workers
- [ ] Advanced analytics and reporting
- [ ] Multi-language support (Albanian/English)
- [ ] SMS notifications

### Phase 3: Scale & Integrate (Months 5-6)
- [ ] IoT integration for smart bins
- [ ] Gamification features
- [ ] Integration with municipal systems
- [ ] Mobile app deployment

## 🏛️ Municipality Integration

### Supported Municipalities
- Prishtina (Pilot)
- Gjakova
- Prizren
- Peja
- Ferizaj

### Partnership Opportunities
- Waste collection companies (e.g., "Pastrimi")
- NGOs and international donors (GIZ, UNDP, EU Office)
- Local government institutions

## 📊 Success Metrics

- **Resolution Time**: 70% of reports resolved within 48 hours
- **Citizen Satisfaction**: 85%+ satisfaction rate
- **System Adoption**: 1000+ active users in pilot phase
- **Efficiency Improvement**: 30% reduction in response time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kosovo municipalities for their support
- International donors and NGOs
- Open source community for excellent tools and libraries
- Citizens of Kosovo for their participation

## 📞 Support

For support and questions:
- Email: support@wastekosovo.com
- GitHub Issues: [Create an issue](https://github.com/your-org/waste-management-system/issues)

---

**Made with ❤️ for a cleaner Kosovo**