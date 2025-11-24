-- =====================================================================
-- HOMER - TRUST-FIRST HYBRID RENTAL MARKETPLACE
-- Complete Database Schema for MySQL 8.0
-- =====================================================================
--
-- COMPATIBILITY: This schema works on both MariaDB (dev) and MySQL (prod)
-- DEVELOPMENT: Use with MariaDB locally
-- PRODUCTION: Use with your MySQL 8.0+ server
--
-- USAGE:
-- mysql -u root -p < homer_schema.sql
-- OR
-- mysql -u root -p
-- mysql> CREATE DATABASE homer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- mysql> USE homer_db;
-- mysql> SOURCE homer_schema.sql;
-- =====================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS homer_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE homer_db;

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS admin_audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS shortlists;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;

-- =====================================================================
-- TABLE: users
-- Stores all user accounts (renters, owners, or both)
-- =====================================================================
CREATE TABLE users (
    -- Primary identification
    user_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for user identification',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'User email address',
    phone VARCHAR(20) UNIQUE NOT NULL COMMENT 'User phone number',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
    
    -- User type and basic info
    user_type ENUM('renter', 'owner', 'both', 'admin') NOT NULL DEFAULT 'renter' COMMENT 'User role in marketplace',
    full_name VARCHAR(255) COMMENT 'Full name of user',
    profile_photo_url TEXT COMMENT 'URL to profile photo',
    date_of_birth DATE COMMENT 'Date of birth for verification',
    gender VARCHAR(20) COMMENT 'Gender (optional)',
    
    -- Admin fields
    is_admin BOOLEAN DEFAULT FALSE COMMENT 'Admin access flag',
    admin_role VARCHAR(50) COMMENT 'Admin role type (super_admin, moderator, support)',
    
    -- Account status
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Account active status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
    last_login TIMESTAMP NULL COMMENT 'Last login timestamp',
    
    -- Renter-specific fields
    subscription_tier ENUM('free', 'premium') DEFAULT 'free' COMMENT 'Renter subscription level',
    subscription_start TIMESTAMP NULL COMMENT 'Premium subscription start date',
    subscription_end TIMESTAMP NULL COMMENT 'Premium subscription end date',
    is_verified_renter BOOLEAN DEFAULT FALSE COMMENT 'Renter verification status',
    renter_verification_status ENUM('none', 'pending', 'verified', 'rejected') DEFAULT 'none' COMMENT 'Renter verification workflow status',
    renter_verification_documents JSON COMMENT 'Renter verification document info (ID proof, income proof)',
    renter_preferences JSON COMMENT 'Renter search preferences (budget, BHK, location, lifestyle)',
    employment_info JSON COMMENT 'Employment details (company, designation, income)',
    contacts_used INT DEFAULT 0 COMMENT 'Number of contacts used by free tier renters',
    profile_visibility BOOLEAN DEFAULT TRUE COMMENT 'Show in reverse marketplace',
    
    -- Owner-specific fields
    is_verified_owner BOOLEAN DEFAULT FALSE COMMENT 'Owner verification status',
    owner_verification_status ENUM('none', 'pending', 'verified', 'rejected') DEFAULT 'none' COMMENT 'Owner verification workflow status',
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_user_type (user_type),
    INDEX idx_subscription_tier (subscription_tier),
    INDEX idx_verified_renter (is_verified_renter, profile_visibility),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts table';

-- =====================================================================
-- TABLE: properties
-- Stores all property listings with location, details, and analytics
-- =====================================================================
CREATE TABLE properties (
    -- Primary identification
    property_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for property identification',
    owner_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
    
    -- Basic information
    title VARCHAR(255) NOT NULL COMMENT 'Property listing title',
    description TEXT COMMENT 'Detailed property description',
    property_type VARCHAR(50) COMMENT 'apartment, villa, independent_house, pg',
    bhk_type VARCHAR(20) COMMENT '1BHK, 2BHK, 3BHK, 4BHK+',
    
    -- Pricing
    rent DECIMAL(10,2) NOT NULL COMMENT 'Monthly rent amount',
    security_deposit DECIMAL(10,2) COMMENT 'Security deposit amount',
    maintenance_charges DECIMAL(10,2) DEFAULT 0 COMMENT 'Monthly maintenance charges',
    
    -- Location information (JSON for flexibility)
    location JSON NOT NULL COMMENT 'Address, city, state, pincode, latitude, longitude, locality, landmarks',
    
    -- Property details (JSON for nested structure)
    details JSON COMMENT 'carpet_area, total_floors, floor_number, furnishing, parking, amenities, bathrooms, balconies, facing, age_of_property, available_from, preferred_tenants, pets_allowed, vegetarian_only',
    
    -- Media
    images JSON COMMENT 'Array of image URLs',
    video_url VARCHAR(500) COMMENT 'Property video URL',
    virtual_tour_url VARCHAR(500) COMMENT 'Virtual tour URL',
    
    -- Verification and trust
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Property verification status',
    verification_tier ENUM('free', 'verified') DEFAULT 'free' COMMENT 'Verification tier',
    verification_date TIMESTAMP NULL COMMENT 'Date of verification',
    verification_documents JSON COMMENT 'Owner ID proof and ownership proof info',
    verification_fee_paid BOOLEAN DEFAULT FALSE COMMENT 'Payment status for verification',
    payment_id VARCHAR(255) COMMENT 'Transaction ID for verification payment',
    
    -- Lifestyle data (Premium feature - calculated for verified properties)
    lifestyle_data JSON COMMENT 'aqi_score, noise_level, walkability_score, nearby_parks, nearby_hospitals, nearby_schools, nearby_malls, public_transport_score, safety_score, calculated_at, is_mock',
    
    -- Analytics (tracking property performance)
    analytics JSON COMMENT 'total_views, premium_views, total_contacts, shortlisted_count, last_viewed, views_history',
    
    -- Status and timestamps
    status ENUM('active', 'inactive', 'rented', 'deleted') DEFAULT 'active' COMMENT 'Property listing status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Listing creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Foreign keys
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes for search performance
    INDEX idx_owner_id (owner_id),
    INDEX idx_bhk_type (bhk_type),
    INDEX idx_rent (rent),
    INDEX idx_verification (is_verified, verification_tier),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_property_type (property_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Property listings table';

-- =====================================================================
-- TABLE: chats
-- Stores conversations between renters and owners
-- =====================================================================
CREATE TABLE chats (
    -- Primary identification
    chat_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for chat identification',
    
    -- Participants
    property_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to properties table',
    renter_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table (renter)',
    owner_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table (owner)',
    
    -- Chat metadata
    initiated_by ENUM('renter', 'owner') NOT NULL COMMENT 'Who started the conversation (for reverse marketplace)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Chat creation timestamp',
    last_message_at TIMESTAMP NULL COMMENT 'Last message timestamp',
    status ENUM('active', 'archived', 'blocked') DEFAULT 'active' COMMENT 'Chat status',
    
    -- Messages (stored as JSON array for REST API implementation)
    messages JSON COMMENT 'Array of message objects: {message_id, sender_id, sender_type, message, timestamp, is_read, attachments}',
    
    -- Foreign keys
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_property_id (property_id),
    INDEX idx_renter_id (renter_id),
    INDEX idx_owner_id (owner_id),
    INDEX idx_last_message (last_message_at),
    INDEX idx_status (status),
    UNIQUE INDEX idx_unique_chat (property_id, renter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chat conversations table';

-- =====================================================================
-- TABLE: transactions
-- Stores all payment transactions (subscriptions and verifications)
-- =====================================================================
CREATE TABLE transactions (
    -- Primary identification
    transaction_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for transaction identification',
    user_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
    
    -- Transaction details
    transaction_type ENUM('renter_subscription', 'property_verification') NOT NULL COMMENT 'Type of payment',
    amount DECIMAL(10,2) NOT NULL COMMENT 'Transaction amount',
    currency VARCHAR(3) DEFAULT 'INR' COMMENT 'Currency code',
    
    -- Payment gateway details
    payment_gateway VARCHAR(50) DEFAULT 'razorpay' COMMENT 'Payment gateway used',
    payment_id VARCHAR(255) COMMENT 'Payment gateway transaction ID',
    order_id VARCHAR(255) COMMENT 'Payment gateway order ID',
    payment_status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending' COMMENT 'Payment status',
    
    -- Mock payment indicator
    is_mock BOOLEAN DEFAULT FALSE COMMENT 'Whether this is a mock payment for testing',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Transaction creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Additional metadata (JSON for flexibility)
    metadata JSON COMMENT 'subscription_duration, property_id, invoice_url, etc.',
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment transactions table';

-- =====================================================================
-- TABLE: shortlists
-- Stores properties shortlisted/saved by renters
-- =====================================================================
CREATE TABLE shortlists (
    -- Primary identification
    shortlist_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for shortlist identification',
    user_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table (renter)',
    property_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to properties table',
    
    -- Shortlist details
    notes TEXT COMMENT 'User notes about this property',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Shortlist creation timestamp',
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_property_id (property_id),
    INDEX idx_created_at (created_at),
    UNIQUE INDEX idx_unique_shortlist (user_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Shortlisted properties table';

-- =====================================================================
-- TABLE: notifications
-- Stores user notifications for various events
-- =====================================================================
CREATE TABLE notifications (
    -- Primary identification
    notification_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for notification identification',
    user_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
    
    -- Notification details
    type VARCHAR(50) NOT NULL COMMENT 'new_message, property_view, subscription_expiry, verification_approved, etc.',
    title VARCHAR(255) NOT NULL COMMENT 'Notification title',
    message TEXT NOT NULL COMMENT 'Notification message',
    action_url VARCHAR(500) COMMENT 'URL to navigate when clicked',
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE COMMENT 'Read status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Notification creation timestamp',
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User notifications table';

-- =====================================================================
-- TABLE: reviews (Future feature - not in MVP)
-- Stores property reviews from verified tenants
-- =====================================================================
CREATE TABLE reviews (
    -- Primary identification
    review_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for review identification',
    property_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to properties table',
    renter_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
    
    -- Review details
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5) COMMENT 'Rating from 1 to 5',
    comment TEXT COMMENT 'Review comment',
    is_verified_tenant BOOLEAN DEFAULT FALSE COMMENT 'Whether reviewer was actually a tenant',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Review creation timestamp',
    
    -- Foreign keys
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_property_id (property_id),
    INDEX idx_renter_id (renter_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    UNIQUE INDEX idx_unique_review (property_id, renter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Property reviews table (future feature)';

-- =====================================================================
-- EXAMPLE DATA STRUCTURE COMMENTS
-- JSON column structure examples for reference
-- =====================================================================

-- users.renter_verification_documents JSON structure:
-- {
--   "id_proof": {
--     "type": "aadhaar",
--     "document_url": "/uploads/verification/user_123/aadhaar.pdf",
--     "verified": false,
--     "uploaded_at": "2025-01-15T10:30:00"
--   },
--   "income_proof": {
--     "type": "salary_slip",
--     "document_urls": ["/uploads/verification/user_123/salary_jan.pdf", "/uploads/verification/user_123/salary_feb.pdf"],
--     "verified": false,
--     "uploaded_at": "2025-01-15T10:35:00"
--   }
-- }

-- users.renter_preferences JSON structure:
-- {
--   "budget_min": 15000,
--   "budget_max": 30000,
--   "bhk_type": ["2BHK", "3BHK"],
--   "preferred_locations": ["Koramangala", "Indiranagar", "HSR Layout"],
--   "move_in_date": "2025-03-01",
--   "lifestyle_preferences": {
--     "max_aqi": 60,
--     "max_noise_level": 65,
--     "min_walkability_score": 70,
--     "near_parks": true,
--     "pet_friendly": false,
--     "furnished": "semi-furnished"
--   }
-- }

-- users.employment_info JSON structure:
-- {
--   "company_name": "Tech Corp India",
--   "designation": "Software Engineer",
--   "employment_type": "salaried",
--   "annual_income": 1500000,
--   "experience_years": 5
-- }

-- properties.location JSON structure:
-- {
--   "address": "123, MG Road, Near Central Mall",
--   "city": "Bangalore",
--   "state": "Karnataka",
--   "pincode": "560001",
--   "latitude": 12.9716,
--   "longitude": 77.5946,
--   "locality": "MG Road",
--   "landmarks": ["Central Mall", "Metro Station", "City Park"]
-- }

-- properties.details JSON structure:
-- {
--   "carpet_area": 1200,
--   "total_floors": 10,
--   "floor_number": 5,
--   "furnishing": "semi-furnished",
--   "parking": {
--     "car": 1,
--     "bike": 2
--   },
--   "amenities": ["gym", "swimming_pool", "lift", "power_backup", "security", "park", "playground"],
--   "bathrooms": 2,
--   "balconies": 2,
--   "facing": "east",
--   "age_of_property": 3,
--   "available_from": "2025-02-01",
--   "preferred_tenants": ["family", "bachelor"],
--   "pets_allowed": false,
--   "vegetarian_only": false
-- }

-- properties.lifestyle_data JSON structure:
-- {
--   "aqi_score": 65,
--   "noise_level": 58,
--   "walkability_score": 72,
--   "nearby_parks": [
--     {"name": "Central Park", "distance": 0.8},
--     {"name": "Green Garden", "distance": 1.5}
--   ],
--   "nearby_hospitals": [
--     {"name": "Apollo Hospital", "distance": 2.1}
--   ],
--   "nearby_schools": [
--     {"name": "DPS School", "distance": 1.0}
--   ],
--   "nearby_malls": [
--     {"name": "Central Mall", "distance": 0.5}
--   ],
--   "public_transport_score": 75,
--   "safety_score": 68,
--   "calculated_at": "2025-01-15T12:00:00",
--   "is_mock": true
-- }

-- properties.analytics JSON structure:
-- {
--   "total_views": 156,
--   "premium_views": 42,
--   "total_contacts": 8,
--   "shortlisted_count": 23,
--   "last_viewed": "2025-01-20T14:30:00",
--   "views_history": [
--     {"date": "2025-01-15", "count": 12, "premium_count": 3},
--     {"date": "2025-01-16", "count": 15, "premium_count": 5},
--     {"date": "2025-01-17", "count": 18, "premium_count": 7}
--   ]
-- }

-- chats.messages JSON structure:
-- [
--   {
--     "message_id": "msg_abc123",
--     "sender_id": "user_xyz789",
--     "sender_type": "renter",
--     "message": "Hi, is this property still available?",
--     "timestamp": "2025-01-20T10:30:00",
--     "is_read": true,
--     "attachments": []
--   },
--   {
--     "message_id": "msg_def456",
--     "sender_id": "user_owner123",
--     "sender_type": "owner",
--     "message": "Yes, it is available. Would you like to schedule a visit?",
--     "timestamp": "2025-01-20T11:15:00",
--     "is_read": false,
--     "attachments": []
--   }
-- ]

-- transactions.metadata JSON structure:
-- For renter_subscription:
-- {
--   "subscription_duration": 90,
--   "plan_name": "Premium Renter",
--   "features": ["unlimited_contacts", "lifestyle_search", "verified_badge", "reverse_marketplace"],
--   "invoice_url": "/invoices/txn_abc123.pdf"
-- }
-- For property_verification:
-- {
--   "property_id": "prop_xyz789",
--   "verification_type": "property_ownership",
--   "documents_verified": ["id_proof", "ownership_proof"],
--   "invoice_url": "/invoices/txn_def456.pdf"
-- }

-- =====================================================================
-- TABLE: admin_audit_logs
-- Tracks all admin actions for security and auditing
-- =====================================================================
CREATE TABLE admin_audit_logs (
    -- Primary identification
    log_id VARCHAR(36) PRIMARY KEY COMMENT 'UUID for log entry',
    admin_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table (admin user)',
    
    -- Action details
    action_type VARCHAR(100) NOT NULL COMMENT 'Type of action (user_edit, property_delete, etc)',
    entity_type VARCHAR(50) NOT NULL COMMENT 'Entity affected (user, property, transaction, etc)',
    entity_id VARCHAR(36) COMMENT 'ID of the affected entity',
    action_details JSON COMMENT 'Detailed information about the action',
    
    -- Change tracking
    old_value JSON COMMENT 'Previous value before change',
    new_value JSON COMMENT 'New value after change',
    
    -- Context
    ip_address VARCHAR(45) COMMENT 'IP address of admin',
    user_agent TEXT COMMENT 'Browser/client user agent',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When action was performed',
    
    -- Status
    status ENUM('success', 'failed', 'partial') DEFAULT 'success' COMMENT 'Action outcome',
    error_message TEXT COMMENT 'Error details if action failed',
    
    -- Indexes for performance
    INDEX idx_admin_id (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_timestamp (timestamp),
    
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Admin action audit logs';

-- =====================================================================
-- INITIAL SETUP COMPLETE
-- =====================================================================

-- Verify tables created
SHOW TABLES;

-- Display structure of key tables
DESCRIBE users;
DESCRIBE properties;
DESCRIBE chats;
DESCRIBE transactions;
DESCRIBE admin_audit_logs;

-- =====================================================================
-- NOTES FOR PRODUCTION DEPLOYMENT
-- =====================================================================
-- 
-- 1. BACKUP: Always backup your production database before running this
-- 2. CREDENTIALS: Update DATABASE_URL in backend/.env with your credentials
-- 3. MIGRATION: Export schema from MariaDB (dev) and import to MySQL (prod)
-- 4. INDEXES: Monitor query performance and add indexes as needed
-- 5. JSON COLUMNS: Require MySQL 5.7+ or MariaDB 10.2+
-- 6. CHARACTER SET: utf8mb4 supports emojis and international characters
-- 7. ENGINE: InnoDB provides ACID compliance and foreign key support
-- 8. COLLATION: utf8mb4_unicode_ci for case-insensitive string comparisons
-- 
-- =====================================================================
-- END OF SCHEMA
-- =====================================================================
