'use client';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import type { NetworkMember } from './NetworkTable';

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

interface EditNicknameDialogProps {
  open: boolean;
  member: NetworkMember | null;
  onClose: () => void;
  onSave: (memberId: string, nickname: string) => void;
}

export default function EditNicknameDialog({
  open,
  member,
  onClose,
  onSave,
}: EditNicknameDialogProps) {
  const [nickname, setNickname] = React.useState('');

  React.useEffect(() => {
    if (member) setNickname(member.nickname ?? '');
  }, [member]);

  const handleSave = () => {
    if (!member) return;
    onSave(member.id, nickname);
    onClose();
  };

  const avatarColor = member ? getAvatarColor(member.id) : '#2563eb';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: '14px' } } }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>
            Edit Nickname
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {member && (
          <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: avatarColor,
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {getInitials(member.name)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{member.name}</Typography>
              <Typography variant="caption" color="text.secondary">{member.role}</Typography>
            </Box>
          </Stack>
        )}

        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
          Give this person a label that's meaningful to you. Only you can see it.
        </Typography>

        <TextField
          fullWidth
          size="small"
          autoFocus
          placeholder={`e.g. "Sarah from Q2 project"`}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button variant="text" size="small" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          startIcon={<CheckRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
