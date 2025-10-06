-- Waste Management System MySQL Database Initialization
-- This script creates the database and user for the waste management system

-- Create database
CREATE DATABASE IF NOT EXISTS waste_management_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'waste_user'@'localhost' IDENTIFIED BY 'waste_password';
CREATE USER IF NOT EXISTS 'waste_user'@'%' IDENTIFIED BY 'waste_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON waste_management_db.* TO 'waste_user'@'localhost';
GRANT ALL PRIVILEGES ON waste_management_db.* TO 'waste_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the database
USE waste_management_db;

-- Note: The actual table creation and data insertion will be handled by Liquibase
-- when the Spring Boot application starts up. The changelog files in 
-- src/main/resources/db/changelog/ will automatically create:
-- - All tables with proper indexes
-- - Foreign key constraints
-- - Sample data for Kosovo municipalities
-- - Default users (admin, workers, citizens)

-- To run this manually:
-- 1. Start MySQL server
-- 2. Run: mysql -u root -p < database/mysql-init.sql
-- 3. Start the Spring Boot application
-- 4. Liquibase will automatically create all tables and insert sample data

-- Default credentials after Liquibase runs:
-- Admin: username=admin, password=admin123
-- Worker: username=worker1, password=worker123  
-- Citizen: username=citizen1, password=citizen123






