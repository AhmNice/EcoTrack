import { pool } from "../config/db.config.js";

export const seedRoles = async () => {
  const roles = [
    { name: "user", description: "Regular system user" },
    { name: "admin", description: "System administrator" },
    { name: "super_admin", description: "Super administrator with full access" },
  ];

  try {
    for (const role of roles) {
      await pool.query(
        `
        INSERT INTO auth_schema.roles (name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        `,
        [role.name, role.description]
      );
    }

    console.log("✅ Roles seeded");
  } catch (error) {
    console.error("❌ Error seeding roles:", error.message);
  }
};
