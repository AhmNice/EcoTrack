import { Report } from "../model/Report.js";
import { ReportVote } from "../model/Vote.js";
import { Notification } from "../model/Notification.js";

export const voteReport = async (req, res) => {
  const { report_id } = req.params;
  const { vote_type } = req.body;
  const user_id = req.user?.user_id;

  if (!report_id || ![1, -1].includes(vote_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid report_id or vote_type",
    });
  }
  const reportOwner = await Report.findById(report_id)
  try {
    const vote = await ReportVote.vote({ report_id, user_id, vote_type });
    const summary = await ReportVote.getSummary(report_id);

    // 🔔 Create notification for report owner
    try {
      if (reportOwner && reportOwner.user_id !== user_id) {
        const voteMessage = vote_type === 1 ? "upvoted" : "downvoted";
        const notification = new Notification({
          report_id: report_id,
          recipient_user_id: reportOwner.user_id,
          notification_type: vote_type === 1 ? "info" : "warning",
          message: `Someone ${voteMessage} your report.`,
          is_read: false,
        });
        await notification.save();
      }
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create vote notification:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: "Vote registered successfully",
      vote,
      summary,
    });
  } catch (error) {
    console.error("❌ Error voting report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const removeVote = async (req, res) => {
  const { report_id } = req.params;
  const user_id = req.user?.user_id;

  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Report id is required",
    });
  }

  try {
    await ReportVote.removeVote({ report_id, user_id });
    const summary = await ReportVote.getSummary(report_id);

    return res.status(200).json({
      success: true,
      message: "Vote removed successfully",
      summary,
    });
  } catch (error) {
    console.error("❌ Error removing vote:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getVoteSummary = async (req, res) => {
  const { report_id } = req.params;

  if (!report_id) {
    return res.status(400).json({
      success: false,
      message: "Report id is required",
    });
  }

  try {
    const summary = await ReportVote.getSummary(report_id);

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("❌ Error fetching vote summary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
