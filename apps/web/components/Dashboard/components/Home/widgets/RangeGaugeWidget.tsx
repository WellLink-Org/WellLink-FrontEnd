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
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { LineChart } from "@mui/x-charts/LineChart";

interface RangeMeta {
  label: string;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  color: string;
  description: string;
}

const RANGE_META: Record<string, RangeMeta> = {
  oxygenSaturation: {
    label: "Blood Oxygen",
    unit: "%",
    min: 85,
    max: 100,
    normalMin: 95,
    normalMax: 100,
    color: "#2980b9",
    description: "Normal: 95–100%",
  },
  respiratoryRate: {
    label: "Respiratory Rate",
    unit: "br/min",
    min: 8,
    max: 30,
    normalMin: 12,
    normalMax: 20,
    color: "#1abc9c",
    description: "Normal: 12–20 br/min",
  },
  bodyTemperature: {
    label: "Body Temperature",
    unit: "°C",
    min: 35,
    max: 42,
    normalMin: 36.1,
    normalMax: 37.2,
    color: "#e67e22",
    description: "Normal: 36.1–37.2°C",
  },
  walkingAsymmetry: {
    label: "Gait Asymmetry",
    unit: "%",
    min: 0,
    max: 30,
    normalMin: 0,
    normalMax: 10,
    color: "#8e44ad",
    description: "Normal: < 10%",
  },
};

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

function GaugeBar({ value, meta }: { value: number | null; meta: RangeMeta }) {
  if (value === null) return null;
  const pct = Math.max(
    0,
    Math.min(100, ((value - meta.min) / (meta.max - meta.min)) * 100),
  );
  const normalStartPct =
    ((meta.normalMin - meta.min) / (meta.max - meta.min)) * 100;
  const normalWidthPct =
    ((meta.normalMax - meta.normalMin) / (meta.max - meta.min)) * 100;
  const isNormal = value >= meta.normalMin && value <= meta.normalMax;

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Box
        sx={{
          position: "relative",
          height: 12,
          bgcolor: "action.hover",
          borderRadius: 6,
          overflow: "visible",
        }}
      >
        {/* Normal band */}
        <Box
          sx={{
            position: "absolute",
            left: `${normalStartPct}%`,
            width: `${normalWidthPct}%`,
            height: "100%",
            bgcolor: "success.light",
            opacity: 0.4,
            borderRadius: 6,
          }}
        />
        {/* Marker */}
        <Box
          sx={{
            position: "absolute",
            left: `calc(${pct}% - 8px)`,
            top: -4,
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: isNormal ? "success.main" : "warning.main",
            border: "3px solid",
            borderColor: "background.paper",
            boxShadow: 1,
            transition: "left 0.5s ease",
          }}
        />
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {meta.min}
          {meta.unit}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {meta.max}
          {meta.unit}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function RangeGaugeWidget({
  dataType,
  sizeVariant = "small",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  const meta = RANGE_META[dataType];

  useEffect(() => {
    if (previewData || !meta) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=${dataType}&days=14`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, previewData]);

  if (!meta) return null;

  const values = data.map((d) => d.value).filter((v) => v != null);
  const latest = values.at(-1) ?? null;
  const isNormal =
    latest !== null && latest >= meta.normalMin && latest <= meta.normalMax;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={48} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={20} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const showHistory = sizeVariant !== "small" && values.length > 1;

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
            {meta.label}
          </Typography>
          {latest !== null && (
            <Chip
              icon={
                isNormal ? (
                  <CheckCircleOutlineRoundedIcon
                    sx={{ fontSize: "0.8rem !important" }}
                  />
                ) : (
                  <WarningAmberRoundedIcon
                    sx={{ fontSize: "0.8rem !important" }}
                  />
                )
              }
              label={isNormal ? "Normal" : "Attention"}
              size="small"
              color={isNormal ? "success" : "warning"}
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
            />
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="baseline"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
          >
            {latest !== null
              ? typeof latest === "number"
                ? latest.toFixed(1)
                : latest
              : "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {meta.unit}
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {meta.description}
        </Typography>

        <GaugeBar value={latest} meta={meta} />

        {showHistory && (
          <Box sx={{ height: 80, mt: 0.5, mx: -0.5 }}>
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
                  color: meta.color,
                  showMark: false,
                  curve: "natural",
                },
              ]}
              height={80}
              margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
              sx={{
                "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                  display: "none",
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
