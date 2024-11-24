// scripts/watcher.ts
import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Define __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your .watchignore file
const watchIgnorePath = path.resolve(__dirname, "../.watchignore");

// Function to read ignore patterns from .watchignore
const getIgnoredPatterns = (): string[] => {
  if (!fs.existsSync(watchIgnorePath)) {
    console.warn(".watchignore file not found. No files will be ignored.");
    return [];
  }

  const data = fs.readFileSync(watchIgnorePath, "utf-8");
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#")); // Ignore empty lines and comments
};

// Initialize watcher
const watcher = chokidar.watch(".", {
  ignored: getIgnoredPatterns(),
  persistent: true,
  ignoreInitial: true, // Don't emit events for existing files on startup
});

// Event handlers
watcher
  .on("add", (filePath) => {
    console.log(`File added: ${filePath}`);
  })
  .on("change", (filePath) => {
    console.log(`File changed: ${filePath}`);
  })
  .on("unlink", (filePath) => {
    console.log(`File removed: ${filePath}`);
  })
  .on("error", (error) => {
    console.error(`Watcher error: ${error}`);
  });

console.log("Custom watcher is running...");
