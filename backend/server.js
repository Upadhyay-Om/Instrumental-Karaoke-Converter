import "dotenv/config";
import express from "express";
import cors from "cors";
import songRoutes from "./routes/songRoutes.js";

// ── Debug: confirm .env loaded ───────────────────────────────────
console.log("[DEBUG] Replicate token loaded:", process.env.REPLICATE_API_TOKEN ? "YES" : "NO");
console.log("[DEBUG] PORT:", process.env.PORT || "5000 (default)");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────
app.use("/", songRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🎵  MusicGen backend running → http://localhost:${PORT}\n`);
});
