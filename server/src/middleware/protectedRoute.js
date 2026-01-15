import { secureRoute } from "./secureRoute.js";

export const adminRoute = (allowedRoles = ["admin", "super_admin"]) => {
  return async (req, res, next) => {
    try {
      // Apply secureRoute first (rate limit + JWT session)
      secureRoute(req, res, () => {
        const userRole = req.user?.role_name?.toLowerCase();
        if (!userRole || !allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: "Access denied. Admins only.",
          });
        }
        next();
      });
    } catch (error) {
      console.error("❌ AdminRoute error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export const userRoute = (allowedRoles = ["user"]) => {
  return async (req, res, next) => {
    try {
      // Ensure secureRoute runs first
      secureRoute(req, res, () => {
        const userRole = req.user?.role_name?.toLowerCase();
        if (!userRole || !allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: "Access denied.",
          });
        }
        next();
      });
    } catch (error) {
      console.error("❌ UserRoute error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export const generalRoute = (
  allowedRoles = ["user", "admin", "super_admin"]
) => {
  return async (req, res, next) => {
    try {
      // Ensure secureRoute runs first
      secureRoute(req, res, () => {
        const userRole = req.user?.role_name?.toLowerCase();
        if (!userRole || !allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: "Access denied.",
          });
        }
        next();
      });
    } catch (error) {
      console.error("❌ UserRoute error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};
