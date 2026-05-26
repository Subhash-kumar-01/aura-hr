import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Users,
  FileSearch,
  BarChart3,
  LogOut,
  Sparkles,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Resumes", icon: Upload },
  { to: "/job", label: "Job Description", icon: FileText },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/report", label: "ATS Report", icon: FileSearch },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 mt-2">
      {nav.map((item) => {
        const active = loc.pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {active && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative" />
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 p-4 glass-strong rounded-r-2xl m-2 ml-0">
        <div className="flex items-center gap-2 px-3 py-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">HireSense</div>
            <div className="text-xs text-muted-foreground">AI ATS Platform</div>
          </div>
        </div>
        <NavList />
        <div className="mt-auto">
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 glass-strong p-4 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">HireSense</div>
                    <div className="text-xs text-muted-foreground">AI ATS Platform</div>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 grid place-items-center rounded-lg glass">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <NavList onNavigate={() => setMobileOpen(false)} />
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass-strong border-b border-white/10 px-3 sm:px-4 lg:px-8 py-3 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 grid place-items-center rounded-lg glass hover:bg-white/10 shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md glass rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="bg-transparent outline-none text-sm flex-1 min-w-0 placeholder:text-muted-foreground"
            />
          </div>
          <button className="hidden sm:grid w-9 h-9 place-items-center rounded-lg glass hover:bg-white/10">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-xs font-semibold text-primary-foreground">
            AK
          </div>
        </header>
        <div className="p-3 sm:p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
