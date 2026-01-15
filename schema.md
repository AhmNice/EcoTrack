# EcoTrack 🗄️ Database Schema Documentation

## Overview

EcoTrack uses **PostgreSQL** with a **multi-schema architecture** to ensure strong separation of concerns, data integrity, and long-term scalability. Each schema encapsulates a specific domain of the system, making the database easier to reason about, secure, and extend.

This document serves as the **authoritative reference** for EcoTrack’s data model, relationships, constraints, and performance considerations.

---

## 🧩 Schema Design Philosophy

* **Domain-driven schemas** (auth, reports, locations, stakeholders, etc.)
* **UUID primary keys** for security and distributed scalability
* **Strict referential integrity** using foreign keys and cascades
* **Auditability** through activity and audit logs
* **Performance-aware design** with indexes and summary views

---

## 📦 Database Schemas Overview

| Schema                | Responsibility                     |
| --------------------- | ---------------------------------- |
| `auth_schema`         | Authentication, roles, permissions |
| `report_schema`       | Environmental reports & engagement |
| `location_schema`     | Nigerian states & LGAs             |
| `stakeholder_schema`  | Organizations & memberships        |
| `notification_schema` | User notifications                 |
| `analytics_schema`    | Activity tracking                  |
| `system_schema`       | Audit logging                      |

---

## 🔐 1. Authentication Schema (`auth_schema`)

Handles **identity, access control, and authorization**.

### `roles`

Defines system-wide roles.

* **Primary Key:** `id (UUID)`
* **Unique:** `name`

**Typical Roles**

* `super_admin` – Full system access
* `admin` – Administrative control
* `organization_staff` – Handle assigned reports
* `reporter` – Submit and manage reports
* `citizen` – View, vote, and comment

---

### `users`

Stores user identity and authentication metadata.

**Highlights**

* One role per user (via `role_id`)
* Supports OTP-based verification
* Soft account control via `is_active`

**Indexes**

* Unique index on `email`

**Relationships**

* `users.role_id → roles.id`

---

### `permissions`

Defines atomic system permissions.

**Examples**

* `create_report`
* `edit_report`
* `manage_users`
* `view_analytics`

---

### `role_permissions`

Many-to-many mapping between roles and permissions.

**Design Notes**

* Composite primary key (`role_id`, `permission_id`)
* Cascades ensure orphaned permissions never exist

---

## 🌱 2. Report Schema (`report_schema`)

Central schema for **environmental reporting and community engagement**.

### `issue_types`

Standardized classification of environmental problems.

**Examples**

* Pollution
* Waste Management
* Deforestation
* Climate Change

---

### `reports`

The core entity representing a reported environmental issue.

**Key Attributes**

* Geo-coordinates + human-readable address
* Severity and lifecycle status
* Assignment flag for organizations

**Status Lifecycle**

```
pending → in_progress → resolved → closed
```

**Severity Scale**

```
low → medium → high → critical
```

**Relationships**

* `reports.user_id → auth_schema.users.id`
* `reports.issue_type_id → issue_types.id`

---

### `report_images`

Stores photo evidence linked to reports.

* One-to-many: Report → Images
* Cascades on report deletion

---

### `report_comments`

Threaded discussion and stakeholder feedback.

**Behavior**

* Editable comments tracked via `is_edited`
* Cascades preserve referential cleanliness

---

### `report_votes`

Community prioritization through voting.

**Rules**

* One vote per user per report
* `1 = upvote`, `-1 = downvote`

---

### `report_organizations`

Assignment of reports to responsible organizations.

**Design Choice**

* Supports multiple organizations per report
* Unique constraint prevents duplicate assignments

---

### `report_vote_summary` (Materialized View)

Pre-aggregated voting statistics for fast reads.

**Purpose**

* Avoid expensive runtime aggregations
* Improve feed and dashboard performance

---

## 🗺️ 3. Location Schema (`location_schema`)

Normalized representation of **Nigeria’s administrative divisions**.

### `states`

* Seeded with 36 states + FCT
* Case-consistent, unique naming

---

### `local_governments`

* LGAs scoped to states
* Composite uniqueness (`state_id`, `lga_name`)

---

### `report_locations`

Decouples geographic data from reports.

**Benefits**

* Clean separation of concerns
* Enables future geospatial extensions

---

## 🏢 4. Stakeholder Schema (`stakeholder_schema`)

Manages organizations involved in environmental resolution.

### `organizations`

Represents NGOs, government agencies, and private partners.

**Constraints**

* Case-insensitive unique organization names

---

### `organization_users`

Maps users to organizations.

**Use Cases**

* Organization staff management
* Multi-organization membership support

---

## 🔔 5. Notification Schema (`notification_schema`)

Delivers system-generated alerts to users.

**Notification Categories**

* `info`, `update`, `comment`, `vote`, `warning`, `alert`

---

## 📈 6. Analytics Schema (`analytics_schema`)

Tracks **user behavior and system interactions**.

### `user_activity_logs`

**Captured Events**

* Authentication actions
* Report lifecycle changes
* Engagement actions (comments, votes)

---

## 🛡️ 7. System Schema (`system_schema`)

Provides a **tamper-resistant audit trail**.

### `audit_logs`

**Purpose**

* Compliance and accountability
* Forensic analysis
* Change traceability

---

## 🔗 Entity Relationships (High-Level)

```
Users → Roles → Permissions
  ↓
Reports → Issue Types
  ├─ Images
  ├─ Comments ← Users
  ├─ Votes ← Users
  └─ Organizations

Reports → Locations → States → LGAs

Notifications → Users & Reports
Analytics → Users
Audit Logs → Users
```

---

## ⚙️ Data Integrity & Constraints

### Primary Keys

* UUIDs across all tables
* Collision-resistant and horizontally scalable

### Referential Integrity

* Strategic use of `ON DELETE CASCADE`
* Prevents orphaned records

### Validation Constraints

* Enumerated severity levels
* Strict report status lifecycle
* Enforced voting rules

---

## 🚀 Performance & Scalability

### Indexing Strategy

* Unique indexes on identity fields
* Composite indexes for geographic lookups
* Indexed foreign keys

### Optimization Techniques

* Materialized views for aggregates
* Pagination-first querying
* Prepared statements only

### Scale Readiness

* Millions of reports supported
* Partition-ready by date or state
* Geospatial indexing planned

---

## 🔄 Backups & Migrations

```bash
pg_dump -U postgres ecotrack > backup.sql
psql -U postgres ecotrack < backup.sql
```

Seeding and initialization are automated via project scripts.

---

## 🔮 Planned Enhancements

* Approval & moderation workflows
* Temporal history tables
* Full-text search (GIN indexes)
* PostGIS spatial queries
* Archival policies
* Analytics materialized dashboards

---

**Database Engine:** PostgreSQL 12+
**Schema Version:** 1.0
**Last Updated:** January 2026
