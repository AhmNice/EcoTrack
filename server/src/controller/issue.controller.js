import { Issue } from "../model/Issues.js";

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.findAll();

    return res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error("❌ Error fetching issues:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
};
export const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    console.error("❌ Error fetching issue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issue",
    });
  }
};
export const createIssue = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingIssue = await Issue.findByName(name);
    if (existingIssue) {
      return res.status(409).json({
        success: false,
        message: "Issue type already exists",
      });
    }

    const issue = await Issue.create({ name, description });
    await logUserActivity({
      user_id: req.user.id,
      action: `Created issue type (${name})`,
      ip_address: req.ip,
    });

    // AUDIT LOG (STATE CHANGE)
    await logAudit({
      user_id: req.user.id,
      action: "CREATE",
      affected_table: "report_schema.issue_types",
      record_id: issue.id,
    });
    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    console.error("❌ Error creating issue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create issue",
    });
  }
};
export const updateIssue = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const updatedIssue = await Issue.update(id, {
      name,
      description,
    });

    await logUserActivity({
      user_id: req.user.id,
      action: `Updated issue type (${id})`,
      ip_address: req.ip,
    });

    // AUDIT LOG
    await logAudit({
      user_id: req.user.id,
      action: "UPDATE",
      affected_table: "report_schema.issue_types",
      record_id: id,
    });
    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    console.error("❌ Error updating issue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update issue",
    });
  }
};
export const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    await Issue.delete(id);

    await logUserActivity({
      user_id: req.user.id,
      action: `Deleted issue type (${id})`,
      ip_address: req.ip,
    });

    // AUDIT LOG
    await logAudit({
      user_id: req.user.id,
      action: "DELETE",
      affected_table: "report_schema.issue_types",
      record_id: id,
    });
    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting issue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete issue",
    });
  }
};
