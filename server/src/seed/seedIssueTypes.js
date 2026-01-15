import { pool } from "../config/db.config.js";

export const seedIssueTypes = async () => {
  const client = await pool.connect();

  const issueTypes = [
    ["Illegal Waste Dumping", "Unauthorized disposal of solid or liquid waste"],
    ["Bush Burning", "Uncontrolled burning of vegetation or farmland"],
    ["Flooding", "Overflow of water submerging land or property"],
    ["Soil Erosion", "Loss of topsoil due to water or wind"],
    ["Water Pollution", "Contamination of rivers, streams, or wells"],
    ["Air Pollution", "Release of harmful substances into the atmosphere"],
    ["Deforestation", "Illegal or uncontrolled cutting of trees"],
    ["Blocked Drainage", "Drainage channels obstructed by waste"],
    ["Oil Spill", "Leakage of oil into land or water"],
    ["Noise Pollution", "Excessive or harmful noise levels"]
  ];

  const insertQuery = `
    INSERT INTO report_schema.issue_types (name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
  `;

  try {
    await client.query("BEGIN");

    for (const issue of issueTypes) {
      await client.query(insertQuery, issue);
    }

    await client.query("COMMIT");
    console.log("✅ Issue types seeded successfully");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding issue types:", error);
  } finally {
    client.release();
  }
};
