import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
        <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">HireSense</span>
        </div>
        <div className="relative space-y-6 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">
            Hire smarter with <span className="text-gradient">AI-powered</span> resume screening.
          </h1>
          <p className="text-muted-foreground">
            Rank, score, and shortlist top talent in seconds. Built for modern HR teams.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "2.8k", v: "Resumes" },
              { k: "94%", v: "Accuracy" },
              { k: "3.2s", v: "Avg scan" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl p-3">
                <div className="text-xl font-semibold text-gradient">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-muted-foreground">© 2026 HireSense Labs</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-strong rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your dashboard.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => navigate({ to: "/" }), 600);
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-xs text-muted-foreground">Work email</label>
              <div className="mt-1 flex items-center gap-2 glass rounded-lg px-3 py-2.5">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  required
                  defaultValue="alex@hiresense.ai"
                  type="email"
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="mt-1 flex items-center gap-2 glass rounded-lg px-3 py-2.5">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <input
                  required
                  defaultValue="••••••••"
                  type="password"
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-primary" /> Remember me
              </label>
              <a className="text-primary hover:underline" href="#">
                Forgot password?
              </a>
            </div>
            <button
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium py-2.5 flex items-center justify-center gap-2 glow hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="glass rounded-lg py-2.5 text-sm hover:bg-white/10 flex items-center justify-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button className="glass rounded-lg py-2.5 text-sm hover:bg-white/10">Google</button>
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            Don't have an account? <a className="text-primary hover:underline" href="#">Request access</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}