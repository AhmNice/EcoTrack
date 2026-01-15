import { pool } from "../config/db.config.js";

export class Notification {
  constructor({
    report_id,
    recipient_user_id,
    notification_type = "info",
    message,
    is_read = false,
  }) {
    this.report_id = report_id;
    this.recipient_user_id = recipient_user_id;
    this.notification_type = notification_type; // "info", "warning", "urgent"
    this.message = message;
    this.is_read = is_read;
  }

  /* ======================
     CREATE NOTIFICATION
  ====================== */
  async save() {
    const query = `
      INSERT INTO notification_schema.notifications
      (report_id, recipient_user_id, notification_type, message, is_read)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [
        this.report_id,
        this.recipient_user_id,
        this.notification_type,
        this.message,
        this.is_read,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error creating notification:", error);
      throw error;
    }
  }

  /* ======================
     GET NOTIFICATIONS FOR USER
  ====================== */
  static async findByUserId(user_id, onlyUnread = false) {
    let query = `
      SELECT n.*, r.description AS report_description, r.status AS report_status
      FROM notification_schema.notifications n
      LEFT JOIN report_schema.reports r
      ON n.report_id = r.id
      WHERE n.recipient_user_id = $1
    `;
    const values = [user_id];

    if (onlyUnread) {
      query += ` AND n.is_read = false`;
    }

    query += ` ORDER BY n.sent_at DESC`;

    try {
      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      throw error;
    }
  }

  /* ======================
     MARK NOTIFICATION AS READ
  ====================== */
  static async markAsRead(id) {
    const query = `
      UPDATE notification_schema.notifications
      SET is_read = true, sent_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
      throw error;
    }
  }

  /* ======================
     DELETE NOTIFICATION
  ====================== */
  static async delete(id) {
    const query = `
      DELETE FROM notification_schema.notifications
      WHERE id = $1
      RETURNING *
    `;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
      throw error;
    }
  }
}
