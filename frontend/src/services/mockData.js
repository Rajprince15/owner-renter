// =================================================================
// HOMER - COMPLETE MOCK DATA FILE
// =================================================================
//
// This file contains ALL mock data used across the frontend when
// REACT_APP_USE_MOCK_DATA=true in the .env file.
//
// Data structures match EXACTLY with:
// - Database schema from /app/homer_schema.sql
// - Sample data from /app/sample_data.sql
// - Backend API contracts from /app/backend_workflow.txt
// - Frontend expectations from /app/frontend_workflow.txt
//
// When backend is ready, all API calls automatically switch to
// real backend endpoints - NO code changes needed!
// =================================================================

// UUID library available if needed for generating IDs
// import { v4 as uuidv4 } from 'uuid';

// =================================================================
// MOCK USERS DATA
// =================================================================

export const mockUsers = [
  {
    user_id: 'admin_001',
    email: 'admin@homer.com',
    phone: '+919999999999',
    password_hash: 'admin@123', // In real backend, this is hashed
    user_type: 'admin',
    full_name: 'System Administrator',
    profile_photo_url: null,
    date_of_birth: null,
    gender: null,
    is_admin: true,
    admin_role: 'super_admin',
    is_active: true,
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
    
    // Not applicable for admin
    subscription_tier: null,
    subscription_start: null,
    subscription_end: null,
    is_verified_renter: false,
    renter_verification_status: 'none',
    renter_verification_documents: null,
    renter_preferences: null,
    employment_info: null,
    contacts_used: 0,
    profile_visibility: false,
    is_verified_owner: false,
    owner_verification_status: 'none'
  },
  {
    user_id: 'user_001_renter_free',
    email: 'renter.free@homer.com',
    phone: '+919876543210',
    password_hash: 'password123', // In real backend, this is hashed
    user_type: 'renter',
    full_name: 'Raj Kumar',
    profile_photo_url: null,
    date_of_birth: '1995-05-15',
    gender: 'male',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
    
    // Renter-specific fields
    subscription_tier: 'free',
    subscription_start: null,
    subscription_end: null,
    is_verified_renter: false,
    renter_verification_status: 'none',
    renter_verification_documents: null,
    renter_preferences: {
      budget_min: 15000,
      budget_max: 25000,
      bhk_type: ['2BHK'],
      preferred_locations: ['Koramangala', 'HSR Layout'],
      move_in_date: '2025-03-01',
      lifestyle_preferences: null
    },
    employment_info: {
      company_name: 'Tech Startup',
      designation: 'Software Developer',
      employment_type: 'salaried',
      annual_income: 800000,
      experience_years: 2
    },
    contacts_used: 2,
    profile_visibility: true,
    
    // Owner-specific fields
    is_verified_owner: false,
    owner_verification_status: 'none'
  },
  {
    user_id: 'user_002_renter_premium',
    email: 'renter.premium@homer.com',
    phone: '+919876543211',
    password_hash: 'password123',
    user_type: 'renter',
    full_name: 'Priya Sharma',
    profile_photo_url: null,
    date_of_birth: '1992-08-20',
    gender: 'female',
    is_active: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
    
    // Renter-specific fields
    subscription_tier: 'premium',
    subscription_start: new Date().toISOString(),
    subscription_end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified_renter: true,
    renter_verification_status: 'verified',
    renter_verification_documents: {
      id_proof: {
        type: 'aadhaar',
        document_url: '/uploads/verification/user_002/aadhaar.pdf',
        verified: true,
        uploaded_at: '2025-01-10T10:30:00'
      },
      income_proof: {
        type: 'salary_slip',
        document_urls: ['/uploads/verification/user_002/salary_jan.pdf', '/uploads/verification/user_002/salary_feb.pdf'],
        verified: true,
        uploaded_at: '2025-01-10T10:35:00'
      }
    },
    renter_preferences: {
      budget_min: 20000,
      budget_max: 35000,
      bhk_type: ['2BHK', '3BHK'],
      preferred_locations: ['Indiranagar', 'Whitefield'],
      move_in_date: '2025-03-01',
      lifestyle_preferences: {
        max_aqi: 60,
        max_noise_level: 65,
        min_walkability_score: 70,
        near_parks: true,
        pet_friendly: false,
        furnished: 'semi-furnished'
      }
    },
    employment_info: {
      company_name: 'Big Tech Corp',
      designation: 'Senior Software Engineer',
      employment_type: 'salaried',
      annual_income: 1500000,
      experience_years: 5
    },
    contacts_used: 15,
    profile_visibility: true,
    
    // Owner-specific fields
    is_verified_owner: false,
    owner_verification_status: 'none'
  },
  {
    user_id: 'user_003_owner_free',
    email: 'owner.free@homer.com',
    phone: '+919876543212',
    password_hash: 'password123',
    user_type: 'owner',
    full_name: 'Amit Patel',
    profile_photo_url: null,
    date_of_birth: '1985-03-12',
    gender: 'male',
    is_active: true,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
    
    // Renter-specific fields
    subscription_tier: null,
    subscription_start: null,
    subscription_end: null,
    is_verified_renter: false,
    renter_verification_status: 'none',
    renter_verification_documents: null,
    renter_preferences: null,
    employment_info: null,
    contacts_used: 0,
    profile_visibility: false,
    
    // Owner-specific fields
    is_verified_owner: false,
    owner_verification_status: 'none'
  },
  {
    user_id: 'user_004_owner_verified',
    email: 'owner.verified@homer.com',
    phone: '+919876543213',
    password_hash: 'password123',
    user_type: 'owner',
    full_name: 'Sunita Reddy',
    profile_photo_url: null,
    date_of_birth: '1988-11-25',
    gender: 'female',
    is_active: true,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
    
    // Renter-specific fields
    subscription_tier: null,
    subscription_start: null,
    subscription_end: null,
    is_verified_renter: false,
    renter_verification_status: 'none',
    renter_verification_documents: null,
    renter_preferences: null,
    employment_info: null,
    contacts_used: 0,
    profile_visibility: false,
    
    // Owner-specific fields
    is_verified_owner: true,
    owner_verification_status: 'verified'
  },
  {
    user_id: 'user_005_both',
    email: 'user.both@homer.com',
    phone: '+919876543214',
    password_hash: 'password123',
    user_type: 'both',
    full_name: 'Vikram Singh',
    profile_photo_url: null,
    date_of_birth: '1990-07-08',
    gender: 'male',
    is_active: true,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
    
    // Renter-specific fields
    subscription_tier: 'free',
    subscription_start: null,
    subscription_end: null,
    is_verified_renter: false,
    renter_verification_status: 'none',
    renter_verification_documents: null,
    renter_preferences: {
      budget_min: 18000,
      budget_max: 28000,
      bhk_type: ['2BHK', '3BHK'],
      preferred_locations: ['Indiranagar', 'Koramangala'],
      move_in_date: '2025-02-15',
      lifestyle_preferences: null
    },
    employment_info: {
      company_name: 'Consulting Firm',
      designation: 'Business Analyst',
      employment_type: 'salaried',
      annual_income: 1200000,
      experience_years: 4
    },
    contacts_used: 1,
    profile_visibility: true,
    
    // Owner-specific fields
    is_verified_owner: false,
    owner_verification_status: 'none'
  }
];

// =================================================================
// MOCK PROPERTIES DATA
// =================================================================

export const mockProperties = [
  {
    property_id: 'prop_001_free',
    owner_id: 'user_003_owner_free',
    title: 'Spacious 2BHK Apartment in Koramangala',
    description: 'Well-maintained 2BHK apartment with all modern amenities. Close to tech parks and shopping areas. Great for professionals and small families.',
    property_type: 'apartment',
    bhk_type: '2BHK',
    rent: 22000,
    security_deposit: 44000,
    maintenance_charges: 2000,
    location: {
      address: '123, 4th Block, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      latitude: 12.9352,
      longitude: 77.6245,
      locality: 'Koramangala',
      landmarks: ['Sony Signal', 'Forum Mall', 'Koramangala Police Station']
    },
    details: {
      carpet_area: 1100,
      total_floors: 5,
      floor_number: 3,
      furnishing: 'semi-furnished',
      parking: {
        car: 1,
        bike: 1
      },
      amenities: ['lift', 'power_backup', 'security', 'water_supply'],
      bathrooms: 2,
      balconies: 1,
      facing: 'east',
      age_of_property: 5,
      available_from: '2025-02-15',
      preferred_tenants: ['family', 'bachelor'],
      pets_allowed: false,
      vegetarian_only: false
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    video_url: null,
    virtual_tour_url: null,
    is_verified: false,
    verification_tier: 'free',
    verification_date: null,
    verification_documents: null,
    verification_fee_paid: false,
    payment_id: null,
    lifestyle_data: null,
    analytics: {
      total_views: 45,
      premium_views: 8,
      total_contacts: 3,
      shortlisted_count: 12,
      last_viewed: new Date().toISOString(),
      views_history: [
        { date: '2025-01-15', count: 8, premium_count: 2 },
        { date: '2025-01-16', count: 12, premium_count: 3 },
        { date: '2025-01-17', count: 10, premium_count: 1 }
      ]
    },
    status: 'active',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    property_id: 'prop_002_verified',
    owner_id: 'user_004_owner_verified',
    title: 'Luxury 3BHK with Park View in Indiranagar',
    description: 'Premium 3BHK apartment with excellent ventilation, park view, and all modern amenities. Perfect for families looking for a peaceful yet connected location.',
    property_type: 'apartment',
    bhk_type: '3BHK',
    rent: 35000,
    security_deposit: 70000,
    maintenance_charges: 3500,
    location: {
      address: '456, 100 Feet Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      latitude: 12.9716,
      longitude: 77.6412,
      locality: 'Indiranagar',
      landmarks: ['Metro Station', 'CMH Road', 'Central Park', 'Chinmaya Mission Hospital']
    },
    details: {
      carpet_area: 1500,
      total_floors: 8,
      floor_number: 6,
      furnishing: 'furnished',
      parking: {
        car: 2,
        bike: 2
      },
      amenities: ['gym', 'swimming_pool', 'lift', 'power_backup', 'security', 'park', 'club_house', 'playground', 'jogging_track'],
      bathrooms: 3,
      balconies: 2,
      facing: 'north',
      age_of_property: 2,
      available_from: '2025-02-01',
      preferred_tenants: ['family'],
      pets_allowed: true,
      vegetarian_only: false
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    video_url: null,
    virtual_tour_url: null,
    is_verified: true,
    verification_tier: 'verified',
    verification_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    verification_documents: {
      owner_id_proof: {
        type: 'aadhaar',
        document_url: '/uploads/verification/prop_002/owner_aadhaar.pdf',
        verified: true
      },
      ownership_proof: {
        type: 'property_tax',
        document_url: '/uploads/verification/prop_002/property_tax.pdf',
        verified: true
      }
    },
    verification_fee_paid: true,
    payment_id: 'txn_002_verification',
    lifestyle_data: {
      aqi_score: 55,
      noise_level: 52,
      walkability_score: 85,
      nearby_parks: [
        { name: 'Indiranagar Park', distance: 0.3 },
        { name: 'Central Park', distance: 0.8 }
      ],
      nearby_hospitals: [
        { name: 'Apollo Hospital', distance: 2.5 },
        { name: 'Chinmaya Mission Hospital', distance: 1.0 }
      ],
      nearby_schools: [
        { name: 'National Public School', distance: 1.2 },
        { name: 'Delhi Public School', distance: 2.0 }
      ],
      nearby_malls: [
        { name: 'Garuda Mall', distance: 1.5 },
        { name: 'Phoenix Marketcity', distance: 3.0 }
      ],
      public_transport_score: 90,
      safety_score: 82,
      calculated_at: new Date().toISOString(),
      is_mock: true
    },
    analytics: {
      total_views: 245,
      premium_views: 78,
      total_contacts: 15,
      shortlisted_count: 42,
      last_viewed: new Date().toISOString(),
      views_history: [
        { date: '2025-01-15', count: 25, premium_count: 10 },
        { date: '2025-01-16', count: 30, premium_count: 12 },
        { date: '2025-01-17', count: 28, premium_count: 8 }
      ]
    },
    status: 'active',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    property_id: 'prop_003_verified',
    owner_id: 'user_004_owner_verified',
    title: 'Cozy 1BHK Near HSR Layout',
    description: 'Affordable 1BHK apartment perfect for bachelors or young couples. Good connectivity to IT parks and metro station.',
    property_type: 'apartment',
    bhk_type: '1BHK',
    rent: 12000,
    security_deposit: 24000,
    maintenance_charges: 1000,
    location: {
      address: '789, Sector 1, HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      latitude: 12.9121,
      longitude: 77.6446,
      locality: 'HSR Layout',
      landmarks: ['27th Main Road', 'BDA Complex', 'HSR Club']
    },
    details: {
      carpet_area: 600,
      total_floors: 4,
      floor_number: 2,
      furnishing: 'semi-furnished',
      parking: {
        car: 0,
        bike: 1
      },
      amenities: ['lift', 'security', 'water_supply', 'power_backup'],
      bathrooms: 1,
      balconies: 1,
      facing: 'west',
      age_of_property: 7,
      available_from: '2025-02-20',
      preferred_tenants: ['bachelor'],
      pets_allowed: false,
      vegetarian_only: true
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    video_url: null,
    virtual_tour_url: null,
    is_verified: true,
    verification_tier: 'verified',
    verification_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    verification_documents: {
      owner_id_proof: {
        type: 'aadhaar',
        document_url: '/uploads/verification/prop_003/owner_aadhaar.pdf',
        verified: true
      },
      ownership_proof: {
        type: 'electricity_bill',
        document_url: '/uploads/verification/prop_003/electricity_bill.pdf',
        verified: true
      }
    },
    verification_fee_paid: true,
    payment_id: 'txn_003_verification',
    lifestyle_data: {
      aqi_score: 68,
      noise_level: 62,
      walkability_score: 70,
      nearby_parks: [
        { name: 'HSR Lake', distance: 1.2 }
      ],
      nearby_hospitals: [
        { name: 'Fortis Hospital', distance: 2.0 },
        { name: 'Columbia Asia Hospital', distance: 3.5 }
      ],
      nearby_schools: [],
      nearby_malls: [],
      public_transport_score: 65,
      safety_score: 75,
      calculated_at: new Date().toISOString(),
      is_mock: true
    },
    analytics: {
      total_views: 89,
      premium_views: 25,
      total_contacts: 6,
      shortlisted_count: 18,
      last_viewed: new Date().toISOString(),
      views_history: [
        { date: '2025-01-15', count: 15, premium_count: 5 },
        { date: '2025-01-16', count: 18, premium_count: 8 },
        { date: '2025-01-17', count: 12, premium_count: 4 }
      ]
    },
    status: 'active',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    property_id: 'prop_004_verified',
    owner_id: 'user_004_owner_verified',
    title: 'Modern 2BHK in Whitefield Tech Park Area',
    description: 'Brand new 2BHK apartment in the heart of Whitefield. Walking distance to major IT parks, malls, and restaurants.',
    property_type: 'apartment',
    bhk_type: '2BHK',
    rent: 28000,
    security_deposit: 56000,
    maintenance_charges: 2500,
    location: {
      address: '234, Varthur Main Road, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      latitude: 12.9698,
      longitude: 77.7499,
      locality: 'Whitefield',
      landmarks: ['Phoenix Marketcity', 'ITPL', 'Prestige Tech Park']
    },
    details: {
      carpet_area: 1200,
      total_floors: 12,
      floor_number: 8,
      furnishing: 'furnished',
      parking: {
        car: 1,
        bike: 2
      },
      amenities: ['gym', 'swimming_pool', 'lift', 'power_backup', 'security', 'club_house', 'kids_play_area', 'indoor_games'],
      bathrooms: 2,
      balconies: 2,
      facing: 'south',
      age_of_property: 1,
      available_from: '2025-02-10',
      preferred_tenants: ['family', 'bachelor'],
      pets_allowed: true,
      vegetarian_only: false
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    video_url: null,
    virtual_tour_url: null,
    is_verified: true,
    verification_tier: 'verified',
    verification_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    verification_documents: {
      owner_id_proof: {
        type: 'aadhaar',
        document_url: '/uploads/verification/prop_004/owner_aadhaar.pdf',
        verified: true
      },
      ownership_proof: {
        type: 'sale_deed',
        document_url: '/uploads/verification/prop_004/sale_deed.pdf',
        verified: true
      }
    },
    verification_fee_paid: true,
    payment_id: 'txn_004_verification',
    lifestyle_data: {
      aqi_score: 72,
      noise_level: 68,
      walkability_score: 60,
      nearby_parks: [
        { name: 'Whitefield Park', distance: 0.7 }
      ],
      nearby_hospitals: [
        { name: 'Columbia Asia Hospital', distance: 1.5 },
        { name: 'Manipal Hospital', distance: 2.8 }
      ],
      nearby_schools: [
        { name: 'Ryan International School', distance: 1.0 }
      ],
      nearby_malls: [
        { name: 'Phoenix Marketcity', distance: 0.5 },
        { name: 'Forum Value Mall', distance: 1.2 }
      ],
      public_transport_score: 55,
      safety_score: 78,
      calculated_at: new Date().toISOString(),
      is_mock: true
    },
    analytics: {
      total_views: 156,
      premium_views: 52,
      total_contacts: 10,
      shortlisted_count: 28,
      last_viewed: new Date().toISOString(),
      views_history: [
        { date: '2025-01-15', count: 20, premium_count: 8 },
        { date: '2025-01-16', count: 24, premium_count: 10 },
        { date: '2025-01-17', count: 18, premium_count: 6 }
      ]
    },
    status: 'active',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    property_id: 'prop_005_free',
    owner_id: 'user_005_both',
    title: 'Affordable 3BHK in Marathahalli',
    description: 'Spacious 3BHK apartment suitable for families. Close to schools and hospitals.',
    property_type: 'apartment',
    bhk_type: '3BHK',
    rent: 24000,
    security_deposit: 48000,
    maintenance_charges: 2200,
    location: {
      address: '567, Outer Ring Road, Marathahalli',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560037',
      latitude: 12.9591,
      longitude: 77.6974,
      locality: 'Marathahalli',
      landmarks: ['Marathahalli Bridge', 'KR Market']
    },
    details: {
      carpet_area: 1400,
      total_floors: 6,
      floor_number: 4,
      furnishing: 'unfurnished',
      parking: {
        car: 1,
        bike: 1
      },
      amenities: ['lift', 'power_backup', 'security', 'water_supply'],
      bathrooms: 2,
      balconies: 2,
      facing: 'north',
      age_of_property: 6,
      available_from: '2025-03-01',
      preferred_tenants: ['family'],
      pets_allowed: false,
      vegetarian_only: true
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    video_url: null,
    virtual_tour_url: null,
    is_verified: false,
    verification_tier: 'free',
    verification_date: null,
    verification_documents: null,
    verification_fee_paid: false,
    payment_id: null,
    lifestyle_data: null,
    analytics: {
      total_views: 32,
      premium_views: 6,
      total_contacts: 2,
      shortlisted_count: 8,
      last_viewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      views_history: [
        { date: '2025-01-15', count: 5, premium_count: 1 },
        { date: '2025-01-16', count: 8, premium_count: 2 },
        { date: '2025-01-17', count: 6, premium_count: 1 }
      ]
    },
    status: 'active',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// =================================================================
// MOCK CHATS DATA
// =================================================================
// 
// IMPORTANT: These chats demonstrate different scenarios:
// - user_004_owner_verified has 3 properties and receives inquiries from different renters
// - user_003_owner_free has 1 property and receives inquiry from a renter
// - user_001_renter_free contacts 2 different owners about 2 different properties
// - user_002_renter_premium contacts 1 owner about 1 property
// - user_005_both contacts 1 owner about 1 property
//
// This ensures that:
// 1. When owners log in, they see chats about THEIR properties with different renters
// 2. When renters log in, they see chats about different properties with different owners
// 3. The chat list is properly filtered based on user_id and role
//
// Database Schema: chats table stores all messages in a JSON array
// Backend will use this same structure when implemented

export const mockChats = [
  // Chat 1: Premium renter (user_002) inquiring about verified owner's (user_004) luxury 3BHK
  {
    chat_id: 'chat_001',
    property_id: 'prop_002_verified',
    renter_id: 'user_002_renter_premium',
    owner_id: 'user_004_owner_verified',
    initiated_by: 'renter',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    messages: [
      {
        message_id: 'msg_001',
        sender_id: 'user_002_renter_premium',
        sender_type: 'renter',
        message: 'Hi, I am interested in this property. Is it still available?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_002',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'Yes, it is available! The property is well-maintained and ready for immediate move-in. Would you like to schedule a visit?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_003',
        sender_id: 'user_002_renter_premium',
        sender_type: 'renter',
        message: 'I would like to schedule a property visit. Please let me know your available time slots.',
        message_type: 'schedule_visit',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_004',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'Great! I am available this Saturday at 2 PM or Sunday at 11 AM. Which works better for you?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_005',
        sender_id: 'user_002_renter_premium',
        sender_type: 'renter',
        message: 'Saturday 2 PM works perfectly for me. Also, could you please share the property documents for verification?',
        message_type: 'document_request',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_006',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'Perfect! Saturday 2 PM it is. I will share the property tax receipts and ownership proof documents. The property is already verified on Homer, so all documents are authentic.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        is_read: false,
        attachments: []
      }
    ]
  },
  // Chat 2: Free renter (user_001) inquiring about verified owner's (user_004) Whitefield 2BHK
  {
    chat_id: 'chat_002',
    property_id: 'prop_004_verified',
    renter_id: 'user_001_renter_free',
    owner_id: 'user_004_owner_verified',
    initiated_by: 'renter',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    messages: [
      {
        message_id: 'msg_007',
        sender_id: 'user_001_renter_free',
        sender_type: 'renter',
        message: 'Hello, is this property pet-friendly? I saw pets are allowed in the listing.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_008',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'Yes, pets are absolutely welcome! What kind of pet do you have?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_009',
        sender_id: 'user_001_renter_free',
        sender_type: 'renter',
        message: 'I have a small dog, a Beagle. Very friendly and well-trained. Is there a pet deposit?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_010',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'That sounds perfect! There is a small pet deposit of ₹5,000 which is refundable. The society also has a nice park nearby for walks.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_011',
        sender_id: 'user_001_renter_free',
        sender_type: 'renter',
        message: 'That works for me. When can I visit the property?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        is_read: false,
        attachments: []
      }
    ]
  },
  // Chat 3: User with both roles (user_005) inquiring about verified owner's (user_004) HSR 1BHK
  {
    chat_id: 'chat_003',
    property_id: 'prop_003_verified',
    renter_id: 'user_005_both',
    owner_id: 'user_004_owner_verified',
    initiated_by: 'renter',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    messages: [
      {
        message_id: 'msg_012',
        sender_id: 'user_005_both',
        sender_type: 'renter',
        message: 'Hi, I noticed this is a vegetarian-only property. I am a vegetarian and looking for a quiet 1BHK near HSR Layout.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_013',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'Perfect! This property is in a very peaceful building with mostly families. It is well-connected to HSR main road and close to the metro station.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_014',
        sender_id: 'user_005_both',
        sender_type: 'renter',
        message: 'That sounds ideal. What are the maintenance charges and are there any additional charges?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_015',
        sender_id: 'user_004_owner_verified',
        sender_type: 'owner',
        message: 'Maintenance is ₹1,000/month which covers water and common area maintenance. Electricity is separate on actuals. No hidden charges!',
        message_type: 'text',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_016',
        sender_id: 'user_005_both',
        sender_type: 'renter',
        message: 'Could you please share the property documents for verification? (Ownership proof, property tax receipts, etc.)',
        message_type: 'document_request',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
        is_read: false,
        attachments: []
      }
    ]
  },
  // Chat 4: Free renter (user_001) inquiring about free owner's (user_003) Koramangala 2BHK
  {
    chat_id: 'chat_004',
    property_id: 'prop_001_free',
    renter_id: 'user_001_renter_free',
    owner_id: 'user_003_owner_free',
    initiated_by: 'renter',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    messages: [
      {
        message_id: 'msg_017',
        sender_id: 'user_001_renter_free',
        sender_type: 'renter',
        message: 'Hi, I saw your 2BHK property in Koramangala. Is parking available?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_018',
        sender_id: 'user_003_owner_free',
        sender_type: 'owner',
        message: 'Yes, there is covered parking for 1 car and 1 bike. The property is close to Sony Signal and Forum Mall.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_019',
        sender_id: 'user_001_renter_free',
        sender_type: 'renter',
        message: 'Great! What is the security deposit amount?',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_020',
        sender_id: 'user_003_owner_free',
        sender_type: 'owner',
        message: 'Security deposit is ₹44,000 (2 months rent). Monthly rent is ₹22,000 plus ₹2,000 maintenance.',
        message_type: 'text',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        is_read: true,
        attachments: []
      },
      {
        message_id: 'msg_021',
        sender_id: 'user_001_renter_free',
        sender_type: 'renter',
        message: 'Sounds reasonable. Can I schedule a visit this week?',
        message_type: 'schedule_visit',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        is_read: false,
        attachments: []
      }
    ]
  }
];

// =================================================================
// MOCK TRANSACTIONS DATA
// =================================================================

export const mockTransactions = [
  {
    transaction_id: 'txn_001_subscription',
    user_id: 'user_002_renter_premium',
    transaction_type: 'renter_subscription',
    amount: 750,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_id: 'mock_pay_abc123',
    order_id: 'mock_order_xyz789',
    payment_status: 'success',
    is_mock: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      subscription_duration: 90,
      plan_name: 'Premium Renter',
      features: ['unlimited_contacts', 'lifestyle_search', 'verified_badge', 'reverse_marketplace'],
      invoice_url: '/invoices/txn_001_subscription.pdf'
    }
  },
  {
    transaction_id: 'txn_002_verification',
    user_id: 'user_004_owner_verified',
    transaction_type: 'property_verification',
    amount: 2000,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_id: 'mock_pay_def456',
    order_id: 'mock_order_uvw123',
    payment_status: 'success',
    is_mock: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      property_id: 'prop_002_verified',
      verification_type: 'property_ownership',
      documents_verified: ['id_proof', 'ownership_proof'],
      invoice_url: '/invoices/txn_002_verification.pdf'
    }
  },
  {
    transaction_id: 'txn_003_verification',
    user_id: 'user_004_owner_verified',
    transaction_type: 'property_verification',
    amount: 2000,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_id: 'mock_pay_ghi789',
    order_id: 'mock_order_rst456',
    payment_status: 'success',
    is_mock: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      property_id: 'prop_003_verified',
      verification_type: 'property_ownership',
      documents_verified: ['id_proof', 'ownership_proof'],
      invoice_url: '/invoices/txn_003_verification.pdf'
    }
  },
  {
    transaction_id: 'txn_004_verification',
    user_id: 'user_004_owner_verified',
    transaction_type: 'property_verification',
    amount: 2000,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_id: 'mock_pay_jkl012',
    order_id: 'mock_order_mno789',
    payment_status: 'success',
    is_mock: true,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      property_id: 'prop_004_verified',
      verification_type: 'property_ownership',
      documents_verified: ['id_proof', 'ownership_proof'],
      invoice_url: '/invoices/txn_004_verification.pdf'
    }
  }
];

// =================================================================
// MOCK SHORTLISTS DATA
// =================================================================

export const mockShortlists = [
  {
    shortlist_id: 'shortlist_001',
    user_id: 'user_001_renter_free',
    property_id: 'prop_002_verified',
    notes: 'Great location, need to check rent budget',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    shortlist_id: 'shortlist_002',
    user_id: 'user_002_renter_premium',
    property_id: 'prop_002_verified',
    notes: 'Perfect for family, matches all criteria',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    shortlist_id: 'shortlist_003',
    user_id: 'user_002_renter_premium',
    property_id: 'prop_003_verified',
    notes: 'Backup option if 3BHK not available',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    shortlist_id: 'shortlist_004',
    user_id: 'user_001_renter_free',
    property_id: 'prop_004_verified',
    notes: 'Whitefield location is convenient for work',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// =================================================================
// MOCK NOTIFICATIONS DATA
// =================================================================

export const mockNotifications = [
  {
    notification_id: 'notif_001',
    user_id: 'user_002_renter_premium',
    type: 'new_message',
    title: 'New Message from Owner',
    message: 'You have a new message regarding your inquiry for 3BHK property in Indiranagar',
    action_url: '/renter/chats/chat_001',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    notification_id: 'notif_002',
    user_id: 'user_004_owner_verified',
    type: 'property_view',
    title: 'Property Viewed',
    message: 'Your property "Luxury 3BHK with Park View" was viewed by a premium renter',
    action_url: '/owner/property/prop_002_verified/analytics',
    is_read: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    notification_id: 'notif_003',
    user_id: 'user_001_renter_free',
    type: 'contact_limit_warning',
    title: 'Contact Limit Warning',
    message: 'You have reached your free contact limit (2 contacts). Upgrade to premium for unlimited contacts!',
    action_url: '/renter/subscription',
    is_read: false,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    notification_id: 'notif_004',
    user_id: 'user_004_owner_verified',
    type: 'new_contact',
    title: 'New Contact Request',
    message: 'A verified renter has contacted you about your Whitefield property',
    action_url: '/owner/chats/chat_002',
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    notification_id: 'notif_005',
    user_id: 'user_002_renter_premium',
    type: 'subscription_expiry',
    title: 'Subscription Expiring Soon',
    message: 'Your premium subscription will expire in 30 days. Renew now to continue enjoying benefits.',
    action_url: '/renter/subscription',
    is_read: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

// =================================================================
// HELPER FUNCTIONS
// =================================================================

// Function to get user by email or phone (for login)
export const getUserByCredentials = (emailOrPhone, password) => {
  return mockUsers.find(
    u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password_hash === password
  );
};

// Function to get user by ID
export const getUserById = (userId) => {
  return mockUsers.find(u => u.user_id === userId);
};

// Function to get property by ID
export const getPropertyById = (propertyId) => {
  return mockProperties.find(p => p.property_id === propertyId);
};

// Function to get properties by owner
export const getPropertiesByOwner = (ownerId) => {
  return mockProperties.filter(p => p.owner_id === ownerId && p.status !== 'deleted');
};

// Function to get chats by user
export const getChatsByUser = (userId) => {
  return mockChats.filter(c => c.renter_id === userId || c.owner_id === userId);
};

// Function to get shortlists by user
export const getShortlistsByUser = (userId) => {
  return mockShortlists.filter(s => s.user_id === userId);
};

// Function to get transactions by user
export const getTransactionsByUser = (userId) => {
  return mockTransactions.filter(t => t.user_id === userId);
};

// Function to get notifications by user
export const getNotificationsByUser = (userId) => {
  return mockNotifications.filter(n => n.user_id === userId);
};

// Function to get unread notifications count
export const getUnreadNotificationsCount = (userId) => {
  return mockNotifications.filter(n => n.user_id === userId && !n.is_read).length;
};

// Function to generate mock property (for creating new ones)
export const generateMockProperty = (propertyData, ownerId) => {
  return {
    property_id: `prop_${Date.now()}`,
    owner_id: ownerId,
    ...propertyData,
    is_verified: false,
    verification_tier: 'free',
    verification_date: null,
    verification_documents: null,
    verification_fee_paid: false,
    payment_id: null,
    lifestyle_data: null,
    analytics: {
      total_views: 0,
      premium_views: 0,
      total_contacts: 0,
      shortlisted_count: 0,
      last_viewed: null,
      views_history: []
    },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Export all mock data as default
export default {
  mockUsers,
  mockProperties,
  mockChats,
  mockTransactions,
  mockShortlists,
  mockNotifications,
  getUserByCredentials,
  getUserById,
  getPropertyById,
  getPropertiesByOwner,
  getChatsByUser,
  getShortlistsByUser,
  getTransactionsByUser,
  getNotificationsByUser,
  getUnreadNotificationsCount,
  generateMockProperty
};
