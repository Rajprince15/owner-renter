# 🚀 Server Deployment Guide - From Mock to Production

## 📋 Overview
This guide explains **exactly** how to deploy your Homer application to a real server with MySQL backend, moving from mock data to a fully functional production system.

---

## 🖥️ Server Requirements

### **Minimum Specifications:**
- **OS:** Ubuntu 20.04 LTS or newer (or CentOS, Debian)
- **RAM:** 2GB minimum (4GB recommended)
- **Storage:** 20GB minimum (50GB+ for production)
- **CPU:** 2 cores minimum
- **Network:** Public IP with ports 80 (HTTP) and 443 (HTTPS) open

### **Software Stack:**
```
Frontend: React (already built)
Backend: Python FastAPI
Database: MySQL 8.0+
Web Server: Nginx
File Storage: Local disk OR AWS S3/Cloudinary
```

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Nginx (Port 80/443)                                        │
│  - SSL Termination                                           │
│  - Static Files                                              │
│  - Reverse Proxy                                             │
└──────────┬──────────────────────┬───────────────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌─────────────────────────────────────┐
│  React Frontend  │    │  FastAPI Backend (Port 8001)        │
│  (Built Static)  │    │  - API Endpoints                     │
│  /var/www/html   │    │  - File Uploads                      │
└──────────────────┘    │  - Authentication                    │
                        └──────────┬──────────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────────────────┐
                        │  MySQL Database (Port 3306)          │
                        │  - User Data                          │
                        │  - Properties                         │
                        │  - Transactions                       │
                        └──────────────────────────────────────┘
                                   │
                        ┌──────────┴──────────────────────────┐
                        │  File Storage                        │
                        │  /var/www/uploads/                   │
                        │  OR AWS S3 Bucket                    │
                        └─────────────────────────────────────┘
```

---

## 📝 Step-by-Step Deployment

## PHASE 1: Server Initial Setup

### **Step 1.1: Connect to Your Server**
```bash
# SSH into your server
ssh root@your-server-ip
# or
ssh ubuntu@your-server-ip
```

### **Step 1.2: Update System**
```bash
sudo apt update
sudo apt upgrade -y
```

### **Step 1.3: Install Required Software**
```bash
# Install Python 3.10+
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js 18+ (for building React)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install MySQL Server
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Install build tools
sudo apt install build-essential libssl-dev libffi-dev python3-dev -y
```

---

## PHASE 2: MySQL Database Setup

### **Step 2.1: Secure MySQL Installation**
```bash
sudo mysql_secure_installation
```

**Follow prompts:**
- Set root password: `YourSecurePassword123!`
- Remove anonymous users: `Y`
- Disallow root login remotely: `Y`
- Remove test database: `Y`
- Reload privilege tables: `Y`

### **Step 2.2: Create Database & User**
```bash
sudo mysql -u root -p
```

**Execute SQL commands:**
```sql
-- Create database
CREATE DATABASE homer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for application
CREATE USER 'homer_user'@'localhost' IDENTIFIED BY 'SecurePassword456!';

-- Grant privileges
GRANT ALL PRIVILEGES ON homer_db.* TO 'homer_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### **Step 2.3: Import Schema**
```bash
# Download your schema file (if not already on server)
# Or upload it via SCP
scp homer_schema.sql ubuntu@your-server-ip:/home/ubuntu/

# Import schema
mysql -u homer_user -p homer_db < /home/ubuntu/homer_schema.sql

# Import sample data (optional for testing)
mysql -u homer_user -p homer_db < /home/ubuntu/sample_data.sql
```

### **Step 2.4: Verify Database**
```bash
mysql -u homer_user -p homer_db -e "SHOW TABLES;"
```

**Expected Output:**
```
+---------------------+
| Tables_in_homer_db  |
+---------------------+
| admin_audit_logs    |
| chats               |
| notifications       |
| properties          |
| reviews             |
| shortlists          |
| transactions        |
| users               |
+---------------------+
```

---

## PHASE 3: Backend Setup (FastAPI)

### **Step 3.1: Create Project Directory**
```bash
sudo mkdir -p /var/www/homer
sudo chown $USER:$USER /var/www/homer
cd /var/www/homer
```

### **Step 3.2: Upload Your Code**

**Option A: Using Git**
```bash
git clone https://github.com/your-username/homer-app.git .
```

**Option B: Using SCP (from your local machine)**
```bash
# From your local machine
scp -r /app/frontend ubuntu@your-server-ip:/var/www/homer/
# Note: Backend needs to be created
```

### **Step 3.3: Create Backend Application**

```bash
cd /var/www/homer
mkdir backend
cd backend
```

**Create `requirements.txt`:**
```bash
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
mysql-connector-python==8.2.0
pymysql==1.1.0
sqlalchemy==2.0.23
pydantic==2.5.0
pydantic-settings==2.1.0
python-dateutil==2.8.2
aiofiles==23.2.1
Pillow==10.1.0
EOF
```

**Install dependencies:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **Step 3.4: Create Main Backend File**

**Create `server.py`:**
```python
# /var/www/homer/backend/server.py

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, JSON, DECIMAL, Enum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import os
import uuid
import shutil
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://homer_user:SecurePassword456!@localhost/homer_db")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Create database engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI(title="Homer API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# File upload configuration
UPLOAD_DIR = "/var/www/homer/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/verification", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/properties", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/profiles", exist_ok=True)

# ============================================================================
# DATABASE MODELS
# ============================================================================

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(Enum('renter', 'owner', 'both', 'admin'), nullable=False, default='renter')
    full_name = Column(String(255))
    profile_photo_url = Column(Text)
    is_admin = Column(Boolean, default=False)
    admin_role = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    
    # Renter fields
    subscription_tier = Column(Enum('free', 'premium'), default='free')
    subscription_start = Column(DateTime)
    subscription_end = Column(DateTime)
    is_verified_renter = Column(Boolean, default=False)
    renter_verification_status = Column(Enum('none', 'pending', 'verified', 'rejected'), default='none')
    renter_verification_documents = Column(JSON)
    employment_info = Column(JSON)
    contacts_used = Column(Integer, default=0)
    
    # Owner fields
    is_verified_owner = Column(Boolean, default=False)
    owner_verification_status = Column(Enum('none', 'pending', 'verified', 'rejected'), default='none')

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    return {"message": "Homer API is running", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# ----------------------------------------------------------------------------
# AUTHENTICATION ENDPOINTS
# ----------------------------------------------------------------------------

@app.post("/api/auth/register")
def register(user_data: dict, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(
        (User.email == user_data['email']) | (User.phone == user_data['phone'])
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Email or phone already registered")
    
    # Create new user
    new_user = User(
        user_id=str(uuid.uuid4()),
        email=user_data['email'],
        phone=user_data['phone'],
        password_hash=get_password_hash(user_data['password']),
        user_type=user_data['user_type'],
        full_name=user_data['full_name'],
        subscription_tier='free' if user_data['user_type'] in ['renter', 'both'] else None
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create token
    token = create_access_token({"sub": new_user.user_id})
    
    return {
        "token": token,
        "user_id": new_user.user_id,
        "user_type": new_user.user_type,
        "user": {
            "user_id": new_user.user_id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "user_type": new_user.user_type,
            "subscription_tier": new_user.subscription_tier,
            "is_verified_renter": new_user.is_verified_renter,
            "is_admin": new_user.is_admin
        }
    }

@app.post("/api/auth/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    # Find user by email or phone
    user = db.query(User).filter(
        (User.email == credentials['email']) | (User.phone == credentials['email'])
    ).first()
    
    if not user or not verify_password(credentials['password'], user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create token
    token = create_access_token({"sub": user.user_id})
    
    return {
        "token": token,
        "user_id": user.user_id,
        "user_type": user.user_type,
        "user": {
            "user_id": user.user_id,
            "email": user.email,
            "full_name": user.full_name,
            "user_type": user.user_type,
            "subscription_tier": user.subscription_tier,
            "is_verified_renter": user.is_verified_renter,
            "is_admin": user.is_admin,
            "admin_role": user.admin_role
        }
    }

@app.get("/api/auth/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "user_type": current_user.user_type,
        "subscription_tier": current_user.subscription_tier,
        "is_verified_renter": current_user.is_verified_renter,
        "is_verified_owner": current_user.is_verified_owner,
        "is_admin": current_user.is_admin
    }

# ----------------------------------------------------------------------------
# FILE UPLOAD ENDPOINTS
# ----------------------------------------------------------------------------

@app.post("/api/verification/upload-document")
async def upload_document(
    document: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if document.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and images allowed")
    
    # Validate file size (5MB max)
    content = await document.read()
    file_size = len(content)
    if file_size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB")
    
    # Create user-specific directory
    user_dir = f"{UPLOAD_DIR}/verification/{current_user.user_id}"
    os.makedirs(user_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = int(datetime.utcnow().timestamp())
    file_extension = os.path.splitext(document.filename)[1]
    unique_filename = f"{document_type}_{timestamp}{file_extension}"
    file_path = os.path.join(user_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return file metadata
    return {
        "file_name": document.filename,
        "file_url": f"/uploads/verification/{current_user.user_id}/{unique_filename}",
        "file_size": file_size,
        "file_type": document.content_type,
        "uploaded_at": datetime.utcnow().isoformat()
    }

@app.post("/api/verification/renter/submit")
def submit_renter_verification(
    verification_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_type not in ['renter', 'both']:
        raise HTTPException(status_code=403, detail="Only renters can submit verification")
    
    # Update user verification data
    current_user.renter_verification_documents = verification_data['documents']
    current_user.employment_info = verification_data['employment_details']
    current_user.renter_verification_status = 'pending'
    
    db.commit()
    
    return {
        "message": "Verification request submitted successfully",
        "status": "pending"
    }

@app.get("/api/verification/my-status")
def get_my_verification_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "status": current_user.renter_verification_status,
        "is_verified": current_user.is_verified_renter,
        "documents": current_user.renter_verification_documents,
        "employment_info": current_user.employment_info
    }

# ----------------------------------------------------------------------------
# FILE SERVING (with access control)
# ----------------------------------------------------------------------------

@app.get("/uploads/verification/{user_id}/{filename}")
def serve_verification_document(
    user_id: str,
    filename: str,
    current_user: User = Depends(get_current_user)
):
    # Check authorization (own documents or admin)
    if current_user.user_id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this file")
    
    file_path = f"{UPLOAD_DIR}/verification/{user_id}/{filename}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

# Add more endpoints for properties, chats, etc. as needed...

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

### **Step 3.5: Create Environment File**

```bash
cat > .env << EOF
# Database
DATABASE_URL=mysql+pymysql://homer_user:SecurePassword456!@localhost/homer_db

# Security
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/var/www/homer/uploads

# Application
DEBUG=False
ENVIRONMENT=production
EOF
```

### **Step 3.6: Test Backend**
```bash
source venv/bin/activate
python server.py
```

**Test API:**
```bash
# In another terminal
curl http://localhost:8001/api/health
# Expected: {"status":"healthy"}
```

---

## PHASE 4: Frontend Setup

### **Step 4.1: Build React App**
```bash
cd /var/www/homer/frontend

# Install dependencies
npm install
# or
yarn install

# Update .env for production
cat > .env << EOF
REACT_APP_BACKEND_URL=https://your-domain.com/api
REACT_APP_USE_MOCK_DATA=false
PORT=3000
EOF

# Build for production
npm run build
# or
yarn build
```

This creates `/var/www/homer/frontend/build/` with static files.

### **Step 4.2: Move Build to Web Root**
```bash
sudo mkdir -p /var/www/html
sudo cp -r /var/www/homer/frontend/build/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

---

## PHASE 5: Nginx Configuration

### **Step 5.1: Create Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/homer
```

**Add configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend - Serve React build
    root /var/www/html;
    index index.html;

    # Frontend routes - Single Page Application
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Reverse proxy to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for file uploads
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # File uploads - Serve uploaded files with access control
    location /uploads/ {
        alias /var/www/homer/uploads/;
        # Access control is handled by FastAPI endpoint
        internal;
    }

    # Client max body size for file uploads
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;
}
```

### **Step 5.2: Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/homer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## PHASE 6: Process Management (Systemd)

### **Step 6.1: Create Systemd Service**
```bash
sudo nano /etc/systemd/system/homer-backend.service
```

**Add:**
```ini
[Unit]
Description=Homer FastAPI Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/homer/backend
Environment="PATH=/var/www/homer/backend/venv/bin"
ExecStart=/var/www/homer/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### **Step 6.2: Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable homer-backend
sudo systemctl start homer-backend
sudo systemctl status homer-backend
```

---

## PHASE 7: SSL Certificate (HTTPS)

### **Step 7.1: Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### **Step 7.2: Obtain Certificate**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Follow prompts:**
- Enter email
- Agree to terms
- Choose to redirect HTTP to HTTPS

---

## PHASE 8: File Permissions

### **Set correct permissions:**
```bash
# Backend files
sudo chown -R www-data:www-data /var/www/homer

# Upload directory (needs write access)
sudo chmod -R 775 /var/www/homer/uploads
sudo chown -R www-data:www-data /var/www/homer/uploads

# Frontend files
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

---

## 🧪 Testing Your Deployment

### **1. Test Frontend**
```bash
curl https://your-domain.com
# Should return HTML
```

### **2. Test Backend API**
```bash
curl https://your-domain.com/api/health
# Expected: {"status":"healthy"}
```

### **3. Test User Registration**
```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "password123",
    "full_name": "Test User",
    "user_type": "renter"
  }'
```

### **4. Test Login**
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@homer.com",
    "password": "admin@123"
  }'
```

### **5. Test File Upload**
Open browser → https://your-domain.com → Login → Go to Verification → Upload file

---

## 📊 Monitoring & Maintenance

### **Check Backend Logs**
```bash
sudo journalctl -u homer-backend -f
```

### **Check Nginx Logs**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Check MySQL**
```bash
sudo systemctl status mysql
mysql -u homer_user -p -e "SELECT COUNT(*) FROM homer_db.users;"
```

### **Check Disk Usage**
```bash
df -h /var/www/homer/uploads/
```

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY in .env
- [ ] Enable UFW firewall
- [ ] Configure MySQL to only accept local connections
- [ ] Set up automatic backups
- [ ] Enable fail2ban for SSH
- [ ] Regular security updates
- [ ] Monitor error logs
- [ ] Implement rate limiting
- [ ] Add virus scanning for uploads (optional)

### **Firewall Setup:**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 🔄 Updating Your Application

### **Update Frontend:**
```bash
cd /var/www/homer/frontend
git pull  # or upload new files
npm run build
sudo cp -r build/* /var/www/html/
```

### **Update Backend:**
```bash
cd /var/www/homer/backend
git pull  # or upload new files
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart homer-backend
```

---

## 🗄️ Database Backup

### **Automated Daily Backup:**
```bash
sudo nano /usr/local/bin/backup-homer-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/homer"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u homer_user -p'SecurePassword456!' homer_db | gzip > $BACKUP_DIR/homer_db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "homer_db_*.sql.gz" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-homer-db.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-homer-db.sh") | crontab -
```

---

## 🚨 Troubleshooting

### **Backend Not Starting:**
```bash
sudo journalctl -u homer-backend -n 50
```

### **File Upload Failing:**
```bash
# Check permissions
ls -la /var/www/homer/uploads/

# Check disk space
df -h

# Check Nginx config
sudo nginx -t
```

### **Database Connection Issues:**
```bash
# Test connection
mysql -u homer_user -p homer_db -e "SELECT 1;"

# Check MySQL is running
sudo systemctl status mysql
```

---

## 🎯 Summary

**You now have:**
1. ✅ MySQL database with schema
2. ✅ FastAPI backend with authentication & file uploads
3. ✅ React frontend (production build)
4. ✅ Nginx reverse proxy
5. ✅ SSL/HTTPS
6. ✅ Systemd service management
7. ✅ Automated backups

**Your app is accessible at:**
- Frontend: `https://your-domain.com`
- Backend API: `https://your-domain.com/api`
- Files: Stored in `/var/www/homer/uploads/`

**Next Steps:**
- Implement remaining API endpoints (properties, chats, etc.)
- Set up monitoring (Prometheus, Grafana)
- Configure CDN for static assets
- Implement Redis caching
- Set up staging environment
