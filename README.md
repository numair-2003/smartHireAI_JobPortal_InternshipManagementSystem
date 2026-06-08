# SmartHire AI - Job Portal and Internship Management System

Final Project - MERN Stack Internship

SmartHire AI is a full-stack MERN job portal for students, recruiters, and admins. It includes JWT authentication, role-based dashboards, job and internship posting, profile photo uploads, resume uploads, application tracking, AI resume review, AI job description generation, email alerts, and real-time notification support.

## Quick Links

| Resource | Link |
| --- | --- |
| GitHub Repository | [numair-2003/smartHireAI_JobPortal_InternshipManagementSystem](https://github.com/numair-2003/smartHireAI_JobPortal_InternshipManagementSystem) |
| Live Frontend | [SmartHire AI on Vercel](https://smart-hire-ai-job-portal-inter-git-50b9b0-numair-2003s-projects.vercel.app) |
| Backend Root Check | [Azure backend root](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/) |
| Backend Health Check | [Azure backend health](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/api/health) |
| Backend API Base | [Azure API base](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/api) |
| API Documentation | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) |
| MongoDB Atlas | [MongoDB Atlas](https://cloud.mongodb.com/) |
| MongoDB Compass | [MongoDB Compass Download](https://www.mongodb.com/try/download/compass) |
| Cloudinary Console | [Cloudinary Console](https://console.cloudinary.com/) |
| OpenAI Platform | [OpenAI Platform](https://platform.openai.com/) |
| Microsoft Azure Portal | [Azure Portal](https://portal.azure.com/) |
| Vercel Dashboard | [Vercel Dashboard](https://vercel.com/dashboard) |
| Cloudflare WARP | [Cloudflare WARP / 1.1.1.1](https://one.one.one.one/) |

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
| AI Job Generator | Generates job descriptions, requirements, skill tags, and publishes generated listings |
| Resume Upload | Cloudinary-backed PDF/DOC/DOCX upload |
| Profile Photo Upload | Cloudinary-backed JPG/PNG/WEBP avatars for students and recruiters |
| Brightness Preferences | Navbar brightness selector with Bright, Soft, Night, and intensity settings |
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
- Browser localStorage for brightness preferences
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
|   |-- .env.example
|   |-- .env.azure.example
|   |-- .gitignore
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
|   |-- .env.example
|   |-- .gitignore
|   `-- package.json
|-- demo-assets/
|   |-- profile-photos/
|   `-- resumes/
|-- .gitignore
|-- API_DOCUMENTATION.md
`-- README.md
```

Real local environment files also exist during development:

```text
backend/.env
frontend/.env
```

These files are intentionally ignored by Git and must not be pushed because they contain secrets and deployment-specific URLs.

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

[http://localhost:5000](http://localhost:5000)

### Connect MongoDB Atlas With Compass

Use this when you want to view your Atlas database collections in MongoDB Compass.

1. Open MongoDB Atlas.
2. Go to `Database` > your cluster > `Connect`.
3. Select `Compass`.
4. Copy the connection string.
5. Open MongoDB Compass.
6. Click `New Connection`.
7. Paste the Atlas connection string.
8. Replace `<db_password>` with the real password for your Atlas database user.
9. Add the database name after `.net/`, for example:

```text
mongodb+srv://numair1919_db_user:<db_password>@cluster0.ewy6run.mongodb.net/smarthire-ai?retryWrites=true&w=majority&appName=Cluster0
```

10. Click `Save & Connect`.

Important notes:

- Keep the local `mongodb://127.0.0.1:27017` connection if you still want local testing. Atlas and local MongoDB are separate connections in Compass.
- If Compass cannot connect, check Atlas `Network Access` and make sure your current IP or `0.0.0.0/0` is active.
- If your Wi-Fi has SRV DNS issues, try Cloudflare WARP or use the non-SRV MongoDB URI option below.
- Keep `/smarthire-ai` in the URI so Compass opens the same database used by the app.
- If your database password has special characters such as `@`, `#`, `/`, `?`, or `&`, use the encoded connection string copied from Atlas.
- Never paste the real Atlas password into GitHub, README, screenshots, or chat.

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

Use this when Atlas works through Google DNS tests but Node still fails with `querySrv ECONNREFUSED`.

1. Install Cloudflare WARP / 1.1.1.1 for Windows.
2. Open the Cloudflare app.
3. Choose `Private browsing` when asked what to use WARP for.
4. Set mode to `Traffic and DNS (UDP)`.
5. Turn WARP on and wait until it says `Connected`.
6. In Command Prompt, run:

```bash
ipconfig /flushdns
nslookup -type=SRV _mongodb._tcp.cluster0.ewy6run.mongodb.net
npm run dev
```

WARP often fixes DNS routing without disabling IPv6. In the successful case, `nslookup` may show a Cloudflare/WARP resolver such as `127.0.2.2`, and `npm run dev` should connect to MongoDB Atlas.

Cloudflare WARP notes:

- Keep WARP running while testing Atlas locally if your Wi-Fi router DNS is unreliable.
- Do not choose `Cloudflare One Client` unless you have a company/team Cloudflare One login.
- If WARP causes other network issues, disconnect it and use the non-SRV MongoDB URI option instead.
- WARP is only a local network workaround. Azure App Service uses its own network and still needs the correct `MONGO_URI`, `DNS_SERVERS`, and Atlas Network Access settings.

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

[http://localhost:3000](http://localhost:3000)

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
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
AI_API_KEY=your_google_gemini_or_openai_api_key
ADMIN_EMAIL=admin@smarthire.ai
ADMIN_PASSWORD=change_this_admin_password
SCM_DO_BUILD_DURING_DEPLOYMENT=true
ENABLE_ORYX_BUILD=true
```

For Azure App Service production settings, use `backend/.env.azure.example` as a reference and add the values in Azure App Service application settings instead of committing a real `.env` file.

AI provider key note:

- `AI_API_KEY` belongs only in `backend/.env` for local testing and Azure App Service application settings for production.
- Do not add `AI_API_KEY` to Vercel frontend environment variables.
- Use `AI_PROVIDER=gemini` and `AI_MODEL=gemini-2.5-flash` for Google Gemini API keys.
- Use `AI_PROVIDER=openai` and an OpenAI model such as `gpt-4o-mini` if switching back to OpenAI later.
- Do not commit a real Gemini/OpenAI key to GitHub.
- After rotating or replacing the AI key in Azure, click `Apply` or `Save`, then restart the Azure App Service.
- If the AI provider has no quota, billing credits, or available free-tier capacity, SmartHire returns demo fallback AI responses instead of breaking the app.

Google Gemini setup:

1. Create the key from [Google AI Studio API Keys](https://aistudio.google.com/app/apikey).
2. In `backend/.env` locally and Azure App Service environment variables, set:

```env
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
AI_API_KEY=your_actual_google_gemini_api_key
```

3. Save/apply Azure environment variables and restart the Azure App Service.
4. Do not add Gemini keys to Vercel frontend environment variables.

SmartHire calls Gemini through Google's OpenAI-compatible endpoint, documented here: [Gemini OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai).

Production backend URL settings used for this deployment:

```env
FRONTEND_URL=https://smart-hire-ai-job-portal-inter-git-50b9b0-numair-2003s-projects.vercel.app
FRONTEND_URLS=https://smart-hire-ai-job-portal-inter-git-50b9b0-numair-2003s-projects.vercel.app,https://smart-hire-ai-job-portal-internship.vercel.app,https://smart-hire-ai-job-portal-internship-management-syste-3r6ls1r2y.vercel.app,https://smart-hire-ai-job-portal-internship-management-syste-b60023dlz.vercel.app,https://smart-hire-ai-job-portal-internship-management-syste-obddo08su.vercel.app,http://localhost:3000
```

Clickable frontend origins referenced above:

- [Current Vercel frontend deployment / Git preview](https://smart-hire-ai-job-portal-inter-git-50b9b0-numair-2003s-projects.vercel.app)
- [Primary frontend alias](https://smart-hire-ai-job-portal-internship.vercel.app)
- [Vercel frontend deployment variant](https://smart-hire-ai-job-portal-internship-management-syste-3r6ls1r2y.vercel.app)
- [Vercel frontend deployment variant](https://smart-hire-ai-job-portal-internship-management-syste-b60023dlz.vercel.app)
- [Vercel frontend deployment variant](https://smart-hire-ai-job-portal-internship-management-syste-obddo08su.vercel.app)
- [Local frontend](http://localhost:3000)

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

For production on Vercel, point both values to the deployed Azure backend URL.

Production frontend URL settings used for this deployment:

```env
REACT_APP_API_URL=https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net
REACT_APP_SOCKET_URL=https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net
```

Clickable backend URLs referenced above:

- [Azure backend API base](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/api)
- [Azure backend Socket.IO/root URL](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net)

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
| Student | `sara.demo@smarthire.ai` | `password123` |
| Student | `hamza.demo@smarthire.ai` | `password123` |
| Student | `emma.demo@smarthire.ai` | `password123` |
| Student | `lucas.demo@smarthire.ai` | `password123` |
| Student | `sofia.demo@smarthire.ai` | `password123` |
| Student | `omar.demo@smarthire.ai` | `password123` |
| Student | `mei.demo@smarthire.ai` | `password123` |
| Recruiter | `recruiter@smarthire.ai` | `password123` |
| Recruiter | `maha.demo@smarthire.ai` | `password123` |
| Recruiter | `olivia.recruiter@smarthire.ai` | `password123` |
| Recruiter | `carlos.recruiter@smarthire.ai` | `password123` |
| Recruiter | `priya.recruiter@smarthire.ai` | `password123` |
| Admin | `admin@smarthire.ai` | Uses `ADMIN_PASSWORD` if set; otherwise demo fallback `admin123` |

The seed script creates demo jobs, applications, AI resume scores, and notifications. Demo jobs include Pakistan-based roles plus international roles in London, Dubai, Berlin, San Francisco, Austin, Singapore, Amsterdam, and Toronto.

Current demo seed totals:

- 14 users: 8 students, 5 recruiters, and 1 admin
- 13 active jobs
- 12 sample applications
- Stored notifications for students, recruiters, and admin

Important: before seeding data for a public/live demo, set a strong `ADMIN_PASSWORD` in `backend/.env`. Otherwise the seed script warns and uses the demo fallback admin password.

### Demo Resume and Profile Assets

The `demo-assets` folder contains generated demo files used for a polished demo:

```text
demo-assets/
|-- profile-photos/
|   |-- ayesha-khan-profile.png
|   |-- bilal-ahmed-profile.png
|   |-- carlos-rivera-profile.png
|   |-- emma-johnson-profile.png
|   |-- hamza-raza-profile.png
|   |-- lucas-meyer-profile.png
|   |-- maha-siddiqui-profile.png
|   |-- mei-chen-profile.png
|   |-- olivia-smith-profile.png
|   |-- omar-hassan-profile.png
|   |-- priya-nair-profile.png
|   |-- sara-malik-profile.png
|   `-- sofia-garcia-profile.png
`-- resumes/
    |-- ayesha-khan-resume.pdf
    |-- emma-johnson-resume.pdf
    |-- hamza-raza-resume.pdf
    |-- lucas-meyer-resume.pdf
    |-- mei-chen-resume.pdf
    |-- omar-hassan-resume.pdf
    |-- sara-malik-resume.pdf
    `-- sofia-garcia-resume.pdf
```

The same asset inventory is also listed in [demo-assets/README.txt](demo-assets/README.txt).

The generated resume PDFs cover all seeded demo students: `Ayesha Khan`, `Sara Malik`, `Hamza Raza`, `Emma Johnson`, `Lucas Meyer`, `Sofia Garcia`, `Omar Hassan`, and `Mei Chen`.

The generated profile PNGs cover all seeded students and recruiters except the admin account, so the demo can show real account photos after Cloudinary sync instead of initials-only placeholders.

After running `npm run seed`, run the demo asset sync command so the seeded database points to real files in your Cloudinary account instead of placeholder/demo URLs:

```bash
cd backend
npm run sync-demo-assets
```

This script uploads the generated resumes and profile photos to Cloudinary, updates user profile photo URLs, updates all seeded student resume URLs, and repairs existing application `resumeUrl` values. If a recruiter clicks `View Resume` and Cloudinary returns `404`, run this script again.

Important notes:

- `backend/.env` must contain working `MONGO_URI` and `CLOUDINARY_*` values before running the sync.
- Run `npm.cmd run sync-demo-assets` on Windows PowerShell if `npm run sync-demo-assets` is blocked by execution policy.
- Do not manually use `res.cloudinary.com/demo/...` URLs for seeded resumes because those files may not exist.
- The app opens resumes through protected backend API routes instead of direct browser links to Cloudinary. This keeps the demo usable for logged-in students and recruiters.
- The Azure backend deployment bundles the generated demo resume PDFs, so seeded resumes can still open even when Cloudinary blocks public PDF delivery.
- If a direct Cloudinary PDF URL returns `401`, open Cloudinary Console settings and enable public delivery for PDF/ZIP files. Without that account-level setting, uploaded PDF/Word files can exist but Cloudinary may still block browser access. After enabling it, re-run `npm run sync-demo-assets` if old demo URLs still fail.
- The script does not upload an admin profile photo.

### Seed Resume URL Validation Fix

The `Application` model requires every application record to include `resumeUrl`. If `npm run seed` fails with this error:

```text
Application validation failed: resumeUrl: Path `resumeUrl` is required.
```

it means at least one seeded demo application was created for a student that did not have a resume URL attached.

Fix checklist:

1. Confirm `backend/scripts/seedDemoData.js` assigns `resumeUrl` to every seeded student used in `Application.insertMany`.
2. Confirm each inserted application also includes `resumeUrl: student.resumeUrl`.
3. Re-run the seed command:

```bash
cd backend
npm run seed
```

4. If resume links need to be repaired in Cloudinary after seeding, run:

```bash
npm run sync-demo-assets
```

This project already includes that fix: every seeded student has a bundled demo resume file, so the seed script can create valid application records every time.

For production or Azure testing, set a strong `ADMIN_PASSWORD` in `backend/.env` locally and in Azure App Service application settings, then run:

```bash
cd backend
npm run create-admin
```

If `admin@smarthire.ai` already exists, the script promotes that user to admin and updates the password when `ADMIN_PASSWORD` is configured.

When `NODE_ENV=production`, `ADMIN_PASSWORD` is required and the script will refuse to use the demo fallback password.

## Useful Scripts

### Backend

```bash
npm run dev
npm start
npm run seed
npm run create-admin
npm run sync-demo-assets
```

### Frontend

```bash
npm start
npm run build
```

## Brightness Preferences

The navbar includes a visible brightness settings icon button for all visitors and logged-in roles, including students, recruiters, and admins. On desktop it appears beside `Jobs` before the notification bell; on mobile it appears inside the opened navigation menu.

Available settings:

- `Bright`: default high-visibility mode.
- `Soft`: slightly reduced brightness for long browsing sessions.
- `Night`: dimmer mode using the moon icon.
- `Intensity`: slider from `70%` to `115%`.

The selected brightness mode is saved in browser `localStorage` under `smarthire-brightness`, so the preference stays active after refreshes and across role logins on the same browser.

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
- Demo resume/profile assets are synced to Cloudinary with `npm run sync-demo-assets`
- AI resume review returns a score
- AI job generator returns a job description, then `Publish Job` creates the listing
- Recruiter sees new application notification
- Recruiter updates application status
- Student sees status notification
- Admin can view users and platform stats
- Student, recruiter, and admin can adjust the navbar brightness setting
- Frontend builds successfully with `npm run build`

Current local verification completed:

- Backend connects to MongoDB locally
- Frontend production build compiles successfully
- Seed data creates demo users/jobs/applications
- Student, recruiter, and admin API flows work locally

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

Main API base URL locally:

[http://localhost:5000/api](http://localhost:5000/api)

## Deployment Plan

The project is intended to be deployed as two separate projects:

1. `smarthire-ai-backend`
2. `smarthire-ai-frontend`

### Backend Deployment on Azure App Service

The backend is designed for Azure App Service because it runs as a long-lived Node.js Express server and supports Socket.IO better than serverless-only platforms.

#### 1. Create the Azure backend app

1. Open Azure Portal.
2. Search for `App Services`.
3. Click `Create` > `Web App`.
4. Select the `Azure for Students` subscription.
5. Select or create the resource group `smarthire-ai-rg`.
6. App name: `smarthire-ai-backend-numairfahad`.
7. Publish: `Code`.
8. Runtime stack: `Node 22 LTS`.
9. Operating System: `Linux`.
10. Region: `UAE North` is fine for Pakistan if Azure allows it for the student subscription.
11. Pricing plan: select `Free F1` if available.
12. Zone redundancy: keep `Disabled`.
13. Database tab: skip database creation because this project already uses MongoDB Atlas.
14. Deployment tab: keep continuous deployment disabled during creation.
15. Monitor + secure tab: keep Application Insights `No` and Defender unchecked to avoid extra cost.
16. Click `Review + create`, then `Create`.

Why Linux instead of Windows:

- Node.js apps work correctly on Linux App Service.
- Linux is cheaper and common for Express deployments.
- Your code does not use Windows-only server features.
- Azure provides the runtime port automatically through `process.env.PORT`, so the app will still run correctly.

#### 2. Add Azure environment variables

Open the App Service, then go to `Settings` > `Environment variables` or `Configuration` > `Application settings`.

Add these values one by one. Keep `Deployment slot setting` unchecked for this project.

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
FRONTEND_URL=https://smart-hire-ai-job-portal-inter-git-50b9b0-numair-2003s-projects.vercel.app
FRONTEND_URLS=https://smart-hire-ai-job-portal-inter-git-50b9b0-numair-2003s-projects.vercel.app,https://smart-hire-ai-job-portal-internship.vercel.app,https://smart-hire-ai-job-portal-internship-management-syste-3r6ls1r2y.vercel.app,https://smart-hire-ai-job-portal-internship-management-syste-b60023dlz.vercel.app,https://smart-hire-ai-job-portal-internship-management-syste-obddo08su.vercel.app,http://localhost:3000
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash
AI_API_KEY=your_google_gemini_or_openai_api_key
ADMIN_EMAIL=admin@smarthire.ai
ADMIN_PASSWORD=your_strong_admin_password
SCM_DO_BUILD_DURING_DEPLOYMENT=true
ENABLE_ORYX_BUILD=true
```

Do not add `PORT` manually in Azure. The backend already uses `process.env.PORT || 5000`, and Azure provides the runtime port.

Warnings:

- Do not commit `backend/.env` to GitHub.
- Do not paste real secrets into README files.
- Do not add `PORT` in Azure App Service.
- Keep `SCM_DO_BUILD_DURING_DEPLOYMENT=true` and `ENABLE_ORYX_BUILD=true` so Azure installs backend dependencies during deployment.
- Do not upload `node_modules` manually to Azure. The GitHub Actions workflow creates a source-only backend ZIP and lets Azure build it.
- Do not check `Deployment slot setting` unless you are using Azure deployment slots.
- After changing environment variables, click `Apply` or `Save`, then restart the App Service.
- Keep WebSockets enabled for live Socket.IO notifications.
- Free F1 can sleep, restart, or feel slow. That is normal for student/free hosting.
- If Azure deployment fails because no credentials were found, add the publish profile secret described below.

#### 3. Configure App Service runtime settings

In the Azure App Service:

1. Go to `Settings` > `Configuration` > `General settings`.
2. Startup command: use `npm start` if Azure asks for one. Leaving it blank can also work because `backend/package.json` has `"start": "node server.js"`.
3. WebSockets: `On`.
4. Always On: `On` only if your pricing plan supports it. Free F1 may not support it.
5. Save and restart the App Service.

#### 4. Add the GitHub Actions publish profile

The repository includes:

```text
.github/workflows/azure-backend-deploy.yml
```

That workflow deploys the `backend` folder to:

```text
smarthire-ai-backend-numairfahad
```

The Azure app name is used by GitHub Actions. The public backend URL is the full default domain:

[https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net)

To let GitHub deploy to Azure:

1. Open Azure App Service `Overview`.
2. Click `Download publish profile`.
3. If the button is disabled, go to `Configuration` > `General settings`, enable `SCM Basic Auth Publishing Credentials`, save, then download the publish profile.
4. Open GitHub repo > `Settings` > `Secrets and variables` > `Actions`.
5. Click `New repository secret`.
6. Name:

```text
AZURE_WEBAPP_PUBLISH_PROFILE
```

7. Value: paste the full XML content from the downloaded `.PublishSettings` file.
8. Save the secret.

Never commit the `.PublishSettings` file. The root `.gitignore` already ignores publish settings files.

#### 5. Push and deploy backend

From the project root:

```bash
git add README.md API_DOCUMENTATION.md backend/.env.example backend/.env.azure.example backend/package.json backend/package-lock.json backend/server.js backend/scripts/createAdmin.js .github/workflows/azure-backend-deploy.yml
git commit -m "Configure Azure backend deployment"
git push origin main
```

GitHub Actions should start automatically. You can also run it manually from GitHub:

1. Open the repo on GitHub.
2. Go to `Actions`.
3. Select `Deploy Backend to Azure App Service`.
4. Click `Run workflow`.

#### 6. Test the deployed backend

- [Backend root check](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/)
- [Backend health check](https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/api/health)

Expected health response:

```json
{
  "success": true,
  "status": "ok",
  "service": "SmartHire AI API"
}
```

#### 7. Create or update the production admin

After Azure app settings include `ADMIN_EMAIL` and `ADMIN_PASSWORD`, run the admin script locally against Atlas:

```bash
cd backend
npm run create-admin
```

This creates the admin if missing, promotes the existing user if present, and updates the admin password when `ADMIN_PASSWORD` is configured.

When `NODE_ENV=production`, the script requires `ADMIN_PASSWORD` and will not use a demo fallback password.

#### 8. Azure troubleshooting checklist

- If GitHub Actions says `No credentials found`, check the `AZURE_WEBAPP_PUBLISH_PROFILE` GitHub secret.
- If the app opens but API routes fail, check App Service `Log stream`.
- If MongoDB fails, check `MONGO_URI`, Atlas password, Atlas Network Access, and `DNS_SERVERS`.
- If Cloudinary upload fails, check the three `CLOUDINARY_*` values.
- If `npm run seed` fails with `resumeUrl: Path resumeUrl is required`, make sure the latest `backend/scripts/seedDemoData.js` is deployed/pulled, then re-run `npm run seed`.
- If `View Resume` opens a Cloudinary `404`, run `npm run sync-demo-assets` from the backend folder to upload the generated demo PDFs and repair application resume URLs.
- If `View Resume` still cannot open resumes after deployment, confirm the latest backend deploy included `demo-assets/resumes` and the latest frontend deploy is using the protected resume buttons.
- If a direct Cloudinary resume URL opens a `401`, enable PDF/ZIP delivery in Cloudinary account security settings. Direct Cloudinary PDF URLs can be blocked even when the app upload succeeds.
- If an AI-generated job description does not appear in Jobs, make sure you clicked `Publish Job` after generation. Generating text alone only creates a draft preview.
- If AI routes use fallback data, check `AI_PROVIDER`, `AI_MODEL`, `AI_API_KEY`, and the provider quota/billing page. For Gemini, use `AI_PROVIDER=gemini` and `AI_MODEL=gemini-2.5-flash`.
- If frontend requests are blocked by CORS, add the final Vercel URL to `FRONTEND_URL` and `FRONTEND_URLS`, save, then restart Azure.
- If Vercel lists multiple production/preview domains, include each domain in `FRONTEND_URLS`. Otherwise login may show `Network Error` even though the backend health URL works.
- The backend also allows the SmartHire Vercel preview URL pattern used by this project, so new preview deployments do not need a code change every time Vercel creates a new temporary URL.
- If notifications do not update live, confirm WebSockets are on and `REACT_APP_SOCKET_URL` points to the Azure backend.
- If Azure shows a billing warning, stay on Free F1 or the lowest student-friendly plan and monitor Cost Management.

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
REACT_APP_API_URL=https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net
REACT_APP_SOCKET_URL=https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net
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
