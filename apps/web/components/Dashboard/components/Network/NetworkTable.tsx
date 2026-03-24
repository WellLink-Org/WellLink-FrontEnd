'use client';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

export type NetworkMemberStatus = 'pending' | 'connected' | 'declined';

export interface NetworkMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  department?: string;
  avatar?: string;
  nickname?: string;
  status: NetworkMemberStatus;
  requestedAt: Date;
  lastSynced?: Date;
}

interface NetworkTableProps {
  members: NetworkMember[];
  onEditNickname: (member: NetworkMember) => void;
  onRemove: (memberId: string) => void;
  onSync?: (memberId: string) => void;
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

function formatDate(date?: Date) {
  if (!date) return '—';
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CONFIG: Record<
  NetworkMemberStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label: 'Pending',
    color: '#b45309',
    bg: '#fef3c7',
    border: '#fcd34d',
  },
  connected: {
    label: 'Connected',
    color: '#065f46',
    bg: '#d1fae5',
    border: '#6ee7b7',
  },
  declined: {
    label: 'Declined',
    color: '#991b1b',
    bg: '#fee2e2',
    border: '#fca5a5',
  },
};

function StatusChip({ status }: { status: NetworkMemberStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        height: 22,
        fontSize: '0.7rem',
        fontWeight: 600,
        bgcolor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: '6px',
      }}
    />
  );
}

export default function NetworkTable({
  members,
  onEditNickname,
  onRemove,
  onSync,
}: NetworkTableProps) {
  if (members.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          gap: 1.5,
          color: 'text.disabled',
          borderRadius: '12px',
          border: '1.5px dashed',
          borderColor: 'divider',
          mt: 2,
        }}
      >
        <PeopleAltRoundedIcon sx={{ fontSize: 40, opacity: 0.35 }} />
        <Typography variant="body2">No network members yet</Typography>
        <Typography variant="caption" color="text.disabled">
          Use the + button above to add people to your network
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        mt: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        '& .MuiTable-root': { minWidth: 600 },
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {['Person', 'Nickname', 'Status', 'Last Synced', 'Requested', ''].map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'text.disabled',
                  py: 1.25,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member, idx) => {
            const avatarColor = getAvatarColor(member.id);
            return (
              <TableRow
                key={member.id}
                hover
                sx={{
                  '&:last-child td': { border: 0 },
                  '&:hover': { bgcolor: 'action.hover' },
                  bgcolor: idx % 2 === 0 ? 'transparent' : 'grey.50',
                }}
              >
                {/* Person */}
                <TableCell sx={{ py: 1.25 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: avatarColor,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(member.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.role}
                        {member.department ? ` · ${member.department}` : ''}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                {/* Nickname */}
                <TableCell sx={{ py: 1.25 }}>
                  {member.nickname ? (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      "{member.nickname}"
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell sx={{ py: 1.25 }}>
                  <StatusChip status={member.status} />
                </TableCell>

                {/* Last Synced */}
                <TableCell sx={{ py: 1.25 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(member.lastSynced)}
                  </Typography>
                </TableCell>

                {/* Requested */}
                <TableCell sx={{ py: 1.25 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(member.requestedAt)}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell sx={{ py: 1.25 }} align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    {onSync && member.status === 'connected' && (
                      <Tooltip title="Sync now">
                        <IconButton size="small" onClick={() => onSync(member.id)}>
                          <SyncRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit nickname">
                      <IconButton size="small" onClick={() => onEditNickname(member)}>
                        <EditRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from network">
                      <IconButton
                        size="small"
                        onClick={() => onRemove(member.id)}
                        sx={{ color: 'error.light', '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
