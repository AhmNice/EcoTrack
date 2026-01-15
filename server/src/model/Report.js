import { pool } from "../config/db.config.js";

export class Report {
  constructor({
    user_id,
    title,
    issue_type_id,
    description,
    latitude,
    longitude,
    location_address,
    severity_level = "low",
    status = "pending",
  }) {
    this.user_id = user_id;
    this.title = title
    this.issue_type_id = issue_type_id;
    this.description = description;
    this.latitude = latitude;
    this.longitude = longitude;
    this.location_address = location_address;
    this.severity_level = severity_level;
    this.status = status;
  }
  async save() {
    const query = `
  INSERT INTO report_schema.reports (
    user_id,
    title,
    issue_type_id,
    description,
    latitude,
    longitude,
    location_address,
    severity_level,
    status
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  )
  RETURNING *
`;

    try {
      const { rows } = await pool.query(query, [
        this.user_id,
        this.title,
        this.issue_type_id,
        this.description,
        this.latitude,
        this.longitude,
        this.location_address,
        this.severity_level,
        this.status,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error creating report:", error);
      throw error;
    }
  }
  static async findById(id) {
    try {
      const query = `SELECT
  r.*,

  json_build_object(
    'user_id', u.id,
    'full_name', u.full_name,
    'email', u.email,
    'phone_number', u.phone_number,
    'created_at', u.created_at
  ) AS reporter,

  it.name AS issue_type,

  -- images
  COALESCE(img.images, '{}') AS images,

  -- votes
  COALESCE(vs.upvotes, 0) AS upvotes,
  COALESCE(vs.downvotes, 0) AS downvotes,
  COALESCE(vs.total_votes, 0) AS total_votes,

  -- voters with vote_type
  COALESCE(vt.voters, '[]') AS voters,

  -- assigned organization
  org.name AS assigned_to

FROM report_schema.reports r

JOIN auth_schema.users u
  ON r.user_id = u.id

JOIN report_schema.issue_types it
  ON r.issue_type_id = it.id

LEFT JOIN LATERAL (
  SELECT array_agg(ri.image_url) AS images
  FROM report_schema.report_images ri
  WHERE ri.report_id = r.id
) img ON true

LEFT JOIN LATERAL (
  SELECT json_agg(
    jsonb_build_object(
      'user_id', rv.user_id,
      'vote_type', rv.vote_type
    )
  ) AS voters
  FROM report_schema.report_votes rv
  WHERE rv.report_id = r.id
) vt ON true

LEFT JOIN report_schema.report_vote_summary vs
  ON vs.report_id = r.id

LEFT JOIN report_schema.report_organizations ro
  ON ro.report_id = r.id

LEFT JOIN stakeholder_schema.organizations org
  ON org.id = ro.organization_id

WHERE r.id = $1;
`
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async findAll(filters = {}) {
    try {
      let query = `
      SELECT
        r.*,

        json_build_object(
          'full_name', u.full_name,
          'email', u.email,
          'phone_number', u.phone_number
        ) AS reporter,

        it.name AS issue_type,

        -- images
        COALESCE(img.images, '{}') AS images,

        -- votes
        COALESCE(vs.upvotes, 0) AS upvotes,
        COALESCE(vs.downvotes, 0) AS downvotes,
        COALESCE(vs.total_votes, 0) AS total_votes,

        -- voters
        COALESCE(vt.voters, '[]') AS voters,

        -- assigned organizations
        COALESCE(orgs.assigned_to, '[]') AS assigned_to

      FROM report_schema.reports r

      JOIN auth_schema.users u
        ON r.user_id = u.id

      JOIN report_schema.issue_types it
        ON r.issue_type_id = it.id

      -- Images
      LEFT JOIN LATERAL (
        SELECT array_agg(ri.image_url) AS images
        FROM report_schema.report_images ri
        WHERE ri.report_id = r.id
      ) img ON true

      -- Voters
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'user_id', rv.user_id,
            'vote_type', rv.vote_type
          )
        ) AS voters
        FROM report_schema.report_votes rv
        WHERE rv.report_id = r.id
      ) vt ON true

      -- Assigned organizations
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', org.id,
            'name', org.name
          )
        ) AS assigned_to
        FROM report_schema.report_organizations ro
        JOIN stakeholder_schema.organizations org
          ON org.id = ro.organization_id
        WHERE ro.report_id = r.id
      ) orgs ON true

      LEFT JOIN report_schema.report_vote_summary vs
        ON vs.report_id = r.id

      WHERE 1 = 1
    `;

      const values = [];
      let idx = 1;

      if (filters.status) {
        query += ` AND r.status = $${idx++}`;
        values.push(filters.status);
      }

      if (filters.user_id) {
        query += ` AND r.user_id = $${idx++}`;
        values.push(filters.user_id);
      }

      if (filters.issue_type_id) {
        query += ` AND r.issue_type_id = $${idx++}`;
        values.push(filters.issue_type_id);
      }

      query += ` ORDER BY r.created_at DESC`;

      const { rows } = await pool.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error fetching reports:", error);
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
      UPDATE report_schema.reports
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
      const query = `
      DELETE FROM report_schema.reports
      WHERE id = $1
      RETURNING *
    `;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async findByUserId(user_id) {
    try {
      const query = `
      SELECT
        r.*,
        json_build_object(
          'full_name', u.full_name,
          'email', u.email,
          'phone_number', u.phone_number
        ) AS reporter,
        it.name AS issue_type,
        COALESCE(img.images, '{}') AS images,
        COALESCE(vs.upvotes, 0) AS upvotes,
        COALESCE(vs.downvotes, 0) AS downvotes,
        COALESCE(vs.total_votes, 0) AS total_votes,
        COALESCE(vt.voters, '[]') AS voters,
        COALESCE(orgs.assigned_to, '[]') AS assigned_to
      FROM report_schema.reports r
      JOIN auth_schema.users u ON r.user_id = u.id
      JOIN report_schema.issue_types it ON r.issue_type_id = it.id

      -- images
      LEFT JOIN LATERAL (
        SELECT array_agg(ri.image_url) AS images
        FROM report_schema.report_images ri
        WHERE ri.report_id = r.id
      ) img ON true

      -- voters
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'user_id', rv.user_id,
            'vote_type', rv.vote_type
          )
        ) AS voters
        FROM report_schema.report_votes rv
        WHERE rv.report_id = r.id
      ) vt ON true

      -- Assigned organizations
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', org.id,
            'name', org.name
          )
        ) AS assigned_to
        FROM report_schema.report_organizations ro
        JOIN stakeholder_schema.organizations org
          ON org.id = ro.organization_id
        WHERE ro.report_id = r.id
      ) orgs ON true

      LEFT JOIN report_schema.report_vote_summary vs ON vs.report_id = r.id

      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `;

      const { rows } = await pool.query(query, [user_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  static async assign({ report_id, org_id }) {
    try {
      const query = `INSERT INTO report_schema.report_organizations(report_id, organization_id) VALUES($1,$2) RETURNING *`

      const values = [report_id, org_id]
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  static async countByUserId(user_id) {
    try {
      const query = `
        SELECT COUNT(*) as total_reports
        FROM report_schema.reports
        WHERE user_id = $1
      `;

      const { rows } = await pool.query(query, [user_id]);
      return rows[0]?.total_reports || 0;
    } catch (error) {
      console.error("❌ Error counting reports by user:", error);
      throw error;
    }
  }
  static async countByStatus(status, user_id) {
    try {
      const query = `
        SELECT COUNT(*) as total_reports
        FROM report_schema.reports
        WHERE status = $1 AND user_id = $2
      `;

      const { rows } = await pool.query(query, [status, user_id]);
      return rows[0]?.total_reports || 0;
    } catch (error) {
      console.error("❌ Error counting reports by status:", error);
      throw error;
    }
  }

  static async countTotal() {
    try {
      const query = `
        SELECT COUNT(*) as total_reports
        FROM report_schema.reports
      `;

      const { rows } = await pool.query(query);
      return rows[0]?.total_reports || 0;
    } catch (error) {
      console.error("❌ Error counting total reports:", error);
      throw error;
    }
  }
  static async countBySeverity(severity_level) {
    try {
      const query = `
        SELECT COUNT(*) as total_reports
        FROM report_schema.reports
        WHERE severity_level = $1
      `;

      const { rows } = await pool.query(query, [severity_level]);
      return rows[0]?.total_reports || 0;
    } catch (error) {
      console.error("❌ Error counting reports by severity:", error);
      throw error;
    }
  }
  static async getStatistics() {
    try {
      const query = `
        SELECT
          COUNT(*) as total_reports,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
          SUM(CASE WHEN severity_level = 'critical' THEN 1 ELSE 0 END) as critical,
          SUM(CASE WHEN severity_level = 'high' THEN 1 ELSE 0 END) as high,
          SUM(CASE WHEN severity_level = 'medium' THEN 1 ELSE 0 END) as medium,
          SUM(CASE WHEN severity_level = 'low' THEN 1 ELSE 0 END) as low
        FROM report_schema.reports
      `;

      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      console.error("❌ Error getting report statistics:", error);
      throw error;
    }
  }

}
