"use client";

import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export interface PersonResult {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
  department?: string;
}

interface NetworkPeopleSearchProps {
  people: PersonResult[];
  selectedId?: string | null;
  onSelect: (person: PersonResult) => void;
  loading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  alreadyAddedIds?: string[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0891b2",
  "#4f46e5",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function NetworkPeopleSearch({
  people,
  selectedId,
  onSelect,
  loading = false,
  search,
  onSearchChange,
  alreadyAddedIds = [],
}: NetworkPeopleSearchProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, role, or email…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  fontSize="small"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "0.85rem",
            "& fieldset": { borderColor: "divider" },
            "&:hover fieldset": { borderColor: "primary.main" },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
              borderWidth: 1,
            },
          },
        }}
      />

      <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : people.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              gap: 1,
              color: "text.disabled",
            }}
          >
            <PersonSearchRoundedIcon sx={{ fontSize: 36 }} />
            <Typography variant="body2">
              {search ? "No people found" : "Start typing to search"}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {people.map((person) => {
              const isSelected = selectedId === person.id;
              const isAdded = alreadyAddedIds.includes(person.id);
              return (
                <ListItem key={person.id} disablePadding sx={{ mb: 0.25 }}>
                  <ListItemButton
                    onClick={() => onSelect(person)}
                    selected={isSelected}
                    sx={{
                      borderRadius: "10px",
                      py: 0.75,
                      px: 1,
                      "&.Mui-selected": {
                        bgcolor: "primary.50",
                        "&:hover": { bgcolor: "primary.50" },
                      },
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: getAvatarColor(person.id),
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          getInitials(person.name)
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {person.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {person.role}
                          {person.department ? ` · ${person.department}` : ""}
                        </Typography>
                      }
                    />
                    {isAdded && (
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: 16,
                          color: "success.main",
                          ml: 0.5,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
}
