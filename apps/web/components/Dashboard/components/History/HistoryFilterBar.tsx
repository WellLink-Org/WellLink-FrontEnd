"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { ActivityType } from "./HistoryTimelineItem";

const FILTERS: { label: string; value: ActivityType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Insights", value: "insight" },
  { label: "Reports", value: "report" },
  { label: "Shared", value: "share" },
  { label: "Exports", value: "export" },
  { label: "Settings", value: "settings" },
];

interface HistoryFilterBarProps {
  activeFilter: ActivityType | "all";
  onFilterChange: (f: ActivityType | "all") => void;
}

export default function HistoryFilterBar({
  activeFilter,
  onFilterChange,
}: HistoryFilterBarProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
      spacing={1.5}
      sx={{ mb: 3 }}
    >
      {/* Filter chips */}
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <Chip
              key={f.value}
              label={f.label}
              size="small"
              onClick={() => onFilterChange(f.value)}
              sx={{
                fontWeight: 600,
                fontSize: "0.78rem",
                height: 28,
                bgcolor: isActive ? "primary.main" : "background.paper",
                color: isActive ? "#fff" : "text.secondary",
                border: "1px solid",
                borderColor: isActive ? "primary.main" : "divider",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isActive ? "primary.dark" : "#f0f9f2",
                  borderColor: "primary.main",
                  color: isActive ? "#fff" : "primary.main",
                },
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
