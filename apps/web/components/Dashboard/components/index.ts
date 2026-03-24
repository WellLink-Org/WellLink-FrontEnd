// components/index.ts — barrel export for all dashboard components
export { default as DashboardLayout } from "./DashboardLayout";
export { default as ThemeRegistry } from "./ThemeRegistry";

export { default as SideNav, DRAWER_WIDTH } from "./SideNav";
export { default as TopBar } from "./TopBar";
export { default as NavBreadcrumbs } from "./NavBreadcrumbs";
export type { NavBreadcrumbsProps, BreadcrumbItem } from "./NavBreadcrumbs";
export { default as ColorModeIconDropdown } from "./Home/ColorModeIconDropdown";

// Cards & layout helpers
export { default as StatCard } from "./Home/StatCard";
export type { StatCardProps } from "./Home/StatCard";
export { default as InsightCard } from "./Home/InsightCard";
export type { InsightCardProps } from "./Home/InsightCard";
export { default as SectionHeader } from "./SectionHeader";
export type { SectionHeaderProps } from "./SectionHeader";
export { default as EmptyState } from "./Home/EmptyState";
export type { EmptyStateProps } from "./Home/EmptyState";

// Data visualisations
export { default as SessionsChart } from "./Home/SessionsChart";
export { default as PageViewsChart } from "./Home/PageViewsChart";
export { default as CountriesChart } from "./Home/CountriesChart";

// Tables & trees
export { default as DetailsTable } from "./Home/DetailsTable";
export type { DetailsRow } from "./Home/DetailsTable";
export { default as ProductTree } from "./Home/ProductTree";

export { default as SendDialog } from "./Home/SendDialog";
export { default as DashboardSettingsDialog } from "./Home/DashboardSettingsDialog";

export { default as AddToNetworkDialog } from "./Network/AddToNetworkDialog";
export { default as EditNicknameDialog } from "./Network/EditNicknameDialog";
export { default as NetworkPeopleSearch } from "./Network/NetworkPeopleSearch";
export { default as NetworkProfilePanel } from "./Network/NetworkProfilePanel";
export { default as NetworkTable } from "./Network/NetworkTable";
