"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import NetworkProfilePanel from "./NetworkProfilePanel";
import NetworkPeopleSearch, { PersonResult } from "./NetworkPeopleSearch";

// ─── mock data ────────────────────────────────────────────────────────────────
const MOCK_PEOPLE: PersonResult[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Product Manager",
    email: "sarah.j@acme.com",
    department: "Product",
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "Engineering Lead",
    email: "marcus.c@acme.com",
    department: "Engineering",
  },
  {
    id: "3",
    name: "Emily Davis",
    role: "UX Designer",
    email: "emily.d@acme.com",
    department: "Design",
  },
  {
    id: "4",
    name: "Robert Kim",
    role: "Data Analyst",
    email: "robert.k@acme.com",
    department: "Analytics",
  },
  {
    id: "5",
    name: "Ana Martins",
    role: "Marketing Lead",
    email: "ana.m@acme.com",
    department: "Marketing",
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Sales Director",
    email: "james.w@acme.com",
    department: "Sales",
  },
  {
    id: "7",
    name: "Priya Patel",
    role: "DevOps Engineer",
    email: "priya.p@acme.com",
    department: "Engineering",
  },
  {
    id: "8",
    name: "Lucas Oliveira",
    role: "Backend Developer",
    email: "lucas.o@acme.com",
    department: "Engineering",
  },
];

interface AddToNetworkDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (person: PersonResult, nickname: string) => void;
  alreadyAddedIds?: string[];
}

export default function AddToNetworkDialog({
  open,
  onClose,
  onAdd,
  alreadyAddedIds = [],
}: AddToNetworkDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedPerson, setSelectedPerson] =
    React.useState<PersonResult | null>(null);
  const [nickname, setNickname] = React.useState("");

  // Replace this with a real API call / search hook in production
  const filtered = MOCK_PEOPLE.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (person: PersonResult) => {
    setSelectedPerson(person);
    setNickname("");
  };

  const handleAdd = () => {
    if (!selectedPerson) return;
    onAdd(selectedPerson, nickname);
    handleClose();
  };

  const handleClose = () => {
    setSearch("");
    setSelectedPerson(null);
    setNickname("");
    onClose();
  };

  const isAlreadyAdded = selectedPerson
    ? alreadyAddedIds.includes(selectedPerson.id)
    : false;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: "16px", overflow: "hidden" },
        },
      }}
    >
      {/* Title */}
      <DialogTitle sx={{ pb: 0, pt: 2, px: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonAddAlt1RoundedIcon
              sx={{ color: "primary.main", fontSize: 20 }}
            />
            <Typography variant="subtitle1" fontWeight={700}>
              Add to Network
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "text.secondary" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.5}
        >
          Search for a colleague and send them a connection request.
        </Typography>
      </DialogTitle>

      <Divider sx={{ mt: 1.5 }} />

      {/* Content: two-panel layout */}
      <DialogContent sx={{ p: 0, height: 420, overflow: "hidden" }}>
        <Box sx={{ display: "flex", height: "100%" }}>
          {/* Left: search list */}
          <Box
            sx={{
              width: "50%",
              borderRight: "1px solid",
              borderColor: "divider",
              p: 2,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              display="block"
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              People
            </Typography>
            <NetworkPeopleSearch
              people={filtered}
              selectedId={selectedPerson?.id}
              onSelect={handleSelect}
              search={search}
              onSearchChange={setSearch}
              alreadyAddedIds={alreadyAddedIds}
            />
          </Box>

          {/* Right: profile panel */}
          <Box sx={{ width: "50%", p: 2, overflowY: "auto" }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              display="block"
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Profile
            </Typography>
            <NetworkProfilePanel
              person={selectedPerson}
              nickname={nickname}
              onNicknameChange={setNickname}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      {/* Footer */}
      <DialogActions sx={{ px: 2.5, py: 1.5, justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          {isAlreadyAdded
            ? "Already in your network"
            : selectedPerson
              ? `Ready to invite ${selectedPerson.name.split(" ")[0]}`
              : "Select a person to continue"}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="text" size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={!selectedPerson || isAlreadyAdded}
            onClick={handleAdd}
            startIcon={
              <SendRoundedIcon
                sx={{
                  transform: "rotate(-45deg)",
                  fontSize: "0.85rem !important",
                }}
              />
            }
          >
            Send Request
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
