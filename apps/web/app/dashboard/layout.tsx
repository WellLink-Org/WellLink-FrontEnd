// app/dashboard/layout.tsx
import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import {
  DashboardLayout,
  ThemeRegistry,
} from "../../components/Dashboard/components";
import { auth0 } from "../../lib/auth0";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  return (
    <AppRouterCacheProvider>
      <ThemeRegistry>
        <DashboardLayout userDetails={session?.user}>
          {children}
        </DashboardLayout>
      </ThemeRegistry>
    </AppRouterCacheProvider>
  );
}
