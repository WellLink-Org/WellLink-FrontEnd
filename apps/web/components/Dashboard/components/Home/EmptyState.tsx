"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCtaClick,
}: EmptyStateProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 6,
          px: 3,
          gap: 1.5,
        }}
      >
        {icon ? (
          <Box sx={{ color: "text.disabled", mb: 0.5 }}>{icon}</Box>
        ) : (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "#f0f9f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 0.5,
            }}
          >
            <AddRoundedIcon sx={{ color: "primary.main" }} />
          </Box>
        )}

        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 280 }}
          >
            {description}
          </Typography>
        )}

        {ctaLabel && (
          <Button
            variant="outlined"
            size="small"
            onClick={onCtaClick}
            sx={{ mt: 0.5, borderRadius: 999 }}
          >
            {ctaLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
