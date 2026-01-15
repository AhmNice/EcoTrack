import { body, param, validationResult } from "express-validator";

// ======= Auth validators handler ==========
export const createUserValidator = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone_number")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number")
    .escape(),

  body("role").trim().notEmpty().withMessage("Role is required").escape(),
];
export const otpValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .escape(),
  body("otp").trim().notEmpty().withMessage("OTP is required").escape()
]
export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
export const changePasswordValidator = [
  body("CurrentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6 })
    .withMessage("Current password must be at least 6 characters")
    .escape(),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .escape(),
];
export const resetPasswordLinkValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .escape(),
];
export const addUserToOrgValidator = [
  body("user_id")
    .trim()
    .notEmpty()
    .withMessage("User id is required")
    .escape(),
  param("organization_id")
    .trim()
    .notEmpty()
    .withMessage("User id is required")
    .escape(),
]
export const getOrdDataValidator = [
  param("organization_id")
    .trim()
    .notEmpty()
    .withMessage("User id is required")
    .escape(),
]
export const resetPasswordValidator = [
  body("token").trim().notEmpty().withMessage("Token is required").escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
export const updateProfileValidator = [
  param("user_id")
    .trim()
    .notEmpty()
    .withMessage("User id is required")
    .escape(),
  body("full_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("full_name is required")
    .escape(),
  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .escape(),
  body("phone_number")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number")
    .escape(),
]
// ======= report validators  handler ==========


export const createReportValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .trim()
    .escape(),
  body("issue_type")
    .notEmpty().withMessage("Issue type is required")
    .trim()
    .escape(),

  body("description")
    .notEmpty().withMessage("Description is required")
    .trim()
    .escape(),

  body("latitude")
    .notEmpty().withMessage("Latitude is required")
    .bail()
    .custom((value) => {
      const lat = Number(value);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        throw new Error("Invalid latitude value");
      }
      return true;
    }),

  body("longitude")
    .notEmpty().withMessage("Longitude is required")
    .bail()
    .custom((value) => {
      const lng = Number(value);
      if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        throw new Error("Invalid longitude value");
      }
      return true;
    }),

  body("location_address")
    .notEmpty().withMessage("Location address is required")
    .trim()
    .escape(),

  body("severity_level")
    .notEmpty().withMessage("Severity level is required")
    .bail()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid severity level"),
];

export const getReportByIdValidator = [
  param("report_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
];
export const deleteReportValidator = [
  param("report_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
];
export const getUserReportsValidator = [
  param("user_id")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .escape(),
];
export const updateReportValidator = [
  param("report_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
  body("status").trim().notEmpty().withMessage("Status is required").escape(),
];
export const assignReportValidator = [
  param("report_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
  param("org_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
]

// ======= Comment validator handler ==========
export const addCommentValidator = [
  param("report_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
  body("comment").trim().notEmpty().withMessage("Comment is required").escape(),
  body("user_id").trim().notEmpty().withMessage("User ID is required").escape(),
];
export const updateCommentValidator = [
  param("comment_id")
    .trim()
    .notEmpty()
    .withMessage("comment id is required")
    .escape(),
  body("comment").trim().notEmpty().withMessage("Comment is required").escape(),
];
export const deleteCommentValidator = [
  param("comment_id")
    .trim()
    .notEmpty()
    .withMessage("comment id is required")
    .escape(),
];

// ====== Permission validator handler ==========
export const createPermissionValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Permission name is required")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Permission description is required"),
];
export const updatePermissionValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Permission name is required")
    .escape(),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Permission description is required"),
];
export const deletePermissionValidator = [
  param("permission_id")
    .trim()
    .notEmpty()
    .withMessage("Permission ID is required")
    .escape(),
];
export const getCommentsValidator = [
  param("report_id")
    .trim()
    .notEmpty()
    .withMessage("Report ID is required")
    .escape(),
];

// ====== Role validator handler ==========
export const createRoleValidator = [
  body("name").trim().notEmpty().withMessage("Role name is required").escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description name is required")
    .escape(),
];
export const deleteRoleValidator_Get = [
  param("role_id")
    .trim()
    .notEmpty()
    .withMessage("Role ID is required")
    .escape(),
];


export const handleInputValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
      message: formattedErrors[0].message,
    });
  }

  next();
};

