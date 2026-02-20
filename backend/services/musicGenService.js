import fetch from "node-fetch";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

/**
 * Generate a song using Meta's MusicGen model on Replicate.
 * Uses the official model endpoint (no version hash needed).
 * Falls back to a free sample audio URL when no API token is configured.
 */
export async function generateSong(lyrics, genre) {
  const prompt = `${genre} style song: ${lyrics}`;

  // ── Demo / no-token fallback ───────────────────────────────────
  if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === "your_replicate_token") {
    console.log("[MusicGen] No Replicate token — using demo audio.");
    const idx = Math.floor(Math.random() * 10) + 1;
    return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${idx}.mp3`;
  }

  // ── Real Replicate call ────────────────────────────────────────
  try {
    console.log("[MusicGen] Calling Replicate API…");
    console.log("[MusicGen] Prompt:", prompt);

    // Use the standard predictions endpoint with confirmed version hash
    const createRes = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          version:
            "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
          input: {
            prompt,
            duration: 15,
            model_version: "stereo-melody-large",
            output_format: "mp3",
          },
        }),
      }
    );

    console.log("[MusicGen] Replicate response status:", createRes.status);

    const prediction = await createRes.json();

    if (!createRes.ok) {
      console.error("[MusicGen] Replicate API error:", JSON.stringify(prediction));
      throw new Error(prediction.detail || prediction.error || `HTTP ${createRes.status}`);
    }

    // If the model already finished (Prefer: wait), grab output directly.
    if (prediction.output) {
      console.log("[MusicGen] ✅ Song generated (immediate):", prediction.output);
      return prediction.output;
    }

    // Otherwise poll until complete
    console.log("[MusicGen] Polling for result… id:", prediction.id);
    let result = prediction;
    let attempts = 0;
    while (result.status !== "succeeded" && result.status !== "failed" && attempts < 40) {
      await new Promise((r) => setTimeout(r, 3000));
      attempts++;
      console.log(`[MusicGen] Poll #${attempts}, status: ${result.status}`);
      const pollRes = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        { headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` } }
      );
      result = await pollRes.json();
    }

    if (result.status === "failed") {
      throw new Error(result.error || "Replicate prediction failed");
    }

    if (result.status === "succeeded") {
      console.log("[MusicGen] ✅ Song generated (polled):", result.output);
      return result.output;
    }

    throw new Error("Prediction timed out after 40 polls");
  } catch (err) {
    console.error("[MusicGen] ❌ Replicate error:", err.message);
    console.log("[MusicGen] Falling back to demo audio.");
    const idx = Math.floor(Math.random() * 10) + 1;
    return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${idx}.mp3`;
  }
}
