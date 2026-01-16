import { Link } from "react-router-dom";
import { getActiveHref } from "../../../utils/utils";

const path = location.pathname;

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/periods", label: "Periodos" },
  { href: "/admin/students", label: "Estudiantes" },
  // { href: "/admin/settings", label: "Configuración" },
];

const activeHref = getActiveHref(path, nav);

export default function AdminAside() {
  return (
    <>
      <aside className="w-65 border-r border-border bg-white sticky top-0 left-0 h-screen">
        <div className="px-4 py-4">
          <a href="/admin" className="text-lg font-extrabold tracking-tight">
            Portal Vocacional
          </a>
          <div className="mt-1 text-xs text-muted">Panel de administración</div>
        </div>

        <nav className="px-2 pb-4">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Menú
          </div>

          <div className="space-y-1">
            {nav.map((it) => {
              const active = it.href === activeHref;

              return (
                <Link
                  key={it.href}
                  to={it.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition
                    ${
                      active
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}>
                  {it.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-3 text-xs text-muted">
          v0.1 MVP
        </div>
      </aside>
    </>
  );
}
