import { pool } from "../config/db.config.js";

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // 1️⃣ Ensure user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // 2️⃣ Super admin bypass
      if (req.user.is_super_admin === true) {
        return next();
      }

      // 3️⃣ Validate permission input
      if (!permission) {
        return res.status(500).json({
          success: false,
          message: "Permission not specified",
        });
      }

      const userId = req.user.id;

      // 4️⃣ Check permission
      const { rows } = await pool.query(
        `
        SELECT 1
        FROM auth_schema.permissions p
        JOIN auth_schema.role_permissions rp ON p.id = rp.permission_id
        JOIN auth_schema.roles r ON r.id = rp.role_id
        JOIN auth_schema.users u ON u.role_id = r.id
        WHERE u.id = $1 AND p.name = $2
        LIMIT 1
        `,
        [userId, permission]
      );

      if (!rows.length) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      console.error("❌ Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};
