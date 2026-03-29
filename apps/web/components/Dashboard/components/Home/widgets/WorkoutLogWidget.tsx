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
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import PoolRoundedIcon from "@mui/icons-material/PoolRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import SportsBasketballRoundedIcon from "@mui/icons-material/SportsBasketballRounded";

const WORKOUT_ICONS: Record<string, React.ReactElement> = {
  running: <DirectionsRunRoundedIcon />,
  cycling: <DirectionsBikeRoundedIcon />,
  swimming: <PoolRoundedIcon />,
  strength: <FitnessCenterRoundedIcon />,
  yoga: <SelfImprovementRoundedIcon />,
  walking: <DirectionsWalkRoundedIcon />,
  basketball: <SportsBasketballRoundedIcon />,
};

const WORKOUT_COLORS: Record<string, string> = {
  running: "#e74c3c",
  cycling: "#e67e22",
  swimming: "#2980b9",
  strength: "#8e44ad",
  yoga: "#27ae60",
  walking: "#1f5c2e",
  basketball: "#f39c12",
};

interface Workout {
  id: number;
  started_at: string;
  ended_at: string;
  type: string;
  duration_minutes: number;
  calories_kcal: number;
  distance_km: number;
  source: string;
}

interface Props {
  dataType: string;
  sizeVariant?: "small" | "medium" | "large" | "wide";
  editMode?: boolean;
  previewData?: Workout[];
}

function WorkoutRow({ workout }: { workout: Workout }) {
  const type = (workout.type ?? "other").toLowerCase();
  const icon = WORKOUT_ICONS[type] ?? <FitnessCenterRoundedIcon />;
  const color = WORKOUT_COLORS[type] ?? "#888";
  const date = new Date(workout.started_at);

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1 }}>
      <Avatar sx={{ width: 36, height: 36, bgcolor: `${color}20`, color }}>
        {React.cloneElement(icon, { sx: { fontSize: 18 } })}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ textTransform: "capitalize" }}
        >
          {workout.type ?? "Workout"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {date.toLocaleDateString("en-GB", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        {workout.duration_minutes && (
          <Chip
            label={`${Math.round(workout.duration_minutes)}m`}
            size="small"
            sx={{ height: 20, fontSize: "0.68rem", fontWeight: 600 }}
          />
        )}
        {workout.calories_kcal && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ minWidth: 50, textAlign: "right" }}
          >
            {Math.round(workout.calories_kcal)} kcal
          </Typography>
        )}
        {workout.distance_km && (
          <Typography variant="caption" color="text.secondary">
            {workout.distance_km.toFixed(1)} km
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default function WorkoutLogWidget({
  dataType,
  sizeVariant = "large",
  editMode,
  previewData,
}: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>(previewData ?? []);
  const [loading, setLoading] = useState(!previewData);

  const limit = sizeVariant === "small" ? 3 : sizeVariant === "medium" ? 4 : 6;

  useEffect(() => {
    if (previewData) return;
    setLoading(true);
    fetch(`/api/dashboard/widget-data?dataType=workouts&days=30`)
      .then((r) => r.json())
      .then((d) => {
        setWorkouts(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [previewData]);

  const shown = workouts.slice(-limit).reverse();
  const totalCalories = workouts.reduce(
    (s, w) => s + (w.calories_kcal ?? 0),
    0,
  );
  const totalWorkouts = workouts.length;

  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton width="40%" height={14} />
          {[...Array(4)].map((_, i) => (
            <Stack key={i} direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={12} />
              </Box>
            </Stack>
          ))}
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
          alignItems="center"
          sx={{ mb: 1 }}
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
              Workouts
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                }}
              >
                {totalWorkouts}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                this month
              </Typography>
            </Stack>
          </Box>
          {totalCalories > 0 && (
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Total burned
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {Math.round(totalCalories).toLocaleString()} kcal
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ mb: 0.5 }} />

        {shown.length > 0 ? (
          shown.map((w, i) => (
            <React.Fragment key={w.id ?? i}>
              <WorkoutRow workout={w} />
              {i < shown.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No workouts recorded
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
