"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

export interface StatCardProps {
  title: string;
  value: string;
  interval?: string;
  trend: "up" | "down" | "neutral";
  trendLabel: string;
  sparkline?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  interval,
  trend,
  trendLabel,
  sparkline,
}: StatCardProps) {
  const trendColor =
    trend === "up" ? "success" : trend === "down" ? "error" : "default";

  const TrendIcon =
    trend === "up" ? TrendingUpRoundedIcon : TrendingDownRoundedIcon;

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          gutterBottom
        >
          {title}
        </Typography>

        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            {interval && (
              <Typography
                variant="caption"
                color="text.muted"
                sx={{ mt: 0.25, display: "block" }}
              >
                {interval}
              </Typography>
            )}
          </Box>

          <Chip
            icon={<TrendIcon sx={{ fontSize: "0.85rem !important" }} />}
            label={trendLabel}
            size="small"
            color={trendColor as "success" | "error" | "default"}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.72rem", height: 24 }}
          />
        </Stack>

        {sparkline && <Box sx={{ mt: 2 }}>{sparkline}</Box>}
      </CardContent>
    </Card>
  );
}
