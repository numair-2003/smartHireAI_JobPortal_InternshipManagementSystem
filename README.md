# SmartHire AI - Job Portal and Internship Management System

Final Project - MERN Stack Internship

SmartHire AI is a full-stack MERN job portal for students, recruiters, and admins. It includes JWT authentication, role-based dashboards, job and internship posting, profile photo uploads, resume uploads, application tracking, AI resume review, AI job description generation, email alerts, and real-time notification support.

## Features

| Feature | Description |
| --- | --- |
| Authentication | JWT-based login/register with bcrypt password hashing |
| Role Dashboards | Separate dashboards for students, recruiters, and admins |
| Job Marketplace | Search, filter, and view jobs/internships |
| Recruiter Tools | Post jobs, view applicants, update application status |
| Student Tools | Upload profile photo/resume, apply to jobs, track applications |
| Recruiter Profiles | Upload Cloudinary-backed profile photos for recruiter accounts |
| Admin Panel | Manage users, roles, active status, and platform stats |
| AI Resume Review | OpenAI-powered resume scoring, strengths, and improvements |
| AI Job Generator | Generates job descriptions, requirements, and skill tags |
| Resume Upload | Cloudinary-backed PDF/DOC/DOCX upload |
| Profile Photo Upload | Cloudinary-backed JPG/PNG/WEBP avatars for students and recruiters |
| Notifications | Socket.IO notification flow plus stored notification history |
| Email Alerts | Nodemailer email updates when application status changes |
| Demo Data | Seed script with realistic users, jobs, applications, AI scores, and notifications |

## Tech Stack

**Frontend**

- React.js
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Socket.IO Client
- React Hot Toast

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js
- Multer
- Cloudinary
- Nodemailer
- OpenAI API
- Socket.IO

## Project Structure

```text
SmartHire AI - Job Portal and Internship Management System/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   |-- services/
|   |-- utils/
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- data/
|   |   |-- features/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   `-- package.json
|-- API_DOCUMENTATION.md
`-- README.md
```

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas cluster
- Cloudinary account for resume and profile photo uploads
- Gmail app password for Nodemailer email alerts
- OpenAI API key for live AI features

### 1. Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

For local MongoDB, use this in `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smarthire-ai
```

Backend runs on:

```text
http://localhost:5000
```

### MongoDB Atlas DNS Troubleshooting

If the backend fails with a MongoDB Atlas SRV DNS error such as `querySrv ECONNREFUSED`, try these options.

#### Option 1: Use mobile hotspot

This is the easiest. Connect the laptop to a mobile hotspot, then run:

```bash
ipconfig /flushdns
npm run dev
```

If it connects, the Wi-Fi router DNS is the issue.

#### Option 2: Use non-SRV MongoDB URI

This avoids `mongodb+srv` DNS lookup completely. Run this first:

```bash
nslookup -type=TXT cluster0.ewy6run.mongodb.net 8.8.8.8
```

Use the output to build the exact `mongodb://...` URI for `backend/.env`.

#### Option 3: Use Cloudflare WARP

Install Cloudflare WARP, turn it on, then run:

```bash
ipconfig /flushdns
npm run dev
```

WARP often fixes DNS routing without disabling IPv6.

#### Option 4: Try with Google DNS directly through PowerShell test

This will not fix Node permanently, but confirms the network:

```bash
nslookup -type=SRV _mongodb._tcp.cluster0.ewy6run.mongodb.net 1.1.1.1
```

Recommendation: Option 2. It keeps IPv6 enabled and permanently avoids the SRV DNS issue for this project.

### 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/smarthire-ai
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
AI_API_KEY=your_openai_api_key
ADMIN_EMAIL=admin@smarthire.ai
ADMIN_PASSWORD=change_this_admin_password
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Never commit real `.env` files or secret keys to GitHub.

## Demo Data

Seed realistic demo records:

```bash
cd backend
npm run seed
```

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@smarthire.ai` | `password123` |
| Recruiter | `recruiter@smarthire.ai` | `password123` |
| Admin | `admin@smarthire.ai` | `admin123` |

The seed script creates demo jobs, applications, AI resume scores, and notifications.

## Useful Scripts

### Backend

```bash
npm run dev
npm start
npm run seed
npm run create-admin
```

### Frontend

```bash
npm start
npm run build
```

## How Notifications Work

1. The frontend connects to Socket.IO after login.
2. The user joins a private room using their MongoDB user id.
3. When a student applies, the backend creates a notification for the recruiter.
4. When a recruiter updates an application status, the backend creates a notification for the student.
5. The backend emits the notification to that user's Socket.IO room.
6. The frontend notification bell updates instantly and also stores notifications in MongoDB.

Stored notifications can still be loaded from the API even if the user was offline.

## Local Testing Checklist

Before deployment, test these flows locally:

- Register/login as student
- Register/login as recruiter
- Login as admin
- Seed demo data with `npm run seed`
- Browse and filter jobs
- Recruiter posts a job
- Student applies to a job
- Student and recruiter can upload profile photos
- AI resume review returns a score
- AI job generator returns a job description
- Recruiter sees new application notification
- Recruiter updates application status
- Student sees status notification
- Admin can view users and platform stats
- Frontend builds successfully with `npm run build`

Current local verification completed:

- Backend connects to MongoDB locally
- Frontend production build compiles successfully
- Seed data creates demo users/jobs/applications
- Student, recruiter, and admin API flows work locally

## API Documentation

See:

```text
API_DOCUMENTATION.md
```

Main API base URL locally:

```text
http://localhost:5000/api
```

## Deployment Plan

The project is intended to be deployed as two separate projects:

1. `smarthire-ai-backend`
2. `smarthire-ai-frontend`

### Backend Deployment on Fly.io

The backend should be deployed on Fly.io because it runs as a long-lived Node.js service, which is better for Express and Socket.IO than serverless functions.

Install and log in to the Fly.io CLI:

```bash
fly auth login
```

Create the Fly app from the backend folder:

```bash
cd backend
fly launch
```

Recommended choices during `fly launch`:

- App name: `smarthire-ai-backend` or another available name
- Region: choose the closest region to your users
- Database: choose `No`, because this project uses MongoDB Atlas
- Deploy now: choose `No` if you want to set secrets first

Set backend environment variables as Fly secrets:

```bash
fly secrets set NODE_ENV=production
fly secrets set MONGO_URI=your_mongodb_atlas_uri
fly secrets set JWT_SECRET=your_secure_jwt_secret
fly secrets set CLOUDINARY_CLOUD_NAME=your_cloud_name
fly secrets set CLOUDINARY_API_KEY=your_cloudinary_api_key
fly secrets set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
fly secrets set EMAIL_USER=your_gmail_address
fly secrets set EMAIL_PASS=your_gmail_app_password
fly secrets set FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
fly secrets set AI_API_KEY=your_openai_api_key
```

Deploy or redeploy the backend:

```bash
fly deploy
```

Useful Fly.io commands:

```bash
fly status
fly logs
fly open
```

After deployment, the backend URL will look like:

```text
https://smarthire-ai-backend.fly.dev
```

Test the deployed backend health endpoint:

```text
https://smarthire-ai-backend.fly.dev/api/health
```

Important realtime note:

- Fly.io is suitable for this backend because it can keep the Express server running for Socket.IO.
- Stored notifications work through MongoDB even if a user is offline.
- Socket.IO live updates require the frontend `REACT_APP_SOCKET_URL` to point to the Fly.io backend URL.

### Frontend Deployment on Vercel

Create a second Vercel project for the frontend:

- Root Directory: `frontend`
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

Add frontend environment variables in Vercel:

```env
REACT_APP_API_URL=https://smarthire-ai-backend.fly.dev
REACT_APP_SOCKET_URL=https://smarthire-ai-backend.fly.dev
```

After frontend deployment, update the backend Fly.io `FRONTEND_URL` secret to the live frontend URL:

```bash
cd backend
fly secrets set FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
fly deploy
```

## Deliverables

- GitHub repository
- Live frontend deployment
- Live backend deployment
- API documentation
- README file
- Demo video

## Author

Numair Fahad  
MERN Stack Intern @ DawoodTech NextGen  
GitHub: [@numair-2003](https://github.com/numair-2003)
