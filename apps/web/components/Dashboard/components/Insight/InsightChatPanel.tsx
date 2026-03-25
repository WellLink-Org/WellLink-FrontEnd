"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InsightChatMessage, { type ChatMessage } from "./InsightChatMessage";

const SUGGESTED_PROMPTS = [
  "Why did sessions drop last week?",
  "Which country has the best conversion?",
  "Summarise this month's performance",
  "What should I focus on next?",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "assistant",
  content:
    "Hi! I've analysed your dashboard data. Ask me anything about your metrics, trends, or what actions to take next.",
  timestamp: new Date(),
};

interface InsightChatPanelProps {
  /** Pre-fill the input — used when the user clicks "Explore" on a recommendation card */
  prefillMessage?: string;
  onPrefillConsumed?: () => void;
}

export default function InsightChatPanel({
  prefillMessage,
  onPrefillConsumed,
}: InsightChatPanelProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Consume prefill from recommendation card
  React.useEffect(() => {
    if (prefillMessage) {
      setInput(prefillMessage);
      onPrefillConsumed?.();
    }
  }, [prefillMessage, onPrefillConsumed]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Replace with your real AI call
    await new Promise((r) => setTimeout(r, 1400));

    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: getMockResponse(trimmed),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(10,31,15,0.06)",
      }}
    >
      {/* Chat header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          px: 2.5,
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ color: "#fff", fontSize: 16 }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            AI Insights Agent
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Powered by your dashboard data
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <Chip
            label="Online"
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 600,
              bgcolor: "#d4edd9",
              color: "#1f5c2e",
            }}
          />
        </Box>
      </Stack>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pt: 2, pb: 1 }}>
        {messages.map((msg) => (
          <InsightChatMessage key={msg.id} message={msg} />
        ))}
        {loading && (
          <InsightChatMessage
            message={{ id: "loading", role: "assistant", content: "" }}
            isLoading
          />
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <>
          <Divider />
          <Box
            sx={{
              px: 2,
              py: 1.25,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
            }}
          >
            {SUGGESTED_PROMPTS.map((p) => (
              <Chip
                key={p}
                label={p}
                size="small"
                variant="outlined"
                onClick={() => sendMessage(p)}
                sx={{
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "#f0f9f2",
                    borderColor: "primary.main",
                    color: "primary.main",
                  },
                }}
              />
            ))}
          </Box>
        </>
      )}

      <Divider />

      {/* Input */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          multiline
          maxRows={3}
          placeholder="Ask about your data…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    disabled={!input.trim() || loading}
                    onClick={() => sendMessage(input)}
                    sx={{
                      bgcolor: input.trim() ? "primary.main" : "transparent",
                      color: input.trim() ? "#fff" : "text.disabled",
                      "&:hover": { bgcolor: "#1a4425" },
                      width: 30,
                      height: 30,
                      transition: "background 0.2s",
                    }}
                  >
                    <SendRoundedIcon
                      sx={{ fontSize: 15, transform: "rotate(-45deg)" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "0.875rem",
              "& fieldset": { borderColor: "divider" },
              "&:hover fieldset": { borderColor: "primary.light" },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                borderWidth: 1,
              },
            },
          }}
        />
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 0.5, display: "block" }}
        >
          Press Enter to send · Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  );
}

// Replace with real AI responses
function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("session") || lower.includes("drop"))
    return "Sessions dipped by ~12% on Tuesday — this correlates with a deploy at 14:32. Page load time increased from 1.2s to 3.8s for users in Europe. I'd recommend investigating the CDN config for that region.";
  if (lower.includes("country") || lower.includes("conversion"))
    return "The USA leads on conversion rate at 4.2%, followed by India at 3.8%. Brazil has the highest drop-off on the pricing page — consider A/B testing a localised pricing tier there.";
  if (lower.includes("summar") || lower.includes("month"))
    return "This month: 14k users (+25%), 325 conversions (-25%), 200k events (+5%). The conversion decline is the key concern — new users are arriving but not completing sign-up. Funnel analysis points to the onboarding step 3 as the main drop-off.";
  if (lower.includes("focus") || lower.includes("next"))
    return "Top 3 priorities: (1) Fix the onboarding funnel — recovering 20% of drop-offs would add ~65 conversions/month. (2) Invest in Brazil localisation. (3) Set up real-time alerts for page load regressions.";
  return "That's a great question. Based on your current data trends, I can see some interesting patterns. Could you clarify which time period or metric you'd like me to focus on?";
}
