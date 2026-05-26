import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Star, Mail, Sparkles, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useResumes, useJob, rankResumes, type Scored } from "@/lib/resumeData";

export const Route = createFileRoute("/candidates")({ component: Candidates });

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
  const { data, loading } = useResumes();
  const [job] = useJob();
  const [limit, setLimit] = useState(24);
  const [onlyRoleMatch, setOnlyRoleMatch] = useState(false);

  const ranked = useMemo(() => {
    let r = rankResumes(data, job);
    if (onlyRoleMatch) r = r.filter((c) => c.role.toLowerCase() === job.role.toLowerCase());
    return r;
  }, [data, job, onlyRoleMatch]);

  const visible = ranked.slice(0, limit);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ranked Candidates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading Kaggle dataset…" : `${ranked.length.toLocaleString()} resumes scored for`}{" "}
            <span className="text-foreground">{job.role}</span> · min {job.minExperience}y · {job.requiredSkills.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyRoleMatch((v) => !v)}
            className={`rounded-lg px-3 py-2 text-xs flex items-center gap-2 transition ${
              onlyRoleMatch ? "bg-primary/20 border border-primary/40" : "glass hover:bg-white/10"
            }`}
          >
            Role match only
          </button>
          <button className="rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Re-rank
          </button>
        </div>
      </div>

      {loading && (
        <div className="glass-strong rounded-2xl p-12 grid place-items-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <div className="text-sm mt-3">Parsing 1,000 resumes from the Kaggle dataset…</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map((c: Scored, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 12) * 0.03 }}
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
                  <Briefcase className="w-3 h-3" /> {c.role} · {c.experience}y
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <GraduationCap className="w-3 h-3" /> {c.education}
                  {c.certifications && c.certifications !== "None" ? ` · ${c.certifications}` : ""}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Star className={`w-4 h-4 cursor-pointer ${c.decision === "Hire" ? "text-amber-400" : "text-muted-foreground"}`} />
                <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  c.decision === "Hire" ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/10 text-rose-300"
                }`}>{c.decision}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 mt-5">
              <Ring value={c.matchScore} label="Match" />
              <Ring value={c.aiScore} label="ATS" />
              <Ring value={c.skillMatch} label="Skills" />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {c.skills.slice(0, 6).map((t) => {
                const matched = c.matchedSkills.includes(t);
                return (
                  <span
                    key={t}
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      matched
                        ? "bg-emerald-400/15 border border-emerald-400/30 text-emerald-300"
                        : "glass"
                    }`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium py-2">
                ${(c.salary / 1000).toFixed(0)}k · {c.projects} projects
              </button>
              <button className="w-9 h-9 grid place-items-center rounded-lg glass hover:bg-white/10">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && limit < ranked.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setLimit((l) => l + 24)}
            className="rounded-lg glass px-5 py-2.5 text-sm hover:bg-white/10"
          >
            Load more ({ranked.length - limit} remaining)
          </button>
        </div>
      )}
    </AppLayout>
  );
}