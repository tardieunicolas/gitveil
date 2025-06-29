import * as fs from "fs";
import * as path from "path";

interface StatusOptions {
  target?: string;
}

function findProjectRoot(): string {
  // Find the root of the GitVeil project (where gitveil.config.json is located)
  let currentDir = path.resolve(__dirname, "../../");
  while (!fs.existsSync(path.join(currentDir, "gitveil.config.json"))) {
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
    console.warn(`⚠️  Records folder does not exist: ${recordsDir}`);
  }

  if (readyCount === 0) {
    console.log()
    console.log("> Synchronization: UP TO DATE ✔️");
    console.log("Everything is up to date, nothing to push.");
  } else {
    console.log()
    console.log("> Synchronization: WAITING ⏳");
    console.log(`> Files ready to record: ${readyCount}`);
    console.log()
    console.log("Use the command 'gitveil push' to synchronize your records.");
  }
}
