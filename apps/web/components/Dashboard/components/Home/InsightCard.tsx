"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

export interface InsightCardProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export default function InsightCard({
  title = "Explore your data",
  description = "Uncover performance and visitor insights with our data wizardry.",
  ctaLabel = "Get insights",
  onCtaClick,
}: InsightCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        background: "linear-gradient(135deg, #1f5c2e 0%, #2d7a40 100%)",
        border: "none",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.06)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -30,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.04)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ color: "#ffffff", fontSize: 20 }} />
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: "#ffffff",
            mb: 0.75,
          }}
        >
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#d4edd9", lineHeight: 1.6 }}>
          {description}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          variant="contained"
          size="small"
          onClick={onCtaClick}
          sx={{
            bgcolor: "#ffffff",
            color: "#1f5c2e",
            fontWeight: 700,
            borderRadius: 999,
            "&:hover": { bgcolor: "#f0f9f2" },
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {ctaLabel}
        </Button>
      </CardActions>
    </Card>
  );
}
