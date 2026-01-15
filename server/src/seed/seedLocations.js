import { pool } from "../config/db.config.js";
import nigerianStates from "../data/nigerian-states.js";
export const seedStateAndLocalGovernment = async () => {
  const client = await pool.connect();

  const stateQuery = `
    INSERT INTO location_schema.states (state_name)
    VALUES ($1)
    ON CONFLICT (state_name) DO NOTHING
    RETURNING id
  `;

  const lgaQuery = `
    INSERT INTO location_schema.local_governments (state_id, lga_name)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;

  try {
    await client.query("BEGIN");

    for (const [stateName, lgas] of Object.entries(nigerianStates)) {
      // Insert state
      const { rows } = await client.query(stateQuery, [stateName]);

      // Get state_id (whether newly inserted or already exists)
      let stateId;

      if (rows.length > 0) {
        stateId = rows[0].id;
      } else {
        const existing = await client.query(
          `SELECT id FROM location_schema.states WHERE state_name = $1`,
          [stateName]
        );
        stateId = existing.rows[0].id;
      }

      // Insert LGAs
      for (const lga of lgas) {
        await client.query(lgaQuery, [stateId, lga]);
      }
    }

    await client.query("COMMIT");
    console.log("✅ Nigerian states and LGAs seeded successfully");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding states and LGAs:", error);
  } finally {
    client.release();
  }
};
