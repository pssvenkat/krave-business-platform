/**
 * @krave/validation
 * Public API for the validation package.
 */

// Registration
export {
  registrationSchema,
  registrationSearchSchema,
  type RegistrationInput,
  type RegistrationSearchInput,
} from "./registration";

// Webinar
export {
  createWebinarSchema,
  updateWebinarSchema,
  webinarListSchema,
  type CreateWebinarInput,
  type UpdateWebinarInput,
  type WebinarListInput,
} from "./webinar";

// Auth
export {
  adminLoginSchema,
  adminInviteSchema,
  passwordResetSchema,
  type AdminLoginInput,
  type AdminInviteInput,
  type PasswordResetInput,
} from "./auth";
