"use client";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import {
  CountriesChart,
  DashboardSettingsDialog,
  DetailsTable,
  InsightCard,
  PageViewsChart,
  ProductTree,
  SectionHeader,
  SendDialog,
  SessionsChart,
  StatCard,
} from "../../components/Dashboard/components";
import SendIcon from "@mui/icons-material/Send";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import Link from "next/link";
import { healthApi } from "../api/client/healthAPI";

const stats = [
  {
    title: "Users",
    value: "14k",
    interval: "Last 30 days",
    trend: "up" as const,
    trendLabel: "+25%",
  },
  {
    title: "Conversions",
    value: "325",
    interval: "Last 30 days",
    trend: "down" as const,
    trendLabel: "-25%",
  },
  {
    title: "Event count",
    value: "200k",
    interval: "Last 30 days",
    trend: "up" as const,
    trendLabel: "+5%",
  },
];

export default function DashboardPage() {
  const [sendOpen, setSendOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    getDashboardData();
  }, []);
  async function getDashboardData() {
    const response = await healthApi.getNames();
    console.log(response);
  }
  return (
    <Box>
      <SectionHeader
        title="Dashboard"
        subtitle={`Last synced on ${new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`}
        action={
          <Link href="/dashboard/insights" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeRoundedIcon />}
              size="small"
            >
              Get insights
            </Button>
          </Link>
        }
        toolbar={
          <>
            <Tooltip title="Send">
              <IconButton onClick={() => setSendOpen(true)}>
                <SendIcon
                  fontSize="small"
                  sx={{ transform: "rotate(-45deg)" }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dashboard Settings">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <SendDialog open={sendOpen} onClose={() => setSendOpen(false)} />
      <DashboardSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Stat cards + insight promo */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <InsightCard />
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsChart />
        </Grid>
      </Grid>

      {/* Details + tree + countries */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DetailsTable />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <ProductTree />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <CountriesChart />
        </Grid>
      </Grid>

      {/* Footer */}
      <Divider sx={{ mb: 2 }} />
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
      >
        Copyright © WellLink {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
