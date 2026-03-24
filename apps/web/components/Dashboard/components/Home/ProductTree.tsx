"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

export default function ProductTree() {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Product tree
        </Typography>

        <SimpleTreeView
          defaultExpandedItems={["website", "store"]}
          sx={{
            "& .MuiTreeItem-label": {
              fontSize: "0.875rem",
              color: "text.primary",
            },
            "& .MuiTreeItem-root": {
              "& .MuiTreeItem-content": {
                borderRadius: 1.5,
                py: 0.25,
                "&:hover": { bgcolor: "#f0f9f2" },
                "&.Mui-selected": { bgcolor: "#d4edd9", color: "primary.main" },
                "&.Mui-focused": { bgcolor: "#f0f9f2" },
              },
            },
          }}
        >
          <TreeItem itemId="website" label="Website">
            <TreeItem itemId="home" label="Home" />
            <TreeItem itemId="pricing" label="Pricing" />
            <TreeItem itemId="about" label="About us" />
            <TreeItem itemId="blog" label="Blog" />
          </TreeItem>
          <TreeItem itemId="store" label="Store" />
          <TreeItem itemId="contact" label="Contact" />
          <TreeItem itemId="help" label="Help" />
        </SimpleTreeView>
      </CardContent>
    </Card>
  );
}
