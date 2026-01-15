import { pool } from "../config/db.config.js";
import bcrypt from "bcrypt";
export const seedAdminAndRoles = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* -------- ROLES -------- */
    const roles = [
      ["admin", "System administrator"],
      ["authority", "Environmental authority"],
      ["organization", "Partner organization"],
      ["citizen", "Regular citizen"],
    ];

    for (const [name, desc] of roles) {
      await client.query(
        `INSERT INTO auth_schema.roles (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [name, desc]
      );
    }

    /* -------- PERMISSIONS -------- */
    const permissions = [
      ["manage_users", "Create, update, deactivate users"],
      ["assign_roles", "Assign roles to users"],
      ["view_reports", "View all reports"],
      ["update_reports", "Update report status"],
      ["delete_reports", "Delete false reports"],
      ["view_analytics", "View dashboard analytics"],
      ["manage_locations", "Manage states and LGAs"],
      ["system_settings", "System configuration"],
    ];

    for (const [name, desc] of permissions) {
      await client.query(
        `INSERT INTO auth_schema.permissions (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [name, desc]
      );
    }

    /* -------- ADMIN PERMISSION MATRIX -------- */
    await client.query(`
      INSERT INTO auth_schema.role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM auth_schema.roles r
      CROSS JOIN auth_schema.permissions p
      WHERE r.name = 'admin'
      ON CONFLICT DO NOTHING
    `);

    /* -------- DEFAULT ADMIN USER -------- */
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    await client.query(
      `
      INSERT INTO auth_schema.users
      (full_name, email, password_hash, role_id, is_super_admin)
      VALUES (
        'System Administrator',
        'admin@ecotrack.ng',
        $1,
        (SELECT id FROM auth_schema.roles WHERE name='admin'),
        TRUE
      )
      ON CONFLICT (email) DO NOTHING
    `,
      [passwordHash]
    );

    await client.query("COMMIT");
    console.log("✅ Admin, roles & permissions seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", error);
  } finally {
    client.release();
  }
};

