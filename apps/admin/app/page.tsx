import { redirect } from "next/navigation";

/**
 * Admin root route – redirects to dashboard or login.
 * Middleware handles actual auth protection.
 */
export default function AdminRootPage() {
  redirect("/login");
}
