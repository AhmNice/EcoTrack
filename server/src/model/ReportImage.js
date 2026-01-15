import { pool } from "../config/db.config.js";

export class ReportImage {
  constructor({ report_id, image_url }) {
    this.report_id = report_id;
    this.image_url = image_url;
  }

  async save() {
    const query = `
      INSERT INTO report_schema.report_images
      (report_id, image_url)
      VALUES ($1, $2)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [
        this.report_id,
        this.image_url,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error saving report image:", error);
      throw error;
    }
  }

  static async findByReportId(report_id) {
    const query = `
      SELECT *
      FROM report_schema.report_images
      WHERE report_id = $1
      ORDER BY uploaded_at ASC
    `;

    try {
      const { rows } = await pool.query(query, [report_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error fetching report images:", error);
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM report_schema.report_images
      WHERE id = $1
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error deleting report image:", error);
      throw error;
    }
  }

  static async deleteByReportId(report_id) {
    const query = `
      DELETE FROM report_schema.report_images
      WHERE report_id = $1
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [report_id]);
      return rows;
    } catch (error) {
      console.error("❌ Error deleting report images:", error);
      throw error;
    }
  }
}
