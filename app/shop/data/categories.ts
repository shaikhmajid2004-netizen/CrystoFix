import {
  BatteryFull,
  Cog,
  Disc3,
  Filter as FilterIcon,
  LayoutGrid,
  Lightbulb,
  Package,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "../types";

export interface ShopCategory {
  id: CategoryId | "all";
  label: string;
  icon: LucideIcon;
}

export const CATEGORIES: ShopCategory[] = [
  { id: "all", label: "All Parts", icon: LayoutGrid },
  { id: "engine", label: "Engine Parts", icon: Cog },
  { id: "brakes", label: "Brakes", icon: Disc3 },
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "suspension", label: "Suspension", icon: Waves },
  { id: "filters", label: "Filters", icon: FilterIcon },
  { id: "lighting", label: "Lighting", icon: Lightbulb },
  { id: "batteries", label: "Batteries", icon: BatteryFull },
  { id: "accessories", label: "Accessories", icon: Package },
];
