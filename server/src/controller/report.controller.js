import { logAudit, logUserActivity } from "../helpers/logHelper.js";
import { Issue } from "../model/Issues.js";
import { Report } from "../model/Report.js";
import { multipleUploader } from "../util/uploaders.js";
import { ReportImage } from '../model/ReportImage.js'
import { getClientIp } from "../util/ip_address.js";
import cloudinary from "../config/cloudinary.js";
import { Organization } from "../model/Organization.js";
import { pool } from "../config/db.config.js";
import { Notification } from "../model/Notification.js";
import { User } from "../model/User.js"
export const createNewReport = async (req, res) => {
  const {
    issue_type,
    title,
    description,
    latitude,
    longitude,
    location_address,
    severity_level,
  } = req.body;
  const { user_id, email, full_name } = req.user;
  console.log(req.user)
  console.log(req.files)
  try {
    const validIssue = await Issue.findById(issue_type)
    if (!validIssue) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue type"
      })
    }
    // 1️⃣ Upload images
    const images = await multipleUploader(req.files);

    // 2️⃣ Create the report
    const newReport = await new Report({
      user_id,
      title,
      issue_type_id: issue_type,
      description,
      latitude,
      longitude,
      location_address,
      severity_level,
    }).save();

    // 3️⃣ Create ReportImage docs AND save them
    const imagePromises = images.map((image) => {
      const imgDoc = new ReportImage({
        report_id: newReport.id,
        image_url: image.url,
      });
      return imgDoc.save();
    });

    // 4️⃣ Wait for all images to save
    await Promise.all(imagePromises);

    // 5️⃣ Create notification for report creation
    try {
      // Create notification for the report creator
      const userNotification = new Notification({
        report_id: newReport.id,
        recipient_user_id: user_id,
        notification_type: "info",
        message: `Your report "${title}" has been successfully created.`,
        is_read: false,
      });
      await userNotification.save();

      // Create notifications for all admins
      const admins = await User.findAdmins();
      if (admins && admins.length > 0) {
        const adminNotificationPromises = admins.map((admin) => {
          const adminNotification = new Notification({
            report_id: newReport.id,
            recipient_user_id: admin.id,
            notification_type: "info",
            message: `New report "${title}" submitted by ${full_name}.`,
            is_read: false,
          });
          return adminNotification.save();
        });
        await Promise.all(adminNotificationPromises);
      }
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create notification:", notificationError);
      // Continue with response even if notification fails
    }


    await logUserActivity({
      user_id,
      action: "created a report",
      ip_address: getClientIp(req),
    });
    await logAudit({
      user_id,
      action: "created a report",
      affected_table: "report_schema.reports",
    });

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("❌ Error creating report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllReports = async (req, res) => {
  try {
    const allReports = await Report.findAll();
    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      reports: allReports,
    });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getReportById = async (req, res) => {
  const { report_id } = req.params;
  try {
    const report = await Report.findById(report_id);
    return res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      report: report,
    });
  } catch (error) {
    console.error("❌ Error fetching report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const deleteReportById = async (req, res) => {
  const { report_id } = req.params;

  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Report id is required",
    });
  }

  try {
    // 1️⃣ Fetch report images first
    const images = await ReportImage.findByReportId(report_id);

    // 2️⃣ Delete images from Cloudinary
    for (const image of images) {
      let publicId = image.public_id;
      console.log(publicId)
      if (!publicId && image.image_url) {
        const urlParts = image.image_url.split("/");
        const filename = urlParts[urlParts.length - 1];
        publicId = urlParts
          .slice(urlParts.findIndex(p => p.includes("eco_uploads")))
          .join("/")
          .replace(/\.[^/.]+$/, ""); // remove extension
      }

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image", // or "raw" if needed
        });
      }
    }

    // 3️⃣ Delete report images from DB
    await ReportImage.deleteByReportId(report_id);

    // 4️⃣ Delete the report
    const deletedReport = await Report.delete(report_id);

    // 5️⃣ Logging
    await logAudit({
      user_id: req.user?.user_id || null,
      action: `Deleted report ${report_id}`,
      affected_table: "report_schema.reports",
    });
    await logUserActivity({
      user_id: req.user?.user_id || null,
      action: `Deleted report ${report_id}`,
      ip_address: getClientIp(req),
    });

    return res.status(200).json({
      success: true,
      message: "Report and associated images deleted successfully",
      report: deletedReport,
    });
  } catch (error) {
    console.error("❌ Error deleting report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getMyReports = async (req, res) => {
  const { user_id } = req.user;
  console.log(user_id)
  try {
    const userReports = await Report.findByUserId(user_id);
    return res.status(200).json({
      success: true,
      message: "User reports fetched successfully",
      reports: userReports,
    });
  } catch (error) {
    console.error("❌ Error fetching user reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getUserReports = async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id)
  try {
    const userReports = await Report.findByUserId(user_id);
    return res.status(200).json({
      success: true,
      message: "User reports fetched successfully",
      reports: userReports,
    });
  } catch (error) {
    console.error("❌ Error fetching user reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateReportStatus = async (req, res) => {
  const { report_id } = req.params;
  const { status } = req.body;
  const { user_id } = req.user;
  try {
    const updatedReport = await Report.update(report_id, {
      status,
    });
    await logUserActivity({
      user_id,
      action: `Updated report ${report_id} status to ${status}`,
      ip_address: getClientIp(req),
    });
    await logAudit({
      user_id,
      action: `Updated report ${report_id} status to ${status}`,
      affected_table: "report_schema.reports",
    });


    try {
      // Notify the report creator
      const userNotification = new Notification({
        report_id: report_id,
        recipient_user_id: updatedReport.user_id,
        notification_type: "info",
        message: `Report status has been updated to ${status}.`,
        is_read: false,
      });
      await userNotification.save();

      // Notify all admins
      const admins = await User.findAdmins();
      if (admins && admins.length > 0) {
        const adminNotificationPromises = admins.map((admin) => {
          const adminNotification = new Notification({
            report_id: report_id,
            recipient_user_id: admin.id,
            notification_type: "info",
            message: `Report #${report_id} status updated to ${status}.`,
            is_read: false,
          });
          return adminNotification.save();
        });
        await Promise.all(adminNotificationPromises);
      }
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create status update notifications:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("❌ Error updating report status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const assignReportToOrg = async (req, res) => {
  const { report_id, org_id } = req.params;

  try {
    // 1️⃣ Validate report & org
    const report = await Report.findById(report_id);
    const org = await Organization.findById(org_id);

    if (!report || !org) {
      return res.status(404).json({
        success: false,
        message: "Invalid organization or report",
      });
    }

    // 2️⃣ Check if already assigned to THIS org
    const alreadyAssigned = await pool.query(
      `
      SELECT 1
      FROM report_schema.report_organizations
      WHERE report_id = $1 AND organization_id = $2
      `,
      [report_id, org_id]
    );

    if (alreadyAssigned.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Report already assigned to this organization",
      });
    }

    // 3️⃣ Assign
    const assigned = await Report.assign({ report_id, org_id });

    // 4️⃣ Mark report as assigned
    await Report.update(report_id, { assigned: true });

    // 5️⃣ Fetch updated report
    const reportUp = await Report.findById(report_id);

    // 6️⃣ Create notifications for assignment
    try {
      // Notify the report creator
      const userNotification = new Notification({
        report_id: report_id,
        recipient_user_id: report.user_id,
        notification_type: "info",
        message: `Your report has been assigned to ${org.name}.`,
        is_read: false,
      });
      await userNotification.save();

      // Notify all admins
      const admins = await User.findAdmins();
      if (admins && admins.length > 0) {
        const adminNotificationPromises = admins.map((admin) => {
          const adminNotification = new Notification({
            report_id: report_id,
            recipient_user_id: admin.id,
            notification_type: "info",
            message: `Report #${report_id} assigned to ${org.name}.`,
            is_read: false,
          });
          return adminNotification.save();
        });
        await Promise.all(adminNotificationPromises);
      }
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create assignment notifications:", notificationError);
    }

    return res.status(201).json({
      success: true,
      message: "Report assigned successfully",
      assigned,
      report: reportUp,
    });
  } catch (error) {
    console.error("❌ Error assigning report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
