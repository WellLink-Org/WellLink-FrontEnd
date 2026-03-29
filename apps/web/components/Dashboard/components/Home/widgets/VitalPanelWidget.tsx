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
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { LineChart } from "@mui/x-charts/LineChart";

interface DataPoint {
  sampled_at: string;
  value: number;
}

interface Props {
  dataType: string; // 'bloodPressureSystolic' — widget fetches both
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewSystolic?: DataPoint[];
  previewDiastolic?: DataPoint[];
}

function getBPCategory(
  sys: number,
  dia: number,
): { label: string; color: "success" | "warning" | "error" } {
  if (sys < 120 && dia < 80) return { label: "Normal", color: "success" };
  if (sys < 130 && dia < 80) return { label: "Elevated", color: "warning" };
  if (sys < 140 || dia < 90) return { label: "High Stage 1", color: "warning" };
  return { label: "High Stage 2", color: "error" };
}

export default function VitalPanelWidget({
  dataType,
  sizeVariant = "small",
  editMode,
  previewSystolic,
  previewDiastolic,
}: Props) {
  const [systolic, setSystolic] = useState<DataPoint[]>(previewSystolic ?? []);
  const [diastolic, setDiastolic] = useState<DataPoint[]>(
    previewDiastolic ?? [],
  );
  const [loading, setLoading] = useState(!previewSystolic);

  useEffect(() => {
    if (previewSystolic) return;
    setLoading(true);
    Promise.all([
      fetch(
        `/api/dashboard/widget-data?dataType=bloodPressureSystolic&days=14`,
      ).then((r) => r.json()),
      fetch(
        `/api/dashboard/widget-data?dataType=bloodPressureDiastolic&days=14`,
      ).then((r) => r.json()),
    ])
      .then(([sys, dia]) => {
        setSystolic(sys);
        setDiastolic(dia);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [previewSystolic]);

  const sysValues = systolic.map((d) => d.value).filter(Boolean);
  const diaValues = diastolic.map((d) => d.value).filter(Boolean);
  const latestSys = sysValues.at(-1) ?? null;
  const latestDia = diaValues.at(-1) ?? null;
  const category =
    latestSys && latestDia ? getBPCategory(latestSys, latestDia) : null;

  const avgSys = sysValues.length
    ? Math.round(sysValues.reduce((a, b) => a + b, 0) / sysValues.length)
    : null;
  const avgDia = diaValues.length
    ? Math.round(diaValues.reduce((a, b) => a + b, 0) / diaValues.length)
    : null;

  const showChart = sizeVariant !== "small" && sysValues.length > 1;
  const chartH = sizeVariant === "large" ? 180 : 140;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="50%" height={56} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={24} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
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
            Blood Pressure
          </Typography>
          {category && (
            <Chip
              icon={
                category.color === "success" ? (
                  <CheckCircleOutlineRoundedIcon
                    sx={{ fontSize: "0.8rem !important" }}
                  />
                ) : (
                  <WarningAmberRoundedIcon
                    sx={{ fontSize: "0.8rem !important" }}
                  />
                )
              }
              label={category.label}
              size="small"
              color={category.color}
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
            />
          )}
        </Stack>

        {/* Big reading */}
        <Stack
          direction="row"
          alignItems="flex-end"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: "2.2rem",
              lineHeight: 1,
            }}
          >
            {latestSys ?? "—"}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontSize: "1.5rem",
              color: "text.secondary",
              lineHeight: 1.2,
            }}
          >
            /{latestDia ?? "—"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.25 }}
          >
            mmHg
          </Typography>
        </Stack>

        {avgSys && avgDia && (
          <Typography variant="caption" color="text.secondary">
            14-day avg: {avgSys}/{avgDia} mmHg
          </Typography>
        )}

        {/* Reference bands */}
        <Box sx={{ mt: 1.5, mb: 0.5 }}>
          {[
            { label: "Normal", range: "< 120/80", color: "success.main" },
            { label: "Elevated", range: "120–129/<80", color: "warning.main" },
            { label: "High", range: "≥ 130/80", color: "error.main" },
          ].map((band) => (
            <Stack
              key={band.label}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 0.25 }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: band.color,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                <strong>{band.label}</strong> {band.range}
              </Typography>
            </Stack>
          ))}
        </Box>

        {showChart && sysValues.length > 1 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ height: chartH, mx: -0.5 }}>
              <LineChart
                xAxis={[
                  {
                    data: sysValues.map((_, i) => i),
                    tickLabelStyle: { display: "none" },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: { fontSize: 10, fill: "#7a9e84" },
                    tickNumber: 3,
                  },
                ]}
                series={[
                  {
                    data: sysValues,
                    color: "#c0392b",
                    showMark: false,
                    curve: "natural",
                    label: "Systolic",
                  },
                  {
                    data: diaValues,
                    color: "#2980b9",
                    showMark: false,
                    curve: "natural",
                    label: "Diastolic",
                  },
                ]}
                height={chartH}
                margin={{ left: 40, right: 8, top: 8, bottom: 4 }}
                legend={{ hidden: true }}
                sx={{
                  "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                    stroke: "#ddeee1",
                  },
                }}
              />
            </Box>
            {/* Custom legend */}
            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
              {[
                { label: "Systolic", color: "#c0392b" },
                { label: "Diastolic", color: "#2980b9" },
              ].map((s) => (
                <Stack
                  key={s.label}
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 1,
                      bgcolor: s.color,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {s.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
