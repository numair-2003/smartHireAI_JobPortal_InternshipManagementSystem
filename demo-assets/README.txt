SmartHire AI demo assets
========================

Resume PDFs generated for seeded demo students:
- resumes/ayesha-khan-resume.pdf
- resumes/sara-malik-resume.pdf
- resumes/hamza-raza-resume.pdf
- resumes/emma-johnson-resume.pdf
- resumes/lucas-meyer-resume.pdf
- resumes/sofia-garcia-resume.pdf
- resumes/omar-hassan-resume.pdf
- resumes/mei-chen-resume.pdf

Profile PNGs generated for everyone except admins:
- profile-photos/ayesha-khan-profile.png
- profile-photos/bilal-ahmed-profile.png
- profile-photos/carlos-rivera-profile.png
- profile-photos/emma-johnson-profile.png
- profile-photos/hamza-raza-profile.png
- profile-photos/lucas-meyer-profile.png
- profile-photos/maha-siddiqui-profile.png
- profile-photos/mei-chen-profile.png
- profile-photos/olivia-smith-profile.png
- profile-photos/omar-hassan-profile.png
- profile-photos/priya-nair-profile.png
- profile-photos/sara-malik-profile.png
- profile-photos/sofia-garcia-profile.png

Demo video:
- videos/Demo_Video_SmartHireAI.mp4

The demo video is tracked with Git LFS because it is larger than GitHub's normal 100 MB file limit.

Run backend/npm run sync-demo-assets after seeding so Cloudinary stores these files and MongoDB application records point to working resume URLs.
