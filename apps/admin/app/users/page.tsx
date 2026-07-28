import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";
import { UserManagement } from "./user-management";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "User Management | Krave Admin" };

export default async function UsersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#143623]">User Management</h1>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            Create & manage admin user accounts, roles & login permissions
          </p>
        </div>

        <div className="p-8">
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
