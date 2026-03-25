"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f9f2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        gap: 2,
      }}
    >
      <Typography
        variant="h1"
        fontWeight={700}
        sx={{ fontSize: "6rem", color: "#1f5c2e", lineHeight: 1 }}
      >
        404
      </Typography>

      <Typography variant="h5" fontWeight={700} color="text.primary">
        Under Construction
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380 }}>
        This page doesn't exist yet - we're working on it.
      </Typography>

      <Link href="/" style={{ textDecoration: "none" }}>
        <Button
          sx={{ bgcolor: "#1f5c2e", mt: 1 }}
          variant="contained"
          size="medium"
        >
          Back to Home
        </Button>
      </Link>
    </Box>
  );
}
