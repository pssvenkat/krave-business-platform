/**
 * @krave/database
 * Public API for the database package.
 */

// Browser client (use in 'use client' components)
export { createClient } from "./client";

// Server clients (use in Server Components, Actions, Route Handlers)
export { createClient as createServerClient, createAdminClient } from "./server";

// Types
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  Json,
} from "./types";
