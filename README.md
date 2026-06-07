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
FRONTEND_URLS=http://localhost:3000,https://your-frontend.vercel.app
AI_API_KEY=your_openai_api_key
ADMIN_EMAIL=admin@smarthire.ai
ADMIN_PASSWORD=change_this_admin_password
```

For Azure App Service production settings, use `backend/.env.azure.example` as a reference and add the values in Azure App Service application settings instead of committing a real `.env` file.

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

For production on Vercel, point both values to the deployed Azure backend URL.

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

### Backend Deployment on Azure App Service

The backend is designed for Azure App Service because it runs as a long-lived Node.js Express server and supports Socket.IO better than serverless-only platforms.

Create the backend app in Azure Portal:

1. Search for `App Services`.
2. Select `Create` > `Web App`.
3. Use the Azure for Students subscription.
4. Create or select a resource group, for example `smarthire-ai-rg`.
5. Set the app name, for example `smarthire-ai-backend-numair`.
6. Publish: `Code`.
7. Runtime stack: `Node 20 LTS`.
8. Operating System: `Linux`.
9. Region: choose the closest available region.
10. Pricing plan: choose the lowest student/free-friendly plan available in your subscription.

Recommended Azure App Service settings:

- Startup command: leave blank or use `npm start`
- WebSockets: `On`
- Always On: `On` if the selected plan supports it

Add backend application settings in Azure:

Go to the App Service > `Settings` > `Environment variables` or `Configuration` > `Application settings`, then add:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
DNS_SERVERS=8.8.8.8,8.8.4.4
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
FRONTEND_URLS=https://your-frontend-vercel-url.vercel.app,http://localhost:3000
AI_API_KEY=your_openai_api_key
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

Do not add `PORT` manually in Azure. The backend already uses `process.env.PORT || 5000`, and Azure provides the runtime port.

Deploying from GitHub:

1. In Azure App Service, open `Deployment Center`.
2. Choose GitHub as the source.
3. Select this repository.
4. If Azure asks for a workflow, use `.github/workflows/azure-backend-deploy.yml`.
5. In GitHub repository settings, add this secret:

```text
AZURE_WEBAPP_PUBLISH_PROFILE
```

Download the publish profile from the Azure App Service `Overview` page and paste the full XML content into that GitHub secret.

Important: in `.github/workflows/azure-backend-deploy.yml`, set `AZURE_WEBAPP_NAME` to the exact Azure App Service name you created.

After deployment, the backend URL will look like:

```text
https://smarthire-ai-backend-numair.azurewebsites.net
```

Test the deployed backend:

```text
https://smarthire-ai-backend-numair.azurewebsites.net/
https://smarthire-ai-backend-numair.azurewebsites.net/api/health
```

Useful Azure checks:

- App Service > `Log stream` for live backend logs
- App Service > `Deployment Center` for GitHub deployment status
- App Service > `Configuration` for environment variables

Important realtime note:

- Azure App Service can host the Express server used by Socket.IO.
- Stored notifications work through MongoDB even if a user is offline.
- Socket.IO live updates require the frontend `REACT_APP_SOCKET_URL` to point to the Azure backend URL.

### Frontend Deployment on Vercel

Create a second Vercel project for the frontend:

- Root Directory: `frontend`
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

Add frontend environment variables in Vercel:

```env
REACT_APP_API_URL=https://smarthire-ai-backend-numair.azurewebsites.net
REACT_APP_SOCKET_URL=https://smarthire-ai-backend-numair.azurewebsites.net
```

After frontend deployment, update the backend Azure App Service `FRONTEND_URL` and `FRONTEND_URLS` application settings to include the live Vercel URL, then restart the Azure App Service.

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
