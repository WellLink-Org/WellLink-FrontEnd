"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SettingsIcon from "@mui/icons-material/Settings";

// Lazy-load the actual components for preview
import dynamic from "next/dynamic";

const SessionsChart = dynamic(() => import("./SessionsChart"), { ssr: false });
const PageViewsChart = dynamic(() => import("./PageViewsChart"), {
  ssr: false,
});
const CountriesChart = dynamic(() => import("./CountriesChart"), {
  ssr: false,
});
const DetailsTable = dynamic(() => import("./DetailsTable"), { ssr: false });
const ProductTree = dynamic(() => import("./ProductTree"), { ssr: false });
const StatCard = dynamic(() => import("./StatCard"), { ssr: false });
const InsightCard = dynamic(() => import("./InsightCard"), { ssr: false });

const COMPONENTS = [
  {
    id: "sessions",
    name: "Sessions Chart",
    description: "Daily sessions over 30 days — line + area",
    icon: <ShowChartRoundedIcon fontSize="small" />,
    category: "Chart",
    preview: <SessionsChart />,
  },
  {
    id: "pageviews",
    name: "Page Views & Downloads",
    description: "Grouped bar chart across 6 months",
    icon: <BarChartRoundedIcon fontSize="small" />,
    category: "Chart",
    preview: <PageViewsChart />,
  },
  {
    id: "countries",
    name: "Users by Country",
    description: "Donut chart with country breakdown",
    icon: <PieChartRoundedIcon fontSize="small" />,
    category: "Chart",
    preview: <CountriesChart />,
  },
  {
    id: "details",
    name: "Details Table",
    description: "Users table with status and activity",
    icon: <TableChartRoundedIcon fontSize="small" />,
    category: "Table",
    preview: <DetailsTable />,
  },
  {
    id: "tree",
    name: "Product Tree",
    description: "Collapsible product structure tree",
    icon: <AccountTreeRoundedIcon fontSize="small" />,
    category: "Navigation",
    preview: <ProductTree />,
  },
  {
    id: "statcard",
    name: "Stat Card",
    description: "Key metric with trend indicator",
    icon: <DashboardRoundedIcon fontSize="small" />,
    category: "Card",
    preview: (
      <StatCard
        title="Users"
        value="14k"
        interval="Last 30 days"
        trend="up"
        trendLabel="+25%"
      />
    ),
  },
  {
    id: "insight",
    name: "Insight Card",
    description: "Green gradient promotional CTA card",
    icon: <AutoAwesomeRoundedIcon fontSize="small" />,
    category: "Card",
    preview: <InsightCard />,
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Chart: { bg: "#d4edd9", color: "#1f5c2e" },
  Table: { bg: "#e8f4fd", color: "#1565c0" },
  Navigation: { bg: "#fef3cd", color: "#856404" },
  Card: { bg: "#f3e8ff", color: "#6b21a8" },
};

interface DashboardSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSettingsDialog({
  open,
  onClose,
}: DashboardSettingsDialogProps) {
  const [activeId, setActiveId] = React.useState(COMPONENTS[0]?.id);

  const active = COMPONENTS.find((c) => c.id === activeId) ?? COMPONENTS[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: { borderRadius: "14px", height: "80vh", maxHeight: 640 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0, pt: 2, px: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SettingsIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Dashboard Settings
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "text.secondary" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.5}
        >
          Browse and preview available components
        </Typography>
      </DialogTitle>

      <Divider sx={{ mt: 1.5 }} />

      <DialogContent sx={{ p: 0, display: "flex", overflow: "hidden" }}>
        {/* Left — component list */}
        <Box
          sx={{
            width: 230,
            flexShrink: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            overflowY: "auto",
            bgcolor: "#f5faf6",
          }}
        >
          <List disablePadding dense>
            {COMPONENTS.map((comp) => {
              const isActive = comp.id === activeId;
              const catStyle =
                CATEGORY_COLORS[comp.category] ?? CATEGORY_COLORS.Card;
              return (
                <ListItem key={comp.id} disablePadding>
                  <ListItemButton
                    onClick={() => setActiveId(comp.id)}
                    selected={isActive}
                    sx={{
                      py: 1.25,
                      px: 2,
                      borderLeft: "3px solid",
                      borderLeftColor: isActive
                        ? "primary.main"
                        : "transparent",
                      bgcolor: isActive ? "#fff !important" : "transparent",
                      "&:hover": { bgcolor: "#eaf4ec" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: isActive ? "primary.main" : "text.secondary",
                      }}
                    >
                      {comp.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={isActive ? 700 : 500}
                          color={isActive ? "primary.main" : "text.primary"}
                          noWrap
                        >
                          {comp.name}
                        </Typography>
                      }
                    />
                    <Chip
                      label={comp.category}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        bgcolor: catStyle?.bg,
                        color: catStyle?.color,
                        ml: 0.5,
                      }}
                    />
                  </ListItemButton>
                  <Divider />
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Right — preview panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Preview header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "#d4edd9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                {active?.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {active?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {active?.description}
                </Typography>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <Chip
                  label={active?.category}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    bgcolor: CATEGORY_COLORS[active!.category]?.bg,
                    color: CATEGORY_COLORS[active!.category]?.color,
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Preview content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              bgcolor: "#f5faf6",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 2,
                boxShadow: "0 1px 4px rgba(10,31,15,0.06)",
              }}
            >
              {active?.preview}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
