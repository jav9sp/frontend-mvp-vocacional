import { BrowserRouter } from "react-router-dom";
import QueryProvider from "../common/QueryProvider";
import AdminGate from "./app/AdminGate";
import AdminRouter from "../../routers/AdminRouter";

export default function AdminApp() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AdminGate>
          <AdminRouter />
        </AdminGate>
      </BrowserRouter>
    </QueryProvider>
  );
}
