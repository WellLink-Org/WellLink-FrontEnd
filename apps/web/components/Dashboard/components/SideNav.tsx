"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import HistoryIcon from "@mui/icons-material/History";
import Logo from "../../Logo/Logo";
import UserProfile from "./UserProfile";
import { User } from "@auth0/nextjs-auth0/types";

export const DRAWER_WIDTH = 240;

export const mainNavItems = [
  {
    label: "Home",
    icon: <HomeRoundedIcon fontSize="small" />,
    href: "/dashboard",
  },
  {
    label: "Insights",
    icon: <AutoAwesomeRoundedIcon fontSize="small" />,
    href: "/dashboard/insights",
  },
  {
    label: "Network",
    icon: <PeopleRoundedIcon fontSize="small" />,
    href: "/dashboard/network",
  },
  {
    label: "History",
    icon: <HistoryIcon fontSize="small" />,
    href: "/dashboard/history",
  },
];

export const secondaryNavItems = [
  {
    label: "Settings",
    icon: <SettingsRoundedIcon fontSize="small" />,
    href: "/dashboard/settings",
  },
  {
    label: "About",
    icon: <InfoRoundedIcon fontSize="small" />,
    href: "/dashboard/about",
  },
  {
    label: "Feedback",
    icon: <HelpRoundedIcon fontSize="small" />,
    href: "/dashboard/feedback",
  },
];

interface SideNavProps {
  open?: boolean;
  onClose?: () => void;
  variant?: "permanent" | "temporary";
  userDetails?: User;
}

function NavList({ items }: { items: typeof mainNavItems }) {
  const pathname = usePathname();

  return (
    <List dense sx={{ px: 1 }}>
      {items.map((item) => (
        <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            href={item.href}
            selected={pathname === item.href}
            sx={{
              borderRadius: 0.6,
              py: 0.8,
              gap: 1,
              alignItems: "center",
              display: "flex",
            }}
          >
            <ListItemIcon sx={{ minWidth: 30 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: { fontSize: "0.875rem", fontWeight: 500 },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

function DrawerContent({ userDetails }: { userDetails?: User }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo />
        </Link>
      </Box>
      {/* Main nav */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <NavList items={mainNavItems} />
        <Divider sx={{ my: 1, mx: 1 }} />
        <NavList items={secondaryNavItems} />
      </Box>

      <Divider />

      {/* User profile */}
      <UserProfile
        name={userDetails?.name}
        email={userDetails?.email}
        picture={userDetails?.picture}
      />
    </Box>
  );
}

export default function SideNav({
  open,
  onClose,
  variant = "permanent",
  userDetails,
}: SideNavProps) {
  return (
    <Drawer
      variant={variant}
      open={variant === "temporary" ? open : true}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <DrawerContent userDetails={userDetails} />
    </Drawer>
  );
}
