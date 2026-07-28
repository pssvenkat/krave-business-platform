import { createClient } from "@supabase/supabase-js";
import { Sidebar } from "../components/sidebar";
import { AcademyModuleGrid } from "./academy-module-grid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Academy | Krave Admin" };

export default async function AcademyAdminPage() {
  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Krave Academy</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Manage masterclass modules, video lessons & student completions
            </p>
          </div>
        </div>

        <div className="p-8">
          <AcademyModuleGrid />
        </div>
      </div>
    </div>
  );
}
