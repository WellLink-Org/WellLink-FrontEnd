"use client";
import * as React from "react";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function NavBreadcrumbs({ items }: NavBreadcrumbsProps) {
  return (
    <MuiBreadcrumbs
      separator={
        <NavigateNextRoundedIcon
          fontSize="small"
          sx={{ color: "text.disabled" }}
        />
      }
      aria-label="breadcrumb"
      sx={{
        "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap", alignItems: "center" },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.href) {
          return (
            <Typography
              key={item.label}
              variant="body2"
              fontWeight={isLast ? 600 : 400}
              color={isLast ? "text.primary" : "text.secondary"}
              noWrap
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={item.label}
            component={NextLink}
            href={item.href}
            underline="hover"
            sx={{
              fontSize: "0.875rem",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
