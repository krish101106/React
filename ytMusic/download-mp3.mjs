import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

const DOWNLOAD_DIR = path.join(process.cwd(), "downloads");

/**
 * Downloads a single YouTube video's audio as an MP3, given its video ID.
 * @param {string} videoId - The YouTube video ID (the part after "v=" in the URL)
 * @param {object} [options]
 * @param {string} [options.category] - Subfolder name to save into, e.g. "podcasts", "music".
 *   Saves into DOWNLOAD_DIR directly if omitted.
 * @param {number} [options.timeoutMs] - Kill the process if it hangs longer than this (default 5 min)
 * @returns {Promise<string>} - Resolves with the videoId on success
 */
async function downloadMP3(videoId, { category, timeoutMs = 5 * 60 * 1000 } = {}) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // If a category is given, files go into DOWNLOAD_DIR/<category>/,
    // otherwise they fall back to the root DOWNLOAD_DIR.
    const targetDir = category ? path.join(DOWNLOAD_DIR, category) : DOWNLOAD_DIR;
    await fs.mkdir(targetDir, { recursive: true });

    const args = [
        "-x",                         // Extract audio
        "--audio-format", "mp3",      // Convert to mp3
        "--audio-quality", "0",       // Best VBR quality
        "-f", "bestaudio",            // Download best available audio
        "--embed-thumbnail",
        "--embed-metadata",
        "--add-metadata",
        "-o", `${targetDir}/%(title)s.%(ext)s`,
        url,
    ];

    return new Promise((resolve, reject) => {
        const yt = spawn("yt-dlp", args);
        let stderrOutput = "";

        const timer = setTimeout(() => {
            yt.kill("SIGKILL");
            reject(new Error(`[${videoId}] Timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        yt.stdout.on("data", (data) => {
            process.stdout.write(`[${videoId}] ${data}`);
        });

        yt.stderr.on("data", (data) => {
            stderrOutput += data.toString();
        });

        // Handles the case where yt-dlp isn't installed, or the OS can't
        // launch the process at all. Without this, a failed spawn would
        // leave the promise hanging forever.
        yt.on("error", (err) => {
            clearTimeout(timer);
            reject(new Error(`[${videoId}] Failed to start yt-dlp: ${err.message}`));
        });

        yt.on("close", (code) => {
            clearTimeout(timer);
            if (code === 0) {
                resolve(videoId);
            } else {
                reject(new Error(`[${videoId}] yt-dlp exited with code ${code}\n${stderrOutput}`));
            }
        });
    });
}

// ---------------------------
// Export for use in another file, e.g.:
//
//   import { downloadMP3 } from "./download-mp3.mjs";
//   await downloadMP3("V1Ca9d7ZdsU");                                 // saves to downloads/
//   await downloadMP3("V1Ca9d7ZdsU", { category: "podcasts" });       // saves to downloads/podcasts/
//   await downloadMP3("V1Ca9d7ZdsU", { category: "music" });          // saves to downloads/music/
//
// ---------------------------
export { downloadMP3, DOWNLOAD_DIR };

// ---------------------------
// Allows running this file directly too:
//   node download-mp3.mjs <videoId> [category]
// ---------------------------
if (process.argv[2]) {
    const [, , videoId, category] = process.argv;
    downloadMP3(videoId, { category })
        .then((id) => console.log(`✅ [${id}] Done`))
        .catch((err) => console.error(err.message));
}
