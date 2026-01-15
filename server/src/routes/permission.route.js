import express from "express";
import { adminRoute } from "../middleware/protectedRoute";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  updatePermission,
} from "../controller/permission.controller";
import {
  createPermissionValidator,
  deletePermissionValidator,
  handleInputValidation,
  updatePermissionValidator,
} from "../middleware/validator";

const permissionRoute = express.Router();

permissionRoute.get("/all-permissions", adminRoute, getAllPermission);

permissionRoute.post(
  "/create-permission",
  createPermissionValidator,
  handleInputValidation,
  adminRoute,
  createPermission
);

permissionRoute.patch(
  "/update-permission/:permission_id",
  updatePermissionValidator,
  adminRoute,
  updatePermission
);

permissionRoute.delete(
  "/delete-permission/:permission_id",
  deletePermissionValidator,
  handleInputValidation,
  adminRoute,
  deletePermission
);

export default permissionRoute;
