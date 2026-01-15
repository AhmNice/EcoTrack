# EcoTrack 🌍

**EcoTrack** is a scalable, full‑stack platform that empowers communities to report, track, and collaboratively resolve environmental issues. It connects citizens, organizations, and administrators through a transparent, data‑driven workflow that turns environmental concerns into measurable action.

> From pollution and waste management to deforestation and urban sanitation, EcoTrack makes environmental accountability visible and actionable.

---

## ✨ Key Highlights

- 📍 **Location‑aware reporting** tailored to Nigerian states and LGAs
- 📸 **Photo‑backed evidence** with secure cloud storage
- 🔔 **Real‑time notifications** for status updates and engagement
- 🗳️ **Community voting & comments** to prioritize issues
- 🏢 **Organization workflows** for structured resolution
- 🔐 **Enterprise‑grade security** with RBAC, OTP, and audit logs

---

## 🧭 What Problem Does EcoTrack Solve?

Environmental issues often go unreported, unresolved, or invisible. EcoTrack bridges the gap between **citizen reports** and **institutional response** by providing:

- A single source of truth for environmental incidents
- Clear ownership and accountability
- Community‑driven prioritization
- Traceable actions and outcomes

---

## 🧱 System Architecture

EcoTrack follows a **modular, service‑oriented architecture** with a modern React frontend and a robust Node.js backend.

```
Client (React + Vite)  →  REST API (Express)  →  PostgreSQL
                                   ↓
                             Cloudinary (Images)
                                   ↓
                             Email Services
```

---

## 🖥️ Frontend (Client)

### Tech Stack

- **React 19** – Component‑based UI
- **Vite** – Fast builds and dev server
- **React Router v7** – Routing
- **Tailwind CSS** – Responsive styling
- **Zustand** – Lightweight state management
- **Axios** – API communication
- **React Toastify** – User feedback
- **Lucide React** – Icons
- **date‑fns** – Date utilities

### Notable Capabilities

- Fully responsive UI
- Auth‑aware route protection
- Geolocation‑based report creation
- Optimistic UI updates with Zustand
- Centralized API error handling

### Directory Overview

The client is structured for **scalability and clarity**, separating pages, layouts, stores, hooks, and utilities for maintainability.

---

## 🛠️ Backend (Server)

### Tech Stack

- **Node.js + Express** – REST API
- **PostgreSQL** – Relational database
- **JWT + OTP** – Secure authentication
- **bcryptjs** – Password hashing
- **Cloudinary** – Media storage
- **Multer** – File uploads
- **Nodemailer** – Email delivery
- **Helmet & Rate Limiting** – Security hardening

### Core Backend Features

- RESTful API design
- Role‑Based Access Control (RBAC)
- Fine‑grained permission checks
- Transaction‑safe database operations
- Activity & audit logging
- Seeded data for rapid setup

---

## 🗄️ Database Design

EcoTrack uses **PostgreSQL with multiple schemas** to enforce separation of concerns and long‑term scalability.

### Schemas

1. **auth_schema** – Users, roles, permissions
2. **report_schema** – Reports, comments, votes, images
3. **location_schema** – Nigerian states & LGAs
4. **stakeholder_schema** – Organizations
5. **notification_schema** – User notifications
6. **analytics_schema** – Activity tracking
7. **system_schema** – Audit & system logs

📄 Full schema documentation is available in `SCHEMA.md`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v16+**
- PostgreSQL **v12+**
- npm or yarn
- Cloudinary account
- Email service credentials

### Installation Flow

1. **Clone the repository**
2. **Configure environment variables**
3. **Initialize & seed the database**
4. **Start backend and frontend servers**

Once running:

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:5000`

---

## 🔐 Authentication & Access Control

### Roles

- **Super Admin** – Full system control
- **Admin** – System and user management
- **Organization Staff** – Assigned report handling
- **Reporter** – Create and manage reports
- **Citizen** – View, vote, and comment

Permissions are centrally managed and enforced at the API level.

---

## 📡 API Overview

The API is organized by domain:

- **Auth** – Registration, login, OTP, password reset
- **Reports** – CRUD, status updates, assignments
- **Comments** – Threaded engagement
- **Votes** – Community prioritization
- **Organizations** – Stakeholder management
- **Notifications** – User alerts
- **Issues** – Environmental issue taxonomy

A Postman collection or API docs can be used for detailed testing.

---

## 🛡️ Security Model

EcoTrack is built with security‑first principles:

- JWT‑based authentication
- OTP verification for sensitive actions
- Encrypted password storage
- API rate limiting
- CORS & secure headers
- Input validation & sanitization
- SQL injection protection
- Immutable audit logs

---

## 📧 Notifications & Messaging

Automated emails are sent for:

- Account onboarding
- OTP verification
- Password resets
- Report lifecycle updates
- Organization assignments

Templates are modular and customizable.

---

## 🧪 Maintenance & Operations

- Database backups via `pg_dump`
- One‑command reseeding for fresh environments
- Structured logs for debugging and audits

---

## 🧩 Use‑Case Summary

### Citizens

- Report issues with evidence
- Track resolution progress
- Engage through votes and comments

### Organizations

- Receive and manage assigned reports
- Communicate updates
- Measure environmental impact

### Administrators

- Control users, roles, and permissions
- Monitor platform activity
- Ensure accountability and compliance

---

## 🔮 Roadmap

- 📱 Mobile applications (Android & iOS)
- 🔴 WebSocket‑based real‑time updates
- 📊 Advanced analytics dashboard
- 🤖 AI‑assisted issue categorization
- 🌐 Multi‑language support
- 🏛️ Government & NGO integrations
- 📶 Offline‑first reporting

---

## 🤝 Contributing

Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Commit with clear messages
4. Open a Pull Request

---

**Last Updated:** January 2026
