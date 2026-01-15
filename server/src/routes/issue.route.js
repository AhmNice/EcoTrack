import express from "express"
import { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssue } from "../controller/issue.controller.js";
import { secureRoute } from "../middleware/secureRoute.js"
import { adminRoute } from '../middleware/protectedRoute.js'
import { checkPermission } from "../middleware/permission.js";
const issueRoute = express.Router()
issueRoute.get("/all", secureRoute, getAllIssues);
issueRoute.get("/single/:id", secureRoute, getIssueById);

issueRoute.post(
  "/create",
  adminRoute(),
  checkPermission("issue:create"),
  createIssue
);

issueRoute.patch(
  "/update/:id",
  adminRoute(),
  checkPermission("issue:update"),
  updateIssue
);

issueRoute.delete(
  "/delete/:id",
  adminRoute(),
  checkPermission("issue:delete"),
  deleteIssue
);
export default issueRoute