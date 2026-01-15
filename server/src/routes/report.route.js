import express from "express";
import { adminRoute, userRoute } from "../middleware/protectedRoute.js";
import {
  assignReportToOrg,
  createNewReport,
  deleteReportById,
  getAllReports,
  getMyReports,
  getReportById,
  getUserReports,
  updateReportStatus,
} from "../controller/report.controller.js";
import {
  assignReportValidator,
  createReportValidator,
  deleteReportValidator,
  getReportByIdValidator,
  getUserReportsValidator,
  handleInputValidation,
  updateReportValidator,
} from "../middleware/validator.js";
import { secureRoute } from "../middleware/secureRoute.js";
import { multipleUpload } from "../middleware/fileUploader.js";

const reportRoute = express.Router();

reportRoute.post(
  "/create-report",
  multipleUpload,
  createReportValidator,
  handleInputValidation,
  userRoute(),
  createNewReport
);

reportRoute.get("/all-reports", secureRoute, getAllReports);

reportRoute.get(
  "/get-report/:report_id",
  getReportByIdValidator,
  handleInputValidation,
  secureRoute,
  getReportById
);

reportRoute.delete(
  "/delete-report/:report_id",
  deleteReportValidator,
  handleInputValidation,
  adminRoute(),
  deleteReportById
);

reportRoute.delete(
  "/delete-my-report/:report_id",
  deleteReportValidator,
  handleInputValidation,
  userRoute(),
  deleteReportById
);

reportRoute.get(
  "/my-reports",
  userRoute(),
  getMyReports
);
reportRoute.get(
  "/user-reports/:user_id",
  getUserReportsValidator,
  handleInputValidation,
  userRoute(),
  getUserReports
);
reportRoute.patch(
  "/update-report/:report_id",
  updateReportValidator,
  handleInputValidation,
  adminRoute(),
  updateReportStatus
);
reportRoute.patch("/assign-report/:report_id/:org_id",
  assignReportValidator,
  handleInputValidation,
  adminRoute(), assignReportToOrg)

export default reportRoute;
