import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, X, Cloud, FolderOpen, Sparkles, Download, AlertTriangle } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { processFiles, type Shortlisted } from "@/lib/resumeExtract";
import { useJob } from "@/lib/resumeData";

export const Route = createFileRoute("/upload")({ component: UploadPage });

function UploadPage() {
  const [job] = useJob();
  const [results, setResults] = useState<Shortlisted[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: "" });
  const [running, setRunning] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const folderRef = useRef<HTMLInputElement>(null);

  const ALLOWED = /\.(pdf|docx|txt|md)$/i;

  const handleFiles = useCallback(
    async (files: File[]) => {
      const filtered = files.filter((f) => ALLOWED.test(f.name) && f.size > 0);
      if (!filtered.length) return;
      setRunning(true);
      setProgress({ done: 0, total: filtered.length, current: "" });
      const out = await processFiles(filtered, job, (done, total, current) => {
        setProgress({ done, total, current: current ?? "" });
      });
      setResults((prev) => [...out, ...prev].sort((a, b) => b.matchScore - a.matchScore));
      setRunning(false);
    },
    [job],
  );

  const shortlisted = results.filter((r) => r.matchScore >= threshold);

  const exportCSV = () => {
    const head = "Rank,Name,File,MatchScore,SkillMatch,AIScore,Experience,MatchedSkills,MissingSkills";
    const rows = results.map((r, i) =>
      [
        i + 1,
        `"${r.resume.name.replace(/"/g, "'")}"`,
        `"${r.file.name}"`,
        r.matchScore,
        r.skillMatch,
        r.resume.aiScore,
        r.resume.experience,
        `"${r.matchedSkills.join("; ")}"`,
        `"${r.missingSkills.join("; ")}"`,
      ].join(","),
    );
    const blob = new Blob([head + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shortlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Upload &amp; Shortlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drop a single resume, many files, or an entire folder — we'll parse them in your browser and rank against{" "}
            <span className="text-foreground">{job.role}</span>.
          </p>
        </div>
        {results.length > 0 && (
          <button
            onClick={exportCSV}
            className="rounded-lg glass px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2 self-start md:self-auto"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>

      <motion.label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        animate={{ scale: dragOver ? 1.01 : 1 }}
        className={`block glass-strong rounded-2xl border-2 border-dashed cursor-pointer p-6 sm:p-12 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-white/15"
        }`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center glow"
        >
          <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
        </motion.div>
        <div className="mt-4 font-medium">Drop resumes or a folder here</div>
        <div className="text-sm text-muted-foreground mt-1">
          or <span className="text-primary">browse files</span> — PDF, DOCX, TXT up to 10MB each
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Cloud className="w-3 h-3" /> Bulk upload</span>
          <span className="hidden sm:inline">•</span>
          <span>100% in-browser parsing</span>
          <span className="hidden sm:inline">•</span>
          <span>No upload to server</span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); folderRef.current?.click(); }}
            className="rounded-lg glass px-4 py-2 text-xs hover:bg-white/10 flex items-center gap-2"
          >
            <FolderOpen className="w-3.5 h-3.5" /> Pick a folder
          </button>
        </div>
        <input
          ref={folderRef}
          type="file"
          className="hidden"
          // @ts-expect-error webkitdirectory is non-standard
          webkitdirectory=""
          directory=""
          multiple
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        />
      </motion.label>

      {/* Required skills + threshold controls */}
      <div className="glass-strong rounded-2xl mt-6 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Matching against:</span>{" "}
            <span className="font-medium">{job.role}</span>
            <span className="text-muted-foreground"> · min {job.minExperience}y · skills:</span>{" "}
            <span className="text-foreground">{job.requiredSkills.join(", ") || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Shortlist ≥</span>
            <input
              type="range" min={0} max={100} value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="w-8 text-right font-medium">{threshold}</span>
          </div>
        </div>
      </div>

      {(running || results.length > 0) && (
        <div className="glass-strong rounded-2xl mt-4 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {running ? "Parsing & scoring…" : "Shortlist"}
            </h3>
            <div className="text-xs text-muted-foreground">
              {running
                ? `${progress.done}/${progress.total} · ${progress.current || ""}`
                : `${shortlisted.length} of ${results.length} pass the bar`}
            </div>
          </div>
          {running && (
            <div className="h-1.5 mb-4 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                animate={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                transition={{ duration: 0.2 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          )}

          <div className="space-y-2">
            <AnimatePresence>
              {results.map((r, i) => {
                const pass = r.matchScore >= threshold;
                const key = `${r.file.name}-${i}`;
                const open = expanded === key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border ${pass ? "border-emerald-400/30 bg-emerald-400/[0.03]" : "border-white/10 glass"}`}
                  >
                    <button
                      onClick={() => setExpanded(open ? null : key)}
                      className="w-full text-left flex items-center gap-3 p-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/5 grid place-items-center shrink-0">
                        <FileText className={`w-4 h-4 ${pass ? "text-emerald-400" : "text-primary"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{r.resume.name}</span>
                          {pass ? (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300">Shortlist</span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground">Skip</span>
                          )}
                          {r.error && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {r.file.name} · {(r.file.size / 1024).toFixed(0)} KB
                          {r.resume.experience > 0 && ` · ${r.resume.experience}y exp`}
                        </div>
                      </div>
                      <div className="hidden sm:block w-40">
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          <span>Match</span><span>{r.matchScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            style={{ width: `${r.matchScore}%` }}
                            className={`h-full ${pass ? "bg-emerald-400" : "bg-gradient-to-r from-primary to-accent"}`}
                          />
                        </div>
                      </div>
                      <div className="text-base font-semibold text-gradient w-10 text-right">{r.matchScore}</div>
                    </button>
                    {open && (
                      <div className="px-3 pb-3 border-t border-white/5 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1.5">Matched skills</div>
                          <div className="flex flex-wrap gap-1">
                            {r.matchedSkills.length ? r.matchedSkills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300">{s}</span>
                            )) : <span className="text-muted-foreground">None</span>}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1.5">Missing skills</div>
                          <div className="flex flex-wrap gap-1">
                            {r.missingSkills.length ? r.missingSkills.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">{s}</span>
                            )) : <span className="text-muted-foreground">None</span>}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1.5">Detected skills in resume</div>
                          <div className="flex flex-wrap gap-1">
                            {r.resume.skills.slice(0, 12).map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-full glass">{s}</span>
                            ))}
                            {!r.resume.skills.length && <span className="text-muted-foreground">No known skills detected</span>}
                          </div>
                        </div>
                        {r.error && (
                          <div className="md:col-span-3 text-amber-300 text-xs">
                            ⚠️ {r.error}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AppLayout>
  );
}