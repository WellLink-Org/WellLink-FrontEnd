'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

import type { PersonResult } from './NetworkPeopleSearch';

interface NetworkProfilePanelProps {
  person: PersonResult | null;
  nickname: string;
  onNicknameChange: (value: string) => void;
}

const AVATAR_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#059669',
  '#d97706', '#dc2626', '#0891b2', '#4f46e5',
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Box
        sx={{
          mt: 0.1,
          color: 'text.disabled',
          display: 'flex',
          alignItems: 'center',
          fontSize: 16,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.disabled" display="block" lineHeight={1.2}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function NetworkProfilePanel({
  person,
  nickname,
  onNicknameChange,
}: NetworkProfilePanelProps) {
  if (!person) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          color: 'text.disabled',
          px: 3,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        <PersonAddAltRoundedIcon sx={{ fontSize: 44, opacity: 0.35 }} />
        <Typography variant="body2" color="text.disabled">
          Select a person from the list to view their profile and add them to your network
        </Typography>
      </Box>
    );
  }

  const avatarColor = getAvatarColor(person.id);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Profile header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 1.5,
          pb: 2,
          gap: 1,
          borderRadius: '12px',
          bgcolor: `${avatarColor}0D`,
          border: '1px solid',
          borderColor: `${avatarColor}22`,
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: avatarColor,
            fontSize: '1.3rem',
            fontWeight: 700,
            border: '3px solid',
            borderColor: 'background.paper',
            boxShadow: `0 0 0 2px ${avatarColor}44`,
          }}
        >
          {getInitials(person.name)}
        </Avatar>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700} lineHeight={1.3}>
            {person.name}
          </Typography>
          <Chip
            label={person.role}
            size="small"
            sx={{
              mt: 0.5,
              height: 20,
              fontSize: '0.68rem',
              fontWeight: 600,
              bgcolor: `${avatarColor}18`,
              color: avatarColor,
              border: 'none',
            }}
          />
        </Box>
      </Box>

      {/* Info rows */}
      <Stack spacing={1.5} sx={{ px: 0.5 }}>
        <InfoRow
          icon={<WorkRoundedIcon fontSize="small" />}
          label="Role"
          value={person.role}
        />
        <InfoRow
          icon={<CorporateFareRoundedIcon fontSize="small" />}
          label="Department"
          value={person.department}
        />
        <InfoRow
          icon={<EmailRoundedIcon fontSize="small" />}
          label="Email"
          value={person.email}
        />
      </Stack>

      <Divider />

      {/* Nickname input */}
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.75}>
          Nickname / Identifier
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block" mb={1}>
          Add a custom label so you can easily identify this person in your network.
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder={`e.g. "Sarah from Q2 project"`}
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontSize: '0.85rem',
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 },
            },
          }}
        />
      </Box>
    </Box>
  );
}
