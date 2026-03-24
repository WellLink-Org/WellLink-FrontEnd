'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { BarChart } from '@mui/x-charts/BarChart';

const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const pageViews = [180000, 220000, 195000, 245000, 210000, 230000];
const downloads = [42000, 55000, 48000, 62000, 53000, 58000];

export default function PageViewsChart() {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
              Page views and downloads
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
              >
                1.3M
              </Typography>
              <Chip
                label="-8%"
                size="small"
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.72rem', height: 22 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Page views and downloads for the last 6 months
            </Typography>
          </Box>
        </Stack>

        {/* Legend */}
        <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#1f5c2e' }} />
            <Typography variant="caption" color="text.secondary">Page views</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#6abf7e' }} />
            <Typography variant="caption" color="text.secondary">Downloads</Typography>
          </Stack>
        </Stack>

        <Box sx={{ height: 200 }}>
          <BarChart
            xAxis={[{
              data: months,
              scaleType: 'band',
              tickLabelStyle: { fontSize: 11, fill: '#7a9e84' },
            }]}
            yAxis={[{
              tickLabelStyle: { fontSize: 10, fill: '#7a9e84' },
              tickNumber: 4,
              valueFormatter: (v: number) =>
                v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}k`,
            }]}
            series={[
              { data: pageViews, color: '#1f5c2e', label: 'Page views' },
              { data: downloads, color: '#6abf7e', label: 'Downloads' },
            ]}
            height={200}
            margin={{ left: 48, right: 8, top: 4, bottom: 28 }}
            legend={{ hidden: true }}
            sx={{
              '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
                stroke: '#ddeee1',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
