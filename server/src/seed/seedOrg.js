import { Organization } from "../model/Organization.js";

export const organizations = [
  {
    name: "Ministry of Works",
    organization_type: "Government Agency",
    email: "info@ministryofworks.gov.ng",
    phone_number: "+2348012345678",
    description: "Responsible for road construction and maintenance",
    location: "Abuja, Nigeria",
    website: "https://ministryofworks.gov.ng",
  },
  {
    name: "Waste Management Authority",
    organization_type: "Environmental Agency",
    email: "support@wastemgmt.gov.ng",
    phone_number: "+2348098765432",
    description: "Handles waste collection and environmental sanitation",
    location: "Lagos, Nigeria",
    website: "https://wastemanagement.gov.ng",
  },
  {
    name: "Road Maintenance Agency",
    organization_type: "Public Works",
    email: "contact@roadmaintenance.ng",
    phone_number: "+2348076543210",
    description: "Maintains highways and urban roads",
    location: "Kano, Nigeria",
    website: "https://roadmaintenance.ng",
  },
  {
    name: "Water Resources Board",
    organization_type: "Utility Agency",
    email: "info@waterresources.gov.ng",
    phone_number: "+2348061122334",
    description: "Oversees water supply and drainage systems",
    location: "Ibadan, Nigeria",
    website: "https://waterresources.gov.ng",
  },
];

export const seedOrganizations = async () => {
  try {
    console.log("🌱 Seeding organizations...");

    const orgPromises = organizations.map(async (org) => {
      // ✅ Prevent duplicates
      const existingOrg = await Organization.findByName(org.name);
      if (existingOrg) {
        console.log(`⚠️ Organization already exists: ${org.name}`);
        return null;
      }

      return Organization.create({
        name: org.name,
        organization_type: org.organization_type,
        email: org.email,
        phone_number: org.phone_number,
        description: org.description,
        location: org.location,
        website: org.website,
      });
    });

    await Promise.all(orgPromises);

    console.log("✅ Organization seeding completed");
  } catch (error) {
    console.error("❌ Error seeding organizations:", error);
    throw error;
  }
};
