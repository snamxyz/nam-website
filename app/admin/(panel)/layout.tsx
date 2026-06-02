import Link from "next/link";
import { logoutAction } from "../actions";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-nam-border bg-nam-dark/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-semibold text-nam-green">
              NAM Admin
            </Link>
            <nav className="flex gap-4 text-sm text-foreground/70">
              <Link href="/admin" className="transition hover:text-foreground">
                Campaigns
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-nam-border px-3 py-1.5 text-sm transition hover:bg-white/5"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </>
  );
}
