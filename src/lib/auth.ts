import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type CurrentUser = {
  id: string;
  email: string;
  roles: AppRole[];
  profile: Profile | null;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);
  return {
    id: user.id,
    email: user.email ?? "",
    roles: (roles ?? []).map((r) => r.role),
    profile: profile ?? null,
  };
});

export async function requireUser(next?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

export async function requireRole(role: AppRole | AppRole[], next?: string): Promise<CurrentUser> {
  const user = await requireUser(next);
  const wanted = Array.isArray(role) ? role : [role];
  if (user.roles.includes("admin") || wanted.some((r) => user.roles.includes(r))) return user;
  redirect("/forbidden");
}

export function hasRole(user: CurrentUser | null, role: AppRole) {
  return !!user && (user.roles.includes(role) || user.roles.includes("admin"));
}
