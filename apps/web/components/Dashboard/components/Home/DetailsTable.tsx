"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

export interface DetailsRow {
  id: string;
  name: string;
  avatar?: string;
  status: "Online" | "Offline" | "Away";
  lastActive: string;
  pageViews: string;
  country: string;
}

const defaultRows: DetailsRow[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    status: "Online",
    lastActive: "Just now",
    pageViews: "4,320",
    country: "India",
  },
  {
    id: "2",
    name: "Marcus Chen",
    status: "Away",
    lastActive: "2h ago",
    pageViews: "3,870",
    country: "USA",
  },
  {
    id: "3",
    name: "Emily Davis",
    status: "Online",
    lastActive: "5m ago",
    pageViews: "2,940",
    country: "Brazil",
  },
  {
    id: "4",
    name: "Robert Kim",
    status: "Offline",
    lastActive: "1d ago",
    pageViews: "1,200",
    country: "Canada",
  },
  {
    id: "5",
    name: "Ana Martins",
    status: "Online",
    lastActive: "30m ago",
    pageViews: "990",
    country: "Brazil",
  },
];

const statusColor = {
  Online: "success",
  Offline: "default",
  Away: "warning",
} as const;

interface DetailsTableProps {
  rows?: DetailsRow[];
}

export default function DetailsTable({
  rows = defaultRows,
}: DetailsTableProps) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2.5, py: 2 }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Details
          </Typography>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell align="right">Page Views</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      src={row.avatar}
                      alt={row.name}
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "primary.light",
                        fontSize: "0.75rem",
                      }}
                    >
                      {row.name[0]}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500}>
                      {row.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={statusColor[row.status]}
                    sx={{ height: 20, fontSize: "0.7rem", fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {row.lastActive}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={500}>
                    {row.pageViews}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {row.country}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
