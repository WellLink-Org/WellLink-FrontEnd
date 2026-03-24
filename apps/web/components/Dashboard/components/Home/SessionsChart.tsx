'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [3200, 4200, 3800, 5100, 4600, 5800, 6400, 5500, 7200, 6800, 8100, 7600,
  6900, 8400, 7800, 9200, 8500, 10100, 9400, 8800, 11200, 10500, 9800, 12100,
  11400, 10800, 13200, 12500, 11900, 13277];

const labels = data.map((_, i) => {
  const d = new Date(2024, 2, i + 1);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

export default function SessionsChart() {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
              Sessions
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
              >
                13,277
              </Typography>
              <Chip
                label="+35%"
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.72rem', height: 22 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Sessions per day for the last 30 days
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ height: 180 }}>
          <LineChart
            xAxis={[{
              data: labels,
              scaleType: 'point',
              tickLabelStyle: { fontSize: 10, fill: '#7a9e84' },
              tickNumber: 6,
            }]}
            yAxis={[{
              tickLabelStyle: { fontSize: 10, fill: '#7a9e84' },
              tickNumber: 4,
            }]}
            series={[{
              data,
              color: '#1f5c2e',
              area: true,
              showMark: false,
              curve: 'natural',
            }]}
            height={180}
            margin={{ left: 40, right: 8, top: 8, bottom: 28 }}
            sx={{
              '& .MuiAreaElement-root': {
                fill: 'url(#greenGradient)',
              },
              '& .MuiLineElement-root': {
                strokeWidth: 2,
              },
              '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
                stroke: '#ddeee1',
              },
            }}
          >
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f5c2e" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#1f5c2e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
          </LineChart>
        </Box>
      </CardContent>
    </Card>
  );
}
