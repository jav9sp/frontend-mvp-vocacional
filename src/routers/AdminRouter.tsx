import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../components/admin/app/AdminLayout";
import DashboardPage from "../components/admin/pages/DashboardPage";
import PeriodsPage from "../components/admin/pages/PeriodsPage";
import PeriodDetailPage from "../components/admin/pages/PeriodDetailPage";

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="periods" element={<PeriodsPage />} />
        <Route path="periods/:id" element={<PeriodDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
