import QueryProvider from "../common/QueryProvider";
import AdminDashboard from "./AdminDashboard";

export default function AdminDashboardIsland() {
  return (
    <QueryProvider>
      <AdminDashboard />
    </QueryProvider>
  );
}
