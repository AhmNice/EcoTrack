import express from "express";
import { body, param } from "express-validator";
import { handleInputValidation } from "../middleware/validator.js";
import { voteReport, removeVote, getVoteSummary } from "../controller/vote.controller.js";
import { userRoute } from "../middleware/protectedRoute.js";

const voteRoute = express.Router();

voteRoute.get('/', (req, res) => {
  res.send("vote route is working")
})
voteRoute.post(
  "/add-vote/:report_id",
  [
    param("report_id")
      .trim()
      .notEmpty()
      .withMessage("Report id is required")
      .escape(),
    body("vote_type")
      .notEmpty()
      .withMessage("Vote type is required")
      .isIn([1, -1])
      .withMessage("Vote type must be 1 (upvote) or -1 (downvote)"),
  ],
  handleInputValidation,
  userRoute(),
  voteReport
);


voteRoute.delete(
  "/remove-vote/:report_id",
  [
    param("report_id")
      .trim()
      .notEmpty()
      .withMessage("Report id is required")
      .escape(),
  ],
  handleInputValidation,
  userRoute(),
  removeVote
);


voteRoute.get(
  "/:report_id/summary",
  [
    param("report_id")
      .trim()
      .notEmpty()
      .withMessage("Report id is required")
      .escape(),
  ],
  handleInputValidation,
  getVoteSummary
);

export default voteRoute;
