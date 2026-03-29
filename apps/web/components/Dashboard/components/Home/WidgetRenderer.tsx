"use client";
import * as React from "react";
import { lazy, Suspense } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// Lazy load each widget
const StatSparklineWidget = lazy(() => import("./widgets/StatSparklineWidget"));
const LineChartWidget = lazy(() => import("./widgets/LineChartWidget"));
const BarChartWidget = lazy(() => import("./widgets/BarChartWidget"));
const RangeGaugeWidget = lazy(() => import("./widgets/RangeGaugeWidget"));
const SleepBandsWidget = lazy(() => import("./widgets/SleepBandsWidget"));
const WorkoutLogWidget = lazy(() => import("./widgets/WorkoutLogWidget"));
const VitalPanelWidget = lazy(() => import("./widgets/VitalPanelWidget"));
const HabitStreakWidget = lazy(() => import("./widgets/HabitStreakWidget"));
const DietaryBreakdownWidget = lazy(
  () => import("./widgets/DietaryBreakdownWidget"),
);
const HydrationRingWidget = lazy(() => import("./widgets/HydrationRingWidget"));
const BodyCompositionWidget = lazy(
  () => import("./widgets/BodyCompositionWidget"),
);

const {
  SymptomSeverityWidget,
  EventTimelineWidget,
  AudioExposureWidget,
  ReproductiveLogWidget,
} = React.lazy
  ? {
      SymptomSeverityWidget: null,
      EventTimelineWidget: null,
      AudioExposureWidget: null,
      ReproductiveLogWidget: null,
    }
  : require("./widgets/SpecialtyWidgets");

// We import specialty widgets differently since they're named exports
const LazySymptomSeverity = lazy(() =>
  import("./widgets/SpecialtyWidgets").then((m) => ({
    default: m.SymptomSeverityWidget,
  })),
);
const LazyEventTimeline = lazy(() =>
  import("./widgets/SpecialtyWidgets").then((m) => ({
    default: m.EventTimelineWidget,
  })),
);
const LazyAudioExposure = lazy(() =>
  import("./widgets/SpecialtyWidgets").then((m) => ({
    default: m.AudioExposureWidget,
  })),
);
const LazyReproductiveLog = lazy(() =>
  import("./widgets/SpecialtyWidgets").then((m) => ({
    default: m.ReproductiveLogWidget,
  })),
);

export type WidgetType =
  | "stat_sparkline"
  | "line_chart"
  | "bar_chart"
  | "range_gauge"
  | "sleep_bands"
  | "workout_log"
  | "event_timeline"
  | "symptom_severity"
  | "dietary_breakdown"
  | "hydration_ring"
  | "body_composition"
  | "reproductive_log"
  | "audio_exposure"
  | "habit_streak"
  | "vital_panel";

export type SizeVariant = "small" | "medium" | "large" | "wide";

export const DATA_TYPE_TO_WIDGET: Record<string, WidgetType> = {
  steps: "stat_sparkline",
  distanceWalkingRunning: "stat_sparkline",
  distanceCycling: "stat_sparkline",
  distanceSwimming: "stat_sparkline",
  flightsClimbed: "stat_sparkline",
  pushCount: "stat_sparkline",
  swimmingStrokes: "stat_sparkline",
  activeEnergy: "bar_chart",
  basalEnergy: "bar_chart",
  exerciseMinutes: "bar_chart",
  standMinutes: "habit_streak",
  heartRate: "line_chart",
  restingHeartRate: "stat_sparkline",
  hrv: "line_chart",
  walkingHeartRate: "stat_sparkline",
  highHeartRateEvents: "event_timeline",
  lowHeartRateEvents: "event_timeline",
  irregularHeartEvents: "event_timeline",
  oxygenSaturation: "range_gauge",
  respiratoryRate: "range_gauge",
  bodyTemperature: "range_gauge",
  bloodGlucose: "line_chart",
  bloodPressureSystolic: "vital_panel",
  bloodPressureDiastolic: "vital_panel",
  weight: "body_composition",
  bmi: "body_composition",
  bodyFat: "body_composition",
  height: "body_composition",
  leanBodyMass: "body_composition",
  waistCircumference: "body_composition",
  walkingSpeed: "stat_sparkline",
  walkingStepLength: "stat_sparkline",
  walkingAsymmetry: "range_gauge",
  vo2Max: "stat_sparkline",
  sleep: "sleep_bands",
  mindfulMinutes: "habit_streak",
  environmentalAudio: "audio_exposure",
  headphoneAudio: "audio_exposure",
  handwashing: "habit_streak",
  toothbrushing: "habit_streak",
  dietaryCalories: "dietary_breakdown",
  dietaryCarbs: "dietary_breakdown",
  dietaryProtein: "dietary_breakdown",
  dietaryFat: "dietary_breakdown",
  dietaryFiber: "dietary_breakdown",
  dietarySugar: "dietary_breakdown",
  dietarySodium: "dietary_breakdown",
  dietaryWater: "hydration_ring",
  dietaryCaffeine: "stat_sparkline",
  dietaryCalcium: "stat_sparkline",
  dietaryIron: "stat_sparkline",
  dietaryVitaminC: "stat_sparkline",
  dietaryVitaminD: "stat_sparkline",
  symptomFatigue: "symptom_severity",
  symptomHeadache: "symptom_severity",
  symptomNausea: "symptom_severity",
  symptomFever: "symptom_severity",
  symptomChills: "symptom_severity",
  symptomCoughing: "symptom_severity",
  symptomSoreThroat: "symptom_severity",
  symptomShortnessOfBreath: "symptom_severity",
  symptomDizziness: "symptom_severity",
  symptomBodyAche: "symptom_severity",
  symptomSleepChanges: "symptom_severity",
  symptomLossOfSmell: "symptom_severity",
  symptomLossOfTaste: "symptom_severity",
  menstrualFlow: "reproductive_log",
  ovulationTest: "reproductive_log",
  cervicalMucus: "reproductive_log",
  sexualActivity: "reproductive_log",
  pregnancy: "reproductive_log",
  lactation: "reproductive_log",
  workouts: "workout_log",
};

function WidgetSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Skeleton width="50%" height={14} />
        <Skeleton width="35%" height={44} sx={{ mt: 0.5 }} />
        <Skeleton width="100%" height={100} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
}

function UnknownWidget({ dataType }: { dataType: string }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack alignItems="center" justifyContent="center" sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Unknown widget: {dataType}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface WidgetRendererProps {
  widgetType: WidgetType;
  dataType: string;
  sizeVariant?: SizeVariant;
  editMode?: boolean;
}

export default function WidgetRenderer({
  widgetType,
  dataType,
  sizeVariant = "medium",
  editMode,
}: WidgetRendererProps) {
  const commonProps = { dataType, sizeVariant, editMode };

  const content = (() => {
    switch (widgetType) {
      case "stat_sparkline":
        return <StatSparklineWidget {...commonProps} />;
      case "line_chart":
        return <LineChartWidget {...commonProps} />;
      case "bar_chart":
        return <BarChartWidget {...commonProps} />;
      case "range_gauge":
        return <RangeGaugeWidget {...commonProps} />;
      case "sleep_bands":
        return <SleepBandsWidget {...commonProps} />;
      case "workout_log":
        return <WorkoutLogWidget {...commonProps} />;
      case "vital_panel":
        return <VitalPanelWidget {...commonProps} />;
      case "habit_streak":
        return <HabitStreakWidget {...commonProps} />;
      case "dietary_breakdown":
        return <DietaryBreakdownWidget {...commonProps} />;
      case "hydration_ring":
        return <HydrationRingWidget {...commonProps} />;
      case "body_composition":
        return <BodyCompositionWidget {...commonProps} />;
      case "symptom_severity":
        return <LazySymptomSeverity {...commonProps} />;
      case "event_timeline":
        return <LazyEventTimeline {...commonProps} />;
      case "audio_exposure":
        return <LazyAudioExposure {...commonProps} />;
      case "reproductive_log":
        return <LazyReproductiveLog {...commonProps} />;
      default:
        return <UnknownWidget dataType={dataType} />;
    }
  })();

  return <Suspense fallback={<WidgetSkeleton />}>{content}</Suspense>;
}
