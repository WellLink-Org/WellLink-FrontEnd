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
import Divider from "@mui/material/Divider";
import { LineChart } from "@mui/x-charts/LineChart";

interface DataPoint {
  sampled_at: string;
  value: number;
}

interface Props {
  dataType: string; // any of weight, bmi, bodyFat, height, leanBodyMass, waistCircumference
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
}

function getBMICategory(bmi: number): {
  label: string;
  color: "success" | "warning" | "error" | "default";
} {
  if (bmi < 18.5) return { label: "Underweight", color: "warning" };
  if (bmi < 25) return { label: "Healthy", color: "success" };
  if (bmi < 30) return { label: "Overweight", color: "warning" };
  return { label: "Obese", color: "error" };
}

const METRICS = [
  { key: "weight", label: "Weight", unit: "kg", digits: 1 },
  { key: "bmi", label: "BMI", unit: "", digits: 1 },
  { key: "bodyFat", label: "Body Fat", unit: "%", digits: 1 },
  { key: "leanBodyMass", label: "Lean Mass", unit: "kg", digits: 1 },
  { key: "waistCircumference", label: "Waist", unit: "cm", digits: 0 },
];

export default function BodyCompositionWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
}: Props) {
  const [values, setValues] = useState<Record<string, DataPoint[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      METRICS.map((m) =>
        fetch(`/api/dashboard/widget-data?dataType=${m.key}&days=30`)
          .then((r) => r.json())
          .then((d) => [m.key, d] as const),
      ),
    )
      .then((entries) => {
        setValues(Object.fromEntries(entries));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const weightData = values["weight"] ?? [];
  const weightVals = weightData.map((d) => d.value).filter(Boolean);
  const latestWeight = weightVals.at(-1) ?? null;
  const latestBMI = (values["bmi"] ?? []).at(-1)?.value ?? null;
  const latestFat = (values["bodyFat"] ?? []).at(-1)?.value ?? null;
  const bmiCat = latestBMI ? getBMICategory(latestBMI) : null;

  const showChart = sizeVariant !== "small" && weightVals.length > 1;
  const chartH = sizeVariant === "large" ? 180 : 140;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="30%" height={48} sx={{ mt: 0.5 }} />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} flex={1} height={60} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

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
          Body Composition
        </Typography>

        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          sx={{ mt: 0.5, mb: 1.5 }}
        >
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
            >
              {latestWeight?.toFixed(1) ?? "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              kg
            </Typography>
          </Stack>
          {bmiCat && (
            <Chip
              label={`BMI ${latestBMI?.toFixed(1)} · ${bmiCat.label}`}
              size="small"
              color={bmiCat.color}
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: "0.68rem", height: 20 }}
            />
          )}
        </Stack>

        {/* Metric grid */}
        <Stack direction="row" spacing={0} sx={{ mb: showChart ? 1.5 : 0 }}>
          {METRICS.filter((m) => m.key !== "weight").map((m, i) => {
            const latest = (values[m.key] ?? []).at(-1)?.value ?? null;
            return (
              <React.Fragment key={m.key}>
                {i > 0 && <Divider orientation="vertical" flexItem />}
                <Box sx={{ flex: 1, textAlign: "center", px: 0.75 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {latest !== null
                      ? m.key === "waistCircumference"
                        ? (latest * 100).toFixed(m.digits)
                        : latest.toFixed(m.digits)
                      : "—"}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {m.unit}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.62rem" }}
                  >
                    {m.label}
                  </Typography>
                </Box>
              </React.Fragment>
            );
          })}
        </Stack>

        {showChart && weightVals.length > 1 && (
          <>
            <Divider sx={{ mb: 1 }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Weight trend (30 days)
            </Typography>
            <Box sx={{ height: chartH, mx: -0.5 }}>
              <LineChart
                xAxis={[
                  {
                    data: weightVals.map((_, i) => i),
                    tickLabelStyle: { display: "none" },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: { fontSize: 10, fill: "#7a9e84" },
                    tickNumber: 3,
                    min: Math.floor(Math.min(...weightVals) - 1),
                    max: Math.ceil(Math.max(...weightVals) + 1),
                  },
                ]}
                series={[
                  {
                    data: weightVals,
                    color: "#1f5c2e",
                    showMark: false,
                    curve: "natural",
                  },
                ]}
                height={chartH}
                margin={{ left: 40, right: 8, top: 8, bottom: 4 }}
                sx={{
                  "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                    stroke: "#ddeee1",
                  },
                }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
