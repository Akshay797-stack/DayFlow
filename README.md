# 🌟 Dayflow - Human Resource Management System (HRMS)

> **"Every workday, perfectly aligned."**
> A modern, full-stack enterprise Human Resource Management System built for the **Odoo Hackathon**.

---

## 📖 Overview

**Dayflow** digitizes and streamlines core HR operations end-to-end, providing a unified workspace for both **HR Administrators** and **Employees**. The system features role-based access, interactive shift punch terminals, automated leave approval workflows, employee profile & document vault management, verified PDF payroll generation, and executive analytics.

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
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & Theme** | Tailwind CSS v4 + Bespoke Odoo Design System (Light/Dark mode) |
| **Icons & UI** | Lucide React |
| **Data Visualizations** | Recharts |
| **PDF Generation** | jsPDF + jsPDF-AutoTable |
| **Micro-Interactions** | Canvas-Confetti |
| **Backend API** | Node.js + Express REST API |
| **State & Persistence** | Reactive Context API + Persistent LocalStorage Engine (with Seed Data) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Running Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Akshay797-stack/DayFlow.git
   cd DayFlow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

4. **Run the Full-Stack Application (Frontend + Express API Server)**:
   ```bash
   npm run fullstack
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
DayFlow/
├── server/
│   └── server.ts                 # Express REST API server
├── src/
│   ├── components/
│   │   ├── analytics/            # HR Analytics charts (Recharts)
│   │   ├── attendance/           # CheckInWidget, AttendanceTable, WeeklyCalendar
│   │   ├── auth/                 # LoginModal, RegisterModal
│   │   ├── common/               # Badge, Modal, StatCard, Toast
│   │   ├── layout/               # Navbar, Sidebar
│   │   ├── leaves/               # ApplyLeaveModal, LeaveBalanceCards, LeaveRequestTable
│   │   ├── payroll/              # PayslipModal, PayrollTable, SalaryStructureModal
│   │   └── profile/              # ProfileView, EditProfileModal, DocumentManager
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth state, role switching & session
│   │   └── HRDataContext.tsx     # Reactive HR data store & CRUD operations
│   ├── pages/                    # Dashboard, Employees, Attendance, Leaves, Payroll, Profile, Analytics
│   ├── services/
│   │   ├── mockData.ts           # Rich corporate seed dataset
│   │   ├── pdfGenerator.ts       # jsPDF salary statement generator
│   │   └── storage.ts            # Persistence engine
│   ├── types/
│   │   └── index.ts              # TypeScript domain interfaces
│   ├── App.tsx                   # Main app & route controller
│   ├── index.css                 # Custom styling & glassmorphism system
│   └── main.tsx                  # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🏆 Hackathon Demo Credentials

| Role | Email | Password | Pre-configured Profile |
| :--- | :--- | :--- | :--- |
| **HR / Admin** | `admin@dayflow.com` | `admin123` | Sarah Jenkins (VP of People & Culture) |
| **Employee** | `employee@dayflow.com` | `emp123` | Alex Morgan (Senior Full Stack Engineer) |

*(You can also use the 1-click Demo buttons at the top of the app or on the landing page for instant switching)*.

---

## 📜 License
Developed for the **Odoo Hackathon**. Distributed under the MIT License.
