import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsByReport,
  updateComment,
} from "../controller/comment.controller.js";
import {
  userRoute,
  adminRoute,
  generalRoute,
} from "../middleware/protectedRoute.js";
import {
  addCommentValidator,
  deleteCommentValidator,
  getCommentsValidator,
  handleInputValidation,
  updateCommentValidator,
} from "../middleware/validator.js";

const commentRouter = express.Router();
commentRouter.get("/get-post-comment/:report_id",
  getCommentsValidator,
  handleInputValidation,
  generalRoute(),
  getCommentsByReport
)
commentRouter.post(
  "/add-comment/:report_id",
  addCommentValidator,
  handleInputValidation,
  handleInputValidation,
  userRoute(),
  addComment
);


commentRouter.patch(
  "/update-comment/:comment_id",
  updateCommentValidator,
  handleInputValidation,
  userRoute(),
  updateComment
);

commentRouter.delete(
  "/delete-comment/:comment_id",
  deleteCommentValidator,
  handleInputValidation,
  userRoute(),
  deleteComment
);
export default commentRouter;
