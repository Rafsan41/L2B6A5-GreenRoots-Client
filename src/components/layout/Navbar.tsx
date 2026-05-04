"use client";

import { Menu, LogOut, LayoutDashboard, User, ChevronDown, Package } from "lucide-react";
import { LogoPlantSVG } from "@/components/icons/botanical";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Accordion,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import { CartIcon } from "./CartIcon";
import { authClient } from "@/lib/auth-client";
import { ROLE } from "@/constants/role";

// ── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name?: string | null): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getDashboardUrl(role?: string | null): string {
  const r = role?.toUpperCase()
  if (r === ROLE.admin)   return "/admin-dashboard"
  if (r === ROLE.seller)  return "/seller-dashboard"
  return "/dashboard"
}

function getOrdersLabel(role?: string | null): string {
  const r = role?.toUpperCase()
  if (r === ROLE.admin)   return "All Orders"
  if (r === ROLE.seller)  return "Customer Orders"
  return "My Orders"
}

// ── Menu items ────────────────────────────────────────────────────────────────
const menuItems: MenuItem[] = [
  { title: "Home",     url: "/" },
  { title: "Herbs",    url: "/categories" },
  { title: "Remedies", url: "/medicines" },
  { title: "Blog",     url: "/blog" },
  { title: "About",    url: "/about" },
]

// ── User Avatar section ───────────────────────────────────────────────────────
function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  if (isPending) {
    return (
      <div className="size-9 animate-pulse rounded-full bg-muted" />
    )
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const { name, email, image, role } = session.user as {
    name?: string
    email?: string
    image?: string
    role?: string
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none ring-primary/30 transition-all hover:ring-2 focus-visible:ring-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="size-9 cursor-pointer">
                <AvatarImage src={image ?? ""} alt={name ?? "User"} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {email ?? "No email"}
            </TooltipContent>
          </Tooltip>

          {/* Name + chevron visible on desktop */}
          <span className="hidden max-w-[120px] truncate text-sm font-medium lg:block">
            {name ?? "User"}
          </span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User info header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <Avatar className="size-9">
              <AvatarImage src={image ?? ""} alt={name ?? "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name ?? "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={getDashboardUrl(role)} className="cursor-pointer gap-2">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer gap-2">
            <User className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer gap-2">
            <Package className="size-4" />
            {getOrdersLabel(role)}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Mobile user section ───────────────────────────────────────────────────────
function MobileUserSection() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  if (isPending) return null

  if (!session?.user) {
    return (
      <div className="flex flex-col gap-3">
        <Button asChild variant="outline">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const { name, email, image, role } = session.user as {
    name?: string
    email?: string
    image?: string
    role?: string
  }

  return (
    <div className="flex flex-col gap-3">
      {/* User info card */}
      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
        <Avatar className="size-10">
          <AvatarImage src={image ?? ""} alt={name ?? "User"} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <Button asChild variant="outline" className="gap-2">
        <Link href={getDashboardUrl(role)}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
      </Button>

      <Button asChild variant="outline" className="gap-2">
        <Link href="/orders">
          <Package className="size-4" />
          {getOrdersLabel(role)}
        </Link>
      </Button>

      <Button
        variant="destructive"
        className="gap-2"
        onClick={handleSignOut}
      >
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = ({ className }: NavbarProps) => {
  return (
    <section
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className
      )}
      style={{ background: "oklch(from var(--parchment) l c h / 0.95)", borderColor: "var(--rule)" }}
    >
      <div className="container mx-auto w-full">

        {/* ── Desktop ──────────────────────────────────────────────────── */}
        <nav className="hidden items-center justify-between py-3 lg:flex">
          {/* Logo + nav links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoPlantSVG width={28} height={28} style={{ color: "var(--moss)" }} />
              <span
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 500,
                  fontSize: 22,
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                GreenRoots<span style={{ color: "var(--clay)", marginLeft: 1 }}>☘</span>
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      asChild
                      className="inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: theme toggle + cart + user */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <CartIcon />
            <UserMenu />
          </div>
        </nav>

        {/* ── Mobile ───────────────────────────────────────────────────── */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <LogoPlantSVG width={24} height={24} style={{ color: "var(--moss)" }} />
              <span
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 500,
                  fontSize: 20,
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                GreenRoots<span style={{ color: "var(--clay)", marginLeft: 1 }}>☘</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <CartIcon />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2">
                        <LogoPlantSVG width={22} height={22} style={{ color: "var(--moss)" }} />
                        <span
                          style={{
                            fontFamily: "var(--font-cormorant), Georgia, serif",
                            fontWeight: 500,
                            fontSize: 18,
                            lineHeight: 1,
                            color: "var(--ink)",
                          }}
                        >
                          GreenRoots<span style={{ color: "var(--clay)" }}>☘</span>
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-6 p-4">
                    {/* Nav links */}
                    <div className="flex flex-col gap-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>

                    {/* User section */}
                    <MobileUserSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export { Navbar };
