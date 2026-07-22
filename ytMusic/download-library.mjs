import { readFile } from "fs/promises";
import fs from "fs/promises";
import path from "path";
import { downloadMP3, DOWNLOAD_DIR } from "./download-mp3.mjs";

// Path to the JSON dataset (swap this to point at the full 6000-song
// library or the 50-song test file).
const DATA_PATH = new URL("./vitune_library_test.json", import.meta.url);

// Build a map of songId -> Set of every playlist name (plus "liked") that
// song belongs to. This is how we dedupe: each unique song is downloaded
// exactly once, but we remember every playlist it should show up in.
function buildSongPlaylistMap(data) {
  const map = new Map(); // id -> Set<categoryName>

  for (const playlist of data.customPlaylists ?? []) {
    for (const song of playlist.songs ?? []) {
      if (!map.has(song.id)) map.set(song.id, new Set());
      map.get(song.id).add(playlist.name);
    }
  }

  for (const song of data.likedSongs ?? []) {
    if (!map.has(song.id)) map.set(song.id, new Set());
    map.get(song.id).add("liked");
  }

  return map;
}

async function listFiles(dir) {
  try {
    return new Set(await fs.readdir(dir));
  } catch (err) {
    if (err.code === "ENOENT") return new Set(); // folder doesn't exist yet
    throw err;
  }
}

// download-mp3.mjs names files after the video's real title (via yt-dlp's
// %(title)s.%(ext)s), which we can't predict ahead of time. So we snapshot
// the target folder before and after downloading, and whatever new file
// shows up is the one we just downloaded.
async function downloadAndLocate(videoId, category) {
  const targetDir = category ? path.join(DOWNLOAD_DIR, category) : DOWNLOAD_DIR;

  const before = await listFiles(targetDir);
  await downloadMP3(videoId, { category });
  const after = await listFiles(targetDir);

  const newFiles = [...after].filter((f) => !before.has(f));

  if (newFiles.length === 0) {
    throw new Error(`Downloaded ${videoId} but couldn't find the resulting file in ${targetDir}`);
  }

  // Normally there's exactly one new file. If there's more than one
  // (e.g. a leftover .part or .json sidecar), prefer the .mp3.
  const mp3File = newFiles.find((f) => f.endsWith(".mp3")) ?? newFiles[0];
  return path.join(targetDir, mp3File);
}

// Make sure a copy of `sourcePath` exists at `filePath`, either via a
// symlink (cheap, preferred) or a real copy (fallback if symlinks aren't
// permitted, e.g. some Windows setups).
async function linkIntoPlaylist(sourcePath, filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.symlink(path.resolve(sourcePath), filePath);
  } catch (err) {
    if (err.code === "EEXIST") return; // already there, fine
    await fs.copyFile(sourcePath, filePath);
  }
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);

  const songPlaylists = buildSongPlaylistMap(data);

  console.log(`Found ${songPlaylists.size} unique songs across ${data.customPlaylists?.length ?? 0} playlists + liked songs.`);

  let success = 0;
  let failed = 0;

  for (const [id, categorySet] of songPlaylists) {
    const categories = Array.from(categorySet);
    const [primaryCategory, ...otherCategories] = categories;

    try {
      // Download once, into the first playlist it belongs to, and figure
      // out what filename yt-dlp actually gave it.
      const sourcePath = await downloadAndLocate(id, primaryCategory);
      const filename = path.basename(sourcePath);

      // Then make it show up in every other playlist too, without
      // re-downloading — just link/copy the same file under the same name.
      for (const category of otherCategories) {
        const destPath = path.join(DOWNLOAD_DIR, category, filename);
        await linkIntoPlaylist(sourcePath, destPath);
      }

      success++;
    } catch (err) {
      failed++;
      console.error(`Failed to download ${id} (${categories.join(", ")}):`, err.message ?? err);
    }
  }

  console.log(`Done. ${success} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
