import type { ReactNode } from "react";
import { getSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/admin-shell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect("/dang-nhap?next=/admin");
  }

  if (!isAdmin(session.user.role)) {
    redirect("/");
  }

  return <AdminShell email={session.user.email}>{children}</AdminShell>;
}
