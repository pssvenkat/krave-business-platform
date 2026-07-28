import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.auth.admin.listUsers();
    if (!error && data?.users && data.users.length > 0) {
      const formatted = data.users.map((u) => ({
        id: u.id,
        email: u.email ?? "",
        fullName: (u.user_metadata?.full_name as string) || u.email?.split("@")[0] || "Admin User",
        role: (u.user_metadata?.role as string) || "Admin",
        status: "active",
        createdAt: u.created_at,
      }));
      return NextResponse.json({ users: formatted });
    }
  } catch {
    // ignore
  }

  // Fallback default mock users
  return NextResponse.json({
    users: [
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
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, role } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Try Supabase Auth Admin API
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: role || "Admin" },
    });

    if (createError) {
      // 2. Fallback to standard auth signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role: role || "Admin" },
        },
      });

      if (signUpError) {
        return NextResponse.json({ error: signUpError.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: signUpData.user?.id || `u_${Date.now()}`,
          email,
          fullName,
          role: role || "Admin",
          status: "active",
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.user.id,
        email: userData.user.email ?? email,
        fullName,
        role: role || "Admin",
        status: "active",
        createdAt: userData.user.created_at,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
