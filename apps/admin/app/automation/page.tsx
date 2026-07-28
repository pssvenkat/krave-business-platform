import { Sidebar } from "../components/sidebar";
import { AutomationWorkflowList } from "./automation-workflow-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "AI & Automation | Krave Admin" };

export default async function AutomationPage() {
  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#143623]">AI & WhatsApp Automation</h1>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            Automated workflows · AI lead scoring · Real-time execution logs
          </p>
        </div>

        <div className="p-8">
          <AutomationWorkflowList />
        </div>
      </div>
    </div>
  );
}
