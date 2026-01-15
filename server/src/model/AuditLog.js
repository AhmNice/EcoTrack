import { pool } from "../config/db.config.js";

export class AuditLog {
  constructor({ user_id, action, affected_table }) {
    this.user_id = user_id;
    this.action = action;
    this.affected_table = affected_table;
  }

  /* ======================
     CREATE AUDIT LOG ENTRY
  ====================== */
  async save() {
    const query = `
      INSERT INTO system_schema.audit_logs
      (user_id, action, affected_table)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [
        this.user_id,
        this.action,
        this.affected_table,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error creating audit log:", error);
      throw error;
    }
  }

  /* ======================
     GET LOGS BY USER
  ====================== */
  static async findByUserId(user_id, limit = 50) {
    const query = `
      SELECT *
      FROM system_schema.audit_logs
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    try {
      const { rows } = await pool.query(query, [user_id, limit]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching audit logs:", error);
      throw error;
    }
  }

  /* ======================
     GET ALL LOGS
  ====================== */
  static async findAll(limit = 100) {
    const query = `
      SELECT *
      FROM system_schema.audit_logs
      ORDER BY timestamp DESC
      LIMIT $1
    `;
    try {
      const { rows } = await pool.query(query, [limit]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching all audit logs:", error);
      throw error;
    }
  }

  /* ======================
     DELETE LOG ENTRY
  ====================== */
  static async delete(id) {
    const query = `
      DELETE FROM system_schema.audit_logs
      WHERE id = $1
      RETURNING *
    `;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error deleting audit log:", error);
      throw error;
    }
  }

  /* ======================
     GET LOGS BY TABLE
  ====================== */
  static async findByTable(affected_table, limit = 50) {
    const query = `
      SELECT *
      FROM system_schema.audit_logs
      WHERE affected_table = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    try {
      const { rows } = await pool.query(query, [affected_table, limit]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching audit logs by table:", error);
      throw error;
    }
  }

  /* ======================
     GET LOGS BY DATE RANGE
  ====================== */
  static async findByDateRange(start_date, end_date, limit = 100) {
    const query = `
      SELECT *
      FROM system_schema.audit_logs
      WHERE timestamp BETWEEN $1 AND $2
      ORDER BY timestamp DESC
      LIMIT $3
    `;
    try {
      const { rows } = await pool.query(query, [start_date, end_date, limit]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching audit logs by date range:", error);
      throw error;
    }
  }

  /* ======================
     GET LOG BY ID
  ====================== */
  static async findById(id) {
    const query = `
      SELECT *
      FROM system_schema.audit_logs
      WHERE id = $1
    `;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error fetching audit log:", error);
      throw error;
    }
  }
}
