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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { LineChart } from "@mui/x-charts/LineChart";
import { getTrend } from "./StatSparklineWidget";

const LABEL_MAP: Record<
  string,
  { label: string; unit: string; color: string }
> = {
  heartRate: { label: "Heart Rate", unit: "bpm", color: "#c0392b" },
  hrv: { label: "HRV", unit: "ms", color: "#8e44ad" },
  bloodGlucose: { label: "Blood Glucose", unit: "mg/dL", color: "#e67e22" },
  respiratoryRate: {
    label: "Respiratory Rate",
    unit: "br/min",
    color: "#2980b9",
  },
};

const DAYS_OPTIONS = [7, 14, 30];

interface DataPoint {
  sampled_at: string;
  value: number;
}

interface Props {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: DataPoint[];
}

export default function LineChartWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);
  const [days, setDays] = useState(14);

  const meta = LABEL_MAP[dataType] ?? {
    label: dataType,
    unit: "",
    color: "#1f5c2e",
  };

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=${dataType}&days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, days, previewData]);

  const values = data.map((d) => d.value).filter((v) => v != null);
  const labels = data.map((d) => {
    const date = new Date(d.sampled_at);
    return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
  });
  const latest = values.at(-1) ?? null;
  const avg = values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : null;
  const min = values.length ? Math.min(...values).toFixed(0) : null;
  const max = values.length ? Math.max(...values).toFixed(0) : null;
  const trend = getTrend(values);
  const chartH =
    sizeVariant === "large" ? 260 : sizeVariant === "wide" ? 200 : 180;

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
                {latest?.toFixed(0) ?? "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {meta.unit}
              </Typography>
              {avg !== null && (
                <Chip
                  label={`avg ${avg}`}
                  size="small"
                  variant="outlined"
                  color={
                    trend === "up"
                      ? "success"
                      : trend === "down"
                        ? "error"
                        : "default"
                  }
                  sx={{ fontWeight: 600, fontSize: "0.68rem", height: 20 }}
                />
              )}
            </Stack>
            {min && max && (
              <Typography variant="caption" color="text.secondary">
                Range: {min} – {max} {meta.unit}
              </Typography>
            )}
          </Box>
          {!editMode && (
            <ToggleButtonGroup
              size="small"
              value={days}
              exclusive
              onChange={(_, v) => v && setDays(v)}
              sx={{
                "& .MuiToggleButton-root": {
                  py: 0.25,
                  px: 1,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                },
              }}
            >
              {DAYS_OPTIONS.map((d) => (
                <ToggleButton key={d} value={d}>
                  {d}d
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Stack>
        <Box sx={{ height: chartH }}>
          {values.length > 1 ? (
            <LineChart
              xAxis={[
                {
                  data: labels,
                  scaleType: "point",
                  tickLabelStyle: { fontSize: 10, fill: "#7a9e84" },
                  tickNumber: Math.min(7, labels.length),
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: { fontSize: 10, fill: "#7a9e84" },
                  tickNumber: 4,
                },
              ]}
              series={[
                {
                  data: values,
                  color: meta.color,
                  showMark: false,
                  curve: "natural",
                  area: true,
                },
              ]}
              height={chartH}
              margin={{ left: 44, right: 8, top: 8, bottom: 28 }}
              sx={{
                "& .MuiAreaElement-root": {
                  fill: "url(#lineGrad)",
                  opacity: 0.3,
                },
                "& .MuiLineElement-root": { strokeWidth: 2 },
                "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                  stroke: "#ddeee1",
                },
              }}
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={meta.color} stopOpacity={0.25} />
                  <stop
                    offset="100%"
                    stopColor={meta.color}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
            </LineChart>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <Typography variant="body2" color="text.secondary">
                No data for this period
              </Typography>
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
