import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Star, Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/candidates")({ component: Candidates });

const data = [
  { name: "Aarav Mehta", role: "Senior Frontend Engineer", location: "Bangalore, IN", exp: "7 yrs", match: 96, ats: 92, skills: 94, tags: ["React", "TS", "Next.js"] },
  { name: "Sara Chen", role: "ML Engineer", location: "San Francisco, US", exp: "5 yrs", match: 93, ats: 90, skills: 88, tags: ["Python", "PyTorch", "MLOps"] },
  { name: "Diego Romero", role: "Full Stack Developer", location: "Madrid, ES", exp: "6 yrs", match: 91, ats: 87, skills: 90, tags: ["Node", "React", "AWS"] },
  { name: "Priya Sharma", role: "Data Scientist", location: "Mumbai, IN", exp: "4 yrs", match: 89, ats: 85, skills: 86, tags: ["SQL", "Python", "Tableau"] },
  { name: "Liam O'Connor", role: "DevOps Engineer", location: "Dublin, IE", exp: "8 yrs", match: 87, ats: 84, skills: 89, tags: ["K8s", "Terraform", "AWS"] },
  { name: "Mei Tanaka", role: "Product Designer", location: "Tokyo, JP", exp: "6 yrs", match: 84, ats: 80, skills: 82, tags: ["Figma", "UX", "Prototyping"] },
];

function Ring({ value, label }: { value: number; label: string }) {
  const c = 2 * Math.PI * 22;
  return (
    <div className="flex flex-col items-center">
      <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
        <circle cx="30" cy="30" r="22" stroke="#ffffff15" strokeWidth="5" fill="none" />
        <motion.circle
          cx="30" cy="30" r="22" stroke="url(#cgrad)" strokeWidth="5" fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${(value / 100) * c} ${c}` }}
          transition={{ duration: 1 }}
        />
        <defs>
          <linearGradient id="cgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="-mt-11 text-sm font-semibold">{value}</div>
      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Candidates() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ranked Candidates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data.length} candidates matched for <span className="text-foreground">Senior Frontend Engineer</span>
          </p>
        </div>
        <button className="rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Re-rank with AI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-strong rounded-2xl p-5 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-sm font-semibold text-primary-foreground">
                {c.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                  <Briefcase className="w-3 h-3" /> {c.role}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {c.location} • {c.exp}
                </div>
              </div>
              <Star className="w-4 h-4 text-muted-foreground hover:text-amber-400 cursor-pointer" />
            </div>

            <div className="grid grid-cols-3 mt-5">
              <Ring value={c.match} label="Match" />
              <Ring value={c.ats} label="ATS" />
              <Ring value={c.skills} label="Skills" />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {c.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full glass">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium py-2">View profile</button>
              <button className="w-9 h-9 grid place-items-center rounded-lg glass hover:bg-white/10">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}