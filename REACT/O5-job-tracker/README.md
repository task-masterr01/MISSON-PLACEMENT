# Job Application Tracker 🚀

A full-stack web application built to help developers track their job and internship applications in one place.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Tools:** Vite, pg (node-postgres), dotenv

## ✨ Features
- **Full CRUD Operations:**
  - Create new job applications (Company, Role, Status, Notes).
  - Read/View all applications on a grid dashboard.
  - Update application status (e.g., Applied ➡️ Interview ➡️ Offer).
  - Delete rejected or duplicate applications.
- **RESTful API:** Custom Express backend handling all database queries.
- **Dynamic UI:** Responsive grid layout using Tailwind CSS with status-based color badging.

## 🚀 How to Run Locally

### 1. Database Setup
Create a PostgreSQL database named `job_tracker` and run this SQL query:
```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    date_applied DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Applied',
    notes TEXT,
    link VARCHAR(255)
);