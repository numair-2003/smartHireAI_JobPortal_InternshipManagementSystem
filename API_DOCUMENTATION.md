# SmartHire AI API Documentation

Backend API for the SmartHire AI job portal and internship management system.

## Base URLs

- Local API: `http://localhost:5000/api`
- Local Socket.IO: `http://localhost:5000`
- Azure API: `https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/api`
- Azure Socket.IO: `https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net`
- Root check: `GET http://localhost:5000/`
- Health check: `GET http://localhost:5000/api/health`
- Azure health check: `GET https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net/api/health`

## Authentication

Protected routes require a JWT in the request header:

```http
Authorization: Bearer <token>
```

Tokens are returned by register and login endpoints.

## Response Shape

Most successful responses return the requested JSON object or array.

Error response:

```json
{
  "success": false,
  "message": "Error message"
}
```

In development, the backend may also include `stack`. In production, set `NODE_ENV=production` to hide stack traces.

## Backend Environment Variables

Create `backend/.env` from `backend/.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | Backend port, usually `5000` locally |
| `NODE_ENV` | Recommended | Use `development` locally and `production` after deployment |
| `MONGO_URI` | Yes | MongoDB local or Atlas connection string |
| `DNS_SERVERS` | Recommended for Atlas SRV DNS issues | Comma-separated DNS servers, for example `8.8.8.8,8.8.4.4` |
| `JWT_SECRET` | Yes | Secret used to sign login tokens |
| `CLOUDINARY_CLOUD_NAME` | Required for uploads | Cloudinary cloud name for resumes and profile photos |
| `CLOUDINARY_API_KEY` | Required for uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Required for uploads | Cloudinary API secret |
| `EMAIL_USER` | Optional | Gmail address for Nodemailer status emails |
| `EMAIL_PASS` | Optional | Gmail app password |
| `FRONTEND_URL` | Yes | Primary allowed frontend origin, for example `http://localhost:3000` locally or the Vercel URL in production |
| `FRONTEND_URLS` | Recommended | Comma-separated allowed frontend origins, useful for allowing both local and deployed frontend URLs |
| `AI_API_KEY` | Optional | OpenAI API key. Add this only on the backend or Azure App Service, never in frontend/Vercel. If missing or blocked by quota/rate/billing limits, AI routes use demo fallback responses |
| `ADMIN_EMAIL` | Optional | Email for `npm run create-admin` |
| `ADMIN_PASSWORD` | Optional | Password for `npm run create-admin` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | Azure only | Use `true` when deploying to Azure App Service from GitHub Actions |

Frontend-only variables such as `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` belong in the frontend environment, not in `backend/.env`.

## Backend Scripts

Run from the `backend` folder.

```bash
npm run dev
npm start
npm run seed
npm run create-admin
```

- `npm run dev`: starts the API with Nodemon.
- `npm start`: starts the API with Node.
- `npm run seed`: creates demo students, recruiters, jobs, applications, and notifications.
- `npm run create-admin`: creates or promotes an admin user using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Auth Routes

### Register

`POST /auth/register`

Access: Public

Registers a student or recruiter. Admins should be created with `npm run create-admin`.

```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "password123",
  "role": "student",
  "company": "",
  "phone": "+92 300 1234567"
}
```

Valid roles for public registration:

- `student`
- `recruiter`

### Login

`POST /auth/login`

Access: Public

```json
{
  "email": "student@smarthire.ai",
  "password": "password123"
}
```

### Current User

`GET /auth/me`

Access: Private

Returns the logged-in user profile.

### Update Profile

`PUT /auth/profile`

Access: Private

```json
{
  "name": "Ayesha Khan",
  "phone": "+92 300 1234567",
  "company": "TechNova Labs",
  "password": "newpassword123"
}
```

### Upload Profile Photo

`POST /auth/avatar`

Access: Student or Recruiter

Content type: `multipart/form-data`

Field:

- `avatar`: JPG, PNG, or WEBP image up to 2MB

The image is uploaded to Cloudinary under:

- `smarthire/avatars/student`
- `smarthire/avatars/recruiter`

When a user replaces their profile photo, the previous Cloudinary avatar is deleted if its public ID is stored.

Response:

```json
{
  "avatar": "https://res.cloudinary.com/.../image/upload/...",
  "message": "Profile photo uploaded"
}
```

## Job Routes

### List Active Jobs

`GET /jobs`

Access: Public

Query parameters:

- `search`: searches title, company, and skills
- `type`: `full-time`, `part-time`, `internship`, or `contract`
- `location`: searches location text

Example:

```http
GET /api/jobs?search=react&type=internship&location=Lahore
```

### Job Details

`GET /jobs/:id`

Access: Public

### Recruiter Listings

`GET /jobs/my/listings`

Access: Recruiter or Admin

Returns jobs posted by the logged-in recruiter with `applicationCount`.

### Create Job

`POST /jobs`

Access: Recruiter or Admin

```json
{
  "title": "MERN Stack Intern",
  "company": "TechNova Labs",
  "type": "internship",
  "location": "Lahore, Hybrid",
  "salary": "PKR 35k - 55k",
  "description": "Work on React dashboards and Express APIs.",
  "requirements": ["React basics", "Node.js basics"],
  "skills": ["React", "Node.js", "MongoDB"],
  "applicationDeadline": "2026-07-15"
}
```

`requirements` and `skills` can be arrays or comma/newline-separated text.

### Update Job

`PUT /jobs/:id`

Access: Job owner recruiter or Admin

Send any fields that need to change.

### Delete Job

`DELETE /jobs/:id`

Access: Job owner recruiter or Admin

Deletes the job document.

## Application Routes

### Apply To Job

`POST /applications`

Access: Student

Content type: `multipart/form-data`

Fields:

| Field | Required | Notes |
| --- | --- | --- |
| `jobId` | Yes | MongoDB job ID |
| `coverLetter` | Optional | Student cover letter |
| `resumeText` | Optional | Used for AI resume review |
| `resume` | Required if profile has no resume | PDF, DOC, or DOCX file |

Upload limit: 5MB.

Allowed file types:

- PDF
- DOC
- DOCX

When an application is created, the recruiter receives a database notification and a Socket.IO `notification` event.

### Upload Profile Resume

`POST /applications/resume`

Access: Student

Content type: `multipart/form-data`

Field:

- `resume`: PDF, DOC, or DOCX file up to 5MB

### View Current Profile Resume

`GET /applications/resume/current`

Access: Student

Returns the logged-in student's current resume file as an inline document response. The frontend uses this protected API route instead of opening Cloudinary links directly, because Cloudinary accounts can block direct PDF/Word delivery.

### View Application Resume

`GET /applications/:id/resume`

Access: Application owner student, job owner recruiter, or Admin

Returns the resume attached to a specific application as an inline document response. For seeded demo applications, the Azure deployment includes local demo PDF fallbacks so recruiter review pages can open resumes reliably.

### My Applications

`GET /applications/my`

Access: Student

Returns the logged-in student's applications with populated job data.

### Job Applications

`GET /applications/job/:jobId`

Access: Job owner recruiter or Admin

Returns applicants for a specific job.

### Update Application Status

`PUT /applications/:id/status`

Access: Job owner recruiter or Admin

```json
{
  "status": "shortlisted"
}
```

Valid status values:

- `pending`
- `reviewed`
- `shortlisted`
- `rejected`
- `accepted`

When status changes, the student receives:

- database notification
- Socket.IO `notification` event
- email notification if `EMAIL_USER` and `EMAIL_PASS` are configured

If email sending fails, the API still saves the status update and logs the email issue.

## AI Routes

AI routes use OpenAI when `AI_API_KEY` is configured. Without it, or when OpenAI returns quota/rate/billing errors, the backend returns demo fallback responses so local testing and demo videos still work.

### Resume Review

`POST /ai/resume-review`

Access: Any logged-in user

```json
{
  "resumeText": "Resume text pasted here...",
  "jobTitle": "MERN Stack Intern",
  "jobSkills": ["React", "Node.js", "MongoDB"]
}
```

Returns:

```json
{
  "score": 88,
  "feedback": "Summary feedback",
  "strengths": ["Relevant experience"],
  "improvements": ["Add measurable achievements"]
}
```

### Job Description Generator

`POST /ai/job-description`

Access: Recruiter or Admin

```json
{
  "title": "Frontend Developer Associate",
  "company": "TechNova Labs",
  "type": "full-time",
  "location": "Remote",
  "skills": "React, Redux Toolkit, Tailwind CSS"
}
```

Returns:

```json
{
  "description": "Generated job description",
  "requirements": ["Requirement 1", "Requirement 2"],
  "skills": ["React", "Redux Toolkit", "Tailwind CSS"]
}
```

## Notification Routes

### List Notifications

`GET /notifications`

Access: Private

Returns the latest 50 notifications for the logged-in user.

### Mark One Notification As Read

`PUT /notifications/:id/read`

Access: Private

### Mark All Notifications As Read

`PUT /notifications/read-all`

Access: Private

## Admin User Routes

All `/users` routes require an admin account.

### Platform Stats

`GET /users/stats`

Returns:

```json
{
  "users": 6,
  "jobs": 5,
  "applications": 4,
  "students": 3,
  "recruiters": 2,
  "admins": 1,
  "activeUsers": 6,
  "activeJobs": 5,
  "applicationsByStatus": {
    "pending": 1,
    "reviewed": 1,
    "shortlisted": 1,
    "accepted": 1
  }
}
```

### List Users

`GET /users`

### Update User

`PUT /users/:id`

```json
{
  "role": "recruiter",
  "isActive": true
}
```

Valid roles:

- `student`
- `recruiter`
- `admin`

Admins cannot deactivate their own logged-in admin account.

### Delete User

`DELETE /users/:id`

Admins cannot delete their own logged-in admin account.

## Socket.IO Notifications

Socket URL locally:

```text
http://localhost:5000
```

Socket URL after Azure backend deployment:

```text
https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net
```

Client joins a personal room after login:

```js
socket.emit('join', userId);
```

Server emits:

```js
socket.on('notification', (notification) => {
  console.log(notification);
});
```

Notification object:

```json
{
  "_id": "notificationId",
  "user": "userId",
  "title": "Application Update",
  "message": "Your application is now shortlisted",
  "type": "status",
  "link": "/student",
  "isRead": false,
  "createdAt": "2026-06-06T10:00:00.000Z"
}
```

## Demo Accounts

After running `npm run seed`:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@smarthire.ai` | `password123` |
| Recruiter | `recruiter@smarthire.ai` | `password123` |
| Admin | `admin@smarthire.ai` | Uses `ADMIN_PASSWORD` if set; otherwise demo fallback `admin123` |

Change demo credentials before using the app publicly. The seed script uses `ADMIN_PASSWORD` for the seeded admin when it is configured. If `admin@smarthire.ai` already exists, `npm run create-admin` promotes that account to admin and updates the password when `ADMIN_PASSWORD` is configured.

When `NODE_ENV=production`, `npm run create-admin` requires `ADMIN_PASSWORD` and will not use a demo fallback password.

## Deployment Notes

- Set backend environment variables in the deployment provider dashboard.
- Set frontend environment variables separately in the frontend project.
- Use MongoDB Atlas for production database hosting.
- Use real Cloudinary credentials for resume and profile photo uploads.
- Use a Gmail app password or another transactional email provider for email.
- Azure App Service is the recommended backend host for this project because it can run the Express server as a long-lived Node.js app.
- In Azure App Service, set the runtime stack to Node 22 LTS and use `npm start` as the startup command.
- Use Linux App Service for this project. The Express backend is cross-platform, and Linux is common for Node deployments.
- Keep `Deployment slot setting` unchecked for environment variables unless deployment slots are being used.
- Enable WebSockets in Azure App Service when using Socket.IO realtime notifications.
- Do not set `PORT` manually in Azure. The backend listens on `process.env.PORT || 5000`, and Azure provides the runtime port.
- If GitHub Actions deployment fails with `No credentials found`, add the full Azure publish profile XML as a GitHub Actions secret named `AZURE_WEBAPP_PUBLISH_PROFILE`.
- If MongoDB Atlas has SRV DNS issues, set `DNS_SERVERS=8.8.8.8,8.8.4.4`, use Cloudflare WARP, or switch to a non-SRV MongoDB URI.
- Connect MongoDB Compass to Atlas with the Atlas Compass connection string, replace `<db_password>`, add `/smarthire-ai` after `.net`, and make sure Atlas Network Access allows the current IP.
- Vercel serverless functions can serve REST API routes, but long-lived Socket.IO/WebSocket realtime should be hosted on a serverful Node.js platform such as Azure App Service or replaced with a managed realtime provider for production.
