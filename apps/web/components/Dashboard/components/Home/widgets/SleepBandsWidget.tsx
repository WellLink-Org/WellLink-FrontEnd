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

const STAGE_CONFIG: Record<
  string,
  { label: string; color: string; order: number }
> = {
  awake: { label: "Awake", color: "#e74c3c", order: 0 },
  rem: { label: "REM", color: "#8e44ad", order: 1 },
  core: { label: "Core", color: "#2980b9", order: 2 },
  deep: { label: "Deep", color: "#1a3a5c", order: 3 },
  in_bed: { label: "In Bed", color: "#bdc3c7", order: 4 },
  asleep: { label: "Asleep", color: "#2980b9", order: 2 },
};

interface DataPoint {
  sampled_at: string;
  ended_at: string;
  value: number;
  stage: string;
  recorded_date: string;
}

interface DayData {
  date: string;
  segments: Array<{ stage: string; durationMin: number }>;
  totalMin: number;
}

interface Props {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: DataPoint[];
}

function groupSleepByDay(data: DataPoint[]): DayData[] {
  const map = new Map<string, Array<{ stage: string; durationMin: number }>>();

  for (const d of data) {
    const key = d.recorded_date ?? d.sampled_at?.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    const start = new Date(d.sampled_at).getTime();
    const end = d.ended_at
      ? new Date(d.ended_at).getTime()
      : start + 30 * 60 * 1000;
    const durationMin = Math.round((end - start) / 60000);
    map.get(key)!.push({ stage: d.stage ?? "asleep", durationMin });
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, segments]) => ({
      date,
      segments,
      totalMin: segments.reduce((s, seg) => s + seg.durationMin, 0),
    }));
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function SleepBar({ day }: { day: DayData }) {
  const maxMin = 540; // 9h reference
  const totalWidth = Math.min(day.totalMin / maxMin, 1) * 100;
  const stageGroups = new Map<string, number>();
  for (const seg of day.segments) {
    stageGroups.set(
      seg.stage,
      (stageGroups.get(seg.stage) ?? 0) + seg.durationMin,
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ width: 32, textAlign: "right", flexShrink: 0 }}
      >
        {new Date(day.date).toLocaleDateString("en-GB", { weekday: "short" })}
      </Typography>
      <Box
        sx={{
          flex: 1,
          height: 20,
          bgcolor: "action.hover",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", height: "100%", width: `${totalWidth}%` }}>
          {Array.from(stageGroups.entries())
            .sort(
              ([a], [b]) =>
                (STAGE_CONFIG[a]?.order ?? 9) - (STAGE_CONFIG[b]?.order ?? 9),
            )
            .map(([stage, min]) => {
              const pct = (min / day.totalMin) * 100;
              const cfg = STAGE_CONFIG[stage] ?? {
                color: "#95a5a6",
                label: stage,
              };
              return (
                <Tooltip
                  key={stage}
                  title={`${cfg.label}: ${formatHours(min)}`}
                >
                  <Box
                    sx={{
                      width: `${pct}%`,
                      bgcolor: cfg.color,
                      height: "100%",
                    }}
                  />
                </Tooltip>
              );
            })}
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ width: 44, flexShrink: 0 }}
      >
        {formatHours(day.totalMin)}
      </Typography>
    </Stack>
  );
}

export default function SleepBandsWidget({
  dataType,
  sizeVariant = "wide",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=sleep&days=7`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [previewData]);

  const days = groupSleepByDay(data);
  const lastNight = days.at(-1);
  const avgMin = days.length
    ? Math.round(days.reduce((s, d) => s + d.totalMin, 0) / days.length)
    : null;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="25%" height={48} sx={{ mt: 0.5 }} />
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} width="100%" height={24} sx={{ mt: 0.5 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Box>
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
              Sleep
            </Typography>
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={0.75}
              sx={{ mt: 0.25 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                }}
              >
                {lastNight ? formatHours(lastNight.totalMin) : "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                last night
              </Typography>
            </Stack>
            {avgMin && (
              <Typography variant="caption" color="text.secondary">
                7-day avg: {formatHours(avgMin)}
              </Typography>
            )}
          </Box>
          {/* Legend */}
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={0.75}
            justifyContent="flex-end"
            sx={{ maxWidth: 200 }}
          >
            {Object.entries(STAGE_CONFIG)
              .filter(([k]) => k !== "in_bed" && k !== "asleep")
              .map(([key, cfg]) => (
                <Stack
                  key={key}
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: 1,
                      bgcolor: cfg.color,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    {cfg.label}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Stack>

        {days.length > 0 ? (
          days.map((day) => <SleepBar key={day.date} day={day} />)
        ) : (
          <Typography variant="body2" color="text.secondary">
            No sleep data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
