import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSong } from "../services/musicGenService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SONGS_FILE = path.join(__dirname, "..", "data", "songs.json");

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────
function readSongs() {
  try {
    const raw = fs.readFileSync(SONGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSongs(songs) {
  fs.writeFileSync(SONGS_FILE, JSON.stringify(songs, null, 2), "utf-8");
}

// ─── POST /generate-song ────────────────────────────────────────
router.post("/generate-song", async (req, res) => {
  try {
    const { lyrics, genre } = req.body;

    if (!lyrics || !genre) {
      return res.status(400).json({ error: "lyrics and genre are required" });
    }

    console.log(`[API] Generating song — genre: ${genre}`);

    const audioUrl = await generateSong(lyrics, genre);

    const song = {
      id: uuidv4(),
      title: lyrics.slice(0, 40).trim() + (lyrics.length > 40 ? "…" : ""),
      lyrics,
      genre,
      audioUrl,
      createdAt: new Date().toISOString(),
    };

    const songs = readSongs();
    songs.unshift(song);          // newest first
    writeSongs(songs);

    console.log(`[API] Song saved — id: ${song.id}`);
    res.json(song);
  } catch (err) {
    console.error("[API] Generate error:", err);
    res.status(500).json({ error: "Failed to generate song" });
  }
});

// ─── GET /songs ──────────────────────────────────────────────────
router.get("/songs", (_req, res) => {
  res.json(readSongs());
});

// ─── GET /songs/:id ──────────────────────────────────────────────
router.get("/songs/:id", (req, res) => {
  const songs = readSongs();
  const song = songs.find((s) => s.id === req.params.id);
  if (!song) return res.status(404).json({ error: "Song not found" });
  res.json(song);
});

export default router;
