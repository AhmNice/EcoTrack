import { pool } from "../config/db.config.js";

export class Issue {
  /* =========================
     CREATE ISSUE TYPE
  ========================= */
  static async create({ name, description }) {
    const { rows } = await pool.query(
      `
      INSERT INTO report_schema.issue_types (name, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, description]
    );

    return rows[0];
  }

  /* =========================
     GET ALL ISSUE TYPES
  ========================= */
  static async findAll() {
    const { rows } = await pool.query(
      `SELECT * FROM report_schema.issue_types ORDER BY name ASC`
    );
    return rows;
  }

  /* =========================
     GET ISSUE BY ID
  ========================= */
  static async findById(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM report_schema.issue_types
      WHERE id = $1
      `,
      [id]
    );

    return rows[0] || null;
  }

  /* =========================
     UPDATE ISSUE
  ========================= */
  static async update(id, { name, description }) {
    const { rows } = await pool.query(
      `
      UPDATE report_schema.issue_types
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description)
      WHERE id = $3
      RETURNING *
      `,
      [name, description, id]
    );

    return rows[0] || null;
  }

  /* =========================
     DELETE ISSUE
  ========================= */
  static async delete(id) {
    const { rowCount } = await pool.query(
      `
      DELETE FROM report_schema.issue_types
      WHERE id = $1
      `,
      [id]
    );

    return rowCount > 0;
  }
}
