import { AppRouter } from "@/app/router";
import { DevToolbar } from "@/components/DevToolbar";
import { AuthProvider } from "@/utils/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />

        {import.meta.env.DEV && (
          <>
            <ReactQueryDevtools />
            <DevToolbar />
          </>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
