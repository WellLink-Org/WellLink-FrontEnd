"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { dashboardAPI } from "../../../../../app/api/client/dashboardAPI";

const DAILY_GOAL_L = 2.5;

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

function Ring({ pct, size = 100 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  const cx = size / 2,
    cy = size / 2;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#e8f4fd"
        strokeWidth={12}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={pct >= 100 ? "#27ae60" : "#2980b9"}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

export default function HydrationRingWidget({
  dataType,
  sizeVariant = "small",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    dashboardAPI
      .getWidgetData("dietaryWater", "1")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [previewData]);

  const today = new Date().toISOString().slice(0, 10);
  const todayLiters = data
    .filter((d) => (d.recorded_date ?? d.sampled_at?.slice(0, 10)) === today)
    .reduce((s, d) => s + (d.value ?? 0), 0);

  const pct = Math.round((todayLiters / DAILY_GOAL_L) * 100);
  const ringSize = sizeVariant === "large" ? 140 : 100;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent
          sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Skeleton variant="circular" width={100} height={100} />
          <Box>
            <Skeleton width={80} height={14} />
            <Skeleton width={60} height={40} />
          </Box>
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
            mb: 1,
            display: "block",
          }}
        >
          Hydration Today
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Ring pct={pct} size={ringSize} />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1 }}
              >
                {pct}%
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.6rem" }}
              >
                of goal
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
            >
              {todayLiters.toFixed(2)}L
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Goal: {DAILY_GOAL_L}L
            </Typography>
            <Typography
              variant="body2"
              color={pct >= 100 ? "success.main" : "text.secondary"}
              sx={{ mt: 0.5 }}
            >
              {pct >= 100
                ? "✓ Goal reached!"
                : `${(DAILY_GOAL_L - todayLiters).toFixed(2)}L remaining`}
            </Typography>
          </Box>
        </Stack>

        {sizeVariant !== "small" && (
          <Stack
            direction="row"
            justifyContent="space-around"
            sx={{
              mt: 2,
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {[
              { label: "Morning", val: "0.6L" },
              { label: "Afternoon", val: "1.2L" },
              {
                label: "Evening",
                val:
                  todayLiters > 1.8
                    ? `${(todayLiters - 1.8).toFixed(1)}L`
                    : "—",
              },
            ].map((s) => (
              <Box key={s.label} sx={{ textAlign: "center" }}>
                <Typography variant="body2" fontWeight={600}>
                  {s.val}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
