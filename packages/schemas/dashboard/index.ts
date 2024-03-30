import { type VariantProps } from "class-variance-authority";
import { variants } from "./const";

export type GridItemLayout = "1x2" | "2x1" | "2x2" | "2x4"; // First number is width, second is height
export type GridItemType =
  | "social"
  | "news"
  | "tips"
  | "project"
  | "user"
  | "course"
  | "clock";

export interface GridItemInterface {
  id: string;
  layout: GridItemLayout;
  type: GridItemType;
  title: string;
  icon?: string;
  username?: string;
  description?: string;
  color?: string;
  buttonTitle?: string;
  buttonLink?: string;
  buttonSecondaryText?: string;
  promotion?: string;
  price?: string;
  oldPrice?: string;
  stars?: number;
  image?: string;
  classNameImage?: string;
  className?: string;
}

export type GridItemProps = { children: React.ReactNode } & VariantProps<
  typeof variants
>;
