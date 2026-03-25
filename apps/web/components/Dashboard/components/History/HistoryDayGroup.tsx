"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import HistoryTimelineItem, {
  ActivityType,
  HistoryActivity,
} from "./HistoryTimelineItem";

const ICON_MAP: Record<ActivityType, React.ReactNode> = {
  insight: <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />,
  report: <BarChartRoundedIcon sx={{ fontSize: 16 }} />,
  share: <SendRoundedIcon sx={{ fontSize: 16, transform: "rotate(-45deg)" }} />,
  settings: <SettingsRoundedIcon sx={{ fontSize: 16 }} />,
  login: <LoginRoundedIcon sx={{ fontSize: 16 }} />,
  export: <FileDownloadRoundedIcon sx={{ fontSize: 16 }} />,
  comment: <CommentRoundedIcon sx={{ fontSize: 16 }} />,
};

export interface HistoryDayGroupProps {
  date: Date;
  activities: HistoryActivity[];
  isToday?: boolean;
}

export default function HistoryDayGroup({
  date,
  activities,
  isToday,
}: HistoryDayGroupProps) {
  const label = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

  return (
    <Box sx={{ mb: 4 }}>
      {/* Day header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          {label}
        </Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
        <Chip
          label={`${activities.length} action${activities.length !== 1 ? "s" : ""}`}
          size="small"
          sx={{
            height: 18,
            fontSize: "0.62rem",
            fontWeight: 600,
            bgcolor: "#f0f9f2",
            color: "text.secondary",
          }}
        />
      </Stack>

      {/* Timeline items */}
      <Box>
        {activities.map((activity, idx) => (
          <HistoryTimelineItem
            key={activity.id}
            activity={activity}
            icon={ICON_MAP[activity.type]}
            isLast={idx === activities.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
}
