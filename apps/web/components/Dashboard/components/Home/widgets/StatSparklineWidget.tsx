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
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
import { LineChart } from "@mui/x-charts/LineChart";

export const STAT_LABEL_MAP: Record<string, string> = {
  steps: "Steps",
  distanceWalkingRunning: "Walk / Run",
  distanceCycling: "Cycling",
  distanceSwimming: "Swimming",
  flightsClimbed: "Flights Climbed",
  pushCount: "Push Count",
  swimmingStrokes: "Strokes",
  restingHeartRate: "Resting HR",
  walkingHeartRate: "Walking HR",
  walkingSpeed: "Walking Speed",
  walkingStepLength: "Step Length",
  walkingAsymmetry: "Gait Asymmetry",
  vo2Max: "VO₂ Max",
  dietaryCaffeine: "Caffeine",
  dietaryCalcium: "Calcium",
  dietaryIron: "Iron",
  dietaryVitaminC: "Vitamin C",
  dietaryVitaminD: "Vitamin D",
};

export const STAT_UNIT_MAP: Record<string, string> = {
  steps: "steps",
  distanceWalkingRunning: "km",
  distanceCycling: "km",
  distanceSwimming: "km",
  flightsClimbed: "floors",
  pushCount: "reps",
  swimmingStrokes: "strokes",
  restingHeartRate: "bpm",
  walkingHeartRate: "bpm",
  walkingSpeed: "m/s",
  walkingStepLength: "cm",
  walkingAsymmetry: "%",
  vo2Max: "mL/kg/min",
  dietaryCaffeine: "mg",
  dietaryCalcium: "mg",
  dietaryIron: "mg",
  dietaryVitaminC: "mg",
  dietaryVitaminD: "IU",
};

export function formatStatValue(val: number | null, dataType: string): string {
  if (val === null || val === undefined) return "—";
  if (dataType === "steps") return val.toLocaleString();
  if (dataType.startsWith("distance")) return (val / 1000).toFixed(2);
  if (dataType === "walkingStepLength") return (val * 100).toFixed(1);
  if (dataType === "walkingAsymmetry") return val.toFixed(1);
  return val % 1 === 0 ? val.toString() : val.toFixed(1);
}

export function getTrend(values: number[]): "up" | "down" | "neutral" {
  if (values.length < 4) return "neutral";
  const half = Math.floor(values.length / 2);
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const pct =
    ((avg(values.slice(half)) - avg(values.slice(0, half))) /
      (avg(values.slice(0, half)) || 1)) *
    100;
  if (Math.abs(pct) < 2) return "neutral";
  return pct > 0 ? "up" : "down";
}

interface Props {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: { sampled_at: string; value: number }[];
}

export default function StatSparklineWidget({
  dataType,
  sizeVariant = "small",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<{ sampled_at: string; value: number }[]>(
    previewData ?? [],
  );
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=${dataType}&days=14`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, previewData]);

  const values = data.map((d) => d.value).filter((v) => v != null);
  const latest = values.at(-1) ?? null;
  const trend = getTrend(values);
  const prev = values.length > 1 ? (values.at(-2) ?? null) : null;
  const trendPct =
    latest !== null && prev
      ? (((latest - prev) / prev) * 100).toFixed(1)
      : null;
  const trendColor =
    trend === "up" ? "success" : trend === "down" ? "error" : "default";
  const TrendIcon =
    trend === "up"
      ? TrendingUpRoundedIcon
      : trend === "down"
        ? TrendingDownRoundedIcon
        : TrendingFlatRoundedIcon;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={40} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={64} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  const showSparkline = sizeVariant !== "small" && values.length > 1;

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
          {STAT_LABEL_MAP[dataType] ?? dataType}
        </Typography>
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          sx={{ mt: 0.5 }}
        >
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {formatStatValue(latest, dataType)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {STAT_UNIT_MAP[dataType]}
            </Typography>
          </Stack>
          {trendPct && (
            <Chip
              icon={<TrendIcon sx={{ fontSize: "0.8rem !important" }} />}
              label={`${trendPct}%`}
              size="small"
              color={trendColor as "success" | "error" | "default"}
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
            />
          )}
        </Stack>
        {showSparkline && values.length > 1 && (
          <Box sx={{ height: 64, mt: 1, mx: -0.5 }}>
            <LineChart
              xAxis={[
                {
                  data: values.map((_, i) => i),
                  tickLabelStyle: { display: "none" },
                },
              ]}
              yAxis={[{ tickLabelStyle: { display: "none" } }]}
              series={[
                {
                  data: values,
                  color: "#1f5c2e",
                  showMark: false,
                  curve: "natural",
                  area: true,
                },
              ]}
              height={64}
              margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
              sx={{
                "& .MuiAreaElement-root": { fill: "url(#sparkGr)" },
                "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                  display: "none",
                },
                "& .MuiChartsGrid-line": { display: "none" },
              }}
            >
              <defs>
                <linearGradient id="sparkGr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f5c2e" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#1f5c2e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
            </LineChart>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
