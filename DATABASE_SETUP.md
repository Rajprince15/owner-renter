# Homer Database Setup Guide

## 📋 Overview

This guide explains how to set up the complete database schema for the Homer rental marketplace platform.

**Database:** MySQL 8.0+ (Production) / MariaDB 10.2+ (Development)  
**Schema File:** `homer_schema.sql`  
**Total Tables:** 7 tables  
**Lines of Code:** 490 lines

---

## 🗃️ Database Tables

### Core Tables (MVP)
1. **users** - User accounts (renters, owners, or both)
2. **properties** - Property listings with location, details, and analytics
3. **chats** - Conversations between renters and owners
4. **transactions** - Payment transactions (subscriptions and verifications)
5. **shortlists** - Properties saved/shortlisted by renters
6. **notifications** - User notifications for various events

### Future Tables (Post-MVP)
7. **reviews** - Property reviews from verified tenants

---

## 🚀 Quick Start

### Option 1: Command Line (Recommended)

```bash
# For MariaDB (Development)
mysql -u root < /app/homer_schema.sql

# For MySQL (Production with password)
mysql -u your_username -p < /app/homer_schema.sql
```

### Option 2: MySQL CLI Interactive

```bash
# Login to MySQL
mysql -u root -p

# Run these commands
mysql> CREATE DATABASE homer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
mysql> USE homer_db;
mysql> SOURCE /app/homer_schema.sql;
mysql> SHOW TABLES;
```

### Option 3: MySQL Workbench / phpMyAdmin

1. Open your MySQL GUI tool
2. Create new database: `homer_db`
3. Import/Execute file: `/app/homer_schema.sql`
4. Verify tables created successfully

---

## 📊 Table Details

### 1. users Table
**Purpose:** Store all user accounts with dual profiles (renter + owner)

**Key Fields:**
- Primary: `user_id` (UUID)
- Auth: `email`, `phone`, `password_hash`
- Type: `user_type` (renter/owner/both)
- Renter: `subscription_tier`, `contacts_used`, `is_verified_renter`
- Owner: `is_verified_owner`
- JSON: `renter_preferences`, `employment_info`, `renter_verification_documents`

**Indexes:** email, phone, user_type, subscription_tier

---

### 2. properties Table
**Purpose:** Store all property listings with rich data

**Key Fields:**
- Primary: `property_id` (UUID)
- Owner: `owner_id` (FK to users)
- Basic: `title`, `description`, `property_type`, `bhk_type`
- Pricing: `rent`, `security_deposit`, `maintenance_charges`
- JSON Fields:
  - `location` - address, city, lat/long, locality
  - `details` - carpet_area, furnishing, parking, amenities
  - `images` - array of image URLs
  - `lifestyle_data` - AQI, noise, walkability, nearby amenities
  - `analytics` - views, contacts, shortlists tracking
- Verification: `is_verified`, `verification_tier`

**Indexes:** owner_id, bhk_type, rent, is_verified, status

---

### 3. chats Table
**Purpose:** Store conversations between renters and owners

**Key Fields:**
- Primary: `chat_id` (UUID)
- Participants: `property_id`, `renter_id`, `owner_id`
- Metadata: `initiated_by`, `last_message_at`, `status`
- JSON: `messages` - array of message objects

**Indexes:** property_id, renter_id, owner_id, last_message_at

**Note:** Messages stored as JSON array for REST API. For WebSocket upgrade, consider separate `messages` table.

---

### 4. transactions Table
**Purpose:** Store all payment transactions

**Key Fields:**
- Primary: `transaction_id` (UUID)
- User: `user_id` (FK to users)
- Type: `transaction_type` (renter_subscription/property_verification)
- Payment: `amount`, `payment_id`, `order_id`, `payment_status`
- Testing: `is_mock` - flag for mock payments
- JSON: `metadata` - subscription_duration, property_id, invoice_url

**Indexes:** user_id, transaction_type, payment_status

---

### 5. shortlists Table
**Purpose:** Store properties saved by renters

**Key Fields:**
- Primary: `shortlist_id` (UUID)
- Relationship: `user_id`, `property_id` (both FKs)
- Data: `notes`, `created_at`

**Unique Index:** (user_id, property_id) - prevents duplicate shortlists

---

### 6. notifications Table
**Purpose:** Store user notifications

**Key Fields:**
- Primary: `notification_id` (UUID)
- User: `user_id` (FK to users)
- Content: `type`, `title`, `message`, `action_url`
- Status: `is_read`, `created_at`

**Indexes:** user_id, is_read, type, created_at

---

### 7. reviews Table (Future)
**Purpose:** Store property reviews

**Key Fields:**
- Primary: `review_id` (UUID)
- Relationship: `property_id`, `renter_id`
- Content: `rating` (1-5), `comment`
- Verification: `is_verified_tenant`

**Unique Index:** (property_id, renter_id) - one review per renter per property

---

## 🔄 Development to Production Migration

### Step 1: Export from MariaDB (Development)

```bash
# Export schema only (no data)
mysqldump -u root -d homer_db > homer_schema_backup.sql

# Export schema + data
mysqldump -u root homer_db > homer_full_backup.sql
```

### Step 2: Import to MySQL (Production)

```bash
# Import to your production MySQL
mysql -u your_username -p your_database < homer_schema_backup.sql
```

### Step 3: Update Backend Configuration

Update `/app/backend/.env`:

```env
# FROM (Development - MariaDB):
DATABASE_URL=mysql://root@localhost:3306/homer_db

# TO (Production - MySQL):
DATABASE_URL=mysql://your_user:your_password@your_host:3306/homer_db
```

### Step 4: Restart Backend

```bash
sudo supervisorctl restart backend
```

---

## 🔐 Security Considerations

### Password Management
- **Development:** No password (local MariaDB)
- **Production:** Strong password for MySQL user
- **Never commit:** Production credentials to Git

### Recommended MySQL User Setup (Production)

```sql
-- Create dedicated user for Homer app
CREATE USER 'homer_app'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON homer_db.* TO 'homer_app'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;
```

---

## 📝 JSON Column Examples

### users.renter_preferences
```json
{
  "budget_min": 15000,
  "budget_max": 30000,
  "bhk_type": ["2BHK", "3BHK"],
  "preferred_locations": ["Koramangala", "Indiranagar"],
  "move_in_date": "2025-03-01",
  "lifestyle_preferences": {
    "max_aqi": 60,
    "max_noise_level": 65,
    "min_walkability_score": 70,
    "near_parks": true,
    "pet_friendly": false
  }
}
```

### properties.location
```json
{
  "address": "123, MG Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "locality": "MG Road",
  "landmarks": ["Central Mall", "Metro Station"]
}
```

### properties.lifestyle_data
```json
{
  "aqi_score": 65,
  "noise_level": 58,
  "walkability_score": 72,
  "nearby_parks": [
    {"name": "Central Park", "distance": 0.8}
  ],
  "public_transport_score": 75,
  "calculated_at": "2025-01-15T12:00:00",
  "is_mock": true
}
```

### chats.messages
```json
[
  {
    "message_id": "msg_abc123",
    "sender_id": "user_xyz789",
    "sender_type": "renter",
    "message": "Hi, is this property available?",
    "timestamp": "2025-01-20T10:30:00",
    "is_read": true,
    "attachments": []
  }
]
```

---

## 🛠️ Maintenance Queries

### Check Database Size
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'homer_db'
ORDER BY (data_length + index_length) DESC;
```

### Count Records in All Tables
```sql
SELECT 'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'chats', COUNT(*) FROM chats
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'shortlists', COUNT(*) FROM shortlists
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;
```

### Find Verified Properties
```sql
SELECT 
    property_id, 
    title, 
    rent, 
    verification_tier,
    created_at
FROM properties
WHERE is_verified = TRUE
ORDER BY created_at DESC
LIMIT 10;
```

### Premium Users Count
```sql
SELECT 
    subscription_tier,
    COUNT(*) AS count
FROM users
WHERE user_type IN ('renter', 'both')
GROUP BY subscription_tier;
```

---

## ⚡ Performance Optimization

### Add Additional Indexes (if needed)
```sql
-- For location-based searches
ALTER TABLE properties 
ADD INDEX idx_location_city ((CAST(location->>'$.city' AS CHAR(100))));

-- For date range filters
ALTER TABLE properties 
ADD INDEX idx_available_from ((CAST(details->>'$.available_from' AS DATE)));

-- For rent range searches
ALTER TABLE properties 
ADD INDEX idx_rent_range (rent, bhk_type);
```

### Analyze Tables
```sql
ANALYZE TABLE users, properties, chats, transactions, shortlists, notifications;
```

---

## 🐛 Troubleshooting

### Issue: JSON column not working
**Solution:** Ensure MySQL 5.7+ or MariaDB 10.2+
```sql
SELECT VERSION();
```

### Issue: Foreign key constraint fails
**Solution:** Ensure parent record exists before inserting child
```sql
-- Check if user exists before creating property
SELECT user_id FROM users WHERE user_id = 'your_uuid';
```

### Issue: Character encoding problems
**Solution:** Verify database charset
```sql
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'homer_db';
```

---

## 📚 Additional Resources

- **Workflow Document:** `/app/workflow.txt` - Complete feature specifications
- **Phased Plan:** `/app/phased_implementation_plan.txt` - Development phases
- **Features:** `/app/features.txt` - Business requirements
- **Schema File:** `/app/homer_schema.sql` - Complete SQL schema

---

## ✅ Verification Checklist

After running the schema, verify:

- [ ] Database `homer_db` created
- [ ] All 7 tables created successfully
- [ ] Foreign key constraints working
- [ ] JSON columns supported
- [ ] Indexes created properly
- [ ] Can insert sample data
- [ ] Backend connects successfully

---

## 📞 Support

For issues or questions:
1. Check MySQL error logs
2. Verify MySQL version compatibility
3. Review foreign key relationships
4. Check JSON syntax (MySQL 5.7+ required)

---

**Last Updated:** January 2025  
**MySQL Version:** 8.0+  
**MariaDB Version:** 10.2+  
**Schema Version:** 1.0.0
