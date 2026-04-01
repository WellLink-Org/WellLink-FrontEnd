"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { dashboardAPI } from "../../../../../app/api/client/dashboardAPI";

const HABIT_META: Record<
  string,
  { label: string; color: string; goal?: number; unit?: string }
> = {
  standMinutes: {
    label: "Stand Hours",
    color: "#2980b9",
    goal: 720,
    unit: "min",
  },
  mindfulMinutes: {
    label: "Mindfulness",
    color: "#8e44ad",
    goal: 10,
    unit: "min",
  },
  handwashing: { label: "Handwashing", color: "#1abc9c", unit: "sessions" },
  toothbrushing: {
    label: "Tooth Brushing",
    color: "#e67e22",
    goal: 2,
    unit: "sessions",
  },
};

interface DataPoint {
  sampled_at: string;
  recorded_date: string;
  value: number;
}

interface Props {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: DataPoint[];
}

function groupByDay(data: DataPoint[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const d of data) {
    const key = d.recorded_date ?? d.sampled_at?.slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + (d.value ?? 1));
  }
  return map;
}

function getStreak(dayMap: Map<string, number>, goal?: number): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const val = dayMap.get(key) ?? 0;
    const met = goal ? val >= goal : val > 0;
    if (!met) break;
    streak++;
  }
  return streak;
}

function DotGrid({
  dayMap,
  meta,
  days = 28,
}: {
  dayMap: Map<string, number>;
  meta: (typeof HABIT_META)[string];
  days?: number;
}) {
  const today = new Date();
  const grid = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().slice(0, 10);
    const val = dayMap.get(key) ?? 0;
    const met = meta.goal ? val >= meta.goal : val > 0;
    return { key, date: d, val, met };
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "4px",
        mt: 1.5,
      }}
    >
      {grid.map(({ key, date, val, met }) => (
        <Tooltip
          key={key}
          title={`${date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })}: ${val} ${meta.unit ?? ""}`}
        >
          <Box
            sx={{
              width: "100%",
              paddingTop: "100%",
              borderRadius: 1,
              bgcolor: met ? meta.color : "action.hover",
              opacity: met ? 1 : 0.5,
              cursor: "default",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

export default function HabitStreakWidget({
  dataType,
  sizeVariant = "small",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  const meta = HABIT_META[dataType] ?? { label: dataType, color: "#1f5c2e" };

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    dashboardAPI
      .getWidgetData(dataType, "28")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, previewData]);

  const dayMap = groupByDay(data);
  const streak = getStreak(dayMap, meta.goal);
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayVal = dayMap.get(todayKey) ?? 0;
  const showDots = sizeVariant !== "small";

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="30%" height={40} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={80} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{
            textTransform: "uppercase",
            letterSpacing: 0.6,
            fontSize: "0.65rem",
          }}
        >
          {meta.label}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 0.5 }}
        >
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
            >
              {todayVal > 0
                ? meta.goal
                  ? `${Math.round(todayVal)}`
                  : todayVal
                : "—"}
            </Typography>
            {meta.unit && (
              <Typography variant="caption" color="text.secondary">
                {meta.unit}
              </Typography>
            )}
          </Stack>
          {streak > 0 && (
            <Chip
              icon={
                <LocalFireDepartmentRoundedIcon
                  sx={{
                    fontSize: "0.9rem !important",
                    color: "#e67e22 !important",
                  }}
                />
              }
              label={`${streak} day streak`}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 700,
                fontSize: "0.68rem",
                height: 22,
                borderColor: "#e67e22",
                color: "#e67e22",
              }}
            />
          )}
        </Stack>

        {meta.goal && (
          <Box sx={{ mt: 1 }}>
            <Box
              sx={{
                height: 4,
                bgcolor: "action.hover",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${Math.min((todayVal / meta.goal) * 100, 100)}%`,
                  bgcolor: meta.color,
                  borderRadius: 2,
                  transition: "width 0.5s ease",
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {todayVal} / {meta.goal} {meta.unit} today
            </Typography>
          </Box>
        )}

        {showDots && <DotGrid dayMap={dayMap} meta={meta} days={28} />}
      </CardContent>
    </Card>
  );
}
