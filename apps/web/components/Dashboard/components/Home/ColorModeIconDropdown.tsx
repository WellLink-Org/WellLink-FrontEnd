'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

// Stub: replace with your color mode context if needed
export default function ColorModeIconDropdown() {
  return (
    <Tooltip title="Toggle color mode">
      <IconButton size="small" sx={{ color: 'text.secondary' }}>
        <LightModeRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
