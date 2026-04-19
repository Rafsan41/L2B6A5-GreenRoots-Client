import { ROLE } from "@/constants/role"

export function getDashboardUrl(role?: string | null): string {
  if (role === ROLE.admin) return "/admin-dashboard"
  if (role === ROLE.seller) return "/seller-dashboard"
  return "/dashboard"
}
