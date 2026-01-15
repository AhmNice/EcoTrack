import { logAudit, logUserActivity } from "../helpers/logHelper.js";
import { Notification } from "../model/Notification.js";
import { getClientIp } from "../util/ip_address.js";

export const getUserNotifications = async (req, res) => {
  const { user_id } = req.params;
  try {
    const notifications = await Notification.findByUserId(user_id);
    return res.status(200).json({
      success: true,
      message: "Notification fetched",
      notifications,
    });
  } catch (error) {
    console.error("❌ Error fetching notifications: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const markNotificationAsRead = async (req, res) => {
  const { notification_id } = req.params;
  try {
    const notification = await Notification.markAsRead(notification_id);
    await logAudit({
      action: "MARK_NOTIFICATION_AS_READ",
      user_id: req.user.id,
      affected_table: "notification_schema.notifications",
    });
    await logUserActivity({
      user_id: req.user.id,
      action: `Marked notification ${notification_id} as read`,
      ip_address: req.ip,
    });
    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("❌ Error while trying to mark notification as read;", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const markAllAsRead = async (req, res) => {
  const { notification_ids } = req.body;
  try {
    const marked = [];
    for (const notification_id of notification_ids) {
      const read = await Notification.markAsRead(notification_id);
      marked.push(read);
    }
    await logAudit({
      action: "MARK_ALL_NOTIFICATIONS_AS_READ",
      user_id: req.user.id,
    });
    await logUserActivity({
      user_id: req.user.id,
      action: `Marked all notifications as read`,
      ip_address: getClientIp(req),
    });
    return res.status(200).json({
      success: true,
      message: "All notification marked as read",
      notifications: marked,
    });
  } catch (error) {
    console.error("❌ Error trying to mark all notification as read: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const deleteNotification = async (req, res) => {
  const { notification_id } = req.params;
  try {
    const notification = await Notification.delete(notification_id);
    await logAudit({
      action: "DELETE_NOTIFICATION",
      user_id: req.user.id,
    });
    await logUserActivity({
      user_id: req.user.id,
      action: `Deleted notification ${notification_id}`,
      ip_address: getClientIp(req),
    });
    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error while trying to delete notification: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
