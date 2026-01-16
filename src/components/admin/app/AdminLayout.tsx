import { Link, Outlet, useLocation } from "react-router-dom";
import AdminAside from "../UI/AdminAside";
import AdminTopbar from "../UI/AdminTopbar";

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      <AdminAside />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
