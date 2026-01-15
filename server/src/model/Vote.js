import { pool } from "../config/db.config.js";

export class ReportVote {
  /* ============================
     ADD OR UPDATE VOTE
     vote_type: 1 = upvote, -1 = downvote
  ============================ */
  static async vote({ report_id, user_id, vote_type }) {
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO report_schema.report_votes
        (report_id, user_id, vote_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (report_id, user_id)
        DO UPDATE SET vote_type = EXCLUDED.vote_type
        RETURNING *
        `,
        [report_id, user_id, vote_type]
      );

      return rows[0];
    } catch (error) {
      console.error("❌ Error voting:", error.message);
      throw error;
    }
  }

  /* ============================
     REMOVE VOTE
  ============================ */
  static async removeVote({ report_id, user_id }) {
    try {
      await pool.query(
        `
        DELETE FROM report_schema.report_votes
        WHERE report_id = $1 AND user_id = $2
        `,
        [report_id, user_id]
      );

      return true;
    } catch (error) {
      console.error("❌ Error removing vote:", error.message);
      throw error;
    }
  }

  /* ============================
     GET VOTE SUMMARY
  ============================ */
  static async getSummary(report_id) {
    try {
      const { rows } = await pool.query(
        `
        SELECT *
        FROM report_schema.report_vote_summary
        WHERE report_id = $1
        `,
        [report_id]
      );

      return rows[0] || {
        upvotes: 0,
        downvotes: 0,
        total_votes: 0,
      };
    } catch (error) {
      console.error("❌ Error fetching vote summary:", error.message);
      throw error;
    }
  }
}
