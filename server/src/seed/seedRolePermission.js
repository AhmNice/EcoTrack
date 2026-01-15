import { pool } from "../config/db.config.js";

export const seedRolePermissions = async () => {
  try {
    const { rows: roles } = await pool.query(
      `SELECT id, name FROM auth_schema.roles`
    );

    const { rows: permissions } = await pool.query(
      `SELECT id, name FROM auth_schema.permissions`
    );

    const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));
    const permissionMap = Object.fromEntries(
      permissions.map(p => [p.name, p.id])
    );

    const mappings = [
      // User permissions
      ["user", "create_report"],
      ["user", "comment_report"],
      ["user", "vote_report"],

      // Admin permissions
      ["admin", "update_report"],
      ["admin", "view_analytics"],

      // Super admin permissions (everything)
      ...permissions.map(p => ["super_admin", p.name]),
    ];

    for (const [roleName, permName] of mappings) {
      await pool.query(
        `
        INSERT INTO auth_schema.role_permissions (role_id, permission_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [roleMap[roleName], permissionMap[permName]]
      );
    }

    console.log("✅ Role permissions seeded");
  } catch (error) {
    console.error("❌ Error seeding role permissions:", error.message);
  }
};
