import { pool } from "../config/db.config.js";

export class Permission {
  constructor({ name, description }) {
    this.name = name;
    this.description = description;
  }

  async save() {
    try {
      const query = `
      INSERT INTO auth_schema.permissions (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
      const { rows } = await pool.query(query, [this.name, this.description]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = `SELECT * FROM auth_schema.permissions WHERE id = $1`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const query = `SELECT * FROM auth_schema.permissions WHERE name = $1`;
      const { rows } = await pool.query(query, [name]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const query = `SELECT * FROM auth_schema.permissions ORDER BY name ASC`;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const fields = [];
      const values = [];
      let idx = 1;

      for (const key in data) {
        fields.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }

      if (!fields.length) return null;

      const query = `
      UPDATE auth_schema.permissions
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING *
    `;
      const { rows } = await pool.query(query, [...values, id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM auth_schema.permissions WHERE id = $1 RETURNING *`;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async assignToRole(permission_id, role_id) {
    try {
      const query = `
      INSERT INTO auth_schema.role_permissions (role_id, permission_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
      const { rows } = await pool.query(query, [role_id, permission_id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}
