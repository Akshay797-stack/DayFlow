# 🌟 Dayflow - Human Resource Management System (HRMS)

> **"Every workday, perfectly aligned."**
> A production-ready, full-stack enterprise Human Resource Management System with **MongoDB** persistence built for the **Odoo Hackathon**.

---

## 📖 Overview

**Dayflow** digitizes and streamlines core HR operations end-to-end, providing a unified workspace for both **HR Administrators** and **Employees**. Backed by **MongoDB** and **Express.js REST APIs**, the system provides robust data persistence, role-based security, interactive shift punch terminals, automated leave approval workflows, employee profile & document vault management, verified PDF payroll generation, and executive analytics.

---

## 🗄️ MongoDB Production Database Architecture

The platform runs on a dedicated MongoDB database (`dayflow_hrms`) with automated seeding and indexed schemas:

| Collection | Model / Schema | Description |
| :--- | :--- | :--- |
| `employees` | `EmployeeModel` | Enterprise personnel, salary structures, leave quotas, document vaults, emergency contacts |
| `attendances` | `AttendanceModel` | Daily and weekly punch logs with check-in/out timestamps, hours calculated, and status |
| `leaves` | `LeaveModel` | Time-off applications, approval states (`PENDING`, `APPROVED`, `REJECTED`), and reviewer feedback |
| `payrolls` | `PayrollModel` | Monthly salary disbursements, structured earnings, statutory withholdings (PF & Tax) |
| `notifications`| `NotificationModel` | In-app alerts for leave approvals, attendance updates, and payroll disbursements |

---

## ✨ Key Features & Modules

### 🔐 1. Authentication & Role-Based Authorization
- **Sign Up / Sign In**: Registration with Employee ID, Email, Role, Department, and Password strength compliance.
- **Role Privileges**:
  - **HR Admin**: Full organization directory governance, attendance adjustments, leave triage (Approve/Reject with feedback), compensation & salary structure editor, monthly payroll batch execution.
  - **Employee**: Personal shift check-in/out, leave application with balance quota checks, read-only salary breakdown, and PDF payslip download.
- **1-Click Demo Quick-Access**: Instant pre-configured accounts for rapid demonstration & judging:
  - 🛡️ **HR Admin**: `admin@dayflow.com` (Sarah Jenkins - VP of People & Culture)
  - 👤 **Employee**: `employee@dayflow.com` (Alex Morgan - Senior Full Stack Engineer)
- **Email Verification**: Verification banner and simulated activation workflow.

### ⏱️ 2. Attendance Tracking & Shift Punch Terminal
- **Live Punch Terminal**: Single-click Check-In / Check-Out with a real-time digital clock and session duration counter.
- **Daily Target Progress**: Visual compliance meter towards standard 8.0h working day.
- **Status Types**: `Present`, `Absent`, `Half-day`, `Leave`.
- **Weekly Timesheet Calendar**: Color-coded 7-day grid tracking daily working hours and attendance status.
- **Organization Attendance Sheet**: Filter by date, status, employee name/ID, and **1-Click Export to CSV**.

### 🏖️ 3. Leave & Time-Off Management
- **Leave Types**: `Paid Leave`, `Sick Leave`, `Casual / Personal`, `Unpaid Leave`.
- **Quota Tracking**: Visual quota cards showing Used vs Remaining days with dynamic progress bars.
- **Application Flow**: Date range picker with automatic working days calculation and quota validation.
- **HR Approval Triage Queue**: Inline approval/rejection modal with customizable reviewer comments and immediate calendar reflection.

### 💵 4. Payroll & Salary Management
- **Employee View**: Transparent breakdown of Base Pay, HRA, Conveyance, Special Allowances, PF, and Professional Tax.
- **Admin Compensation Engine**: Configure compensation packages for any employee with instant Net Take-Home calculation.
- **Monthly Batch Run**: Single-click batch disbursement engine for company-wide payroll processing.
- **Official PDF Payslip Generator**: Generates formatted, audit-ready salary slips using `jspdf` and `jspdf-autotable`.

### 👤 5. Employee Profile & Encrypted Document Vault
- **Multi-Tab Profile View**:
  - `Job & Overview`: Designation, Department, Date of Joining, Manager, Bio.
  - `Salary Structure`: Structured earnings and deductions overview.
  - `Documents Vault`: Upload, categorize, preview, and download contracts, IDs, tax forms (W-4), and resumes.
  - `Emergency Info`: Designated emergency contacts.
- **Role-Aware Editing**: Strict separation of user-editable personal fields vs HR-controlled corporate fields.

### 📊 6. Analytics & Executive Reports
- **Workforce Attendance Compliance**: Area chart tracking daily present vs leave percentages.
- **Leave Category Breakdown**: Donut chart analyzing leave utilization distribution across types.
- **Departmental Payroll Allocation**: Bar chart tracking compensation investment across engineering, HR, design, infra, and marketing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Database** | MongoDB + Mongoose ODM (`mongodb://127.0.0.1:27017/dayflow_hrms`) |
| **Backend API** | Node.js + Express.js REST API |
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & Theme** | Tailwind CSS v4 + Bespoke Odoo Design System (Light/Dark mode) |
| **Icons & UI** | Lucide React |
| **Data Visualizations** | Recharts |
| **PDF Generation** | jsPDF + jsPDF-AutoTable |
| **Micro-Interactions** | Canvas-Confetti |
| **State & Synchronization**| Fullstack reactive Context API with MongoDB sync |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Running on default port `27017`)

### 1. Environment Configuration
Create a `.env` file (or use default `.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dayflow_hrms
JWT_SECRET=dayflow_hrms_super_secure_jwt_secret_key_2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Full-Stack (MongoDB Backend + Vite Frontend)
```bash
npm run fullstack
```
- **Frontend App**: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API & MongoDB**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

*(The database will automatically seed with full enterprise records on first run)*.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
DayFlow/
├── server/
│   ├── db/
│   │   ├── connection.ts         # MongoDB connection handler
│   │   └── seed.ts               # Automated MongoDB seeder
│   ├── models/                   # Mongoose schemas (Employee, Attendance, Leave, Payroll, Notification)
│   ├── routes/                   # REST API endpoints (Auth, Employees, Attendance, Leaves, Payroll, Analytics)
│   └── server.ts                 # Express production server
├── src/
│   ├── components/               # UI components (Attendance, Leaves, Payroll, Profile, Analytics)
│   ├── context/                  # React Contexts (AuthContext, HRDataContext)
│   ├── pages/                    # Application pages
│   ├── services/
│   │   ├── api.ts                # Full-stack MongoDB API client
│   │   ├── pdfGenerator.ts       # jsPDF salary statement generator
│   │   └── storage.ts            # Persistent client-side cache
│   ├── types/                    # Domain TypeScript interfaces
│   ├── App.tsx                   # Main routing & layout controller
│   └── index.css                 # Odoo brand styling & glassmorphism
├── .env                          # MongoDB configuration
├── package.json
└── vite.config.ts
```

---

## 🏆 Hackathon Demo Credentials

| Role | Email | Password | Pre-configured Profile |
| :--- | :--- | :--- | :--- |
| **HR / Admin** | `admin@dayflow.com` | `admin123` | Sarah Jenkins (VP of People & Culture) |
| **Employee** | `employee@dayflow.com` | `emp123` | Alex Morgan (Senior Full Stack Engineer) |

---

## 👤 Author & Contributor
- **Name**: Akshay Chandar
- **GitHub**: [@Akshay797-stack](https://github.com/Akshay797-stack)
- **Email**: `akshaychandarm.24csd@kongu.edu`

---

## 📜 License
Distributed under the MIT License for the **Odoo Hackathon**.
