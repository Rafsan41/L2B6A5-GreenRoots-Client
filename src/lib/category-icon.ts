import {
  Pill, Thermometer, Apple, Leaf, Droplets, Activity,
  Heart, Eye, Baby, ShieldCheck, Cross, Brain,
  FlaskConical, Package,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  "pain-relief":         Pill,
  "cold-flu":            Thermometer,
  "digestive-health":    Apple,
  "vitamins-supplements":Leaf,
  "skin-care":           Droplets,
  "diabetes-care":       Activity,
  "heart-health":        Heart,
  "eye-care":            Eye,
  "baby-care":           Baby,
  "antibiotics":         ShieldCheck,
  "first-aid":           Cross,
  "mental-wellness":     Brain,
  "syrup":               FlaskConical,
}

export function getCategoryIcon(slug: string): LucideIcon {
  return iconMap[slug] ?? Package
}
