"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

export type ActivityType =
  | "insight"
  | "report"
  | "share"
  | "settings"
  | "login"
  | "export"
  | "comment";

export interface HistoryActivity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  detail?: string;
  timestamp: Date;
  user?: string;
  meta?: string;
}

const TYPE_META: Record<
  ActivityType,
  { label: string; bg: string; color: string }
> = {
  insight: { label: "Insight", bg: "#d4edd9", color: "#1f5c2e" },
  report: { label: "Report", bg: "#e8f4fd", color: "#1565c0" },
  share: { label: "Shared", bg: "#f3e8ff", color: "#6b21a8" },
  settings: { label: "Settings", bg: "#fef3cd", color: "#856404" },
  login: { label: "Login", bg: "#f0f9f2", color: "#4a6e54" },
  export: { label: "Export", bg: "#e8f4fd", color: "#1565c0" },
  comment: { label: "Comment", bg: "#fff4e5", color: "#b45309" },
};

interface HistoryTimelineItemProps {
  activity: HistoryActivity;
  icon: React.ReactNode;
  isLast?: boolean;
}

export default function HistoryTimelineItem({
  activity,
  icon,
  isLast = false,
}: HistoryTimelineItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const meta = TYPE_META[activity.type];

  const timeStr = activity.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Stack direction="row" spacing={2} alignItems="stretch">
      {/* Spine column */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          pt: 1.5,
        }}
      >
        {/* Icon bubble */}
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            bgcolor: meta.bg,
            border: "2px solid",
            borderColor: meta.color + "33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: meta.color,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          {icon}
        </Box>

        {/* Vertical connector */}
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              minHeight: 16,
              bgcolor: "#ddeee1",
              mt: 0.75,
              mb: 0,
              borderRadius: 1,
            }}
          />
        )}
      </Box>

      {/* White tile card */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 2 }}>
        <Card
          variant="outlined"
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2.5,
            boxShadow: "0 1px 4px rgba(10,31,15,0.06)",
            transition: "box-shadow 0.18s",
            "&:hover": {
              boxShadow: "0 4px 14px rgba(10,31,15,0.10)",
            },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Title + chip row */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {activity.title}
                  </Typography>
                  <Chip
                    label={meta.label}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      bgcolor: meta.bg,
                      color: meta.color,
                    }}
                  />
                </Stack>

                {/* Description */}
                {activity.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.55 }}
                  >
                    {activity.description}
                  </Typography>
                )}

                {/* Meta tag */}
                {activity.meta && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {activity.meta}
                  </Typography>
                )}

                {/* Expandable detail */}
                {activity.detail && (
                  <>
                    <Collapse in={expanded}>
                      <Box
                        sx={{
                          mt: 1.25,
                          p: 1.5,
                          bgcolor: "#f5faf6",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ lineHeight: 1.65 }}
                        >
                          {activity.detail}
                        </Typography>
                      </Box>
                    </Collapse>
                    <Tooltip title={expanded ? "Show less" : "Show more"}>
                      <IconButton
                        size="small"
                        onClick={() => setExpanded((v) => !v)}
                        sx={{
                          mt: 0.5,
                          color: "text.disabled",
                          p: 0.25,
                          "& svg": {
                            transition: "transform 0.2s",
                            transform: expanded ? "rotate(180deg)" : "none",
                          },
                        }}
                      >
                        <ExpandMoreRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>

              {/* Timestamp */}
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ flexShrink: 0, fontSize: "0.7rem", mt: 0.25 }}
              >
                {timeStr}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
