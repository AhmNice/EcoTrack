import express from "express";
import { adminRoute } from "../middleware/protectedRoute.js";
import {
  getAllAuditLogs,
  getAuditLogsByUser,
  createAuditLog,
  deleteAuditLog,
  getAuditLogsByTable,
  getAuditLogsByDateRange,
} from "../controller/auditlog.controller.js";

const auditLogRoute = express.Router();

auditLogRoute.get("/", adminRoute(), getAllAuditLogs);
auditLogRoute.get("/user/:user_id", adminRoute(), getAuditLogsByUser);
auditLogRoute.get("/table/:affected_table", adminRoute(), getAuditLogsByTable);
auditLogRoute.get("/date-range/search", adminRoute(), getAuditLogsByDateRange);
auditLogRoute.post("/", adminRoute(), createAuditLog);
auditLogRoute.delete("/:id", adminRoute(), deleteAuditLog);

export default auditLogRoute;
