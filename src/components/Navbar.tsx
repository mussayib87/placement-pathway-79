import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Search,
  X,
  GraduationCap,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home", icon: GraduationCap, exact: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/experiences", label: "Experiences", icon: MessagesSquare },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/notes", label: "Notes", icon: BookOpen },
  { to: "/search", label: "Search", icon: Search },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/auth", replace: true });
  }


  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <GraduationCap className="size-5" />
          </span>

          <span className="font-display text-[15px] leading-tight font-extrabold tracking-tight">
            Placement
            <span className="block text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Resource Hub
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{
                exact: "exact" in l ? l.exact : false,
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/experiences/new">
              Share Experience
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 lg:hidden">
          <div className="grid gap-1 pt-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{
                  exact: "exact" in l ? l.exact : false,
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
              >
                <l.icon className="size-4" />
                {l.label}
              </Link>
            ))}

            <Button asChild className="mt-2 w-full">
              <Link
                to="/experiences/new"
                onClick={() => setOpen(false)}
              >
                Share Experience
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
    );
            
      }
