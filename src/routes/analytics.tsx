import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({ component: Analytics });

const skills = [
  { name: "React", value: 320 },
  { name: "Python", value: 280 },
  { name: "TypeScript", value: 240 },
  { name: "Node.js", value: 210 },
  { name: "AWS", value: 180 },
  { name: "SQL", value: 150 },
];
const COLORS = ["#8b5cf6", "#22d3ee", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

const compare = [
  { name: "Aarav", communication: 90, technical: 95, leadership: 75, culture: 88, experience: 92 },
  { name: "Sara", communication: 85, technical: 92, leadership: 80, culture: 84, experience: 88 },
  { name: "Diego", communication: 88, technical: 88, leadership: 78, culture: 90, experience: 85 },
];

const atsDist = Array.from({ length: 10 }, (_, i) => ({
  bucket: `${i * 10}-${i * 10 + 10}`,
  count: Math.round(20 + Math.sin(i / 1.5) * 30 + Math.random() * 30 + (i > 5 ? 40 : 0)),
}));

const hiringTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  applied: 200 + Math.round(Math.random() * 200),
  shortlisted: 40 + Math.round(Math.random() * 60),
  hired: 5 + Math.round(Math.random() * 15),
}));

function Card({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`glass-strong rounded-2xl p-5 ${className}`}>
      <div className="mb-3">
        <h3 className="font-medium">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

const tooltipStyle = { background: "rgba(20,20,40,0.9)", border: "1px solid #ffffff20", borderRadius: 8, fontSize: 12 };

function Analytics() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Hiring intelligence across your candidate pool.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Skill Distribution" subtitle="Top skills in talent pool" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={skills}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#ffffff60" fontSize={11} />
              <YAxis stroke="#ffffff60" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ffffff08" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {skills.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Pool Breakdown" subtitle="By seniority">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "Junior", value: 420 },
                  { name: "Mid", value: 780 },
                  { name: "Senior", value: 520 },
                  { name: "Lead", value: 180 },
                ]}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#ffffff80" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Candidate Comparison" subtitle="Top 3 candidates across dimensions" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={[
              { axis: "Communication", ...Object.fromEntries(compare.map(c => [c.name, c.communication])) },
              { axis: "Technical", ...Object.fromEntries(compare.map(c => [c.name, c.technical])) },
              { axis: "Leadership", ...Object.fromEntries(compare.map(c => [c.name, c.leadership])) },
              { axis: "Culture Fit", ...Object.fromEntries(compare.map(c => [c.name, c.culture])) },
              { axis: "Experience", ...Object.fromEntries(compare.map(c => [c.name, c.experience])) },
            ]}>
              <PolarGrid stroke="#ffffff15" />
              <PolarAngleAxis dataKey="axis" stroke="#ffffff80" fontSize={11} />
              <PolarRadiusAxis stroke="#ffffff30" fontSize={10} />
              {compare.map((c, i) => (
                <Radar key={c.name} name={c.name} dataKey={c.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.2} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11, color: "#ffffff80" }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="ATS Score Distribution" subtitle="Candidates per bucket">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={atsDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="bucket" stroke="#ffffff60" fontSize={10} />
              <YAxis stroke="#ffffff60" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ffffff08" }} />
              <defs>
                <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <Bar dataKey="count" fill="url(#bg1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Hiring Funnel — 12 months" subtitle="Applied vs shortlisted vs hired" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff60" fontSize={11} />
              <YAxis stroke="#ffffff60" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#ffffff80" }} />
              <Line type="monotone" dataKey="applied" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="shortlisted" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="hired" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AppLayout>
  );
}