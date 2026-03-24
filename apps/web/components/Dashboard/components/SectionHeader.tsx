"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** Optional icon-button group rendered as a pill toolbar next to the action */
  toolbar?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  toolbar,
}: SectionHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1.5}
      sx={{ mb: 3 }}
    >
      <Stack direction="row" spacing={1} alignItems="start">
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary", lineHeight: 0.8 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.25, display: "block" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {toolbar && <ToolbarPill>{toolbar}</ToolbarPill>}
      </Stack>

      {action && <Box>{action}</Box>}
    </Stack>
  );
}

/** Wraps icon buttons in a subtle bordered pill that matches the green theme */
function ToolbarPill({ children }: { children: React.ReactNode }) {
  // Collect children as an array so we can inject dividers between them
  const items = React.Children.toArray(children);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        height: 34,
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(10,31,15,0.06)",
        "& .MuiIconButton-root": {
          borderRadius: 0,
          height: 34,
          width: 36,
          color: "text.secondary",
          transition: "background 0.15s, color 0.15s",
          "&:hover": {
            bgcolor: "#f0f9f2",
            color: "primary.main",
          },
        },
      }}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < items.length - 1 && <Divider orientation="vertical" flexItem />}
        </React.Fragment>
      ))}
    </Stack>
  );
}
