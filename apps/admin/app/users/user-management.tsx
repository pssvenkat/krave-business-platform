"use client";

import { useState, useEffect } from "react";

export interface UserItem {
  id: string;
  email: string;
  fullName: string;
  role: "Super Admin" | "Admin" | "Manager" | "Editor";
  status: "active" | "disabled";
  createdAt: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: "u-1",
    email: "admin@kravemicrogreens.in",
    fullName: "Venkatesan Selvaraj",
    role: "Super Admin",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-2",
    email: "ops@kravemicrogreens.in",
    fullName: "Operations Manager",
    role: "Manager",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Admin" as "Super Admin" | "Admin" | "Manager" | "Editor",
  });

  // Fetch users on mount
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          setUsers(data.users);
        }
      } catch {
        // keep initial fallback
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create user");
      }

      const newUser: UserItem = {
        id: data.user.id,
        email: form.email,
        fullName: form.fullName,
        role: form.role,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      setUsers((prev) => [newUser, ...prev]);
      setIsCreating(false);
      setSuccessMsg(`User '${form.email}' created successfully! They can now log in at /login.`);
      setTimeout(() => setSuccessMsg(null), 5000);

      // Reset form
      setForm({ fullName: "", email: "", password: "", role: "Admin" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating user";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "disabled" : "active" }
          : u
      )
    );
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">

      {/* Top Header & CTA */}
      <div className="flex items-center justify-between bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-[#143623] font-bold text-lg">Admin Platform Accounts ({users.length})</h2>
          <p className="text-[#4a6b57] text-xs mt-0.5 font-medium">
            Manage admin users, roles & system access credentials
          </p>
        </div>
        <button
          onClick={() => { setIsCreating(true); setErrorMsg(null); }}
          id="add-user-btn"
          className="inline-flex items-center gap-2 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <span>+ Create New Admin User</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-4 rounded-xl transition-all shadow-xs flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <a href="/login" className="underline hover:text-green-900 text-xs font-bold">Go to Login Page →</a>
        </div>
      )}

      {/* Users List Table */}
      <div className="bg-white border border-[#e2efe6] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6b8e78] text-sm font-medium">Loading user accounts…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8faf5] border-b border-[#e2efe6] text-[11px] font-black uppercase text-[#6b8e78] tracking-wider">
                  <th className="px-6 py-3.5">User Details</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f7f2] text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8faf5]/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1e5631] text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {getInitials(u.fullName)}
                        </div>
                        <div>
                          <p className="font-bold text-[#143623]">{u.fullName}</p>
                          <p className="text-[#6b8e78] text-[11px] font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        u.role === "Super Admin" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                        u.role === "Admin"       ? "bg-green-50 text-green-700 border border-green-200" :
                        u.role === "Manager"     ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                                   "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {u.status === "active" ? "✓ Active" : "⏸ Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6b8e78] font-medium">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          u.status === "active"
                            ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                            : "bg-[#1e5631] text-white hover:bg-[#163f24]"
                        }`}
                      >
                        {u.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2efe6] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-3">
              <h3 className="text-[#143623] font-black text-lg">Create New Admin User</h3>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  placeholder="e.g. Ramesh Kumar"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-semibold text-[#143623]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="ramesh@kravemicrogreens.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1">Login Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1">Admin Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-bold text-[#143623]"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Super Admin">Super Admin (Owner)</option>
                  <option value="Manager">Operations Manager</option>
                  <option value="Editor">Content Editor</option>
                </select>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium p-3 rounded-xl">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1e5631] hover:bg-[#163f24] disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm"
                >
                  {submitting ? "Creating Account…" : "Create & Enable Login →"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-3 bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] font-bold text-sm rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
