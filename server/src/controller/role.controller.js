import { logAudit, logUserActivity } from "../helpers/logHelper";
import { Role } from "../model/Role.js";
import { getClientIp } from "../util/ip_address.js";
export const createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingRole = await Role.findByName(name);
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role with this name already exists",
      });
    }
    const role = new Role({ name, description });
    const savedRole = await role.save();
    await logAudit({
      user_id: req.user.id,
      action: `Created role ID ${savedRole.id}`,
      affected_table: "auth_schema.roles",
    });
    await logUserActivity({
      user_id: req.user.id,
      action: `Created role ${name}`,
      ip_address: getClientIp(req),
    });
    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: savedRole,
    });
  } catch (error) {
    console.error("❌ Error in createRole controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      roles,
    });
  } catch (error) {
    console.error("❌ Error in getAllRoles controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getRoleById = async (req, res) => {
  const { role_id } = req.params;
  try {
    const role = await Role.findById(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Role fetched successfully",
      role,
    });
  } catch (error) {
    console.error("❌ Error in getRoleById controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const deleteRole = async (req, res) => {
  const { role_id } = req.params;
  try {
    const role = await Role.findById(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    await Role.delete(role_id);
    await logAudit({
      user_id: req.user.id,
      action: `Deleted role ID ${role_id}`,
      affected_table: "auth_schema.roles",
    });
    await logUserActivity({
      user_id: req.user.id,
      action: `Deleted role ${role.name}`,
      ip_address: getClientIp(req),
    });
    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteRole controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
