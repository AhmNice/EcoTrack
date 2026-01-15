import { ReportComment } from "../model/ReportComment.js";
import { logAudit, logUserActivity } from "../helpers/logHelper.js";
import { getClientIp } from "../util/ip_address.js";
import { Report } from "../model/Report.js";
import { Notification } from "../model/Notification.js";
export const addComment = async (req, res) => {
  const { report_id } = req.params;
  const { user_id, comment } = req.body;
  try {
    const newComment = await ReportComment.create({
      report_id,
      user_id,
      comment,
    });
    await logUserActivity({
      user_id: req.user.id,
      action: `Added a comment to report ID ${report_id}`,
      ip_address: getClientIp(req),
    });
    await logAudit({
      user_id: req.user.id,
      action: `Created comment ID ${newComment.id} on report ID ${report_id}`,
      affected_table: "report_schema.report_comments",
    });

    // 🔔 Create notification for report owner
    try {
      const report = await Report.findById(report_id);
      if (report && report.user_id !== user_id) {
        const notification = new Notification({
          report_id: report_id,
          recipient_user_id: report.user_id,
          notification_type: "info",
          message: "Someone added a comment to your report.",
          is_read: false,
        });
        await notification.save();
      }
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create comment notification:", notificationError);
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("❌ Error in addComment controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getCommentsByReport = async (req, res) => {
  const { report_id } = req.params;
  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Report id is required"
    })
  }
  try {
    const comments = await ReportComment.findByReport(report_id);
    return res.status(200).json({
      success: true,
      message: " Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("❌ Error in getCommentsByReport controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateComment = async (req, res) => {
  const { comment } = req.body;
  const { comment_id } = req.params;
  const user_id = req.user.id;
  try {
    const existingComment = await ReportComment.findById(comment_id);
    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    const updatedComment = await ReportComment.update({
      comment_id,
      user_id,
      comment,
    });
    await logAudit({
      user_id,
      action: `Update this ${comment_id} comment`,
      affected_table: "report_schema.report_comments",
    });
    await logUserActivity({
      user_id,
      action: `Update this ${comment_id} comment`,
      ip_address: getClientIp(req),
    });

    // 🔔 Create notification for report owner about comment update
    try {
      const report = await Report.findById(existingComment.report_id);
      if (report && report.user_id !== user_id) {
        const notification = new Notification({
          report_id: existingComment.report_id,
          recipient_user_id: report.user_id,
          notification_type: "info",
          message: "A comment on your report has been updated.",
          is_read: false,
        });
        await notification.save();
      }
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create comment update notification:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: "comment updated successfully",
      updatedComment,
    });
  } catch (error) {
    console.error("❌ Error while trying to update comment: ");
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
export const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const user_id = req.user.id;
  try {
    const deletedComment = await ReportComment.delete({ comment_id, user_id });
    await logAudit({
      user_id,
      action: `Deleted comment ID ${comment_id}`,
      affected_table: "report_schema.report_comments",
    });
    await logUserActivity({
      user_id,
      action: `Deleted comment ID ${comment_id}`,
      ip_address: getClientIp(req),
    });
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error while trying to delete comment: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
