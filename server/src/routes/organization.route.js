import express from "express"
import { adminRoute } from "../middleware/protectedRoute.js";
import { addUserToOrganization, createOrganization, deleteOrganization, getAllOrganizations, getOrganizationById, getOrganizationData, updateOrganization } from "../controller/organization.controller.js";
import { addUserToOrgValidator, getOrdDataValidator, handleInputValidation } from "../middleware/validator.js"
const OrganizationRoute = express.Router()

OrganizationRoute.post("/create", adminRoute(), createOrganization);
OrganizationRoute.get("/get-all-organizations", adminRoute(), getAllOrganizations);
OrganizationRoute.get("/get-organizations/:id", adminRoute(), getOrganizationById);
OrganizationRoute.patch("/update-organizations/:id", adminRoute(), updateOrganization);
OrganizationRoute.delete("/delete-organizations/:id", adminRoute(), deleteOrganization);
OrganizationRoute.post("/add-user-to-organization/:organization_id", addUserToOrgValidator, handleInputValidation, adminRoute(), addUserToOrganization)
OrganizationRoute.get("/get-organization-details/:organization_id", getOrdDataValidator, handleInputValidation, getOrganizationData)
export default OrganizationRoute