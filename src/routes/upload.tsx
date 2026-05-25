import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, X, Cloud } from "lucide-react";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/upload")({ component: UploadPage });

type UploadItem = { id: string; name: string; size: string; progress: number; done: boolean };

function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([
    { id: "1", name: "Aarav_Mehta_Frontend.pdf", size: "284 KB", progress: 100, done: true },
    { id: "2", name: "Sara_Chen_ML.pdf", size: "312 KB", progress: 100, done: true },
    { id: "3", name: "Diego_Romero_FullStack.docx", size: "198 KB", progress: 62, done: false },
  ]);
  const [dragOver, setDragOver] = useState(false);

  const fakeUpload = useCallback((files: File[]) => {
    const newOnes = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: `${Math.round(f.size / 1024)} KB`,
      progress: 0,
      done: false,
    }));
    setItems((prev) => [...newOnes, ...prev]);
    newOnes.forEach((n) => {
      const t = setInterval(() => {
        setItems((prev) =>
          prev.map((it) => {
            if (it.id !== n.id) return it;
            const p = Math.min(100, it.progress + 10 + Math.random() * 20);
            return { ...it, progress: p, done: p >= 100 };
          }),
        );
      }, 250);
      setTimeout(() => clearInterval(t), 3500);
    });
  }, []);

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold tracking-tight">Upload Resumes</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Drag & drop or bulk-upload PDFs and DOCX.</p>

      <motion.label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          fakeUpload(Array.from(e.dataTransfer.files));
        }}
        animate={{ scale: dragOver ? 1.01 : 1 }}
        className={`block glass-strong rounded-2xl border-2 border-dashed cursor-pointer p-12 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-white/15"
        }`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files && fakeUpload(Array.from(e.target.files))}
        />
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center glow"
        >
          <UploadCloud className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <div className="mt-4 font-medium">Drop resumes here</div>
        <div className="text-sm text-muted-foreground mt-1">
          or <span className="text-primary">browse files</span> — PDF, DOCX up to 10MB each
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Cloud className="w-3 h-3" /> Bulk upload supported</span>
          <span>•</span>
          <span>AI parsing in 2-3s</span>
        </div>
      </motion.label>

      <div className="glass-strong rounded-2xl mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Upload Queue</h3>
          <span className="text-xs text-muted-foreground">{items.length} files</span>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((it) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-3 rounded-xl glass"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 grid place-items-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <span className="truncate font-medium">{it.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{it.size}</span>
                  </div>
                  <div className="h-1.5 mt-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      animate={{ width: `${it.progress}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${it.done ? "bg-emerald-400" : "bg-gradient-to-r from-primary to-accent"}`}
                    />
                  </div>
                </div>
                {it.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {Math.round(it.progress)}%
                  </span>
                )}
                <button
                  onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}