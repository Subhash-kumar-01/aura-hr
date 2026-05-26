import { useEffect, useState } from "react";

export type Resume = {
  id: number;
  name: string;
  skills: string[];
  experience: number;
  education: string;
  certifications: string;
  role: string;
  decision: string;
  salary: number;
  projects: number;
  aiScore: number;
};

export type JobConfig = {
  role: string;
  minExperience: number;
  requiredSkills: string[];
};

export const DEFAULT_JOB: JobConfig = {
  role: "Data Scientist",
  minExperience: 3,
  requiredSkills: ["Python", "SQL", "Machine Learning"],
};

function parseCSV(text: string): Resume[] {
  const lines = text.trim().split(/\r?\n/);
  lines.shift();
  const rows: Resume[] = [];
  for (const line of lines) {
    // Naive CSV split that respects quoted fields
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === "," && !inQ) { cells.push(cur); cur = ""; continue; }
      cur += ch;
    }
    cells.push(cur);
    if (cells.length < 11) continue;
    rows.push({
      id: Number(cells[0]),
      name: cells[1],
      skills: cells[2].split(",").map((s) => s.trim()).filter(Boolean),
      experience: Number(cells[3]) || 0,
      education: cells[4],
      certifications: cells[5],
      role: cells[6],
      decision: cells[7],
      salary: Number(cells[8]) || 0,
      projects: Number(cells[9]) || 0,
      aiScore: Number(cells[10]) || 0,
    });
  }
  return rows;
}

let cache: Promise<Resume[]> | null = null;
export function loadResumes(): Promise<Resume[]> {
  if (!cache) {
    cache = fetch("/data/resumes.csv").then((r) => r.text()).then(parseCSV);
  }
  return cache;
}

export function useResumes() {
  const [data, setData] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadResumes().then((d) => { setData(d); setLoading(false); });
  }, []);
  return { data, loading };
}

const JOB_KEY = "hiresense.job";
export function loadJob(): JobConfig {
  if (typeof window === "undefined") return DEFAULT_JOB;
  try {
    const raw = localStorage.getItem(JOB_KEY);
    if (raw) return { ...DEFAULT_JOB, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_JOB;
}
export function saveJob(job: JobConfig) {
  try { localStorage.setItem(JOB_KEY, JSON.stringify(job)); } catch {}
}
export function useJob(): [JobConfig, (j: JobConfig) => void] {
  const [job, setJob] = useState<JobConfig>(DEFAULT_JOB);
  useEffect(() => { setJob(loadJob()); }, []);
  const update = (j: JobConfig) => { setJob(j); saveJob(j); };
  return [job, update];
}

export type Scored = Resume & {
  matchScore: number;
  skillMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#.]/g, "");

export function scoreResume(r: Resume, job: JobConfig): Scored {
  const req = job.requiredSkills.map(norm);
  const have = new Set(r.skills.map(norm));
  const matched = job.requiredSkills.filter((s) => have.has(norm(s)));
  const missing = job.requiredSkills.filter((s) => !have.has(norm(s)));
  const skillMatch = req.length ? Math.round((matched.length / req.length) * 100) : 0;
  const roleBonus = r.role.toLowerCase() === job.role.toLowerCase() ? 15 : 0;
  const expBonus = Math.min(15, Math.max(0, r.experience - job.minExperience) * 3);
  const expPenalty = r.experience < job.minExperience ? (job.minExperience - r.experience) * 6 : 0;
  const aiBlend = r.aiScore * 0.35;
  const skillWeight = skillMatch * 0.55;
  const raw = skillWeight + aiBlend + roleBonus + expBonus - expPenalty;
  const matchScore = Math.max(0, Math.min(100, Math.round(raw)));
  return { ...r, matchScore, skillMatch, matchedSkills: matched, missingSkills: missing };
}

export function rankResumes(rs: Resume[], job: JobConfig): Scored[] {
  return rs.map((r) => scoreResume(r, job)).sort((a, b) => b.matchScore - a.matchScore);
}