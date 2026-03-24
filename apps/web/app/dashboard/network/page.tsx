"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import NetworkTable, {
  NetworkMember,
} from "../../../components/Dashboard/components/Network/NetworkTable";
import { PersonResult } from "../../../components/Dashboard/components/Network/NetworkPeopleSearch";
import {
  AddToNetworkDialog,
  EditNicknameDialog,
  SectionHeader,
} from "../../../components/Dashboard/components";

export default function NetworkPage() {
  const [addOpen, setAddOpen] = React.useState(false);
  const [editMember, setEditMember] = React.useState<NetworkMember | null>(
    null,
  );
  const [members, setMembers] = React.useState<NetworkMember[]>([
    // Seed with one example so the table is visible
    {
      id: "3",
      name: "Emily Davis",
      role: "UX Designer",
      email: "emily.d@acme.com",
      department: "Design",
      nickname: "Emily – design collab",
      status: "connected",
      requestedAt: new Date(Date.now() - 86400000 * 5),
      lastSynced: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: "6",
      name: "James Wilson",
      role: "Sales Director",
      email: "james.w@acme.com",
      department: "Sales",
      nickname: "",
      status: "pending",
      requestedAt: new Date(Date.now() - 86400000),
      lastSynced: undefined,
    },
  ]);

  const addedIds = members.map((m) => m.id);

  const handleAdd = (person: PersonResult, nickname: string) => {
    const newMember: NetworkMember = {
      id: person.id,
      name: person.name,
      role: person.role,
      email: person.email,
      department: person.department,
      nickname: nickname || undefined,
      status: "pending",
      requestedAt: new Date(),
      lastSynced: undefined,
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleEditNickname = (member: NetworkMember) => {
    setEditMember(member);
  };

  const handleSaveNickname = (memberId: string, nickname: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, nickname: nickname || undefined } : m,
      ),
    );
  };

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleSync = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, lastSynced: new Date() } : m,
      ),
    );
  };

  return (
    <Box>
      <SectionHeader
        title="Network"
        subtitle="Your Share Network"
        toolbar={
          <Tooltip title="Add person to network">
            <IconButton onClick={() => setAddOpen(true)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />

      <NetworkTable
        members={members}
        onEditNickname={handleEditNickname}
        onRemove={handleRemove}
        onSync={handleSync}
      />

      {/* Dialogs */}
      <AddToNetworkDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
        alreadyAddedIds={addedIds}
      />

      <EditNicknameDialog
        open={!!editMember}
        member={editMember}
        onClose={() => setEditMember(null)}
        onSave={handleSaveNickname}
      />
    </Box>
  );
}
