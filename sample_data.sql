-- =====================================================================
-- HOMER - SAMPLE DATA FOR TESTING
-- Use this to populate database with test data
-- =====================================================================

USE homer_db;

-- =====================================================================
-- SAMPLE USERS
-- =====================================================================

-- Sample Renter (Free Tier)
INSERT INTO users (
    user_id, email, phone, password_hash, user_type, full_name,
    subscription_tier, contacts_used, is_verified_renter, renter_verification_status,
    renter_preferences, employment_info, profile_visibility, created_at
) VALUES (
    'user_001_renter_free',
    'renter.free@homer.com',
    '+919876543210',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJB.Dq3s.P2', -- password: password123
    'renter',
    'Raj Kumar',
    'free',
    2,
    FALSE,
    'none',
    '{"budget_min": 15000, "budget_max": 25000, "bhk_type": ["2BHK"], "preferred_locations": ["Koramangala", "HSR Layout"], "move_in_date": "2025-03-01"}',
    '{"company_name": "Tech Startup", "designation": "Software Developer", "employment_type": "salaried", "annual_income": 800000}',
    TRUE,
    NOW()
);

-- Sample Renter (Premium + Verified)
INSERT INTO users (
    user_id, email, phone, password_hash, user_type, full_name,
    subscription_tier, subscription_start, subscription_end, contacts_used,
    is_verified_renter, renter_verification_status,
    renter_preferences, employment_info, profile_visibility, created_at
) VALUES (
    'user_002_renter_premium',
    'renter.premium@homer.com',
    '+919876543211',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJB.Dq3s.P2',
    'renter',
    'Priya Sharma',
    'premium',
    NOW(),
    DATE_ADD(NOW(), INTERVAL 90 DAY),
    15,
    TRUE,
    'verified',
    '{"budget_min": 20000, "budget_max": 35000, "bhk_type": ["2BHK", "3BHK"], "preferred_locations": ["Indiranagar", "Whitefield"], "lifestyle_preferences": {"max_aqi": 60, "max_noise_level": 65, "near_parks": true}}',
    '{"company_name": "Big Tech Corp", "designation": "Senior Software Engineer", "employment_type": "salaried", "annual_income": 1500000}',
    TRUE,
    NOW()
);

-- Sample Owner (Free Tier)
INSERT INTO users (
    user_id, email, phone, password_hash, user_type, full_name,
    is_verified_owner, owner_verification_status, created_at
) VALUES (
    'user_003_owner_free',
    'owner.free@homer.com',
    '+919876543212',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJB.Dq3s.P2',
    'owner',
    'Amit Patel',
    FALSE,
    'none',
    NOW()
);

-- Sample Owner (Verified)
INSERT INTO users (
    user_id, email, phone, password_hash, user_type, full_name,
    is_verified_owner, owner_verification_status, created_at
) VALUES (
    'user_004_owner_verified',
    'owner.verified@homer.com',
    '+919876543213',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJB.Dq3s.P2',
    'owner',
    'Sunita Reddy',
    TRUE,
    'verified',
    NOW()
);

-- Sample Admin User
INSERT INTO users (
    user_id, email, phone, password_hash, user_type, full_name,
    is_admin, admin_role, is_active, created_at
) VALUES (
    'admin_001',
    'admin@homer.com',
    '+919999999999',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJB.Dq3s.P2', -- password: admin@123
    'admin',
    'System Administrator',
    TRUE,
    'super_admin',
    TRUE,
    NOW()
);

-- Sample User (Both Renter + Owner)
INSERT INTO users (
    user_id, email, phone, password_hash, user_type, full_name,
    subscription_tier, is_verified_renter, is_verified_owner, created_at
) VALUES (
    'user_005_both',
    'user.both@homer.com',
    '+919876543214',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyJB.Dq3s.P2',
    'both',
    'Vikram Singh',
    'free',
    FALSE,
    FALSE,
    NOW()
);

-- =====================================================================
-- SAMPLE PROPERTIES
-- =====================================================================

-- Property 1: Free Listing (Unverified)
INSERT INTO properties (
    property_id, owner_id, title, description, property_type, bhk_type,
    rent, security_deposit, maintenance_charges,
    location, details, images,
    is_verified, verification_tier, status, created_at
) VALUES (
    'prop_001_free',
    'user_003_owner_free',
    'Spacious 2BHK Apartment in Koramangala',
    'Well-maintained 2BHK apartment with all modern amenities. Close to tech parks and shopping areas.',
    'apartment',
    '2BHK',
    22000.00,
    44000.00,
    2000.00,
    '{"address": "123, 4th Block, Koramangala", "city": "Bangalore", "state": "Karnataka", "pincode": "560034", "latitude": 12.9352, "longitude": 77.6245, "locality": "Koramangala", "landmarks": ["Sony Signal", "Forum Mall"]}',
    '{"carpet_area": 1100, "total_floors": 5, "floor_number": 3, "furnishing": "semi-furnished", "parking": {"car": 1, "bike": 1}, "amenities": ["lift", "power_backup", "security"], "bathrooms": 2, "balconies": 1, "facing": "east", "age_of_property": 5, "available_from": "2025-02-15", "preferred_tenants": ["family", "bachelor"], "pets_allowed": false, "vegetarian_only": false}',
    '["https://example.com/images/prop1_img1.jpg", "https://example.com/images/prop1_img2.jpg"]',
    FALSE,
    'free',
    'active',
    NOW()
);

-- Property 2: Verified Listing with Lifestyle Data
INSERT INTO properties (
    property_id, owner_id, title, description, property_type, bhk_type,
    rent, security_deposit, maintenance_charges,
    location, details, images,
    is_verified, verification_tier, verification_date, verification_fee_paid,
    lifestyle_data, analytics, status, created_at
) VALUES (
    'prop_002_verified',
    'user_004_owner_verified',
    'Luxury 3BHK with Park View in Indiranagar',
    'Premium 3BHK apartment with excellent ventilation, park view, and all modern amenities. Perfect for families.',
    'apartment',
    '3BHK',
    35000.00,
    70000.00,
    3500.00,
    '{"address": "456, 100 Feet Road, Indiranagar", "city": "Bangalore", "state": "Karnataka", "pincode": "560038", "latitude": 12.9716, "longitude": 77.6412, "locality": "Indiranagar", "landmarks": ["Metro Station", "CMH Road", "Central Park"]}',
    '{"carpet_area": 1500, "total_floors": 8, "floor_number": 6, "furnishing": "furnished", "parking": {"car": 2, "bike": 2}, "amenities": ["gym", "swimming_pool", "lift", "power_backup", "security", "park", "club_house"], "bathrooms": 3, "balconies": 2, "facing": "north", "age_of_property": 2, "available_from": "2025-02-01", "preferred_tenants": ["family"], "pets_allowed": true, "vegetarian_only": false}',
    '["https://example.com/images/prop2_img1.jpg", "https://example.com/images/prop2_img2.jpg", "https://example.com/images/prop2_img3.jpg"]',
    TRUE,
    'verified',
    NOW(),
    TRUE,
    '{"aqi_score": 55, "noise_level": 52, "walkability_score": 85, "nearby_parks": [{"name": "Indiranagar Park", "distance": 0.3}, {"name": "Central Park", "distance": 0.8}], "nearby_hospitals": [{"name": "Apollo Hospital", "distance": 2.5}], "nearby_schools": [{"name": "National Public School", "distance": 1.2}], "nearby_malls": [{"name": "Garuda Mall", "distance": 1.5}], "public_transport_score": 90, "safety_score": 82, "calculated_at": "2025-01-15T10:00:00", "is_mock": true}',
    '{"total_views": 245, "premium_views": 78, "total_contacts": 15, "shortlisted_count": 42, "last_viewed": "2025-01-20T16:30:00"}',
    'active',
    NOW()
);

-- Property 3: Budget 1BHK
INSERT INTO properties (
    property_id, owner_id, title, description, property_type, bhk_type,
    rent, security_deposit, maintenance_charges,
    location, details, images,
    is_verified, verification_tier, verification_date, verification_fee_paid,
    lifestyle_data, status, created_at
) VALUES (
    'prop_003_verified',
    'user_004_owner_verified',
    'Cozy 1BHK Near HSR Layout',
    'Affordable 1BHK apartment perfect for bachelors or young couples. Good connectivity.',
    'apartment',
    '1BHK',
    12000.00,
    24000.00,
    1000.00,
    '{"address": "789, Sector 1, HSR Layout", "city": "Bangalore", "state": "Karnataka", "pincode": "560102", "latitude": 12.9121, "longitude": 77.6446, "locality": "HSR Layout", "landmarks": ["27th Main Road", "BDA Complex"]}',
    '{"carpet_area": 600, "total_floors": 4, "floor_number": 2, "furnishing": "semi-furnished", "parking": {"car": 0, "bike": 1}, "amenities": ["lift", "security"], "bathrooms": 1, "balconies": 1, "facing": "west", "age_of_property": 7, "available_from": "2025-02-20", "preferred_tenants": ["bachelor"], "pets_allowed": false, "vegetarian_only": true}',
    '["https://example.com/images/prop3_img1.jpg"]',
    TRUE,
    'verified',
    NOW(),
    TRUE,
    '{"aqi_score": 68, "noise_level": 62, "walkability_score": 70, "nearby_parks": [{"name": "HSR Lake", "distance": 1.2}], "nearby_hospitals": [{"name": "Fortis Hospital", "distance": 2.0}], "nearby_schools": [], "nearby_malls": [], "public_transport_score": 65, "safety_score": 75, "calculated_at": "2025-01-16T11:00:00", "is_mock": true}',
    'active',
    NOW()
);

-- =====================================================================
-- SAMPLE SHORTLISTS
-- =====================================================================

INSERT INTO shortlists (shortlist_id, user_id, property_id, notes, created_at)
VALUES 
    ('shortlist_001', 'user_001_renter_free', 'prop_002_verified', 'Great location, need to check rent budget', NOW()),
    ('shortlist_002', 'user_002_renter_premium', 'prop_002_verified', 'Perfect for family, matches all criteria', NOW()),
    ('shortlist_003', 'user_002_renter_premium', 'prop_003_verified', 'Backup option if 3BHK not available', NOW());

-- =====================================================================
-- SAMPLE CHATS
-- =====================================================================

INSERT INTO chats (
    chat_id, property_id, renter_id, owner_id, initiated_by,
    created_at, last_message_at, status, messages
) VALUES (
    'chat_001',
    'prop_002_verified',
    'user_002_renter_premium',
    'user_004_owner_verified',
    'renter',
    NOW(),
    NOW(),
    'active',
    '[
        {
            "message_id": "msg_001",
            "sender_id": "user_002_renter_premium",
            "sender_type": "renter",
            "message": "Hi, I am interested in this property. Is it still available?",
            "timestamp": "2025-01-20T10:30:00",
            "is_read": true,
            "attachments": []
        },
        {
            "message_id": "msg_002",
            "sender_id": "user_004_owner_verified",
            "sender_type": "owner",
            "message": "Yes, it is available. Would you like to schedule a visit?",
            "timestamp": "2025-01-20T11:15:00",
            "is_read": true,
            "attachments": []
        },
        {
            "message_id": "msg_003",
            "sender_id": "user_002_renter_premium",
            "sender_type": "renter",
            "message": "Yes, I would like to visit this weekend. Is Saturday 2 PM good?",
            "timestamp": "2025-01-20T11:45:00",
            "is_read": false,
            "attachments": []
        }
    ]'
);

-- =====================================================================
-- SAMPLE TRANSACTIONS
-- =====================================================================

-- Premium subscription transaction
INSERT INTO transactions (
    transaction_id, user_id, transaction_type, amount, currency,
    payment_gateway, payment_id, order_id, payment_status, is_mock,
    created_at, metadata
) VALUES (
    'txn_001_subscription',
    'user_002_renter_premium',
    'renter_subscription',
    750.00,
    'INR',
    'razorpay',
    'mock_pay_abc123',
    'mock_order_xyz789',
    'success',
    TRUE,
    NOW(),
    '{"subscription_duration": 90, "plan_name": "Premium Renter", "features": ["unlimited_contacts", "lifestyle_search", "verified_badge", "reverse_marketplace"]}'
);

-- Property verification transaction
INSERT INTO transactions (
    transaction_id, user_id, transaction_type, amount, currency,
    payment_gateway, payment_id, order_id, payment_status, is_mock,
    created_at, metadata
) VALUES (
    'txn_002_verification',
    'user_004_owner_verified',
    'property_verification',
    2000.00,
    'INR',
    'razorpay',
    'mock_pay_def456',
    'mock_order_uvw123',
    'success',
    TRUE,
    NOW(),
    '{"property_id": "prop_002_verified", "verification_type": "property_ownership", "documents_verified": ["id_proof", "ownership_proof"]}'
);

-- =====================================================================
-- SAMPLE NOTIFICATIONS
-- =====================================================================

INSERT INTO notifications (
    notification_id, user_id, type, title, message, action_url, is_read, created_at
)
VALUES 
    (
        'notif_001',
        'user_002_renter_premium',
        'new_message',
        'New Message from Owner',
        'You have a new message regarding your inquiry for 3BHK property in Indiranagar',
        '/renter/chats/chat_001',
        FALSE,
        NOW()
    ),
    (
        'notif_002',
        'user_004_owner_verified',
        'property_view',
        'Property Viewed',
        'Your property "Luxury 3BHK with Park View" was viewed by a premium renter',
        '/owner/property/prop_002_verified/analytics',
        TRUE,
        NOW()
    ),
    (
        'notif_003',
        'user_001_renter_free',
        'contact_limit_warning',
        'Contact Limit Warning',
        'You have used 2 of 5 free contacts. Upgrade to premium for unlimited contacts.',
        '/renter/subscription',
        FALSE,
        NOW()
    );

-- =====================================================================
-- VERIFY DATA INSERTED
-- =====================================================================

-- Count records in all tables
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Properties', COUNT(*) FROM properties
UNION ALL
SELECT 'Chats', COUNT(*) FROM chats
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Shortlists', COUNT(*) FROM shortlists
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

-- =====================================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================================

-- Find premium renters with their preferences
SELECT 
    user_id, 
    full_name, 
    email, 
    subscription_tier,
    JSON_EXTRACT(renter_preferences, '$.budget_max') AS max_budget,
    JSON_EXTRACT(renter_preferences, '$.preferred_locations') AS locations
FROM users
WHERE subscription_tier = 'premium' AND user_type IN ('renter', 'both');

-- Find verified properties with good lifestyle scores
SELECT 
    property_id,
    title,
    rent,
    JSON_EXTRACT(lifestyle_data, '$.aqi_score') AS aqi,
    JSON_EXTRACT(lifestyle_data, '$.walkability_score') AS walkability,
    JSON_EXTRACT(analytics, '$.total_views') AS views
FROM properties
WHERE is_verified = TRUE
ORDER BY JSON_EXTRACT(analytics, '$.total_views') DESC;

-- Find properties within budget range
SELECT 
    property_id,
    title,
    bhk_type,
    rent,
    JSON_EXTRACT(location, '$.locality') AS locality
FROM properties
WHERE rent BETWEEN 15000 AND 30000
    AND status = 'active'
ORDER BY rent ASC;

-- Get unread notifications for a user
SELECT 
    notification_id,
    type,
    title,
    message,
    created_at
FROM notifications
WHERE user_id = 'user_002_renter_premium'
    AND is_read = FALSE
ORDER BY created_at DESC;

-- =====================================================================
-- END OF SAMPLE DATA
-- =====================================================================
