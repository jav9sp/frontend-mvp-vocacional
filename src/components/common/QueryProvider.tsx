import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

// Añadido manejo de 401 en caso de token expirado
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any) => {
      if (err?.status === 401) {
        window.location.href = "/login";
      }
    },
  }),
});

export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
