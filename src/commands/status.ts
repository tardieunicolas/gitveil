import { log } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";

interface StatusOptions {
  target?: string;
}

function findProjectRoot(): string {
  // Find the root of the GitPulse project (where gitpulse.config.json is located)
  let currentDir = path.resolve(__dirname, "../../");
  while (!fs.existsSync(path.join(currentDir, "gitpulse.config.json"))) {
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  return currentDir;
}

export function checkStatus(options: StatusOptions): void {
  const projectRoot = findProjectRoot();
  const recordsDir = path.join(projectRoot, "records-folder");
  let readyCount = 0;
  if (fs.existsSync(recordsDir)) {
    const files = fs.readdirSync(recordsDir);
    const filtered = files.filter(
      (f) => f.startsWith("record") && f.endsWith(".json")
    );
    readyCount = filtered.length;
  } else {
    log("warn", `⚠️  Records folder does not exist: ${recordsDir}`);
  }

  if (readyCount === 0) {
    console.log("✔️ Synchronization: UP TO DATE");
    console.log("Everything is up to date, nothing to push.");
  } else {
    console.log("⏳ Synchronization: WAITING");
    console.log(`📄 Files ready to record: ${readyCount}`);
    console.log("Use the command 'gitpulse push' to synchronize your records.");
  }
}
