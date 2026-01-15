import { sender, transporter } from "../config/mail.config.js";
import { adminWelcomeEmailTemplate, passwordChangedEmailTemplate, resetPasswordEmailTemplate, welcomeEmailTemplate } from "./templates.js";

const mailOption = ({ email, subject, html }) => ({
  from: sender,
  to: email,
  subject: subject,
  html: html
});

export const sendPasswordResetLink = async ({ full_name, resetLink, email }) => {
  try {
    // const { full_name, resetLink, email } = user;
    if (!email || !resetLink || !full_name) {
      throw new Error("Missing required user data for password reset email");
    }

    const content = resetPasswordEmailTemplate(
      full_name,
      resetLink,
      "15"
    );

    await transporter.sendMail(
      mailOption({
        email,
        subject: "Password Reset",
        html: content,
      })
    );
    console.log("Password resent link email sent")
    return true;
  } catch (error) {
    console.error(" ❌ Password reset email failed:", error.message);
    throw error;
  }
};
export const sendWelcomeEmail = async (user = { email, full_name }) => {
  try {
    const { email, full_name } = user;

    if (!email || !full_name) {
      throw new Error("Invalid user data for welcome email");
    }

    const content = welcomeEmailTemplate(full_name);

    await sendEmail({
      email,
      subject: "Welcome to EcoTrack 🌱",
      html: content,
    });

    return true;
  } catch (error) {
    console.error("❌ Welcome email error:", error.message);
    throw error;
  }
};
export const sendPasswordChangedEmail = async (user = { full_name, email, deviceInfo, time }) => {
  try {
    const { full_name, email, deviceInfo, time } = user;
    
    if (!email || !full_name || !time) {
      throw new Error("Invalid data for password change email");
    }

    const content = passwordChangedEmailTemplate(
      full_name,
      time,
      deviceInfo
    );

    await transporter.sendMail(mailOption({
      email,
      subject: "Your EcoTrack Password Was Changed",
      html: content,
    }));

    return true;
  } catch (error) {
    console.error("❌ Password changed email error:", error.message);
    throw error;
  }
};
export const sendAdminWelcomeEmail = async (user = { full_name, email, admin_id, accessLevel, department }) => {
  try {
    const { full_name, email, admin_id, accessLevel, department } = user;

    if (!email || !full_name || !admin_id || !accessLevel) {
      throw new Error("Invalid admin data for welcome email");
    }

    const content = adminWelcomeEmailTemplate(
      full_name,
      admin_id,
      accessLevel,
      department
    );

    await transporter.sendMail(mailOption({
      email,
      subject: "Welcome to EcoTrack Admin Panel",
      html: content,
    }));

    return true;
  } catch (error) {
    console.error("❌ Admin welcome email error:", error.message);
    throw error;
  }
};
