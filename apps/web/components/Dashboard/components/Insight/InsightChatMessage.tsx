'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
}

interface InsightChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export default function InsightChatMessage({ message, isLoading }: InsightChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <Stack
      direction={isUser ? 'row-reverse' : 'row'}
      spacing={1.25}
      alignItems="flex-end"
      sx={{ mb: 2 }}
    >
      {/* Avatar */}
      {!isUser && (
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />
        </Avatar>
      )}

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: '78%',
          px: 1.75,
          py: 1.25,
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          bgcolor: isUser ? 'primary.main' : '#ffffff',
          border: isUser ? 'none' : '1px solid',
          borderColor: 'divider',
          boxShadow: isUser
            ? '0 2px 8px rgba(31,92,46,0.18)'
            : '0 1px 4px rgba(10,31,15,0.06)',
        }}
      >
        {isLoading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={12} sx={{ color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Thinking…
            </Typography>
          </Stack>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: isUser ? '#ffffff' : 'text.primary',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </Typography>
        )}

        {message.timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.5,
              opacity: 0.6,
              fontSize: '0.65rem',
              color: isUser ? '#d4edd9' : 'text.secondary',
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
