import express from "express";

import {
   userStats,
   adminStats,
   dashboardStats,
   reportStats,
   userBreakdownStats,
   reportStatusStats,
   reportSeverityStats,
   systemStats,
} from "../controller/stat.controller.js";
import { secureRoute } from "../middleware/secureRoute.js";
import { adminRoute } from "../middleware/protectedRoute.js";

const statRoute = express.Router();
statRoute.post("/user", secureRoute, userStats);
statRoute.get("/admin", adminRoute(), adminStats);
statRoute.get("/dashboard", adminRoute(), dashboardStats);
statRoute.get("/reports", adminRoute(), reportStats);
statRoute.get("/users/breakdown", adminRoute(), userBreakdownStats);
statRoute.get("/reports/status", adminRoute(), reportStatusStats);
statRoute.get("/reports/severity", adminRoute(), reportSeverityStats);
statRoute.get("/system", adminRoute(), systemStats);

export default statRoute;
