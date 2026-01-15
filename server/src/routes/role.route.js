import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
} from "../controller/role.controller.js";
import { adminRoute } from "../middleware/protectedRoute.js";
import {
  createRoleValidator,
  handleInputValidation,
} from "../middleware/validator";

const roleRoute = express.Router();

roleRoute.get("/get-all-roles", adminRoute, getAllRoles);
roleRoute.post(
  "/create-role",
  adminRoute,
  createRoleValidator,
  handleInputValidation,
  createRole
);
roleRoute.get(
  "/get-role/:role_id",
  deleteRoleValidator_Get,
  handleInputValidation,
  adminRoute,
  getRoleById
);
roleRoute.delete(
  "/delete-role/:role_id",
  deleteRoleValidator_Get,
  handleInputValidation,
  adminRoute,
  deleteRole
);

export default roleRoute;
