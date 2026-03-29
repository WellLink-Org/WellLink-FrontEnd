"use client";
// SymptomSeverityWidget
import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";

const SYMPTOM_LABELS: Record<string, string> = {
  symptomFatigue: "Fatigue",
  symptomHeadache: "Headache",
  symptomNausea: "Nausea",
  symptomFever: "Fever",
  symptomChills: "Chills",
  symptomCoughing: "Coughing",
  symptomSoreThroat: "Sore Throat",
  symptomShortnessOfBreath: "Breathlessness",
  symptomDizziness: "Dizziness",
  symptomBodyAche: "Body Ache",
  symptomSleepChanges: "Sleep Changes",
  symptomLossOfSmell: "Loss of Smell",
  symptomLossOfTaste: "Loss of Taste",
};

const SEVERITY_COLOR = ["#f0f9f2", "#c8e6c9", "#ffcc80", "#ef9a9a", "#e53935"];

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

export function SymptomSeverityWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
  previewData,
}: Props) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
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

  const dayMap = new Map<string, number>();
  for (const d of data) {
    const key = d.recorded_date ?? d.sampled_at?.slice(0, 10);
    if (!dayMap.has(key) || d.value > (dayMap.get(key) ?? 0))
      dayMap.set(key, d.value);
  }

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, date: d, val: dayMap.get(key) ?? 0 };
  });

  const latest = days.at(-1)?.val ?? 0;
  const label = SYMPTOM_LABELS[dataType] ?? dataType;

  if (loading)
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="100%" height={60} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
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
            {label}
          </Typography>
          {latest > 0 && (
            <Chip
              label={
                ["None", "Mild", "Moderate", "Severe", "Very Severe"][
                  Math.min(latest, 4)
                ]
              }
              size="small"
              color={
                latest >= 3 ? "error" : latest >= 2 ? "warning" : "default"
              }
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
            />
          )}
        </Stack>

        {latest === 0 && (
          <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
            No symptoms today
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: "3px", flexWrap: "nowrap" }}>
          {days.map(({ key, date, val }) => (
            <Tooltip
              key={key}
              title={`${date.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}: Severity ${val}`}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: SEVERITY_COLOR[Math.min(val, 4)],
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "default",
                }}
              />
            </Tooltip>
          ))}
        </Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.6rem" }}
          >
            14 days ago
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.6rem" }}
          >
            Today
          </Typography>
        </Stack>

        {sizeVariant !== "small" && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}
          >
            {["None", "Mild", "Moderate", "Severe"].map((lbl, i) => (
              <Stack
                key={lbl}
                direction="row"
                alignItems="center"
                spacing={0.5}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 1,
                    bgcolor: SEVERITY_COLOR[i],
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.6rem" }}
                >
                  {lbl}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------

interface EventDataPoint {
  sampled_at: string;
  ended_at: string;
  type: string;
}

interface EventProps {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: EventDataPoint[];
}

const EVENT_META: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  highHeartRateEvents: {
    label: "High Heart Rate",
    color: "#e74c3c",
    icon: "↑",
  },
  lowHeartRateEvents: { label: "Low Heart Rate", color: "#3498db", icon: "↓" },
  irregularHeartEvents: {
    label: "Irregular Heart",
    color: "#e67e22",
    icon: "~",
  },
};

export function EventTimelineWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
  previewData,
}: EventProps) {
  const [data, setData] = useState<EventDataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  const meta = EVENT_META[dataType] ?? {
    label: dataType,
    color: "#888",
    icon: "!",
  };

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=${dataType}&days=30`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, previewData]);

  const events = data.slice(-8).reverse();

  if (loading)
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width="100%" height={32} sx={{ mt: 0.75 }} />
          ))}
        </CardContent>
      </Card>
    );

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5 }}
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
          <Chip
            label={`${data.length} events / 30d`}
            size="small"
            color={
              data.length === 0
                ? "success"
                : data.length > 5
                  ? "error"
                  : "warning"
            }
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: "0.68rem", height: 20 }}
          />
        </Stack>

        {events.length === 0 ? (
          <Typography variant="body2" color="success.main">
            No events detected
          </Typography>
        ) : (
          events.map((e, i) => {
            const start = new Date(e.sampled_at);
            const end = e.ended_at ? new Date(e.ended_at) : null;
            const dur = end
              ? Math.round((end.getTime() - start.getTime()) / 60000)
              : null;
            return (
              <Stack
                key={i}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  py: 0.75,
                  borderBottom: i < events.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: `${meta.color}20`,
                    color: meta.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {meta.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {start.toLocaleDateString("en-GB", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {start.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {dur ? ` · ${dur} min` : ""}
                  </Typography>
                </Box>
              </Stack>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------

interface AudioProps {
  dataType: string; // environmentalAudio | headphoneAudio
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: DataPoint[];
}

const AUDIO_META: Record<
  string,
  { label: string; color: string; safeMax: number }
> = {
  environmentalAudio: {
    label: "Environmental Noise",
    color: "#8e44ad",
    safeMax: 70,
  },
  headphoneAudio: { label: "Headphone Audio", color: "#2980b9", safeMax: 80 },
};

export function AudioExposureWidget({
  dataType,
  sizeVariant = "small",
  editMode,
  previewData,
}: AudioProps) {
  const [data, setData] = useState<DataPoint[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);
  const meta = AUDIO_META[dataType] ?? {
    label: dataType,
    color: "#888",
    safeMax: 75,
  };

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=${dataType}&days=7`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType, previewData]);

  const values = data.map((d) => d.value).filter(Boolean);
  const avg = values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;
  const peak = values.length ? Math.max(...values) : null;
  const isSafe = avg !== null && avg < meta.safeMax;

  if (loading)
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={40} sx={{ mt: 0.5 }} />
          <Skeleton width="100%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );

  const pct = avg ? Math.min((avg / 110) * 100, 100) : 0;

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
          alignItems="baseline"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
          >
            {avg !== null ? avg.toFixed(0) : "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            dB avg
          </Typography>
        </Stack>
        {peak && (
          <Typography variant="caption" color="text.secondary">
            Peak: {peak.toFixed(0)} dB · Safe limit: {meta.safeMax} dB
          </Typography>
        )}

        {/* dB gauge */}
        <Box sx={{ mt: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              height: 8,
              borderRadius: 4,
              overflow: "hidden",
              background:
                "linear-gradient(to right, #27ae60 0%, #f39c12 60%, #e74c3c 100%)",
            }}
          >
            <Box sx={{ position: "relative", height: "100%" }}>
              <Box
                sx={{
                  position: "absolute",
                  left: `calc(${pct}% - 2px)`,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 1,
                  transition: "left 0.5s ease",
                }}
              />
            </Box>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 0.25 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.6rem" }}
            >
              0 dB
            </Typography>
            <Typography
              variant="caption"
              color={isSafe ? "success.main" : "error.main"}
              fontWeight={600}
              sx={{ fontSize: "0.65rem" }}
            >
              {isSafe ? "Safe" : "Too Loud"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.6rem" }}
            >
              110 dB
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------

interface ReprodProps {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
}

const REPROD_LABELS: Record<string, string> = {
  menstrualFlow: "Menstrual Flow",
  ovulationTest: "Ovulation Test",
  cervicalMucus: "Cervical Mucus",
  sexualActivity: "Sexual Activity",
  pregnancy: "Pregnancy",
  lactation: "Lactation",
};

export function ReproductiveLogWidget({
  dataType,
  sizeVariant = "medium",
  editMode,
}: ReprodProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=${dataType}&days=35`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dataType]);

  const dayMap = new Map<string, number>();
  for (const d of data) {
    const key = d.recorded_date ?? d.sampled_at?.slice(0, 10);
    dayMap.set(key, d.value ?? 1);
  }

  const today = new Date();
  const weeks = Array.from({ length: 5 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (34 - (w * 7 + d)));
      const key = date.toISOString().slice(0, 10);
      return { key, date, val: dayMap.get(key) ?? 0 };
    }),
  );

  if (loading)
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="100%" height={100} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );

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
          {REPROD_LABELS[dataType] ?? dataType}
        </Typography>

        {/* Calendar grid */}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              mb: "2px",
            }}
          >
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <Typography
                key={i}
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center", fontSize: "0.6rem" }}
              >
                {d}
              </Typography>
            ))}
          </Box>
          {weeks.map((week, wi) => (
            <Box
              key={wi}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "2px",
                mb: "2px",
              }}
            >
              {week.map(({ key, date, val }) => (
                <Tooltip
                  key={key}
                  title={`${date.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}: ${val > 0 ? "Recorded" : "None"}`}
                >
                  <Box
                    sx={{
                      paddingTop: "100%",
                      borderRadius: 0.75,
                      bgcolor: val > 0 ? "#e84393" : "action.hover",
                      opacity: val > 0 ? 0.8 + val * 0.05 : 0.4,
                      cursor: "default",
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
