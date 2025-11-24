# File Upload Architecture - MySQL Backend Strategy

## 🎯 Overview
This document explains how file uploads (renter verification documents, property images, etc.) are handled when switching from mock data to MySQL backend.

---

## 📝 Key Principle: **Files are NOT stored in MySQL**

MySQL databases store **file metadata** (URLs, names, sizes) in JSON columns, while **actual files** are stored separately on:
1. **File System** (local server storage)
2. **Cloud Storage** (AWS S3, Google Cloud Storage, Cloudinary, etc.)

---

## 🗄️ Current Database Schema (MySQL)

### Users Table - Verification Documents
```sql
renter_verification_documents JSON
```

**Stores:**
```json
{
  "id_proof": {
    "type": "aadhaar",
    "document_url": "/uploads/verification/user_123/aadhaar.pdf",
    "verified": false,
    "uploaded_at": "2025-01-15T10:30:00"
  },
  "income_proof": {
    "type": "salary_slip",
    "document_urls": [
      "/uploads/verification/user_123/salary_jan.pdf",
      "/uploads/verification/user_123/salary_feb.pdf"
    ],
    "verified": false,
    "uploaded_at": "2025-01-15T10:35:00"
  }
}
```

### Properties Table - Images & Documents
```sql
images JSON,
video_url VARCHAR(500),
virtual_tour_url VARCHAR(500),
verification_documents JSON
```

**Property Images Example:**
```json
[
  "https://example.com/properties/prop_123/img1.jpg",
  "https://example.com/properties/prop_123/img2.jpg",
  "https://example.com/properties/prop_123/img3.jpg"
]
```

---

## 🔄 File Upload Flow (Frontend to MySQL Backend)

### Current Mock Implementation
```javascript
// Frontend: verificationService.js (Line 370-387)
export const uploadDocument = async (file, documentType) => {
  if (USE_MOCK) {
    // Simulates upload - returns mock URL
    return mockApiCall({
      file_name: file.name,
      file_url: `/uploads/verification/mock_${Date.now()}_${file.name}`,
      file_size: file.size,
      file_type: file.type,
      uploaded_at: new Date().toISOString()
    });
  }
  
  // Real backend - sends file via FormData
  const formData = new FormData();
  formData.append('document', file);
  formData.append('document_type', documentType);
  
  return axios.post('/api/verification/upload-document', formData);
};
```

### Real Backend Flow (When MySQL is Connected)

#### **Step 1: Frontend Uploads File**
```javascript
// User selects file in DocumentUpload component
const handleFileSelect = async (selectedFile) => {
  // Upload file to backend
  const uploadedFile = await uploadDocument(selectedFile, 'id_proof');
  
  // uploadedFile contains:
  // {
  //   file_name: "aadhaar.pdf",
  //   file_url: "/uploads/verification/user_123/aadhaar.pdf",
  //   file_size: 245678,
  //   uploaded_at: "2025-01-20T10:30:00"
  // }
};
```

#### **Step 2: Backend Receives & Stores File**

**Option A: File System Storage (Simple)**
```python
# Backend FastAPI endpoint
@app.post("/api/verification/upload-document")
async def upload_document(
    document: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    # Create user-specific directory
    user_dir = f"/uploads/verification/{current_user['user_id']}"
    os.makedirs(user_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(document.filename)[1]
    unique_filename = f"{document_type}_{int(time.time())}{file_extension}"
    file_path = os.path.join(user_dir, unique_filename)
    
    # Save file to disk
    with open(file_path, "wb") as f:
        content = await document.read()
        f.write(content)
    
    # Return file metadata (NOT the file itself)
    return {
        "file_name": document.filename,
        "file_url": f"/uploads/verification/{current_user['user_id']}/{unique_filename}",
        "file_size": len(content),
        "file_type": document.content_type,
        "uploaded_at": datetime.now().isoformat()
    }
```

**Option B: Cloud Storage (Recommended for Production)**
```python
import boto3  # AWS S3
# or
from google.cloud import storage  # Google Cloud Storage
# or 
import cloudinary  # Cloudinary

@app.post("/api/verification/upload-document")
async def upload_document(
    document: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    # Upload to S3/Cloud Storage
    s3_client = boto3.client('s3')
    bucket_name = 'homer-verification-docs'
    
    # Generate unique key
    file_key = f"verification/{current_user['user_id']}/{document_type}_{int(time.time())}_{document.filename}"
    
    # Upload to S3
    content = await document.read()
    s3_client.put_object(
        Bucket=bucket_name,
        Key=file_key,
        Body=content,
        ContentType=document.content_type
    )
    
    # Generate public URL (or signed URL for private access)
    file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"
    
    # Return metadata
    return {
        "file_name": document.filename,
        "file_url": file_url,  # Cloud URL
        "file_size": len(content),
        "uploaded_at": datetime.now().isoformat()
    }
```

#### **Step 3: Store Metadata in MySQL**
```python
@app.post("/api/verification/renter/submit")
async def submit_renter_verification(
    verification_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user from database
    user = db.query(User).filter(User.user_id == current_user['user_id']).first()
    
    # Update user's verification documents (JSON column)
    user.renter_verification_documents = {
        "id_proof": {
            "type": "aadhaar",
            "document_url": verification_data['documents']['id_proof']['file_url'],
            "file_name": verification_data['documents']['id_proof']['file_name'],
            "uploaded_at": datetime.now().isoformat(),
            "verified": False
        },
        "income_proof": {
            "type": "salary_slip",
            "document_urls": [verification_data['documents']['income_proof']['file_url']],
            "uploaded_at": datetime.now().isoformat(),
            "verified": False
        }
    }
    
    user.renter_verification_status = 'pending'
    db.commit()
    
    return {"message": "Verification submitted successfully"}
```

---

## 📂 Directory Structure for File System Storage

```
/app/
├── uploads/
│   ├── verification/           # Verification documents
│   │   ├── user_001/
│   │   │   ├── aadhaar_1737123456.pdf
│   │   │   └── salary_slip_1737123789.pdf
│   │   ├── user_002/
│   │   │   └── aadhaar_1737124000.pdf
│   │   └── ...
│   ├── properties/             # Property images
│   │   ├── prop_001/
│   │   │   ├── img1_1737125000.jpg
│   │   │   ├── img2_1737125100.jpg
│   │   │   └── video_1737125200.mp4
│   │   └── ...
│   └── profiles/               # Profile photos
│       ├── user_001_profile.jpg
│       └── ...
```

---

## 🔐 Security Considerations

### 1. **File Access Control**
```python
# Serve files only to authorized users
@app.get("/uploads/verification/{user_id}/{filename}")
async def get_verification_document(
    user_id: str,
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    # Check authorization
    if current_user['user_id'] != user_id and not current_user['is_admin']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Serve file
    file_path = f"/uploads/verification/{user_id}/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)
```

### 2. **File Validation**
```python
ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_file(file: UploadFile):
    # Check extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Invalid file type")
    
    # Check file size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large")
    
    await file.seek(0)  # Reset file pointer
    return True
```

---

## ✅ Frontend Code Compatibility

**Good News:** Your current frontend code is already compatible! 

The frontend:
1. ✅ Sends files as `FormData` (Line 382-386 in verificationService.js)
2. ✅ Receives file metadata (URLs, not actual files)
3. ✅ Stores only URLs in verification requests
4. ✅ Displays files using URLs

**No frontend changes needed when switching to MySQL backend!**

---

## 🚀 Migration Checklist

When switching from mock to MySQL backend:

- [ ] **Backend Setup:**
  - [ ] Create `/uploads/` directory with proper permissions
  - [ ] OR configure cloud storage (S3/GCS credentials)
  - [ ] Implement file upload endpoint (`POST /api/verification/upload-document`)
  - [ ] Implement file serving endpoint (`GET /uploads/...`)
  - [ ] Add file validation (type, size, virus scan)

- [ ] **Database:**
  - [ ] MySQL schema already has JSON columns for file metadata ✅
  - [ ] No schema changes needed ✅

- [ ] **Frontend:**
  - [ ] Change `REACT_APP_USE_MOCK_DATA=false` in `.env`
  - [ ] No code changes needed ✅

- [ ] **Security:**
  - [ ] Implement authorization for file access
  - [ ] Use signed URLs for cloud storage (if applicable)
  - [ ] Add rate limiting on upload endpoint
  - [ ] Implement virus scanning (optional but recommended)

---

## 📊 Storage Options Comparison

| Feature | File System | AWS S3 | Google Cloud Storage | Cloudinary |
|---------|-------------|--------|---------------------|------------|
| **Setup Complexity** | Easy | Medium | Medium | Easy |
| **Cost** | Free (server disk) | Pay per GB | Pay per GB | Free tier available |
| **Scalability** | Limited | Unlimited | Unlimited | Unlimited |
| **CDN** | Manual setup | Built-in | Built-in | Built-in |
| **Image Processing** | Manual | Lambda needed | Manual | Built-in |
| **Backup** | Manual | Built-in | Built-in | Built-in |
| **Best For** | Development/Small apps | Production | Production | Image-heavy apps |

---

## 🎯 Recommended Approach

### **For Development:**
Use **File System Storage** - simple, no external dependencies

### **For Production:**
Use **AWS S3** or **Cloudinary**:
- **AWS S3**: Best for large scale, full control
- **Cloudinary**: Best for image-heavy apps (auto-optimization, transformations)

---

## 💡 Example: Complete Upload Flow

```javascript
// 1. User uploads file in frontend
const uploadFile = async (file) => {
  // Frontend calls uploadDocument
  const result = await uploadDocument(file, 'id_proof');
  // result = { file_url: "https://s3.../aadhaar.pdf", ... }
  
  // 2. Store URL in form data
  setDocuments({
    id_proof: result
  });
};

// 3. Submit verification with file URLs (not files)
const submitVerification = async () => {
  await submitRenterVerification({
    documents: {
      id_proof: documents.id_proof,  // Contains URL
      income_proof: documents.income_proof  // Contains URL
    },
    employment_details: {...}
  });
};
```

```python
# 4. Backend stores URLs in MySQL
def submit_verification(data):
    user.renter_verification_documents = {
        "id_proof": {
            "document_url": data['documents']['id_proof']['file_url'],  # URL only
            "uploaded_at": datetime.now()
        }
    }
    db.commit()
```

---

## 🔍 Summary

✅ **Files are NOT stored in MySQL**  
✅ **Only file URLs/metadata are stored in JSON columns**  
✅ **Actual files stored on disk or cloud storage**  
✅ **Frontend code is already compatible**  
✅ **Backend needs file upload/serving endpoints**  
✅ **Schema is already correct for this approach**

Your current architecture is production-ready! 🎉
