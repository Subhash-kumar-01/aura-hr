import { scoreResume, type JobConfig, type Resume } from "./resumeData";

// Lazy-loaded worker; pdfjs ESM build ships its own worker.
let pdfjsP: Promise<typeof import("pdfjs-dist")> | null = null;
async function getPdfjs() {
  if (!pdfjsP) {
    pdfjsP = (async () => {
      const pdfjs = await import("pdfjs-dist");
      const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return pdfjsP;
}

export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (name.endsWith(".pdf")) {
    const pdfjs = await getPdfjs();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    let out = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      out += content.items.map((it: any) => it.str).join(" ") + "\n";
    }
    return out;
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth/mammoth.browser");
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return res.value as string;
  }
  // txt / md / fallback
  return new TextDecoder().decode(buf);
}

const SKILL_LIB = [
  "Python","SQL","Java","JavaScript","TypeScript","React","Node.js","Node",
  "C++","C#","Go","Rust","Ruby","PHP","Swift","Kotlin",
  "TensorFlow","PyTorch","Pytorch","Keras","NLP","Deep Learning","Machine Learning",
  "Data Science","Pandas","NumPy","Scikit-learn",
  "AWS","Azure","GCP","Docker","Kubernetes","Terraform","Linux",
  "GraphQL","REST","HTML","CSS","Tailwind","Next.js","Vue","Angular",
  "Cybersecurity","Networking","Ethical Hacking","Penetration Testing",
  "Tableau","Power BI","Excel","R","Spark","Hadoop","Kafka",
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#.]/g, "");

export function detectSkills(text: string): string[] {
  const lower = ` ${text.toLowerCase()} `;
  const found = new Set<string>();
  for (const s of SKILL_LIB) {
    const k = s.toLowerCase();
    // Word-ish boundary check
    const re = new RegExp(`(^|[^a-z0-9])${k.replace(/[.+*?()[\]\\]/g, "\\$&")}([^a-z0-9]|$)`);
    if (re.test(lower)) found.add(s);
  }
  return [...found];
}

export function guessName(file: File, text: string): string {
  // try first non-empty line that looks like a name
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const l of lines.slice(0, 8)) {
    if (l.length < 60 && /^[A-Z][a-zA-Z.'-]+(\s+[A-Z][a-zA-Z.'-]+){1,3}$/.test(l)) return l;
  }
  return file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
}

export function guessExperience(text: string): number {
  const m = text.match(/(\d{1,2})\+?\s*(?:years|yrs)\s*(?:of)?\s*experience/i);
  if (m) return Number(m[1]);
  return 0;
}

export function fileToResume(file: File, text: string, idx: number): Resume {
  const skills = detectSkills(text);
  // crude AI-style score = skill breadth + length signal
  const ai = Math.min(100, 30 + skills.length * 6 + Math.min(30, Math.floor(text.length / 400)));
  return {
    id: 100000 + idx,
    name: guessName(file, text),
    skills,
    experience: guessExperience(text),
    education: "",
    certifications: "",
    role: "",
    decision: "",
    salary: 0,
    projects: 0,
    aiScore: ai,
  };
}

export type Shortlisted = {
  file: File;
  text: string;
  resume: Resume;
  matchScore: number;
  skillMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  error?: string;
};

export async function processFiles(
  files: File[],
  job: JobConfig,
  onProgress: (done: number, total: number, current?: string) => void,
): Promise<Shortlisted[]> {
  const out: Shortlisted[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    onProgress(i, files.length, f.name);
    try {
      const text = await extractText(f);
      const r = fileToResume(f, text, i);
      const scored = scoreResume(r, job);
      out.push({
        file: f,
        text,
        resume: r,
        matchScore: scored.matchScore,
        skillMatch: scored.skillMatch,
        matchedSkills: scored.matchedSkills,
        missingSkills: scored.missingSkills,
      });
    } catch (e: any) {
      out.push({
        file: f,
        text: "",
        resume: fileToResume(f, "", i),
        matchScore: 0,
        skillMatch: 0,
        matchedSkills: [],
        missingSkills: job.requiredSkills,
        error: e?.message ?? "Failed to read",
      });
    }
  }
  onProgress(files.length, files.length);
  return out.sort((a, b) => b.matchScore - a.matchScore);
}