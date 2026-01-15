import { ActivityLog } from "../model/ActivityLog.js";
import { AuditLog } from "../model/AuditLog.js";

/* ======================
   USER ACTIVITY LOG HELPER
====================== */
export const logUserActivity = async ({ user_id, action, ip_address }) => {
  try {
    const log = new ActivityLog({ user_id, action, ip_address });
    return await log.save();
  } catch (error) {
    console.error("❌ Failed to log user activity:", error.message);
    return null;
  }
};

/* ======================
   SYSTEM AUDIT LOG HELPER
====================== */
export const logAudit = async ({ user_id, action, affected_table }) => {
  try {
    const log = new AuditLog({ user_id, action, affected_table });
    return await log.save();
  } catch (error) {
    console.error("❌ Failed to log audit action:", error.message);
    return null;
  }
};
