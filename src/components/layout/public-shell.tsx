import { SiteHeader, type HeaderUser } from "./site-header";
import { SiteFooter } from "./site-footer";
import { getCurrentUser } from "@/lib/auth";

export async function PublicShell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const current = await getCurrentUser();
  const user: HeaderUser = current
    ? { id: current.id, name: current.profile?.full_name || current.email, avatarUrl: current.profile?.avatar_url, roles: current.roles }
    : null;
  return (
    <>
      <SiteHeader user={user} dark={dark} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
