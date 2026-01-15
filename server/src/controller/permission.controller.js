import { Permission } from "../model/Permission.js";
import { logAudit, logUserActivity } from "../helpers/logHelper.js";
import { getClientIp } from "../util/ip_address.js";
export const createPermission = async (req, res) => {
  const { name, description } = req.body;
  const { full_name, user_id, email } = req.user;
  try {
    const existingPermission = await Permission.findByName(name);
    if (existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Permission already exist",
      });
    }
    const newPermission = await new Permission({
      name,
      description,
    }).save();
    await logAudit({
      user_id,
      action: "Created a new permission",
      affected_table: " auth_schema.permissions",
    });
    await logUserActivity({
      user_id,
      action: `Created a new permission with id ${newPermission.id}`,
      ip_address: getClientIp(req),
    });
    return res.status(200).json({
      success: true,
      message: "Permission create successfully",
    });
  } catch (error) {
    console.error("❌ Error while trying to create a permission");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllPermission = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    return res.status(200).json({
      success: true,
      message: "Permission fetched",
      permissions,
    });
  } catch (error) {
    console.error("❌ Error while trying to fetch permissions");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updatePermission = async (req, res) => {
  const { permission_id } = req.params;
  const { name, description } = req.body;
  try {
    const existingPermission = await Permission.findById(permission_id);
    if (!existingPermission) {
      return res.status(400).json({
        success: false,
        message: "Permission not found",
      });
    }
    const updatedPermission = await Permission.update(permission_id, {
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      message: "Permission updated successfully",
    });
  } catch (error) {
    console.error("❌ Error while trying to update permission");
  }
};
export const deletePermission = async (req, res) => {
  const { permission_id } = req.params;
  try {
    const existingPermission = await Permission.findById(permission_id);
    if (!existingPermission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    await Permission.delete(permission_id);
    return res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error while trying to delete permission");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
