-- Waste Management System Database Initialization
-- This script creates the initial database structure and sample data

-- Create database (run this separately)
-- CREATE DATABASE waste_management_db;

-- Connect to the database and create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Sample Areas for Kosovo
INSERT INTO areas (name, description, municipality, neighborhood, center_latitude, center_longitude, is_active, created_at, updated_at) VALUES
('Dardania', 'Dardania neighborhood in Prishtina', 'Prishtina', 'Dardania', 42.6639, 21.1658, true, NOW(), NOW()),
('Ulpiana', 'Ulpiana neighborhood in Prishtina', 'Prishtina', 'Ulpiana', 42.6581, 21.1619, true, NOW(), NOW()),
('City Center', 'Prishtina city center', 'Prishtina', 'Center', 42.6629, 21.1655, true, NOW(), NOW()),
('Dragodan', 'Dragodan neighborhood', 'Prishtina', 'Dragodan', 42.6594, 21.1583, true, NOW(), NOW()),
('Bardhosh', 'Bardhosh neighborhood', 'Gjakova', 'Bardhosh', 42.3803, 20.4308, true, NOW(), NOW()),
('Center', 'Gjakova city center', 'Gjakova', 'Center', 42.3803, 20.4308, true, NOW(), NOW());

-- Sample Collection Schedules
INSERT INTO collection_schedules (area_id, waste_type, day_of_week, collection_time, is_active, created_at, updated_at) VALUES
(1, 'GENERAL_WASTE', 'MONDAY', '08:00:00', true, NOW(), NOW()),
(1, 'RECYCLABLE', 'THURSDAY', '08:00:00', true, NOW(), NOW()),
(2, 'GENERAL_WASTE', 'TUESDAY', '08:00:00', true, NOW(), NOW()),
(2, 'RECYCLABLE', 'FRIDAY', '08:00:00', true, NOW(), NOW()),
(3, 'GENERAL_WASTE', 'WEDNESDAY', '07:00:00', true, NOW(), NOW()),
(3, 'RECYCLABLE', 'SATURDAY', '07:00:00', true, NOW(), NOW()),
(4, 'GENERAL_WASTE', 'THURSDAY', '08:30:00', true, NOW(), NOW()),
(4, 'RECYCLABLE', 'SUNDAY', '08:30:00', true, NOW(), NOW()),
(5, 'GENERAL_WASTE', 'MONDAY', '09:00:00', true, NOW(), NOW()),
(5, 'RECYCLABLE', 'THURSDAY', '09:00:00', true, NOW(), NOW()),
(6, 'GENERAL_WASTE', 'TUESDAY', '09:00:00', true, NOW(), NOW()),
(6, 'RECYCLABLE', 'FRIDAY', '09:00:00', true, NOW(), NOW());

-- Sample Admin User (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('admin', 'admin@wastekosovo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Administrator', 'ADMIN', true, NOW(), NOW());

-- Sample Worker Users (password: worker123)
INSERT INTO users (username, email, password, first_name, last_name, phone_number, role, assigned_area_id, is_active, created_at, updated_at) VALUES
('worker1', 'worker1@wastekosovo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Agim', 'Krasniqi', '+383 44 123 456', 'WORKER', 1, true, NOW(), NOW()),
('worker2', 'worker2@wastekosovo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Besnik', 'Gashi', '+383 44 234 567', 'WORKER', 2, true, NOW(), NOW()),
('worker3', 'worker3@wastekosovo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Driton', 'Morina', '+383 44 345 678', 'WORKER', 3, true, NOW(), NOW());

-- Sample Citizen Users (password: citizen123)
INSERT INTO users (username, email, password, first_name, last_name, phone_number, address, latitude, longitude, role, is_active, created_at, updated_at) VALUES
('citizen1', 'citizen1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Arben', 'Krasniqi', '+383 44 456 789', 'Rr. Dardania, Nr. 15', 42.6639, 21.1658, 'CITIZEN', true, NOW(), NOW()),
('citizen2', 'citizen2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Blerim', 'Gashi', '+383 44 567 890', 'Rr. Ulpiana, Nr. 23', 42.6581, 21.1619, 'CITIZEN', true, NOW(), NOW()),
('citizen3', 'citizen3@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Driton', 'Morina', '+383 44 678 901', 'Rr. Dragodan, Nr. 8', 42.6594, 21.1583, 'CITIZEN', true, NOW(), NOW());

-- Sample Reports
INSERT INTO reports (title, description, type, status, priority, latitude, longitude, address, reporter_id, assigned_worker_id, area_id, created_at, updated_at) VALUES
('Overflowing bin near school', 'The waste bin near the primary school is overflowing and creating a mess', 'OVERFLOWING_BIN', 'PENDING', 'HIGH', 42.6639, 21.1658, 'Rr. Dardania, near primary school', 4, NULL, 1, NOW(), NOW()),
('Missing recycling bin', 'The recycling bin on this street has been missing for 3 days', 'MISSING_BIN', 'IN_PROGRESS', 'MEDIUM', 42.6581, 21.1619, 'Rr. Ulpiana, Nr. 25', 5, 2, 2, NOW(), NOW()),
('Illegal dumping site', 'Someone has been dumping construction waste illegally in this area', 'ILLEGAL_DUMP', 'RESOLVED', 'URGENT', 42.6594, 21.1583, 'Behind Dragodan park', 6, 3, 4, NOW(), NOW()),
('Damaged waste container', 'The waste container is damaged and needs replacement', 'DAMAGED_BIN', 'PENDING', 'MEDIUM', 42.6629, 21.1655, 'City center, near market', 4, NULL, 3, NOW(), NOW()),
('Missed collection', 'Waste collection was missed this week in our neighborhood', 'MISSED_COLLECTION', 'PENDING', 'LOW', 42.6639, 21.1658, 'Dardania neighborhood', 5, NULL, 1, NOW(), NOW());

-- Sample Comments on Reports
INSERT INTO report_comments (content, report_id, author_id, created_at) VALUES
('I will investigate this issue tomorrow morning', 2, 2, NOW()),
('Issue has been resolved, area cleaned up', 3, 3, NOW()),
('Thank you for reporting this issue', 2, 5, NOW());

-- Sample Notifications
INSERT INTO notifications (title, message, type, user_id, report_id, is_read, created_at) VALUES
('New Report Assigned', 'You have been assigned a new report: Missing recycling bin', 'REPORT_ASSIGNED', 2, 2, false, NOW()),
('Report Status Updated', 'Your report "Illegal dumping site" has been resolved', 'REPORT_STATUS_CHANGED', 6, 3, false, NOW()),
('Collection Reminder', 'Waste collection is scheduled for tomorrow in your area', 'COLLECTION_REMINDER', 4, NULL, false, NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_assigned_worker_id ON reports(assigned_worker_id);
CREATE INDEX IF NOT EXISTS idx_reports_area_id ON reports(area_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_assigned_area_id ON users(assigned_area_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_areas_location ON areas USING GIST (ST_Point(center_longitude, center_latitude));

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO waste_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO waste_user;






