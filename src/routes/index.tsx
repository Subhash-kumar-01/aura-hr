import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Target,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { useMemo } from "react";
import { useResumes, useJob, rankResumes } from "@/lib/resumeData";

export const Route = createFileRoute("/")({ component: Dashboard });

const trendData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  resumes: 80 + Math.round(Math.sin(i / 2) * 40 + Math.random() * 60),
  matches: 30 + Math.round(Math.cos(i / 2) * 20 + Math.random() * 30),
}));

function Dashboard() {
  const { data } = useResumes();
  const [job] = useJob();

  const { stats, topCandidates, avgAts } = useMemo(() => {
    const total = data.length;
    const ranked = rankResumes(data, job);
    const top = ranked.slice(0, 4).map((r) => ({
      name: r.name, role: r.role, score: r.matchScore, skills: r.skillMatch,
    }));
    const matched = ranked.filter((r) => r.matchScore >= 70).length;
    const ats = total ? Math.round((data.reduce((s, r) => s + r.aiScore, 0) / total) * 10) / 10 : 0;
    const matchRate = total ? Math.round((matched / total) * 100) : 0;
    return {
      avgAts: ats,
      topCandidates: top,
      stats: [
        { label: "Total Resumes", value: total.toLocaleString(), change: "Kaggle dataset", icon: FileText, color: "from-primary to-accent" },
        { label: `Top Matches for ${job.role}`, value: matched.toLocaleString(), change: `${matchRate}% pool`, icon: Users, color: "from-emerald-400 to-cyan-400" },
        { label: "Avg ATS Score", value: ats.toString(), change: "out of 100", icon: Target, color: "from-amber-400 to-pink-400" },
        { label: "Match Rate", value: `${matchRate}%`, change: "≥70 score", icon: TrendingUp, color: "from-fuchsia-400 to-violet-500" },
      ],
    };
  }, [data, job]);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Live overview · {data.length.toLocaleString()} resumes loaded from Kaggle dataset.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 glass rounded-lg px-3 py-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" /> AI engine: <span className="text-emerald-400">Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-strong rounded-2xl p-5 relative overflow-hidden group"
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`} />
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-emerald-400 inline-flex items-center gap-1">
                  {s.change} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="mt-4 text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Resume Pipeline</h3>
                <p className="text-xs text-muted-foreground">Resumes processed vs. matched</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#ffffff60" fontSize={11} />
                <YAxis stroke="#ffffff60" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid #ffffff20", borderRadius: 8 }} />
                <Area type="monotone" dataKey="resumes" stroke="#8b5cf6" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="matches" stroke="#22d3ee" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-strong rounded-2xl p-5">
            <h3 className="font-medium mb-1">ATS Score</h3>
            <p className="text-xs text-muted-foreground mb-4">Average across all resumes</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: avgAts }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} fill="url(#radg)" background={{ fill: "#ffffff10" }} />
                <defs>
                  <linearGradient id="radg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-32 text-center pointer-events-none">
              <div className="text-4xl font-semibold text-gradient">{avgAts || "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Out of 100</div>
            </div>
            <div className="mt-24 text-xs text-muted-foreground text-center">
              Avg across {data.length.toLocaleString()} resumes
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Top Candidates</h3>
            <button className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {topCandidates.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-sm font-semibold text-primary-foreground">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.role}</div>
                </div>
                <div className="hidden sm:block w-48">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Match</span>
                    <span>{c.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gradient w-12 text-right">{c.score}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
