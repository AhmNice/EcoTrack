import { Organization } from "../model/Organization.js";
import { User } from "../model/User.js";

export const createOrganization = async (req, res) => {
  const { name, organization_type, email, phone_number, description, location, website } = req.body;

  try {
    const existingOrg = await Organization.findByName(name);
    if (existingOrg) {
      return res.status(409).json({
        success: false,
        message: "Organization already exists",
      });
    }

    const organization = await Organization.create({
      name,
      organization_type,
      email,
      phone_number,
      description,
      location,
      website
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: organization,
    });
  } catch (error) {
    console.error("❌ Create organization error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create organization",
    });
  }
};
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll();

    return res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    console.error("❌ Fetch organizations error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch organizations",
    });
  }
};
export const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error("❌ Fetch organization error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch organization",
    });
  }
};
export const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, organization_type, email, phone_number, description } = req.body;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const updatedOrg = await Organization.update(id, {
      name,
      organization_type,
      email,
      description,
      phone_number,
    });

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: updatedOrg,
    });
  } catch (error) {
    console.error("❌ Update organization error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update organization",
    });
  }
};
export const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    await Organization.delete(id);

    return res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete organization error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete organization",
    });
  }
};
export const addUserToOrganization = async (req, res) => {
  const { organization_id } = req.params;
  const { user_id } = req.body;

  try {

    const org = await Organization.findById(organization_id)

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }


    const user = await User.findById(user_id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingUser = await Organization.hasUser(user_id)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this organization"
      })
    }
    await Organization.addUser({ user_id, organization_id })

    return res.status(201).json({
      success: true,
      message: "User added to organization successfully",
    });
  } catch (error) {
    console.error("Add user to organization error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getOrganizationData = async (req, res) => {
  const { organization_id } = req.params
  try {
    const orgData = await Organization.findById(organization_id)
    if (!orgData) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Organization data fetched",
      organization: orgData
    })
  } catch (error) {
    console.log("❌ Error fetching organization data", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
