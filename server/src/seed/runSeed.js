import { seedPermissions } from "./seedPermission.js";
import { seedRoles } from "./seedRole.js";
import { seedRolePermissions } from "./seedRolePermission.js"
import { seedAdmin } from "./seedAdmin.js"
import { seedIssueTypes } from "./seedIssueTypes.js"
import { seedOrganizations } from "./seedOrg.js";
const runSeeds = async () => {
  try {
    await seedRoles();
    await seedPermissions();
    await seedRolePermissions();
    await seedAdmin();
    await seedIssueTypes();
    await seedOrganizations();

    console.log("🌱 All seeds completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed process failed:", error);
    process.exit(1);
  }
};

runSeeds();
