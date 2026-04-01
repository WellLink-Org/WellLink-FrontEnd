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
import { BarChart } from "@mui/x-charts/BarChart";
import { dashboardAPI } from "../../../../../app/api/client/dashboardAPI";

const LABEL_MAP: Record<
  string,
  { label: string; unit: string; color: string; goal?: number }
> = {
  activeEnergy: {
    label: "Active Energy",
    unit: "kcal",
    color: "#e74c3c",
    goal: 500,
  },
  basalEnergy: { label: "Resting Energy", unit: "kcal", color: "#e67e22" },
  exerciseMinutes: {
    label: "Exercise Minutes",
    unit: "min",
    color: "#1f5c2e",
    goal: 30,
  },
  standMinutes: {
    label: "Stand Minutes",
    unit: "min",
    color: "#2980b9",
    goal: 720,
  },
  steps: { label: "Daily Steps", unit: "steps", color: "#1f5c2e", goal: 10000 },
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

function groupByDay(data: DataPoint[]): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const d of data) {
    const key = d.recorded_date ?? d.sampled_at?.slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + (d.value ?? 0));
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, value]) => ({
      label: new Date(date).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      }),
      value: Math.round(value),
    }));
}

export default function BarChartWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  const meta = LABEL_MAP[dataType] ?? {
    label: dataType,
    unit: "",
    color: "#1f5c2e",
  };

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    dashboardAPI
      .getWidgetData(dataType, "14")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, previewData]);

  const grouped = groupByDay(data);
  const values = grouped.map((g) => g.value);
  const labels = grouped.map((g) => g.label);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? Math.round(total / values.length) : null;
  const todayVal = values.at(-1) ?? null;
  const goalPct =
    meta.goal && todayVal
      ? Math.min(Math.round((todayVal / meta.goal) * 100), 100)
      : null;

  const chartH = sizeVariant === "large" ? 240 : 180;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton width="50%" height={14} />
          <Skeleton width="30%" height={48} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={chartH} sx={{ mt: 2 }} />
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
          sx={{ mb: 1.5 }}
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
              {meta.label}
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
                {todayVal !== null ? todayVal.toLocaleString() : "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {meta.unit} today
              </Typography>
            </Stack>
            {avg !== null && (
              <Typography variant="caption" color="text.secondary">
                14-day avg: {avg.toLocaleString()} {meta.unit}
              </Typography>
            )}
          </Box>
          {goalPct !== null && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Goal
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                color={goalPct >= 100 ? "success.main" : "text.primary"}
              >
                {goalPct}%
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Goal progress bar */}
        {meta.goal && todayVal !== null && (
          <Box sx={{ mb: 1.5 }}>
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
                  bgcolor:
                    goalPct && goalPct >= 100 ? "success.main" : meta.color,
                  borderRadius: 2,
                  transition: "width 0.6s ease",
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {todayVal.toLocaleString()} / {meta.goal.toLocaleString()}{" "}
              {meta.unit}
            </Typography>
          </Box>
        )}

        <Box sx={{ height: chartH }}>
          {values.length > 0 ? (
            <BarChart
              xAxis={[
                {
                  data: labels,
                  scaleType: "band",
                  tickLabelStyle: { fontSize: 10, fill: "#7a9e84" },
                  tickNumber: Math.min(7, labels.length),
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: { fontSize: 10, fill: "#7a9e84" },
                  tickNumber: 4,
                  valueFormatter: (v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v),
                },
              ]}
              series={[{ data: values, color: meta.color }]}
              height={chartH}
              margin={{ left: 40, right: 8, top: 4, bottom: 28 }}
              legend={{ hidden: true }}
              sx={{
                "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                  stroke: "#ddeee1",
                },
              }}
            />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <Typography variant="body2" color="text.secondary">
                No data available
              </Typography>
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
