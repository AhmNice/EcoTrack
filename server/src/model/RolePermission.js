import { pool } from "../config/db.config.js";

export class RolePermission {

  /* ======================
     ASSIGN PERMISSION TO ROLE
  ====================== */
  static async assign(role_id, permission_id) {
    const query = `
      INSERT INTO auth_schema.role_permissions (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      role_id,
      permission_id,
    ]);

    return rows[0] || null;
  }


  static async remove(role_id, permission_id) {
    const query = `
      DELETE FROM auth_schema.role_permissions
      WHERE role_id = $1 AND permission_id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      role_id,
      permission_id,
    ]);

    return rows[0] || null;
  }


  static async getPermissionsByRole(role_id) {
    const query = `
      SELECT p.id, p.name, p.description
      FROM auth_schema.permissions p
      JOIN auth_schema.role_permissions rp
        ON rp.permission_id = p.id
      WHERE rp.role_id = $1
      ORDER BY p.name ASC
    `;

    const { rows } = await pool.query(query, [role_id]);
    return rows;
  }
}
