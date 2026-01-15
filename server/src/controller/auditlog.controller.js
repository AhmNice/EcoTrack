import { AuditLog } from "../model/AuditLog.js";
import { User } from "../model/User.js";

/* =============================================
   GET ALL AUDIT LOGS (Admin Only)
============================================= */
export const getAllAuditLogs = async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit parameter",
      });
    }

    const auditLogs = await AuditLog.findAll(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: auditLogs,
      count: auditLogs.length,
    });
  } catch (error) {
    console.error("❌ Error fetching audit logs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

/* =============================================
   GET AUDIT LOGS BY USER (Admin Only)
============================================= */
export const getAuditLogsByUser = async (req, res) => {
  const { user_id } = req.params;
  const { limit = 50 } = req.query;

  try {
    // Validate user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit parameter",
      });
    }

    const auditLogs = await AuditLog.findByUserId(user_id, parseInt(limit));

    return res.status(200).json({
      success: true,
      data: auditLogs,
      count: auditLogs.length,
      user_id: user_id,
    });
  } catch (error) {
    console.error("❌ Error fetching audit logs by user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

/* =============================================
   CREATE AUDIT LOG ENTRY (Internal)
============================================= */
export const createAuditLog = async (req, res) => {
  const { user_id, action, affected_table } = req.body;

  try {
    // Validate required fields
    if (!user_id || !action || !affected_table) {
      return res.status(400).json({
        success: false,
        message: "user_id, action, and affected_table are required",
      });
    }

    // Validate user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const auditLog = new AuditLog({
      user_id,
      action,
      affected_table,
    });

    const savedLog = await auditLog.save();

    return res.status(201).json({
      success: true,
      message: "Audit log created successfully",
      data: savedLog,
    });
  } catch (error) {
    console.error("❌ Error creating audit log:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create audit log",
    });
  }
};

/* =============================================
   DELETE AUDIT LOG ENTRY (Admin Only)
============================================= */
export const deleteAuditLog = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Audit log ID is required",
      });
    }

    const deletedLog = await AuditLog.delete(id);

    if (!deletedLog) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audit log deleted successfully",
      data: deletedLog,
    });
  } catch (error) {
    console.error("❌ Error deleting audit log:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete audit log",
    });
  }
};

/* =============================================
   GET AUDIT LOGS BY TABLE (Admin Only)
============================================= */
export const getAuditLogsByTable = async (req, res) => {
  const { affected_table } = req.params;
  const { limit = 50 } = req.query;

  try {
    if (!affected_table) {
      return res.status(400).json({
        success: false,
        message: "Table name is required",
      });
    }

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit parameter",
      });
    }

    const auditLogs = await AuditLog.findByTable(
      affected_table,
      parseInt(limit)
    );

    return res.status(200).json({
      success: true,
      data: auditLogs,
      count: auditLogs.length,
      affected_table: affected_table,
    });
  } catch (error) {
    console.error("❌ Error fetching audit logs by table:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

/* =============================================
   GET AUDIT LOGS BY DATE RANGE (Admin Only)
============================================= */
export const getAuditLogsByDateRange = async (req, res) => {
  const { start_date, end_date, limit = 100 } = req.query;

  try {
    // Validate date parameters
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "start_date and end_date are required (ISO format)",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use ISO format (YYYY-MM-DD)",
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "start_date cannot be after end_date",
      });
    }

    const auditLogs = await AuditLog.findByDateRange(
      startDate,
      endDate,
      parseInt(limit)
    );

    return res.status(200).json({
      success: true,
      data: auditLogs,
      count: auditLogs.length,
      date_range: {
        start: start_date,
        end: end_date,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching audit logs by date range:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};
