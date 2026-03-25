"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { SectionHeader } from "../../../components/Dashboard/components";
import InsightRecommendationCard from "../../../components/Dashboard/components/Insight/InsightRecommendationCard";
import InsightChatPanel from "../../../components/Dashboard/components/Insight/InsightChatPanel";

const RECOMMENDATIONS = [
  {
    id: "conv-drop",
    title: "Conversion rate dropped 25%",
    summary:
      "New users are arriving but not completing sign-up. Funnel analysis shows step 3 of onboarding is losing 68% of users.",
    category: "risk" as const,
    priority: "high" as const,
    icon: <TrendingDownRoundedIcon fontSize="small" />,
    metric: "-25%",
    metricLabel: "vs last month",
  },
  {
    id: "session-growth",
    title: "Sessions growing strongly",
    summary:
      "Session volume is up 35% over 30 days. Organic search is the top driver — your recent content updates are working.",
    category: "growth" as const,
    priority: "low" as const,
    icon: <TrendingUpRoundedIcon fontSize="small" />,
    metric: "+35%",
    metricLabel: "sessions this month",
  },
  {
    id: "brazil-opp",
    title: "Brazil market opportunity",
    summary:
      "Brazil sends 10% of your traffic but converts at half the global average. A localised pricing tier could unlock 40+ extra conversions monthly.",
    category: "opportunity" as const,
    priority: "medium" as const,
    icon: <LightbulbRoundedIcon fontSize="small" />,
    metric: "×2",
    metricLabel: "potential uplift",
  },
  {
    id: "load-perf",
    title: "EU page load regression",
    summary:
      "European users are experiencing 3.8s load times vs the 1.2s baseline. This correlates directly with Tuesday's deployment.",
    category: "performance" as const,
    priority: "high" as const,
    icon: <SpeedRoundedIcon fontSize="small" />,
    metric: "3.8s",
    metricLabel: "avg load time (EU)",
  },
  {
    id: "india-top",
    title: "India is your top market",
    summary:
      "50% of users originate from India with a 4.2% conversion rate — your highest globally. Consider dedicated infrastructure in that region.",
    category: "growth" as const,
    priority: "low" as const,
    icon: <GroupsRoundedIcon fontSize="small" />,
    metric: "50%",
    metricLabel: "of total users",
  },
  {
    id: "onboard-fix",
    title: "Onboarding funnel needs attention",
    summary:
      "Step 3 of onboarding (plan selection) has a 68% exit rate. A/B testing a simplified plan UI could recover 20% of drop-offs.",
    category: "opportunity" as const,
    priority: "medium" as const,
    icon: <WarningAmberRoundedIcon fontSize="small" />,
    metric: "68%",
    metricLabel: "exit at step 3",
  },
];

export default function InsightsPage() {
  const [prefill, setPrefill] = React.useState<string | undefined>();

  const handleExplore = (id: string) => {
    const card = RECOMMENDATIONS.find((r) => r.id === id);
    if (card) setPrefill(`Tell me more about: ${card.title}`);
    // Scroll to chat
    scrollToChat();
  };

  function scrollToChat() {
    document
      .getElementById("insight-chat")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Box>
      <SectionHeader
        title="Insights"
        subtitle="AI-generated recommendations from your dashboard data"
        action={
          <Button
            variant="contained"
            startIcon={<AutoAwesomeRoundedIcon />}
            size="small"
            onClick={scrollToChat}
          >
            Ask AI agent
          </Button>
        }
      />

      {/* Recommendations grid */}
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1.5, display: "block" }}
      >
        Recommendations
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {RECOMMENDATIONS.map((rec) => (
          <Grid key={rec.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <InsightRecommendationCard {...rec} onExplore={handleExplore} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* AI Chat */}
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1.5, display: "block" }}
      >
        Ask your AI agent
      </Typography>

      <Box id="insight-chat" sx={{ height: 480 }}>
        <InsightChatPanel
          prefillMessage={prefill}
          onPrefillConsumed={() => setPrefill(undefined)}
        />
      </Box>

      <Divider sx={{ mt: 3, mb: 2 }} />
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
