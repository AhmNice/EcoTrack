import { pool } from "../config/db.config.js";

export const seedPermissions = async () => {
  const permissions = [
    { name: "create_report", description: "Create environmental report" },
    { name: "update_report", description: "Update report status" },
    { name: "delete_report", description: "Delete report" },
    { name: "comment_report", description: "Comment on reports" },
    { name: "vote_report", description: "Upvote or downvote reports" },
    { name: "manage_users", description: "Manage users" },
    { name: "view_analytics", description: "View analytics dashboard" },
  ];

  try {
    for (const permission of permissions) {
      await pool.query(
        `
        INSERT INTO auth_schema.permissions (name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        `,
        [permission.name, permission.description]
      );
    }

    console.log("✅ Permissions seeded");
  } catch (error) {
    console.error("❌ Error seeding permissions:", error.message);
  }
};
