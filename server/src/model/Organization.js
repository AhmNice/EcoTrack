import { pool } from "../config/db.config.js";


export class Organization {
  static async create({ name, organization_type, email, phone_number, description, location, website }) {
    const query = `
      INSERT INTO stakeholder_schema.organizations
      (name, organization_type, email, phone_number, description, location, website)
      VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `;

    const values = [name, organization_type, email, phone_number, description, location, website];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }
  static async findAll() {
    try {
      const query = `
      WITH org_users AS (
        SELECT
          ou.organization_id,
          json_agg(
            json_build_object(
              'user_id', u.id,
              'full_name', u.full_name,
              'email', u.email,
              'role', r.name
            )
          ) FILTER (WHERE u.id IS NOT NULL) AS users
        FROM stakeholder_schema.organization_users ou
        LEFT JOIN auth_schema.users u ON u.id = ou.user_id
        LEFT JOIN auth_schema.roles r ON r.id = u.role_id
        GROUP BY ou.organization_id
      ),
      org_reports AS (
        SELECT
          ro.organization_id,
          json_agg(
            json_build_object(
              'report_id', r.id,
              'title', r.title,
              'description', r.description,
              'status', r.status,
              'created_at', r.created_at
            )
          ) FILTER (WHERE r.id IS NOT NULL) AS reports
        FROM report_schema.report_organizations ro
        LEFT JOIN report_schema.reports r ON ro.report_id = r.id
        GROUP BY ro.organization_id
      )
      SELECT
        o.*,
        COALESCE(ou.users, '[]'::json) AS users,
        COALESCE(rep.reports, '[]'::json) AS reports
      FROM stakeholder_schema.organizations o
      LEFT JOIN org_users ou ON o.id = ou.organization_id
      LEFT JOIN org_reports rep ON o.id = rep.organization_id
      ORDER BY o.name ASC;
    `;

      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw error
    }
  }
  static async findById(id) {
    try {
      const query = `
      WITH org_users AS (
        SELECT
          ou.organization_id,
          json_agg(
            json_build_object(
              'user_id', u.id,
              'full_name', u.full_name,
              'email', u.email,
              'role', r.name
            )
          ) FILTER (WHERE u.id IS NOT NULL) AS users
        FROM stakeholder_schema.organization_users ou
        LEFT JOIN auth_schema.users u ON u.id = ou.user_id
        LEFT JOIN auth_schema.roles r ON r.id = u.role_id
        WHERE ou.organization_id = $1
        GROUP BY ou.organization_id
      ),
      org_reports AS (
        SELECT
          ro.organization_id,
          json_agg(
            json_build_object(
              'report_id', r.id,
              'title', r.title,
              'description', r.description,
              'status', r.status,
              'created_at', r.created_at
            )
          ) FILTER (WHERE r.id IS NOT NULL) AS reports
        FROM report_schema.report_organizations ro
        LEFT JOIN report_schema.reports r ON ro.report_id = r.id
        WHERE ro.organization_id = $1
        GROUP BY ro.organization_id
      )
      SELECT
        o.*,
        COALESCE(ou.users, '[]'::json) AS users,
        COALESCE(rep.reports, '[]'::json) AS reports
      FROM stakeholder_schema.organizations o
      LEFT JOIN org_users ou ON o.id = ou.organization_id
      LEFT JOIN org_reports rep ON o.id = rep.organization_id
      WHERE o.id = $1;
    `;

      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error
    }
  }
  static async update(id, { name, organization_type, email, phone_number, description }) {
    try {
      const query = `
      UPDATE stakeholder_schema.organizations
      SET
        name = COALESCE($2, name),
        organization_type = COALESCE($3, organization_type),
        email = COALESCE($4, email),
        phone_number = COALESCE($5, phone_number),
        description = COALESCE($6, description)
      WHERE id = $1
      RETURNING *;
    `;

      const values = [id, name, organization_type, email, phone_number, description];
      const { rows } = await pool.query(query, values);

      return rows[0] || null;
    } catch (error) {
      throw error
    }
  }
  static async delete(id) {
    try {
      const query = `
      DELETE FROM stakeholder_schema.organizations
      WHERE id = $1;
    `;

      await pool.query(query, [id]);
      return true;
    } catch (error) {
      throw error
    }
  }
  static async addUser({ user_id, organization_id }) {
    try {
      const query = `
      INSERT INTO stakeholder_schema.organization_users
      (user_id, organization_id)
      VALUES ($1, $2)
      RETURNING *;
    `;

      const values = [user_id, organization_id];
      const { rows } = await pool.query(query, values);

      return rows[0];
    } catch (error) {
      throw error
    }
  }
  static async removeUser({ user_id, organization_id }) {
    try {
      const query = `
      DELETE FROM stakeholder_schema.organization_users
      WHERE user_id = $1 AND organization_id = $2;
    `;

      await pool.query(query, [user_id, organization_id]);
      return true;
    } catch (error) {
      throw error
    }
  }
  static async getUsers(organization_id) {
    try {
      const query = `
      SELECT
        u.id,
        u.full_name,
        u.email,
        r.name AS role
      FROM stakeholder_schema.organization_users ou
      JOIN auth_schema.users u ON u.id = ou.user_id
      LEFT JOIN auth_schema.roles r ON r.id = u.role_id
      WHERE ou.organization_id = $1;
    `;

      const { rows } = await pool.query(query, [organization_id]);
      return rows;
    } catch (error) {
      throw error
    }
  }
  static async hasUser(user_id) {
    try {
      const query = `
      SELECT COUNT(*) AS count
      FROM stakeholder_schema.organization_users
      WHERE user_id = $1;
    `;

      const { rows } = await pool.query(query, [user_id]);
      return rows[0].count > 0;
    } catch (error) {
      throw error
    }
  }
  static async findByName(name) {
    try {
      const query = `
      SELECT *
      FROM stakeholder_schema.organizations
      WHERE name = $1;
    `;

      const { rows } = await pool.query(query, [name]);
      return rows[0] || null;
    } catch (error) {
      throw error
    }
  }
}
