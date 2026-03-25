"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

import HistoryIcon from "@mui/icons-material/History";
import {
  ActivityType,
  HistoryActivity,
} from "../../../components/Dashboard/components/History/HistoryTimelineItem";
import {
  EmptyState,
  SectionHeader,
} from "../../../components/Dashboard/components";
import HistoryFilterBar from "../../../components/Dashboard/components/History/HistoryFilterBar";
import HistoryDayGroup from "../../../components/Dashboard/components/History/HistoryDayGroup";

// ─── Mock data ──────────────────────────────────────────────────────────────
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

function ts(base: Date, h: number, m = 0) {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

const ALL_ACTIVITIES: HistoryActivity[] = [
  {
    id: "a1",
    type: "login",
    title: "Signed in",
    description: "Session started from Chrome on macOS.",
    timestamp: ts(today, 9, 4),
  },
  {
    id: "a2",
    type: "insight",
    title: "AI insight generated",
    description: "Conversion rate drop analysis completed.",
    detail:
      "The AI identified that step 3 of onboarding (plan selection) has a 68% exit rate. Root cause: the pricing page loads 2.1s slower on mobile. Recommended action: lazy-load the pricing comparison table.",
    timestamp: ts(today, 9, 22),
    meta: "6 recommendations • 2 high priority",
  },
  {
    id: "a3",
    type: "share",
    title: "Dashboard shared",
    description: "Shared with Sarah Johnson and Marcus Chen.",
    timestamp: ts(today, 10, 45),
    meta: "2 recipients",
  },
  {
    id: "a4",
    type: "report",
    title: "Monthly report viewed",
    description: "Opened the April 2024 performance report.",
    timestamp: ts(today, 11, 30),
  },
  {
    id: "a5",
    type: "export",
    title: "Data exported",
    description: "Exported sessions chart as CSV.",
    timestamp: ts(today, 14, 12),
    meta: "CSV · 48 KB",
  },
  // Yesterday
  {
    id: "b1",
    type: "login",
    title: "Signed in",
    description: "Session started from Safari on iPhone.",
    timestamp: ts(yesterday, 8, 31),
  },
  {
    id: "b2",
    type: "settings",
    title: "Dashboard settings updated",
    description: "Reordered components: moved Sessions Chart to top.",
    timestamp: ts(yesterday, 9, 0),
    detail:
      "Changed layout: Sessions Chart ↑, Page Views ↑, Product Tree removed from view.",
  },
  {
    id: "b3",
    type: "insight",
    title: "Explored AI insight",
    description: "Asked AI agent about Brazil market opportunity.",
    detail:
      'Conversation: "Tell me more about the Brazil opportunity" → AI returned 3 actionable recommendations including a localised pricing tier suggestion.',
    timestamp: ts(yesterday, 10, 18),
  },
  {
    id: "b4",
    type: "comment",
    title: "Note added",
    description: 'Added note to Sessions Chart: "Check EU CDN config."',
    timestamp: ts(yesterday, 11, 55),
  },
  {
    id: "b5",
    type: "export",
    title: "Report exported",
    description: "Downloaded Q1 summary as PDF.",
    timestamp: ts(yesterday, 15, 40),
    meta: "PDF · 2.4 MB",
  },
  // Two days ago
  {
    id: "c1",
    type: "login",
    title: "Signed in",
    description: "Session started from Chrome on Windows.",
    timestamp: ts(twoDaysAgo, 9, 10),
  },
  {
    id: "c2",
    type: "report",
    title: "Analytics page reviewed",
    description: "Spent 12 minutes on the analytics dashboard.",
    timestamp: ts(twoDaysAgo, 9, 22),
  },
  {
    id: "c3",
    type: "share",
    title: "Dashboard shared",
    description: "Shared with Emily Davis, Robert Kim, and Ana Martins.",
    timestamp: ts(twoDaysAgo, 11, 5),
    meta: "3 recipients",
  },
  {
    id: "c4",
    type: "settings",
    title: "Profile updated",
    description: "Changed notification preferences.",
    timestamp: ts(twoDaysAgo, 14, 30),
  },
];

function groupByDay(activities: HistoryActivity[]) {
  const map = new Map<string, HistoryActivity[]>();
  for (const a of activities) {
    const key = a.timestamp.toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return map;
}

export default function HistoryPage() {
  const [filter, setFilter] = React.useState<ActivityType | "all">("all");
  const [search, setSearch] = React.useState("");

  const filtered = ALL_ACTIVITIES.filter((a) => {
    const matchesType = filter === "all" || a.type === filter;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const grouped = groupByDay(filtered);
  const days = Array.from(grouped.entries()).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <Box>
      <SectionHeader
        title="History"
        subtitle="A log of everything you've done in WellLink"
      />

      <HistoryFilterBar activeFilter={filter} onFilterChange={setFilter} />

      {days.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon sx={{ fontSize: 40 }} />}
          title="No activity found"
          description="Try adjusting your filters or search term."
        />
      ) : (
        days.map(([dateStr, activities]) => {
          const date = new Date(dateStr);
          const isToday = date.toDateString() === today.toDateString();
          return (
            <HistoryDayGroup
              key={dateStr}
              date={date}
              activities={activities}
              isToday={isToday}
            />
          );
        })
      )}

      <Divider sx={{ mt: 2, mb: 2 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
      >
        Copyright © WellLink {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
