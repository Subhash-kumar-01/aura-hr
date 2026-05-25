import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Lightbulb, FileSearch, TrendingUp } from "lucide-react";
import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/report")({ component: ReportPage });

const missing = ["GraphQL", "Cypress", "Webpack", "AWS Lambda", "Storybook"];
const present = ["React", "TypeScript", "Tailwind", "Node.js", "Jest", "Git", "REST APIs"];
const tips = [
  { title: "Add measurable impact", text: "Quantify achievements with metrics (e.g. 'reduced load time by 42%')." },
  { title: "Include missing keywords", text: "Add 'GraphQL' and 'Cypress' near your skills section to boost match." },
  { title: "Optimize formatting", text: "Use standard section headers (Experience, Skills, Education) for ATS parsers." },
  { title: "Trim to two pages", text: "Move older roles to a 'Earlier Experience' summary to stay focused." },
];

function ReportPage() {
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">ATS Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aarav_Mehta_Frontend.pdf • Senior Frontend Engineer
          </p>
        </div>
        <button className="rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 self-start">Export PDF</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6">
          <h3 className="font-medium">Overall ATS Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: 86 }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={20} fill="url(#rg)" background={{ fill: "#ffffff10" }} />
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-32 text-center pointer-events-none">
            <div className="text-4xl font-semibold text-gradient">86</div>
            <div className="text-xs text-muted-foreground">Strong match</div>
          </div>
          <div className="mt-24 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Keywords", v: "78%" },
              { k: "Format", v: "94%" },
              { k: "Content", v: "82%" },
            ].map((s) => (
              <div key={s.k} className="glass rounded-lg py-2">
                <div className="text-sm font-semibold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2 glass-strong rounded-2xl p-6">
          <h3 className="font-medium flex items-center gap-2"><FileSearch className="w-4 h-4 text-primary" /> Keyword Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Missing keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {missing.map((m) => (
                  <span key={m} className="text-xs px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Detected keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {present.map((m) => (
                  <span key={m} className="text-xs px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-2xl p-6 mt-4">
        <h3 className="font-medium flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-400" /> Improvement Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {tips.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 font-medium text-sm">
                <TrendingUp className="w-4 h-4 text-primary" /> {t.title}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}