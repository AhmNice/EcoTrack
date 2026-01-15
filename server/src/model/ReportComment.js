import { pool } from "../config/db.config.js";

export class ReportComment {
  /* ============================
     CREATE COMMENT
  ============================ */
  static async create({ report_id, user_id, comment }) {
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO report_schema.report_comments
        (report_id, user_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [report_id, user_id, comment]
      );

      return rows[0];
    } catch (error) {
      console.error("❌ Error creating comment:", error.message);
      throw error;
    }
  }

  /* ============================
     GET COMMENTS BY REPORT
  ============================ */
  static async findByReport(report_id) {
    try {
      const { rows } = await pool.query(
        `
        SELECT
          c.id,
          c.comment,
          c.created_at,
          c.updated_at,
          u.full_name AS user,
          u.email
        FROM report_schema.report_comments c
        JOIN auth_schema.users u ON c.user_id = u.id
        WHERE c.report_id = $1
        ORDER BY c.created_at ASC
        `,
        [report_id]
      );

      return rows;
    } catch (error) {
      console.error("❌ Error fetching comments:", error.message);
      throw error;
    }
  }

  /* ============================
     UPDATE COMMENT
  ============================ */
  static async update({ comment_id, user_id, comment }) {
    try {
      const { rows } = await pool.query(
        `
        UPDATE report_schema.report_comments
        SET comment = $1,
            is_edited = TRUE,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *
        `,
        [comment, comment_id, user_id]
      );

      return rows[0];
    } catch (error) {
      console.error("❌ Error updating comment:", error.message);
      throw error;
    }
  }

  /* ============================
     DELETE COMMENT
  ============================ */
  static async delete(comment_id, user_id) {
    try {
      await pool.query(
        `
        DELETE FROM report_schema.report_comments
        WHERE id = $1 AND user_id = $2
        `,
        [comment_id, user_id]
      );

      return true;
    } catch (error) {
      console.error("❌ Error deleting comment:", error.message);
      throw error;
    }
  }
  static async findById(id) {
    try {
      const query = `SELECT * FROM report_schema.report_comments WHERE id = $1`;
      const values = [id];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}
