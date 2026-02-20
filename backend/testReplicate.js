import fetch from "node-fetch";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env from project root (one level up from backend/)
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env") });

const token = process.env.REPLICATE_API_TOKEN;

async function testToken() {
  console.log("\n─── Replicate API Token Test ───\n");

  if (!token) {
    console.log("❌ REPLICATE_API_TOKEN is not set in .env");
    process.exit(1);
  }

  console.log(`Token found: ${token.slice(0, 6)}${"*".repeat(token.length - 6)}`);

  try {
    const response = await fetch("https://api.replicate.com/v1/models", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.ok) {
      console.log("✅ Replicate API token is VALID");
      const data = await response.json();
      console.log(`   Models accessible: ${data.results?.length ?? "unknown"}`);
    } else {
      const err = await response.text();
      console.log(`❌ Replicate API token is INVALID (HTTP ${response.status})`);
      console.log(`   Response: ${err.slice(0, 200)}`);
    }
  } catch (err) {
    console.log(`❌ Network error: ${err.message}`);
  }

  console.log("");
}

testToken();
