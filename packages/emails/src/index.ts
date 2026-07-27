/**
 * @krave/emails
 * Public API for the emails package.
 */

// Email sending functions
export {
  sendRegistrationConfirmation,
  sendWebinarReminder,
  type SendEmailResult,
} from "./send";

// Email templates (for react-email preview)
export { RegistrationConfirmation } from "./templates/registration-confirmation";
export { WebinarReminder } from "./templates/reminder";
