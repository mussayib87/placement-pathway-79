# Placement Navigator

MASTER PROMPT



You are a senior Full Stack Software Engineer and UI/UX Designer.



Build a modern, production-quality full-stack web application called Placement Resource Hub.



Problem Statement



Students preparing for placements struggle because interview experiences, coding resources, aptitude materials, and preparation notes are scattered across WhatsApp groups, Telegram channels, Google Drive links, and seniors' chats.



The goal is to create one centralized platform where students can share, search, and manage placement resources.



This project is for a coding club assessment, so the application must have clean code, responsive UI, proper project structure, and complete CRUD functionality.



---



Technology Stack



Frontend:



- React

- Vite

- Tailwind CSS



Backend:



- Node.js

- Express.js



Database:



- MongoDB



Deployment Ready:



- Frontend → Vercel

- Backend → Render

- Database → MongoDB Atlas



Use REST APIs.



Organize the project professionally.



---



UI Theme



Use a modern student dashboard.



Primary Color:

Blue (#2563EB)



Background:

Light Gray



Cards:

White



Rounded Corners



Soft Shadows



Responsive Design



Professional Animations



Beautiful Icons



---



Pages



Home



Display



Hero Section



Project Description



Search Bar



Latest Interview Experiences



Popular Companies



Recent Resources



Statistics Cards



Footer



---



Dashboard



Display



Total Companies



Total Interview Experiences



Total Resources



Recent Uploads



Top Companies



Quick Actions



---



Companies Page



Show all companies.



Each company card should display



Company Name



Role



Number of Experiences



Number of Resources



Button



View Details



Search Company



Filter Company



---



Interview Experience Page



Display all interview experiences.



Each card contains



Company Name



Student Name



Role



Interview Date



Difficulty



Interview Rounds



Technical Questions



HR Questions



Tips



Buttons



View



Edit



Delete



Search



Filter



Sort



---



Add Interview Experience



Form Fields



Student Name



Company



Role



Interview Date



Interview Difficulty



Interview Rounds



Technical Questions



HR Questions



Coding Questions



Experience Summary



Preparation Tips



Submit Button



Cancel Button



---



Edit Interview Experience



Allow updating every field.



---



Resources Page



Each resource contains



Title



Company



Category



Description



Resource Type



PDF



YouTube



Website



Notes



DSA Sheet



Aptitude



System Design



Link



Buttons



Edit



Delete



Open Resource



---



Add Resource



Form



Title



Company



Category



Description



Resource Type



Link



Submit



Cancel



---



Search Page



Global Search



Search by



Company



Role



Difficulty



Category



Interview Question



Student Name



---



CRUD Requirements



Users must be able to



Create



Read



Update



Delete



Interview Experiences



Resources



Companies



Everything should update immediately after CRUD operations.



---



Search and Filter



Implement



Search Company



Search Role



Search Resource



Search Interview Questions



Filter by Company



Filter by Role



Filter by Category



Filter by Difficulty



Sort by Date



Newest First



Oldest First



---



Database Collections



Company



id



companyName



role



createdAt



InterviewExperience



id



studentName



company



role



difficulty



date



rounds



technicalQuestions



hrQuestions



codingQuestions



tips



summary



createdAt



Resource



id



title



company



category



description



type



link



createdAt



---



Backend APIs



GET all companies



POST company



PUT company



DELETE company



GET experiences



POST experience



PUT experience



DELETE experience



GET resources



POST resource



PUT resource



DELETE resource



Search API



Filter API



---



Input Validation



No empty fields



Required field validation



Proper URL validation



Display friendly error messages



Success toast notifications



---



Responsive Design



Mobile



Tablet



Laptop



Desktop



Every page must be fully responsive.



---



Nice UI Features



Loading Spinner



Empty State



404 Page



Confirmation before Delete



Success Notifications



Error Notifications



Skeleton Loading



Hover Effects



Smooth Animations



Dark Mode Toggle



---



Folder Structure



Frontend



components



pages



services



hooks



utils



assets



Backend



controllers



routes



models



middleware



config



database



---



Git Commit Plan



Generate the project feature by feature so commits can be made like:



Initial Project Setup



Navbar and Layout



MongoDB Connection



Company CRUD



Interview Experience CRUD



Resource CRUD



Search Feature



Filter Feature



Responsive UI



Deployment Ready



README Update



---



README



Generate a professional README including



Project Overview



Problem Statement



Features



Technology Stack



Installation Steps



Folder Structure



API Endpoints



Screenshots Placeholder



Future Improvements



Challenges Faced



Deployment Instructions



---



Final Requirement



The application must feel like a real product, not a college assignment.



Write clean, modular, maintainable code.



Avoid unnecessary complexity.



Ensure every CRUD operation works correctly.



Generate complete frontend, backend, database models, APIs, and responsive UI.



At the end, provide clear instructions for:



1. Connecting MongoDB Atlas.

2. Deploying the frontend to Vercel.

3. Deploying the backend to Render.

4. Connecting the frontend to the deployed backend.

5. Pushing the project to GitHub.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://placement-pathway-79.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/006a0601-4603-49b0-a8cc-4455e0e82ff2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
