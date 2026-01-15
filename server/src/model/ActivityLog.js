import { pool } from "../config/db.config.js";

export class ActivityLog {
  constructor({ user_id, action, ip_address }) {
    this.user_id = user_id;
    this.action = action;
    this.ip_address = ip_address;
  }

  /* ======================
     CREATE LOG ENTRY
  ====================== */
  async save() {
    const query = `
      INSERT INTO analytics_schema.user_activity_logs
      (user_id, action, ip_address)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [
        this.user_id,
        this.action,
        this.ip_address,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error saving activity log:", error);
      throw error;
    }
  }

  /* ======================
     GET LOGS BY USER
  ====================== */
  static async findByUserId(user_id, limit = 50) {
    const query = `
      SELECT *
      FROM analytics_schema.user_activity_logs
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;

    try {
      const { rows } = await pool.query(query, [user_id, limit]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching activity logs:", error);
      throw error;
    }
  }

  /* ======================
     GET ALL LOGS
  ====================== */
  static async findAll(limit = 100) {
    const query = `
      SELECT *
      FROM analytics_schema.user_activity_logs
      ORDER BY timestamp DESC
      LIMIT $1
    `;

    try {
      const { rows } = await pool.query(query, [limit]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching all activity logs:", error);
      throw error;
    }
  }

  /* ======================
     DELETE LOG ENTRY
  ====================== */
  static async delete(id) {
    const query = `
      DELETE FROM analytics_schema.user_activity_logs
      WHERE id = $1
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error deleting activity log:", error);
      throw error;
    }
  }
}
