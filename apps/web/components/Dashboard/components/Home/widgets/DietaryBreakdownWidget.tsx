"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import LinearProgress from "@mui/material/LinearProgress";
import { PieChart } from "@mui/x-charts/PieChart";

// These are all fetched together regardless of which one triggered the widget
const MACRO_CONFIG = [
  {
    key: "dietaryCarbs",
    label: "Carbs",
    color: "#e67e22",
    goal: 275,
    unit: "g",
  },
  {
    key: "dietaryProtein",
    label: "Protein",
    color: "#c0392b",
    goal: 56,
    unit: "g",
  },
  { key: "dietaryFat", label: "Fat", color: "#f1c40f", goal: 78, unit: "g" },
  {
    key: "dietaryFiber",
    label: "Fiber",
    color: "#27ae60",
    goal: 28,
    unit: "g",
  },
];

interface DataPoint {
  sampled_at: string;
  recorded_date: string;
  value: number;
}

interface Props {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
}

export default function DietaryBreakdownWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
}: Props) {
  const [macros, setMacros] = useState<Record<string, number>>({});
  const [calories, setCalories] = useState<number | null>(null);
  const [calGoal] = useState(2000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);

    Promise.all([
      fetch(`/api/dashboard/widget-data?dataType=dietaryCalories&days=1`).then(
        (r) => r.json(),
      ),
      ...MACRO_CONFIG.map((m) =>
        fetch(`/api/dashboard/widget-data?dataType=${m.key}&days=1`).then((r) =>
          r.json(),
        ),
      ),
    ])
      .then(([calData, ...macroDataArr]) => {
        const cal = calData.reduce(
          (s: number, d: DataPoint) => s + (d.value ?? 0),
          0,
        );
        setCalories(Math.round(cal));
        const result: Record<string, number> = {};
        MACRO_CONFIG.forEach((m, i) => {
          result[m.key] = Math.round(
            macroDataArr[i].reduce(
              (s: number, d: DataPoint) => s + (d.value ?? 0),
              0,
            ),
          );
        });
        setMacros(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pieData = MACRO_CONFIG.map((m) => ({
    id: m.key,
    value: macros[m.key] ?? 0,
    label: m.label,
    color: m.color,
  })).filter((d) => d.value > 0);

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="30%" height={40} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={120} sx={{ mt: 1.5 }} />
        </CardContent>
      </Card>
    );
  }

  const showPie = sizeVariant !== "small" && pieData.length > 0;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
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
          Nutrition Today
        </Typography>
        <Stack
          direction="row"
          alignItems="baseline"
          spacing={0.5}
          sx={{ mt: 0.25, mb: 1.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
          >
            {calories?.toLocaleString() ?? "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            / {calGoal.toLocaleString()} kcal
          </Typography>
        </Stack>

        {/* Calorie progress */}
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(((calories ?? 0) / calGoal) * 100, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#e74c3c",
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {showPie && (
          <Stack
            direction={sizeVariant === "wide" ? "row" : "column"}
            spacing={2}
            alignItems={sizeVariant === "wide" ? "center" : "stretch"}
          >
            <Box sx={{ height: 140, flexShrink: 0 }}>
              <PieChart
                series={[
                  {
                    data: pieData,
                    innerRadius: 35,
                    outerRadius: 60,
                    paddingAngle: 2,
                  },
                ]}
                height={140}
                width={140}
                legend={{ hidden: true }}
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              {MACRO_CONFIG.map((m) => {
                const val = macros[m.key] ?? 0;
                const pct = Math.min((val / m.goal) * 100, 100);
                return (
                  <Box key={m.key} sx={{ mb: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: 1,
                            bgcolor: m.color,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {m.label}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" fontWeight={600}>
                        {val}
                        {m.unit} / {m.goal}
                        {m.unit}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        mt: 0.25,
                        bgcolor: "action.hover",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: m.color,
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Stack>
        )}

        {!showPie && (
          <Stack spacing={0.75}>
            {MACRO_CONFIG.map((m) => {
              const val = macros[m.key] ?? 0;
              return (
                <Stack
                  key={m.key}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: 1,
                        bgcolor: m.color,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {m.label}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" fontWeight={600}>
                    {val}
                    {m.unit}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
