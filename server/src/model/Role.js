import { pool } from "../config/db.config.js";

export class Role {
  constructor({ name, description }) {
    this.name = name;
    this.description = description;
  }

  /* ======================
     CREATE ROLE
  ====================== */
  async save() {
    const query = `
      INSERT INTO auth_schema.roles (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [this.name, this.description]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error creating role:", error);
      throw error;
    }
  }

  /* ======================
     FIND BY NAME
  ====================== */
  static async findByName(name) {
    const query = `
      SELECT *
      FROM auth_schema.roles
      WHERE name = $1
    `;
    const { rows } = await pool.query(query, [name]);
    return rows[0] || null;
  }
  static async findById(id) {
    const query = `
      SELECT *
      FROM auth_schema.roles
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  /* ======================
     FIND ALL ROLES
  ====================== */
  static async findAll() {
    const query = `
      SELECT *
      FROM auth_schema.roles
      ORDER BY name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  /* ======================
     DELETE ROLE
  ====================== */
  static async delete(id) {
    const query = `
      DELETE FROM auth_schema.roles
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }
}
