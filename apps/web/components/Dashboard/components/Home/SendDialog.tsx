"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const PEOPLE = [
  { id: "1", name: "Sarah Johnson", role: "Product Manager", avatar: "" },
  { id: "2", name: "Marcus Chen", role: "Engineering Lead", avatar: "" },
  { id: "3", name: "Emily Davis", role: "UX Designer", avatar: "" },
  { id: "4", name: "Robert Kim", role: "Data Analyst", avatar: "" },
  { id: "5", name: "Ana Martins", role: "Marketing", avatar: "" },
  { id: "6", name: "James Wilson", role: "Sales Director", avatar: "" },
  { id: "7", name: "Priya Patel", role: "DevOps Engineer", avatar: "" },
  { id: "8", name: "Lucas Oliveira", role: "Backend Developer", avatar: "" },
];

interface SendDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SendDialog({ open, onClose }: SendDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  const filtered = PEOPLE.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const selectedPeople = PEOPLE.filter((p) => selected.includes(p.id));

  const handleSend = () => {
    // wire to your send logic
    console.log("Sending to:", selectedPeople);
    onClose();
    setSelected([]);
    setSearch("");
  };

  const handleClose = () => {
    onClose();
    setSelected([]);
    setSearch("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: { borderRadius: "14px" },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Share
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "text.secondary" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, px: 2 }}>
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: "divider" },
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                borderWidth: 1,
              },
            },
          }}
        />

        {/* Selected chips */}
        {selectedPeople.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
            {selectedPeople.map((p) => (
              <Chip
                key={p.id}
                label={p.name.split(" ")[0]}
                size="small"
                onDelete={() => toggle(p.id)}
                avatar={
                  <Avatar sx={{ bgcolor: "primary.main", fontSize: "0.65rem" }}>
                    {p.name[0]}
                  </Avatar>
                }
                sx={{
                  bgcolor: "#d4edd9",
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  "& .MuiChip-deleteIcon": {
                    color: "primary.main",
                    opacity: 0.6,
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ mb: 0.5 }} />

        {/* People list */}
        <List disablePadding sx={{ maxHeight: 300, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 3, textAlign: "center" }}
            >
              No people found
            </Typography>
          )}
          {filtered.map((person) => {
            const isSelected = selected.includes(person.id);
            return (
              <ListItem key={person.id} disablePadding>
                <ListItemButton
                  onClick={() => toggle(person.id)}
                  sx={{
                    borderRadius: 2,
                    py: 0.75,
                    bgcolor: isSelected ? "#f0f9f2" : "transparent",
                    mb: 0.35,
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: isSelected ? "primary.main" : "#d4edd9",
                        color: isSelected ? "#fff" : "primary.main",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {person.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {person.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {person.role}
                      </Typography>
                    }
                  />
                  <Checkbox
                    checked={isSelected}
                    size="small"
                    sx={{
                      color: "divider",
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 2, py: 1.5, justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          {selected.length > 0
            ? `${selected.length} recipient${selected.length > 1 ? "s" : ""} selected`
            : "Select recipients"}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: 0.6 }}
          disabled={selected.length === 0}
          onClick={handleSend}
          startIcon={
            <SendRoundedIcon
              sx={{ transform: "rotate(-45deg)", fontSize: "0.9rem" }}
            />
          }
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
