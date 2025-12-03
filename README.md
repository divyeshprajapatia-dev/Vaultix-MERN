# 🚀 Vaultix  
### Decentralized, Secure File Storage with IPFS & Pinata

Vaultix is a next-generation decentralized file storage platform built using the **MERN stack**.  
It lets users securely upload, store, and share files by leveraging **IPFS (InterPlanetary File System)** and **Pinata**.  
Your files remain encrypted, censorship-resistant, and accessible only to you.

---

## 🎯 Features

- 🔒 **End-to-End Encrypted Storage** – Files are stored securely on decentralized IPFS nodes.  
- ☁️ **Drag-and-Drop Uploads** – Quickly upload files using an intuitive UI.  
- 🔗 **Shareable Links** – Each uploaded file generates a unique IPFS gateway link.  
- 📦 **File Dashboard** – View, download, copy links, or delete uploaded files.  
- 👤 **Authentication System** – Login/registration with JWT-based protection.  
- 🌐 **Powered by Pinata + IPFS** – Reliable pinning and global access.  

---

## 🖼️ Screenshots


| Page | Screenshot |
|------|-----------|
| Home | ![Home](/screenshots/home.png) |
| Register | ![Register](/screenshots/register.png) |
| Login | ![Login](/screenshots/login.png) |
| Upload | ![Upload](/screenshots/upload.png) |
| Your Files | ![Files](/screenshots/files.png) |
| About | ![About](/screenshots/about.png) |

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- CSS / Custom UI  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Pinata SDK / API  

### **Storage**
- IPFS (InterPlanetary File System)  
- Pinata Cloud (Pinning services)  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/vaultix.git
cd vaultix
```

### 🔧 Backend Setup

📁 Navigate to Backend Folder
```bash
cd backend
```

### 📦 Install Dependencies
```bash
npm install
```

### 🔐 Create .env File
Add the following environment variables:
```bash
ini
Copy code
PINATA_API_KEY=your_key_here
PINATA_SECRET_KEY=your_secret_here
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### ▶️ Start Backend Server
```bash
node scripts.js
```

### 💻 Frontend Setup
📁 Navigate to Frontend Folder
```bash
cd frontend
```

📦 Install Dependencies
```bash
Copy code
npm install
```

▶️ Start Frontend App
```bash
Copy code
npm start
```

## 📂 Project Structure
```bash
Vaultix/
│
├── backend/
│   ├── scripts.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── public/
│
└── README.md
```

## 🔮 Future Improvements
  - Shared folders
  - Improved encryption layer
  - Mobile app version
  - Dark mode support
  - File versioning

## 👨‍💻 Author
###  **Divyesh Prajapati**  
Full Stack Developer  
Passionate about decentralised systems and modern web technologies.
