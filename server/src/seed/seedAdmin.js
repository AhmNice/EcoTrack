import { pool } from "../config/db.config.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    let superAdminRoleId, adminRoleId;

    // ================================
    // 1️⃣ Ensure super_admin role exists
    // ================================
    const superRoleRes = await pool.query(
      `SELECT id FROM auth_schema.roles WHERE name = $1`,
      ["super_admin"]
    );

    if (superRoleRes.rows.length) {
      superAdminRoleId = superRoleRes.rows[0].id;
      console.log("ℹ️ super_admin role exists");
    } else {
      const { rows } = await pool.query(
        `INSERT INTO auth_schema.roles (name, description) VALUES ($1, $2) RETURNING id`,
        ["super_admin", "Default system super admin role"]
      );
      superAdminRoleId = rows[0].id;
      console.log("✅ super_admin role created");
    }

    // ================================
    // 2️⃣ Ensure super_admin user exists
    // ================================
    const superUserRes = await pool.query(
      `SELECT id FROM auth_schema.users WHERE role_id = $1 AND is_super_admin = true LIMIT 1`,
      [superAdminRoleId]
    );

    if (!superUserRes.rows.length) {
      const passwordHash = await bcrypt.hash("SuperAdmin@123", 10);
      await pool.query(
        `
        INSERT INTO auth_schema.users
        (full_name, email, password_hash, role_id, is_super_admin, is_active)
        VALUES ($1, $2, $3, $4, true, true)
        `,
        ["Super Administrator", "superadmin@ecotrack.com", passwordHash, superAdminRoleId]
      );
      console.log("✅ Super admin user created successfully");
    } else {
      console.log("ℹ️ Super admin user already exists");
    }

    // ================================
    // 3️⃣ Ensure admin role exists
    // ================================
    const adminRoleRes = await pool.query(
      `SELECT id FROM auth_schema.roles WHERE name = $1`,
      ["admin"]
    );

    if (adminRoleRes.rows.length) {
      adminRoleId = adminRoleRes.rows[0].id;
      console.log("ℹ️ admin role exists");
    } else {
      const { rows } = await pool.query(
        `INSERT INTO auth_schema.roles (name, description) VALUES ($1, $2) RETURNING id`,
        ["admin", "Default system admin role"]
      );
      adminRoleId = rows[0].id;
      console.log("✅ admin role created");
    }

    // ================================
    // 4️⃣ Ensure at least one admin user exists
    // ================================
    const adminUserRes = await pool.query(
      `SELECT id FROM auth_schema.users WHERE role_id = $1 LIMIT 1`,
      [adminRoleId]
    );

    if (!adminUserRes.rows.length) {
      const passwordHash = await bcrypt.hash("Admin@123", 10);
      await pool.query(
        `
        INSERT INTO auth_schema.users
        (full_name, email, password_hash, role_id, is_super_admin, is_active)
        VALUES ($1, $2, $3, $4, false, true)
        `,
        ["Default Admin", "admin@ecotrack.com", passwordHash, adminRoleId]
      );
      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

  } catch (error) {
    console.error("❌ Error seeding admin roles/users:", error.message);
  }
};
