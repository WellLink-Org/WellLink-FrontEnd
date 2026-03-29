"use client";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Link from "next/link";
import type { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WidgetRenderer, {
  DATA_TYPE_TO_WIDGET,
  SizeVariant,
  WidgetType,
} from "../../components/Dashboard/components/Home/WidgetRenderer";
import { SectionHeader } from "../../components/Dashboard/components";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ReactGridLayout = require("react-grid-layout");
const ResponsiveGrid = ReactGridLayout.ResponsiveGridLayout;

// Size variant → grid dimensions (12-col grid, 80px row height)
const SIZE_MAP: Record<
  SizeVariant,
  { w: number; h: number; minW: number; minH: number }
> = {
  small: { w: 3, h: 3, minW: 2, minH: 2 },
  medium: { w: 4, h: 4, minW: 3, minH: 3 },
  large: { w: 6, h: 5, minW: 4, minH: 4 },
  wide: { w: 8, h: 4, minW: 6, minH: 3 },
};

// Widget type → allowed size variants
const ALLOWED_SIZES: Record<WidgetType, SizeVariant[]> = {
  stat_sparkline: ["small", "medium"],
  line_chart: ["medium", "large", "wide"],
  bar_chart: ["medium", "large", "wide"],
  range_gauge: ["small", "medium"],
  sleep_bands: ["wide", "large"],
  workout_log: ["medium", "large", "wide"],
  event_timeline: ["small", "medium"],
  symptom_severity: ["small", "medium"],
  dietary_breakdown: ["medium", "large", "wide"],
  hydration_ring: ["small", "medium"],
  body_composition: ["medium", "large", "wide"],
  reproductive_log: ["small", "medium"],
  audio_exposure: ["small", "medium"],
  habit_streak: ["small", "medium"],
  vital_panel: ["small", "medium", "large"],
};

// Readable labels for data types in the Add Widget dialog
const DATA_TYPE_LABELS: Record<string, { label: string; category: string }> = {
  steps: { label: "Steps", category: "Activity" },
  distanceWalkingRunning: {
    label: "Walk / Run Distance",
    category: "Activity",
  },
  distanceCycling: { label: "Cycling Distance", category: "Activity" },
  distanceSwimming: { label: "Swimming Distance", category: "Activity" },
  flightsClimbed: { label: "Flights Climbed", category: "Activity" },
  activeEnergy: { label: "Active Energy", category: "Activity" },
  exerciseMinutes: { label: "Exercise Minutes", category: "Activity" },
  workouts: { label: "Workout Log", category: "Activity" },
  heartRate: { label: "Heart Rate", category: "Heart" },
  restingHeartRate: { label: "Resting Heart Rate", category: "Heart" },
  hrv: { label: "Heart Rate Variability", category: "Heart" },
  highHeartRateEvents: { label: "High HR Events", category: "Heart" },
  irregularHeartEvents: { label: "Irregular Heart", category: "Heart" },
  oxygenSaturation: { label: "Blood Oxygen", category: "Vitals" },
  respiratoryRate: { label: "Respiratory Rate", category: "Vitals" },
  bloodPressureSystolic: { label: "Blood Pressure", category: "Vitals" },
  bloodGlucose: { label: "Blood Glucose", category: "Vitals" },
  bodyTemperature: { label: "Body Temperature", category: "Vitals" },
  weight: { label: "Body Composition", category: "Body" },
  vo2Max: { label: "VO₂ Max", category: "Body" },
  sleep: { label: "Sleep", category: "Wellness" },
  mindfulMinutes: { label: "Mindfulness", category: "Wellness" },
  dietaryCalories: { label: "Nutrition & Macros", category: "Nutrition" },
  dietaryWater: { label: "Hydration", category: "Nutrition" },
  environmentalAudio: { label: "Environmental Noise", category: "Environment" },
  headphoneAudio: { label: "Headphone Audio", category: "Environment" },
  symptomFatigue: { label: "Fatigue", category: "Symptoms" },
  symptomHeadache: { label: "Headache", category: "Symptoms" },
  menstrualFlow: { label: "Menstrual Cycle", category: "Reproductive" },
};

// Deduplicate: body composition and dietary breakdown are single widgets for multiple types
const DEDUPED_WIDGET_TYPES = new Set([
  "bloodPressureDiastolic",
  "bmi",
  "bodyFat",
  "height",
  "leanBodyMass",
  "waistCircumference",
  "dietaryCarbs",
  "dietaryProtein",
  "dietaryFat",
  "dietaryFiber",
  "dietarySugar",
  "dietarySodium",
  "basalEnergy",
  "standMinutes",
  "pushCount",
  "swimmingStrokes",
  "distanceCycling",
  "distanceSwimming",
]);

export interface DashboardWidget {
  id: string;
  widgetType: WidgetType;
  dataType: string;
  sizeVariant: SizeVariant;
  x: number;
  y: number;
  w: number;
  h: number;
}

function toLayout(widgets: DashboardWidget[], editMode: boolean): Layout[] {
  return widgets.map((w) => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
    minW: SIZE_MAP[w.sizeVariant].minW,
    minH: SIZE_MAP[w.sizeVariant].minH,
    static: !editMode,
    isDraggable: editMode,
    isResizable: editMode,
  }));
}

// ───────────────────────────────────────────────────────────────────────────
// Widget wrapper — shown in edit mode with controls
// ───────────────────────────────────────────────────────────────────────────
function WidgetWrapper({
  widget,
  editMode,
  onRemove,
  onSizeChange,
}: {
  widget: DashboardWidget;
  editMode: boolean;
  onRemove: (id: string) => void;
  onSizeChange: (id: string, size: SizeVariant) => void;
}) {
  const allowed = ALLOWED_SIZES[widget.widgetType] ?? ["small", "medium"];

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      {editMode && (
        <>
          {/* Drag handle */}
          <Box
            className="drag-handle"
            sx={{
              position: "absolute",
              top: 6,
              left: 6,
              zIndex: 20,
              cursor: "grab",
              color: "text.disabled",
              display: "flex",
              alignItems: "center",
              "&:active": { cursor: "grabbing" },
            }}
          >
            <DragIndicatorRoundedIcon fontSize="small" />
          </Box>

          {/* Size + remove controls */}
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              zIndex: 20,
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              bgcolor: "background.paper",
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
            }}
          >
            {allowed.map((size) => (
              <Chip
                key={size}
                label={size[0].toUpperCase()}
                size="small"
                variant={widget.sizeVariant === size ? "filled" : "outlined"}
                color={widget.sizeVariant === size ? "primary" : "default"}
                onClick={() => onSizeChange(widget.id, size)}
                sx={{
                  height: 20,
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  px: 0.25,
                }}
              />
            ))}
            <IconButton
              size="small"
              onClick={() => onRemove(widget.id)}
              sx={{ p: 0.25, color: "error.main" }}
            >
              <CloseRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Edit overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              borderRadius: 1,
              border: "2px dashed",
              borderColor: "primary.light",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <Box sx={{ height: "100%" }}>
        <WidgetRenderer
          widgetType={widget.widgetType}
          dataType={widget.dataType}
          sizeVariant={widget.sizeVariant}
          editMode={editMode}
        />
      </Box>
    </Box>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Add Widget Dialog
// ───────────────────────────────────────────────────────────────────────────
function AddWidgetDialog({
  open,
  existing,
  onClose,
  onAdd,
}: {
  open: boolean;
  existing: Set<string>;
  onClose: () => void;
  onAdd: (dataType: string) => void;
}) {
  const available = Object.entries(DATA_TYPE_LABELS)
    .filter(([dt]) => !DEDUPED_WIDGET_TYPES.has(dt))
    .sort(
      ([, a], [, b]) =>
        a.category.localeCompare(b.category) || a.label.localeCompare(b.label),
    );

  const categories = [...new Set(available.map(([, m]) => m.category))];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2, maxHeight: "70vh" } } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Add Widget
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 0, pb: 1 }}>
        {categories.map((cat) => (
          <Box key={cat}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
              sx={{
                px: 2.5,
                pt: 1.5,
                pb: 0.25,
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                fontSize: "0.65rem",
              }}
            >
              {cat}
            </Typography>
            <List disablePadding dense>
              {available
                .filter(([, m]) => m.category === cat)
                .map(([dt, meta]) => {
                  const alreadyAdded = existing.has(dt);
                  return (
                    <ListItem key={dt} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          onAdd(dt);
                          onClose();
                        }}
                        disabled={alreadyAdded}
                        sx={{
                          px: 2.5,
                          py: 0.75,
                          "&:hover": { bgcolor: "#f0f9f2" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={500}>
                              {meta.label}
                            </Typography>
                          }
                        />
                        {alreadyAdded && (
                          <CheckRoundedIcon
                            fontSize="small"
                            sx={{ color: "success.main" }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ───────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const layoutRef = useRef<Layout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container width for ResponsiveGridLayout
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]!.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Load dashboard on mount
  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data?.widgets) setWidgets(data.widgets);
      })
      .catch(console.error);
  }, []);

  const handleLayoutChange = useCallback((layout: Layout[]) => {
    layoutRef.current = layout;
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const layout = layoutRef.current;
      const updated = widgets.map((w) => {
        const l = layout.find((l) => l.i === w.id);
        return l ? { ...w, x: l.x, y: l.y, w: l.w, h: l.h } : w;
      });
      await fetch("/api/dashboard/widgets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgets: updated }),
      });
      setWidgets(updated);
      setEditMode(false);
      setToast({ open: true, message: "Dashboard saved", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to save", severity: "error" });
    } finally {
      setSaving(false);
    }
  }, [widgets]);

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const handleSizeChange = useCallback((id: string, size: SizeVariant) => {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const dims = SIZE_MAP[size];
        return { ...w, sizeVariant: size, w: dims.w, h: dims.h };
      }),
    );
  }, []);

  const handleAddWidget = useCallback((dataType: string) => {
    const widgetType = DATA_TYPE_TO_WIDGET[dataType];
    if (!widgetType) return;
    const defaultSize: SizeVariant = ALLOWED_SIZES[widgetType][0];
    const dims = SIZE_MAP[defaultSize];
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      widgetType,
      dataType,
      sizeVariant: defaultSize,
      x: 0,
      y: Infinity,
      w: dims.w,
      h: dims.h,
    };
    setWidgets((prev) => [...prev, newWidget]);
  }, []);

  const existingDataTypes = new Set(widgets.map((w) => w.dataType));

  const layouts = {
    lg: toLayout(widgets, editMode),
    md: toLayout(widgets, editMode),
    sm: toLayout(widgets, editMode),
  };

  return (
    <Box>
      <SectionHeader
        title="Dashboard"
        subtitle={`Last synced ${new Date().toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" })}`}
        action={
          <Stack direction="row" spacing={1}>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => setAddOpen(true)}
                >
                  Add Widget
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckRoundedIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Layout"}
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setEditMode(false)}
                  sx={{ color: "text.secondary" }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditRoundedIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Layout
                </Button>
                <Link
                  href="/dashboard/insights"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AutoAwesomeRoundedIcon />}
                  >
                    Get Insights
                  </Button>
                </Link>
              </>
            )}
          </Stack>
        }
      />

      {editMode && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
          Drag widgets to rearrange · Use <strong>S / M / L / W</strong> buttons
          to resize · Click <strong>×</strong> to remove
        </Alert>
      )}

      <Box
        ref={containerRef}
        sx={{
          "& .react-grid-item.react-grid-placeholder": {
            bgcolor: "primary.light",
            opacity: 0.2,
            borderRadius: 1,
          },
          "& .react-resizable-handle": {
            display: editMode ? "block" : "none",
            "&::after": { borderColor: "primary.main !important" },
          },
        }}
      >
        <ResponsiveGrid
          width={containerWidth}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 900, sm: 600, xs: 400 }}
          cols={{ lg: 12, md: 8, sm: 4, xs: 2 }}
          rowHeight={80}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          isDraggable={editMode}
          isResizable={editMode}
          draggableHandle=".drag-handle"
          useCSSTransforms
        >
          {widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetWrapper
                widget={widget}
                editMode={editMode}
                onRemove={handleRemoveWidget}
                onSizeChange={handleSizeChange}
              />
            </div>
          ))}
        </ResponsiveGrid>
      </Box>

      {widgets.length === 0 && !editMode && (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your dashboard is empty
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditMode(true);
              setAddOpen(true);
            }}
          >
            Add Your First Widget
          </Button>
        </Box>
      )}

      <Divider sx={{ mt: 4, mb: 2 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
      >
        Copyright © WellLink {new Date().getFullYear()}
      </Typography>

      <AddWidgetDialog
        open={addOpen}
        existing={existingDataTypes}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddWidget}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 1 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
