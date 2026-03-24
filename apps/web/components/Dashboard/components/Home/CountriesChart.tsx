'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { PieChart } from '@mui/x-charts/PieChart';

const countries = [
  { label: 'India', value: 50, color: '#1f5c2e' },
  { label: 'USA', value: 35, color: '#3d9e55' },
  { label: 'Brazil', value: 10, color: '#6abf7e' },
  { label: 'Other', value: 5, color: '#d4edd9' },
];

export default function CountriesChart() {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
          Users by country
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, mb: 0.5 }}
        >
          98.5K
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Total
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Box sx={{ flexShrink: 0 }}>
            <PieChart
              series={[{
                data: countries,
                innerRadius: 42,
                outerRadius: 68,
                paddingAngle: 2,
                cornerRadius: 4,
                cx: 72,
                cy: 72,
              }]}
              width={144}
              height={144}
              legend={{ hidden: true }}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            />
          </Box>

          <Box sx={{ flex: 1, width: '100%' }}>
            {countries.map((c) => (
              <Box key={c.label} sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color }} />
                    <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                  </Stack>
                  <Typography variant="caption" fontWeight={600} color="text.primary">
                    {c.value}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={c.value}
                  sx={{
                    height: 5,
                    borderRadius: 4,
                    bgcolor: '#f0f9f2',
                    '& .MuiLinearProgress-bar': { bgcolor: c.color },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
