'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export type InsightPriority = 'high' | 'medium' | 'low';
export type InsightCategory = 'performance' | 'growth' | 'risk' | 'opportunity';

export interface InsightRecommendationCardProps {
  id: string;
  title: string;
  summary: string;
  category: InsightCategory;
  priority: InsightPriority;
  icon: React.ReactNode;
  metric?: string;
  metricLabel?: string;
  onExplore?: (id: string) => void;
}

const CATEGORY_META: Record<InsightCategory, { label: string; bg: string; color: string }> = {
  performance: { label: 'Performance', bg: '#d4edd9', color: '#1f5c2e' },
  growth:      { label: 'Growth',      bg: '#e8f4fd', color: '#1565c0' },
  risk:        { label: 'Risk',        bg: '#fee2e2', color: '#b91c1c' },
  opportunity: { label: 'Opportunity', bg: '#fef3cd', color: '#856404' },
};

const PRIORITY_DOT: Record<InsightPriority, string> = {
  high:   '#c0392b',
  medium: '#d68910',
  low:    '#2d7a40',
};

export default function InsightRecommendationCard({
  id,
  title,
  summary,
  category,
  priority,
  icon,
  metric,
  metricLabel,
  onExplore,
}: InsightRecommendationCardProps) {
  const [saved, setSaved] = React.useState(false);
  const meta = CATEGORY_META[category];

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(10,31,15,0.10)',
          borderColor: '#b0d4ba',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header row */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* Icon box */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: meta.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: meta.color,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
            <Stack spacing={0.4}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                {/* Priority dot */}
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: PRIORITY_DOT[priority],
                    flexShrink: 0,
                  }}
                />
                <Chip
                  label={meta.label}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: meta.bg,
                    color: meta.color,
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Tooltip title={saved ? 'Saved' : 'Save insight'}>
            <IconButton
              size="small"
              onClick={() => setSaved((v) => !v)}
              sx={{ color: saved ? 'primary.main' : 'text.disabled', mt: -0.5 }}
            >
              {saved ? (
                <BookmarkRoundedIcon fontSize="small" />
              ) : (
                <BookmarkBorderRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Title */}
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75, lineHeight: 1.4 }}>
          {title}
        </Typography>

        {/* Summary */}
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, flex: 1 }}>
          {summary}
        </Typography>

        {/* Metric + explore */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
          {metric ? (
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1}>
                {metric}
              </Typography>
              {metricLabel && (
                <Typography variant="caption" color="text.secondary">
                  {metricLabel}
                </Typography>
              )}
            </Box>
          ) : (
            <Box />
          )}

          <Tooltip title="Explore in chat">
            <IconButton
              size="small"
              onClick={() => onExplore?.(id)}
              sx={{
                bgcolor: '#f0f9f2',
                color: 'primary.main',
                '&:hover': { bgcolor: '#d4edd9' },
              }}
            >
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
