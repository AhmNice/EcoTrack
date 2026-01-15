import { User } from "../model/User.js";
import { Role } from "../model/Role.js";
import bcrypt from "bcryptjs";
import { logAudit, logUserActivity } from "../helpers/logHelper.js";
import { createSession } from "../util/session.js";
import { getClientIp } from "../util/ip_address.js";
import { sendPasswordChangedEmail, sendPasswordResetLink } from "../mail/services.js";
import { Notification } from "../model/Notification.js";

export const createUser = async (req, res) => {
  const { full_name, email, password, phone_number, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Check if role exists

    const existingRole = await Role.findByName(role);

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: `Role "${role}" does not exist`,
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await new User({
      full_name,
      email,
      password_hash,
      phone_number,
      role_id: existingRole.id,
    }).save();

    // Log user activity
    await logUserActivity({
      user_id: req.user?.id || null, // admin creating user or system
      action: `Created a new user: ${user.email}`,
      ip_address: getClientIp(req),
    });

    // Log system audit
    await logAudit({
      user_id: req.user?.id || null,
      action: `Created user ${user.email}`,
      affected_table: "auth_schema.users",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body
  try {
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    const now = Date.now()
    if (otp !== user.otp_code || now > user.otp_expiry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired otp"
      })
    }
    const update_user = await User.update(user.id, { otp_code: null, otp_expiry: null, updated_at: now, is_verified: true })
    return res.status(200).json({
      success: true,
      message: "Account Verified"
    })
  } catch (error) {
    console.log("Error while trying to verify user")
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const role = await Role.findById(user.role_id);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "User role not found",
      });
    }

    const userData = {
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      role_id: user.role_id,
      role_name: role.name,
    };

    const now = new Date();

    await createSession(res, userData);

    await User.update(user.id, { last_login: now });

    await logUserActivity({
      user_id: user.id,
      action: "Account Login",
      ip_address: getClientIp(req),
    });
    const { password_hash, ...safeData } = user
    return res.status(200).json({
      success: true,
      message: "User logged in",
      user: { ...safeData, role_name: role.name },
    });
  } catch (error) {
    console.error("❌ Error logging user:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll()

    return res.status(200).json({
      success: true,
      message: "All users fetched",
      users
    })
  } catch (error) {
    console.log("❌ Error while trying to fetch all users", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error "
    })
  }
}
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { email } = req.user;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isCurrentPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password provided",
      });
    }
    const newPassword_hash = await bcrypt.hash(newPassword, 10);
    const updateUser = await User.update(user.id, {
      password_hash: newPassword_hash,
    });
    await logUserActivity({
      user_id: user.id,
      action: "Password Change",
      ip_address: getClientIp(req),
    });
    await logAudit({
      user_id: user.id,
      action: "Password change",
      affected_table: "auth_schema.users",
    });

    // 🔔 Create notification for password change
    try {
      const notification = new Notification({
        report_id: null,
        recipient_user_id: user.id,
        notification_type: "warning",
        message: "Your password has been changed successfully.",
        is_read: false,
      });
      await notification.save();
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create password change notification:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user: updateUser,
    });
  } catch (error) {
    console.error("❌ Error changing user password: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const requestResetPasswordLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = await User.generatePasswordResetToken(email);
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
    const mailData = {
      full_name: user.full_name,
      resetLink,
      email: user.email
    }
    await sendPasswordResetLink(mailData)
    await logAudit({
      user_id: user.id,
      action: "Request for password reset link",
      affected_table: "auth_schema.users"
    })
    await logUserActivity({
      user_id: user.id,
      action: "Request for password reset link",
      ip_address: getClientIp(req)
    })
    return res.status(200).json({
      success: true,
      message: "Reset password link sent",
    });
  } catch (error) {
    console.error("❌ Error requesting reset link:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const updateUser = await User.update(user.id, { password_hash, reset_token: null, reset_token_expiry: null });
    const time = new Date().getTime()
    await sendPasswordChangedEmail({ full_name: user.full_name, email: user.email, deviceInfo: '', time })

    await logAudit({ user_id: user.id, action: "Password changed", affected_table: "auth_schema.users" })
    await logUserActivity({ user_id: user.id, action: "Password changed", ip_address: getClientIp(req) })

    // 🔔 Create notification for password reset
    try {
      const notification = new Notification({
        report_id: null,
        recipient_user_id: user.id,
        notification_type: "warning",
        message: "Your password has been reset successfully. If you did not request this, please contact support immediately.",
        is_read: false,
      });
      await notification.save();
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create password reset notification:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      updateUser,
    });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateUser = async (req, res) => {
  const { full_name, email, phone_number } = req.body
  const { user_id } = req.params
  try {
    const user = await User.findById(user_id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const role = await Role.findById(user.role_id)

    const updateData = {}
    if (full_name) updateData.full_name = full_name
    if (email) updateData.email = email
    if (phone_number) updateData.phone_number = phone_number
    const updatedUser = await User.update(user_id, updateData)

    await logUserActivity({
      user_id,
      action: "Profile update",
      ip_address: getClientIp(req)
    })
    await logAudit({
      user_id,
      action: "Profile update",
      affected_table: "auth_schema.users"
    })

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      user: { ...updatedUser, role_name: role.name }
    })
  } catch (error) {
    console.error("❌ Error updating account:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
export const toggleStatus = async (req, res) => {
  const { user_id } = req.params
  const { user_id: admin_id } = req.user

  try {
    const user = await User.findById(user_id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // 🔁 Toggle status
    const newStatus = !user.is_active

    const updated_user = await User.update(user_id, {
      is_active: newStatus
    })

    const action = newStatus ? "activate" : "suspend"

    await logAudit({
      user_id: admin_id,
      action: `${action} user account`,
      affected_table: "auth_schema.users"
    })

    await logUserActivity({
      user_id: admin_id,
      action: `${action} user account`,
      ip_address: getClientIp(req)
    })

    // 🔔 Create notification for status change
    try {
      const notification = new Notification({
        report_id: null,
        recipient_user_id: user_id,
        notification_type: newStatus ? "info" : "urgent",
        message: newStatus ? "Your account has been activated." : "Your account has been suspended. Please contact support for more information.",
        is_read: false,
      });
      await notification.save();
    } catch (notificationError) {
      console.error("⚠️ Warning: Failed to create status change notification:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: `User ${newStatus ? "activated" : "suspended"} successfully`,
      user: updated_user
    })

  } catch (error) {
    console.error("❌ Error toggling user status", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const getUserById = async (req, res) => {
  const { user_id } = req.params
  console.log(user_id)
  try {
    const user = await User.findById(user_id)
    return res.status(200).json({
      success: true,
      message: "User details fetched",
      user
    })
  } catch (error) {
    console.log("❌ Error fetching user details", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const logout = async (req, res) => {
  try {
    const SESSION_NAME = "eco_track_session";
    const { email, role, full_name, user_id } = req.user;
    res.clearCookie(SESSION_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    await logUserActivity({
      user_id,
      action: "Account logout",
      ip_address: getClientIp(req),
    });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    })
  } catch (error) {
    console.error("❌ Error trying to logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAuthenticatedUser = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No authenticated user found",
      });
    }
    const role = await Role.findById(user.role_id)
    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: { ...user, role_name: role.name },
    });
  } catch (error) {
    console.error("❌ Error getting authenticated users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
