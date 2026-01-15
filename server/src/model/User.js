import { pool } from "../config/db.config.js";
import crypto from "crypto";
import { Role } from "./Role.js";
export class User {
  constructor({
    full_name,
    email,
    password_hash,
    phone_number = null,
    role_id,
    is_active = true,
    is_super_admin = false,
  }) {
    this.full_name = full_name;
    this.email = email;
    this.password_hash = password_hash;
    this.phone_number = phone_number;
    this.role_id = role_id;
    this.is_active = is_active;
    this.is_super_admin = is_super_admin;
  }

  async save() {
    const query = `
      INSERT INTO auth_schema.users
      (full_name, email, password_hash, phone_number, role_id, is_active, is_super_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [
        this.full_name,
        this.email,
        this.password_hash,
        this.phone_number,
        this.role_id,
        this.is_active,
        this.is_super_admin,
      ]);

      return rows[0] || null;
    } catch (error) {
      console.error("❌ Error creating user:", error);
      throw error;
    }
  }
  static async findById(id) {
    try {
      const query = `
      SELECT u.*,
      r.name As role_name
      FROM auth_schema.users u
      JOIN auth_schema.roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;
      const { rows } = await pool.query(query, [id]);
      if (rows.length === 0) {
        return null
      }
      const {
        reset_token,
        password_hash,
        reset_token_expiry,
        otp_code,
        otp_expiry,
        ...safeData
      } = rows[0];
      return safeData || null;
    } catch (error) {
      throw error;
    }
  }
  static async findByEmail(email) {
    try {
      const query = `
      SELECT *
      FROM auth_schema.users
      WHERE email = $1
    `;
      const { rows } = await pool.query(query, [email]);
      if (rows.length === 0) {
        return null;
      }
      const {
        reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry,
        ...safeData
      } = rows[0];
      return safeData || null;
    } catch (error) {
      throw error;
    }
  }
  static async findAll() {
    try {
      const query = `
      SELECT u.id, u.full_name, u.email, u.phone_number,
      r.name AS role_name, u.is_active,
      is_super_admin, u.created_at,
      u.last_login AS last_login
      FROM auth_schema.users u
      JOIN auth_schema.roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `;
      const { rows } = await pool.query(query);
      if (rows.length === 0) {
        return null
      }
      const safeData = rows.map((row) => {

        const {
          reset_token,
          reset_token_expiry,
          otp_code,
          otp_expiry,
          password_hash,
          ...safeData
        } = row

        return safeData
      })
      return safeData;
    } catch (error) {
      throw error;
    }
  }
  static async update(id, data = {}) {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in data) {
        fields.push(`${key} = $${index}`);
        values.push(data[key]);
        index++;
      }

      if (!fields.length) return null;

      const query = `
      UPDATE auth_schema.users
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${index}
      RETURNING *
    `;
      const { rows } = await pool.query(query, [...values, id]);
      if (rows.length === 0) {
        return null
      }
      const {
        reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry,
        password_hash,
        ...safeData
      } = rows[0];
      return safeData || null;
    } catch (error) {
      throw error;
    }
  }
  static async delete(id) {
    try {
      const query = `
      DELETE FROM auth_schema.users
      WHERE id = $1
      RETURNING *
    `;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async suspend(id) {
    return this.update(id, { is_active: false });
  }
  static async activate(id) {
    return this.update(id, { is_active: true });
  }
  static async generatePasswordResetToken(email) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const expires = new Date(Date.now() + 15 * 60 * 1000);

      await pool.query(
        `
    UPDATE auth_schema.users
    SET reset_token = $1,
    reset_token_expiry = $2
    WHERE id = $3
    `,
        [hashedToken, expires, user.id]
      );

      return resetToken;
    } catch (error) {
      throw error;
    }
  }
  static async findByResetToken(token) {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const query = `
    SELECT *
    FROM auth_schema.users
    WHERE reset_token = $1
      AND reset_token_expiry > NOW()

  `;

      const rows = await pool.query(query, [hashedToken]);
      const user = rows?.rows?.[0];

      if (!user) {
        return null
      }

      const {
        reset_token,
        reset_token_expiry,
        otp_code,
        otp_expiry,
        password_hash,
        ...safeData
      } = user;

      return safeData || null;
    } catch (error) {
      throw error;
    }
  }
  static async findAdmins() {
    try {
      const query = `
      SELECT u.id, u.full_name, u.email, u.phone_number,
      r.name AS role_name, u.is_active,
      u.is_super_admin, u.created_at,
      u.last_login AS last_login
      FROM auth_schema.users u
      JOIN auth_schema.roles r ON u.role_id = r.id
      WHERE u.is_super_admin = true OR r.name = 'admin'
      ORDER BY u.created_at DESC
    `;
      const { rows } = await pool.query(query);
      if (rows.length === 0) {
        return null;
      }
      const safeData = rows.map((row) => {
        const {
          reset_token,
          reset_token_expiry,
          otp_code,
          otp_expiry,
          password_hash,
          ...safeData
        } = row;
        return safeData;
      });
      return safeData;
    } catch (error) {
      console.error("❌ Error fetching admins:", error);
      throw error;
    }
  }
  static async countTotal() {
    try {
      const query = `
        SELECT COUNT(*) as total_users
        FROM auth_schema.users
      `;

      const { rows } = await pool.query(query);
      return rows[0]?.total_users || 0;
    } catch (error) {
      console.error("❌ Error counting total users:", error);
      throw error;
    }
  }
  static async countActive() {
    try {
      const query = `
        SELECT COUNT(*) as active_users
        FROM auth_schema.users
        WHERE is_active = true
      `;

      const { rows } = await pool.query(query);
      return rows[0]?.active_users || 0;
    } catch (error) {
      console.error("❌ Error counting active users:", error);
      throw error;
    }
  }
  static async countInactive() {
    try {
      const query = `
        SELECT COUNT(*) as inactive_users
        FROM auth_schema.users
        WHERE is_active = false
      `;

      const { rows } = await pool.query(query);
      return rows[0]?.inactive_users || 0;
    } catch (error) {
      console.error("❌ Error counting inactive users:", error);
      throw error;
    }
  }
  static async countByRole(role_id) {
    try {
      const query = `
        SELECT COUNT(*) as total_users
        FROM auth_schema.users
        WHERE role_id = $1
      `;

      const { rows } = await pool.query(query, [role_id]);
      return rows[0]?.total_users || 0;
    } catch (error) {
      console.error("❌ Error counting users by role:", error);
      throw error;
    }
  }

  static async countVerified() {
    try {
      const query = `
        SELECT COUNT(*) as verified_users
        FROM auth_schema.users
        WHERE is_verified = true
      `;

      const { rows } = await pool.query(query);
      return rows[0]?.verified_users || 0;
    } catch (error) {
      console.error("❌ Error counting verified users:", error);
      throw error;
    }
  }

  static async countSuperAdmins() {
    try {
      const query = `
        SELECT COUNT(*) as super_admins
        FROM auth_schema.users
        WHERE is_super_admin = true
      `;

      const { rows } = await pool.query(query);
      return rows[0]?.super_admins || 0;
    } catch (error) {
      console.error("❌ Error counting super admins:", error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const query = `
        SELECT
          COUNT(*) as total_users,
          SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_users,
          SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive_users,
          SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified_users,
          SUM(CASE WHEN is_super_admin = true THEN 1 ELSE 0 END) as super_admins,
          SUM(CASE WHEN is_active = true AND is_verified = true THEN 1 ELSE 0 END) as active_verified
        FROM auth_schema.users
      `;

      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      console.error("❌ Error getting user statistics:", error);
      throw error;
    }
  }
  static async getStatisticsByRole() {
    try {
      const query = `
        SELECT
          r.id,
          r.name as role_name,
          COUNT(u.id) as total_users,
          SUM(CASE WHEN u.is_active = true THEN 1 ELSE 0 END) as active_users
        FROM auth_schema.roles r
        LEFT JOIN auth_schema.users u ON r.id = u.role_id
        GROUP BY r.id, r.name
        ORDER BY total_users DESC
      `;

      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("❌ Error getting user statistics by role:", error);
      throw error;
    }
  }
  static async countByDateRange(startDate, endDate) {
    try {
      const query = `
        SELECT COUNT(*) as total_users
        FROM auth_schema.users
        WHERE created_at BETWEEN $1 AND $2
      `;

      const { rows } = await pool.query(query, [startDate, endDate]);
      return rows[0]?.total_users || 0;
    } catch (error) {
      console.error("❌ Error counting users by date range:", error);
      throw error;
    }
  }
}


