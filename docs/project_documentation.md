# Tanit-Talent-AI Project Documentation 📑

This document provides a detailed breakdown of each layer in the **Tanit-Talent-AI** recruitment platform, outlining current implementations and pending requirements.

---

## 🏗️ 1. Frontend Layer (React & Vite)
The frontend serves as the interactive interface for candidates and recruiters, built with a premium **glassmorphism** design.

### ✅ What we have:
- **Core Framework**: React 18 with Vite for fast builds.
- **Authentication System**:
    - `Login` & `Register` pages with form validation.
    - `AuthContext` for global user state management (JWT stored in `localStorage`).
- **Dynamic Dashboard**:
    - **Recruiter View**: Overview of posted jobs, applicant counts, and top candidate highlights.
    - **Candidate View**: Applied jobs list with AI scoring and status updates.
- **Job Management**:
    - Job listing page with details view.
    - Job application flow with CV upload (PDF/TXT support).
- **UI/UX**:
    - Responsive `Navbar` with role-based links.
    - Premium aesthetics using **Vanilla CSS**, **Framer Motion** for animations, and **Glassmorphism** depth effects.

### 🚀 What we need to implement:
- **Profile Management**: Pages for users to update their personal info, resume details, or company profile.
- **Advanced Search**: Filtering jobs by category, location, salary range, and keyword.
- **Interview Scheduler**: A simple calendar interface for recruiters to propose meeting times.
- **Real-time Notifications**: Toast notifications for application updates (e.g., "Your CV was ranked High!").
- **Dark/Light Mode Toggle**: Persisted theme preferences.

---

## ⚙️ 2. Backend Layer (Node.js & Express)
The backend acts as the central logic hub, managing data persistence, authentication, and communication with the AI service.

### ✅ What we have:
- **API Architecture**: Modular MVC structure (Models, Views, Controllers, Routes).
- **Authentication**: JWT-based stateless auth with bcrypt password hashing.
- **Middleware**:
    - `auth.middleware.js`: Protects routes and handles role-based access control (RBAC).
    - `upload.middleware.js`: Handles multipart/form-data for CV uploads using Multer.
- **Controller Logic**:
    - `authController`: User lifecycle management.
    - `jobController`: CRUD operations specifically for recruiters.
    - `applicationController`: CV storage and orchestration with the AI service.
- **AI Integration**: Axios-based proxying of application data to the Python AI service.

### 🚀 What we need to implement:
- **Email Service**: Integration with **Nodemailer** for automated confirmation emails.
- **Rate Limiting**: Protection against brute-force attacks on auth and application endpoints.
- **Comprehensive Validation**: Migration to **Joi** or **Zod** for stricter schema validation on all inputs.
- **Activity Logs**: Tracking recruiter actions and candidate applications for auditing.
- **Pagination**: Implementing `skip/limit` for large job and application lists.

---

## 🧠 3. AI Service Layer (Python & Flask)
The AI layer provides the "intelligence" of the platform by analyzing CVs against job requirements using Natural Language Processing.

### ✅ What we have:
- **NLP Engine**: Uses `Scikit-learn` for TF-IDF Vectorization and Cosine Similarity.
- **Extraction**: `pdfplumber` for PDF text extraction and standard file reading for TXT.
- **Endpoint**: `/analyze` accepts CV text or file paths and returns a score (0-1) and a ranking (High/Medium/Low).
- **Environment**: Container-ready Python environment with `CORS` support.

### 🚀 What we need to implement:
- **DOCX Support**: Integration with `python-docx` to handle Microsoft Word resumes.
- **Skill Extraction (NER)**: Using `SpaCy` or `NLTK` to specifically identify skills, years of experience, and degrees rather than just overall similarity.
- **Caching**: Storing pre-calculated vectors for job descriptions to speed up analysis.
- **Multi-language Support**: Optimization for both Arabic and French (relevant to the "Tanit" context).

---

## 🗄️ 4. Database Layer (MongoDB)
A NoSQL database layer managed by Mongoose to handle the complex relationships between users, jobs, and applications.

### ✅ What we have:
- **User Schema**: Includes roles (`candidate`, `recruiter`, `admin`), hashed passwords, and profile data.
- **Job Schema**: Stores title, description, company details, requirements, and recruiter references.
- **Application Schema**: Tracks the relationship between a candidate and a job, storing the CV path, AI score, and ranking result.

### 🚀 What we need to implement:
- **Indexing**: Adding indexes to `jobTitle`, `location`, and `tags` for faster search performance.
- **Cleanup Jobs**: Automated scripts to remove orphaned CV files from storage.
- **Analytics Aggregation**: MongoDB aggregation pipelines to calculate hire-rates and average scores for recruiter dashboards.

---

## 📂 5. Infrastructure & Documentation
- **Current**: Docker configurations for backend/frontend/AI service. `architecture.md` available in `/docs`.
- **Planned**: API documentation using **Swagger/OpenAPI** and automated CI/CD pipelines.
