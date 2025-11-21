const joi = require("joi");

const RegisterSchema = joi.object({
  name: joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: joi
    .string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      "any.required": "Password is required",
    }),

  empId: joi.string().alphanum().min(3).max(20).required().messages({
    "string.alphanum": "Employee ID must only contain alphanumeric characters",
    "string.min": "Employee ID must be at least 3 characters long",
    "string.max": "Employee ID cannot exceed 20 characters",
    "any.required": "Employee ID is required",
  }),

  role: joi
    .string()
    .valid("admin", "manager", "contractor")
    .required()
    .messages({
      "any.only": "Role must be either admin, manager, or contractor",
      "any.required": "Role is required",
    }),
});

module.exports = RegisterSchema;
