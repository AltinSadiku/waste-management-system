-- Create database for waste management system
CREATE DATABASE IF NOT EXISTS waste_management_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS 'altin'@'localhost' IDENTIFIED BY '123qwe';
CREATE USER IF NOT EXISTS 'altin'@'%' IDENTIFIED BY '123qwe';

-- Grant privileges
GRANT ALL PRIVILEGES ON waste_management_system.* TO 'altin'@'localhost';
GRANT ALL PRIVILEGES ON waste_management_system.* TO 'altin'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show databases to verify
SHOW DATABASES;






