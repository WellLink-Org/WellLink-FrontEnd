"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import SideNav, { DRAWER_WIDTH } from "./SideNav";
import TopBar from "./TopBar";
import { User } from "@auth0/nextjs-auth0/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userDetails?: User;
}

export default function DashboardLayout({
  children,
  userDetails,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Desktop permanent sidebar */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <SideNav variant="permanent" userDetails={userDetails} />
      </Box>

      {/* Mobile temporary sidebar */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <SideNav
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          userDetails={userDetails}
        />
      </Box>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <TopBar onDrawerToggle={handleDrawerToggle} userDetails={userDetails} />

        {/* Content below AppBar */}
        <Box
          sx={{
            flex: 1,
            mt: "72px", // same as AppBar height
            p: { xs: 2, sm: 3 },
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
