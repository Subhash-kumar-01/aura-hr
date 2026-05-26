import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { Plus, X, Briefcase, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loadJob, saveJob } from "@/lib/resumeData";

export const Route = createFileRoute("/job")({ component: JobPage });

function Chips({ items, setItems, placeholder }: { items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  return (
    <div className="glass rounded-lg p-2 flex flex-wrap gap-2 min-h-12">
      {items.map((it) => (
        <motion.span
          key={it}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-primary/30 to-accent/30 border border-white/10 rounded-full px-3 py-1"
        >
          {it}
          <button onClick={() => setItems(items.filter((x) => x !== it))}>
            <X className="w-3 h-3" />
          </button>
        </motion.span>
      ))}
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) {
            e.preventDefault();
            setItems([...items, val.trim()]);
            setVal("");
          }
        }}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm flex-1 min-w-32 px-2"
      />
    </div>
  );
}

function JobPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Data Scientist");
  const [minExp, setMinExp] = useState(3);
  const [skills, setSkills] = useState<string[]>(["Python", "SQL", "Machine Learning"]);
  const [tech, setTech] = useState<string[]>(["TensorFlow", "Pytorch"]);

  useEffect(() => {
    const j = loadJob();
    setRole(j.role);
    setMinExp(j.minExperience);
    setSkills(j.requiredSkills);
  }, []);

  const runMatch = () => {
    saveJob({ role, minExperience: minExp, requiredSkills: [...skills, ...tech] });
    navigate({ to: "/candidates" });
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold tracking-tight">Job Description</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Define the role our AI should match candidates against.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass-strong rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-xs text-muted-foreground">Job role / title</label>
            <div className="mt-1 flex items-center gap-2 glass rounded-lg px-3 py-2.5">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              >
                {["Data Scientist","AI Researcher","Software Engineer","Cybersecurity Analyst"].map((r) => (
                  <option key={r} className="bg-background">{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Experience (years)</label>
              <input
                type="number"
                min={0}
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value) || 0)}
                className="mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Employment type</label>
              <select className="mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm outline-none">
                <option className="bg-background">Full-time</option>
                <option className="bg-background">Contract</option>
                <option className="bg-background">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Required skills</label>
            <div className="mt-1"><Chips items={skills} setItems={setSkills} placeholder="Press Enter to add..." /></div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Preferred technologies</label>
            <div className="mt-1"><Chips items={tech} setItems={setTech} placeholder="Press Enter to add..." /></div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Job description</label>
            <textarea
              rows={6}
              defaultValue="We're hiring a Senior Frontend Engineer to build delightful, performant interfaces. You'll own complex features end-to-end and partner closely with design and product."
              className="mt-1 w-full glass rounded-lg px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={runMatch}
              className="rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium px-5 py-2.5 glow flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Run AI Match
            </button>
            <button
              onClick={() => saveJob({ role, minExperience: minExp, requiredSkills: [...skills, ...tech] })}
              className="rounded-lg glass px-5 py-2.5 text-sm hover:bg-white/10"
            >
              Save draft
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-2xl p-6">
          <h3 className="font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI Suggestions</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Common skills from the Kaggle resume dataset.</p>
          <div className="space-y-2">
            {["Python","SQL","TensorFlow","Pytorch","NLP","Deep Learning","Machine Learning","React","Java","C++","Linux","Cybersecurity","Networking","Ethical Hacking"].map((s) => (
              <button
                key={s}
                onClick={() => !skills.includes(s) && setSkills([...skills, s])}
                className="w-full text-left text-sm glass rounded-lg px-3 py-2 hover:bg-white/10 flex items-center justify-between"
              >
                {s}
                <Plus className="w-3 h-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}