"# HOMER - TIER SYSTEM IMPLEMENTATION GUIDE

## 🎯 Overview

This document provides a comprehensive guide for implementing the freemium tier system in Homer's Trust-First Hybrid Rental Marketplace. This system is the core of our business model and must be implemented **exactly** as specified.

---

## 📊 Business Model: \"Freemium\" - Free & Limited vs. Paid & Powerful

**Core Principle:** We monetize **trust and access**, not ads. Our platform is ad-free and focused on quality.

### Revenue Streams:
1. **Renter Premium Subscriptions:** ₹750 for 90 days
2. **Property Verification Fees:** ₹2,000 per property (one-time)

---

## 👥 RENTER TIERS

### Tier 1: FREE BROWSER (Free Forever)

**Target User:** Casual renter just starting their search

**What They Get:**
- ✅ Unlimited browsing of **all** property listings (verified and unverified)
- ✅ Basic search filters **ONLY**:
  - Price range
  - BHK count (1BHK, 2BHK, 3BHK, 4BHK+)
  - City/Location
  - Property type (optional)
  
**The \"Pain Point\" (Limitations):**
- ⚠️ **Strict 5-contact limit** - Can only initiate chat with 5 properties maximum
- ❌ **NO** access to advanced lifestyle search (AQI, noise, walkability filters)
- ❌ **NOT** listed in reverse marketplace
- ❌ **NO** verified renter badge

**Database Fields:**
```sql
subscription_tier = 'free'
contacts_used = 0-5 (increments on each new chat)
is_verified_renter = FALSE
```

**Backend Logic:**
```python
# Before creating chat
if user.subscription_tier == 'free':
    if user.contacts_used >= 5:
        raise HTTPException(
            status_code=403,
            detail=\"Contact limit reached. Upgrade to Premium.\"
        )
    
# After successful chat creation
if user.subscription_tier == 'free':
    user.contacts_used += 1
    db.commit()
```

**Frontend Behavior:**
- Show contact counter: \"3/5 contacts used\"
- Display upgrade modal when limit hit
- Lock lifestyle search filters with \"Premium Only\" overlay

---

### Tier 2: PREMIUM RENTER (₹750 for 90 days)

**Target User:** Serious renter who wants to find a house fast

**Payment:** One-time ₹750 (valid for 90 days)

**What They Get (The Value Bundle):**

1. **Unlimited Contacts** 
   - No limit on property contacts
   - `contacts_used` field ignored for premium users

2. **\"Verified Renter\" Badge** (after document verification)
   - Blue star badge visible to owners
   - Shows in chats and profile
   - Requires document upload

3. **Advanced \"Lifestyle Search\"**
   - Filter by AQI score (air quality)
   - Filter by noise levels (dB)
   - Filter by walkability score (0-100)
   - Filter by proximity to parks/amenities
   - Natural language search with AI

4. **Reverse Marketplace Profile**
   - Automatically listed in \"Owner-Finds-Renter\" marketplace
   - Anonymous profile format
   - Can opt out via privacy settings

5. **Priority Support**
   - Faster response times
   - Dedicated support channel

**Database Fields:**
```sql
subscription_tier = 'premium'
subscription_start = TIMESTAMP
subscription_end = TIMESTAMP (start + 90 days)
is_verified_renter = FALSE initially, TRUE after document approval
renter_verification_status = 'pending' | 'verified' | 'rejected'
profile_visibility = TRUE (for reverse marketplace)
```

**Backend Logic:**
```python
# Payment verification
async def upgrade_to_premium(user_id, payment_id):
    user = get_user(user_id)
    
    # Verify payment
    payment_verified = verify_razorpay_payment(payment_id)
    
    if payment_verified:
        user.subscription_tier = 'premium'
        user.subscription_start = datetime.now()
        user.subscription_end = datetime.now() + timedelta(days=90)
        user.contacts_used = 0  # Reset counter
        db.commit()
        
        return {\"success\": True, \"tier\": \"premium\"}
```

**API Endpoints:**
- `POST /api/payments/renter-subscription` - Initiate payment
- `POST /api/verification/renter/upload` - Upload verification docs
- `GET /api/search/lifestyle` - Access lifestyle search (premium only)

---

## 🏠 OWNER TIERS

### Tier 1: FREE LISTER (Free Forever)

**Target User:** Owner who is skeptical or wants to \"try\" the platform

**What They Get:**
- ✅ Can list property for **free**
- ✅ Property appears in search results
- ✅ Can receive messages from renters

**The \"Pain Point\" (Limitations):**
- ⚠️ Property marked with **\"Not Verified\"** warning badge (yellow/amber)
- ⚠️ **Ranked at BOTTOM** of all search results (below every verified property)
- ❌ **NO lifestyle data** calculated for the property
- ❌ **NOT discoverable** in premium lifestyle searches
- ❌ **NO access** to reverse marketplace (cannot browse renters)
- ❌ Gets **90% fewer views** compared to verified properties

**Database Fields:**
```sql
is_verified = FALSE
verification_tier = 'free'
verification_fee_paid = FALSE
lifestyle_data = NULL
```

**Backend Logic - Search Ranking:**
```python
# Search algorithm MUST implement this ranking
def search_properties(filters):
    query = session.query(Property)
    
    # Apply filters
    query = apply_filters(query, filters)
    
    # CRITICAL: Sort by verification status first
    query = query.order_by(
        Property.is_verified.desc(),  # Verified first
        Property.created_at.desc()     # Then by recency
    )
    
    return query.all()
```

**Frontend Display:**
- Show yellow \"⚠ Not Verified\" badge on property card
- Add warning text on property detail page
- Show upsell message on owner dashboard

---

### Tier 2: VERIFIED LISTER (₹2,000 per property)

**Target User:** Serious owner who wants a high-quality tenant fast

**Payment:** One-time ₹2,000 per property

**What They Get (The Value Bundle):**

1. **\"Verified Property\" Badge** 🏆
   - Green checkmark badge
   - The #1 trust signal for renters
   - Displayed prominently on all listings

2. **Top Search Ranking**
   - **ALWAYS** ranked above free listings
   - Priority placement in search results
   - Higher visibility

3. **Lifestyle Data Enrichment**
   - Automatic calculation of:
     - AQI (Air Quality Index) score
     - Noise level estimate (dB)
     - Walkability score (0-100)
     - Nearby amenities (parks, hospitals, schools)
     - Public transport score
     - Safety score
   - Data refreshed periodically

4. **Discoverable in Lifestyle Searches**
   - Property appears in premium lifestyle search results
   - Attracts higher-quality, better-matched tenants

5. **Full Reverse Marketplace Access**
   - Can browse **verified premium renters**
   - See anonymous renter profiles with:
     - Employment type and income range
     - Preferences and requirements
     - Move-in dates
   - Can initiate contact with renters

6. **5-10X More Inquiries**
   - Proven increased visibility
   - Higher quality leads

**Database Fields:**
```sql
is_verified = TRUE
verification_tier = 'verified'
verification_fee_paid = TRUE
payment_id = 'txn_xxxxx'
verification_date = TIMESTAMP
lifestyle_data = {
    \"aqi_score\": 65,
    \"noise_level\": 58,
    \"walkability_score\": 72,
    \"nearby_parks\": [...],
    \"nearby_hospitals\": [...],
    \"public_transport_score\": 75,
    \"calculated_at\": \"2025-01-15T12:00:00\",
    \"is_mock\": true
}
```

**Backend Logic:**
```python
# After payment verification
async def verify_property(property_id, payment_id):
    property = get_property(property_id)
    
    # Verify payment
    payment_verified = verify_razorpay_payment(payment_id, amount=2000)
    
    if payment_verified:
        property.verification_fee_paid = True
        property.payment_id = payment_id
        property.verification_tier = 'verified'
        property.verification_status = 'pending'  # Admin review
        db.commit()
        
        # Notify admin for document review
        notify_admin_for_verification(property_id)
        
        return {\"success\": True, \"status\": \"pending_review\"}

# After admin approval
async def approve_property_verification(property_id):
    property = get_property(property_id)
    
    property.is_verified = True
    property.verification_date = datetime.now()
    
    # Calculate lifestyle data
    lifestyle_data = calculate_lifestyle_data(property.location)
    property.lifestyle_data = lifestyle_data
    
    db.commit()
    
    # Notify owner
    notify_owner_verification_approved(property.owner_id, property_id)
    
    return {\"success\": True, \"verified\": True}
```

**API Endpoints:**
- `POST /api/payments/property-verification` - Initiate payment
- `POST /api/verification/property/{id}/upload` - Upload verification docs
- `POST /api/admin/verifications/{id}/approve` - Admin approval
- `GET /api/properties/{id}/lifestyle-data` - Get lifestyle data

---

## 🔄 REVERSE MARKETPLACE

### How It Works

**For Premium Renters:**
- Automatically listed after subscribing + verification
- Profile is **anonymous**:
  - Format: \"Renter #1024\"
  - Shows: Employment type, income range, preferences, budget
  - Hides: Name, email, phone, exact salary
- Can opt out via privacy settings

**For Verified Owners:**
- Can browse all verified premium renters
- Filter by:
  - Budget range
  - BHK preference
  - Preferred locations
  - Employment type
  - Move-in date
- Can initiate contact (creates chat)

**Database Query (Renters List):**
```python
def get_anonymous_renters(filters):
    query = session.query(User).filter(
        User.subscription_tier == 'premium',
        User.is_verified_renter == True,
        User.profile_visibility == True
    )
    
    # Apply filters
    if filters.get('budget_min'):
        query = query.filter(
            User.renter_preferences['budget_min'] >= filters['budget_min']
        )
    
    # Return anonymized profiles
    renters = query.all()
    return [anonymize_renter_profile(r) for r in renters]

def anonymize_renter_profile(renter):
    return {
        \"renter_id\": renter.user_id,
        \"anonymous_id\": f\"RENTER-{renter.user_id[:4]}\",
        \"employment_type\": renter.employment_info.get('employment_type'),
        \"income_range\": get_income_range(renter.employment_info.get('annual_income')),
        \"bhk_preference\": renter.renter_preferences.get('bhk_preference'),
        \"budget_range\": {
            \"min\": renter.renter_preferences.get('budget_min'),
            \"max\": renter.renter_preferences.get('budget_max')
        },
        \"preferred_locations\": renter.renter_preferences.get('preferred_locations'),
        \"move_in_date\": renter.renter_preferences.get('move_in_date'),
        \"is_verified\": renter.is_verified_renter
    }
```

---

## 🔍 LIFESTYLE SEARCH IMPLEMENTATION

### Access Control
- **Premium renters only** can use lifestyle filters
- **Free renters** see locked filters with upgrade CTA

### Filters Available:
1. **AQI (Air Quality Index)**
   - Range: 0-500
   - Filter: max_aqi (e.g., only show properties with AQI < 60)

2. **Noise Level**
   - Range: 0-100 dB
   - Filter: max_noise_level (e.g., only show < 60 dB)

3. **Walkability Score**
   - Range: 0-100
   - Filter: min_walkability_score (e.g., only show > 70)

4. **Nearby Amenities**
   - Parks, hospitals, schools, malls
   - Filter: near_parks=true, near_metro=true, etc.

### Backend Query:
```python
async def lifestyle_search(user_id, filters):
    # Check premium access
    user = get_user(user_id)
    if user.subscription_tier != 'premium':
        raise HTTPException(403, \"Premium subscription required\")
    
    # Only verified properties with lifestyle data
    query = session.query(Property).filter(
        Property.is_verified == True,
        Property.lifestyle_data != None
    )
    
    # Apply lifestyle filters
    if filters.get('max_aqi'):
        query = query.filter(
            Property.lifestyle_data['aqi_score'] <= filters['max_aqi']
        )
    
    if filters.get('max_noise_level'):
        query = query.filter(
            Property.lifestyle_data['noise_level'] <= filters['max_noise_level']
        )
    
    if filters.get('min_walkability_score'):
        query = query.filter(
            Property.lifestyle_data['walkability_score'] >= filters['min_walkability_score']
        )
    
    # Sort by match score
    properties = query.all()
    return calculate_match_scores(properties, filters)
```

---

## 💳 PAYMENT FLOWS

### Renter Premium Subscription (₹750)

1. **Frontend:** User clicks \"Upgrade to Premium\"
2. **Backend:** Create payment order
   ```python
   POST /api/payments/create-order
   Body: {
       \"type\": \"renter_subscription\",
       \"amount\": 750,
       \"currency\": \"INR\"
   }
   ```

3. **Mock Payment (if no Razorpay keys):**
   - Return mock order immediately
   - Frontend shows mock payment modal
   - Always succeeds after 2 seconds

4. **Real Payment (with Razorpay keys):**
   - Create Razorpay order
   - Frontend opens Razorpay checkout
   - User completes payment

5. **Verify Payment:**
   ```python
   POST /api/payments/verify
   Body: {
       \"payment_id\": \"pay_xxx\",
       \"order_id\": \"order_xxx\",
       \"signature\": \"xxx\",
       \"type\": \"renter_subscription\"
   }
   ```

6. **Update User:**
   - Set `subscription_tier = 'premium'`
   - Set `subscription_start` and `subscription_end`
   - Reset `contacts_used = 0`
   - Create transaction record

### Property Verification (₹2,000)

Same flow as above, but:
- Amount: ₹2,000
- Type: \"property_verification\"
- Updates property record instead of user
- Sets `verification_fee_paid = TRUE`
- Status becomes 'pending' for admin review

---

## 🎨 FRONTEND BADGE DISPLAY

### Verified Property Badge
```jsx
{property.is_verified && property.verification_tier === 'verified' && (
  <div className=\"absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full flex items-center space-x-1\">
    <CheckCircle className=\"w-4 h-4\" />
    <span className=\"text-sm font-semibold\">Verified</span>
  </div>
)}
```

### Not Verified Warning
```jsx
{!property.is_verified && (
  <div className=\"absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center space-x-1\">
    <AlertCircle className=\"w-4 h-4\" />
    <span className=\"text-sm font-semibold\">Not Verified</span>
  </div>
)}
```

### Verified Renter Badge
```jsx
{user.is_verified_renter && (
  <div className=\"inline-flex items-center bg-primary-100 text-primary-600 px-3 py-1 rounded-full\">
    <BadgeCheck className=\"w-4 h-4 mr-1\" />
    <span className=\"text-sm font-semibold\">Verified Renter</span>
  </div>
)}
```

---

## 🔒 SECURITY & VALIDATION

### Contact Limit Enforcement
- **Server-side validation only** (never trust frontend)
- Check on every chat initiation
- Return 403 with clear error message
- Frontend shows upgrade modal on 403

### Subscription Expiry
- Check on every protected endpoint
- Auto-downgrade if expired:
  ```python
  if user.subscription_tier == 'premium':
      if datetime.now() > user.subscription_end:
          user.subscription_tier = 'free'
          db.commit()
  ```

### Verification Status
- Only admin can approve/reject verifications
- Document upload triggers 'pending' status
- Payment required before admin review (for properties)

---

## 📊 ANALYTICS & UPSELL

### For Free Owners
Show performance comparison:
```
Your unverified listing performance:
• Views: 150 (90% below average)
• Contacts: 2
• Shortlists: 8

Verified properties in your area:
• Average views: 1,500 (10X more)
• Average contacts: 25
• Average shortlists: 85

💡 Get verified to rank higher and get 5-10X more inquiries!
```

### For Free Renters
Show contact counter prominently:
```
Contacts used: 4/5
[Upgrade to Premium for unlimited contacts]
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend Tasks:
- [ ] Implement contact limit check in chat creation
- [ ] Implement search ranking algorithm (verified first)
- [ ] Implement lifestyle search endpoint (premium only)
- [ ] Implement reverse marketplace endpoints (verified only)
- [ ] Implement payment verification flows
- [ ] Implement admin verification approval
- [ ] Calculate lifestyle data on property verification
- [ ] Auto-downgrade expired subscriptions
- [ ] Create transaction records for all payments

### Frontend Tasks:
- [ ] Display verification badges correctly
- [ ] Show \"Not Verified\" warnings on free listings
- [ ] Lock lifestyle filters for free users
- [ ] Show contact counter for free renters
- [ ] Display upgrade modals at right moments
- [ ] Implement payment flows (mock + real)
- [ ] Hide reverse marketplace for unverified users
- [ ] Show upsell messages on dashboards

### Database:
- [ ] Ensure all tier-related fields exist
- [ ] Create indexes for search ranking
- [ ] Set up JSON field validation

---

## 🚀 DEPLOYMENT NOTES

1. **Database Migration:**
   - Run `homer_schema.sql` on production MySQL
   - Verify all fields match tier requirements

2. **Environment Variables:**
   - Set Razorpay keys for real payments
   - Set API keys for lifestyle data (or use mocks)
   - Configure email service for notifications

3. **Feature Flags:**
   - Keep mock mode for testing
   - Switch to real mode in production

4. **Monitoring:**
   - Track conversion rates (free → premium)
   - Monitor verification approval times
   - Track search ranking effectiveness

---

## 📞 SUPPORT

For implementation questions, refer to:
- `homer_schema.sql` - Database structure
- `backend_workflow.txt` - Complete API specifications
- `workflow.txt` - Overall system design

---

**Last Updated:** 2025-01-25  
**Version:** 1.0.0  
**Status:** Ready for Backend Implementation
"