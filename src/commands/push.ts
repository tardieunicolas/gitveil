import * as fs from "fs";
import * as path from "path";
import { log } from "../utils/logger";

interface PushOptions {
  target?: string;
}

function resolveTargetPath(target?: string): string {
  if (!target || target === "./records-folder") {
    let currentDir = process.cwd();
    let rootFound = false;
    while (!rootFound) {
      if (fs.existsSync(path.join(currentDir, "package.json"))) {
        rootFound = true;
      } else {
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
      }
    }
    return path.join(currentDir, "records-folder");
  }
  return target;
}

export async function pushCommits(options: PushOptions): Promise<void> {
  // Trouve la racine du projet GitPulse même si lancé ailleurs
  let projectRoot = path.dirname(require.main?.filename || process.argv[1]);
  // Remonte jusqu'à trouver le gitpulse.config.json
  while (!fs.existsSync(path.join(projectRoot, "gitpulse.config.json"))) {
    const parent = path.dirname(projectRoot);
    if (parent === projectRoot) break;
    projectRoot = parent;
  }
  const configPath = path.join(projectRoot, "gitpulse.config.json");
  let mirrorRepoPath = "";
  let userName = "GitPulse";
  let userEmail = "gitpulse@example.com";
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    mirrorRepoPath = config.mirrorRepoPath;
    userName = config.name || userName;
    userEmail = config.email || userEmail;
  } else {
    log("error", "gitpulse.config.json not found.");
    return;
  }

  log("info", `🔍 Mirror repo path: ${mirrorRepoPath}`);
  // 2. Create README.md if it does not exist (empty file if needed)
  const readmePath = path.join(mirrorRepoPath, "README.md");
  let initialCounter = 0;
  if (fs.existsSync(readmePath)) {
    try {
      const readmeContent = fs.readFileSync(readmePath, "utf-8");
      const counterMatch = readmeContent.match(/Counter: (\d+)/);
      if (counterMatch) initialCounter = parseInt(counterMatch[1], 10);
    } catch (e) {
      log(
        "warn",
        "Impossible de lire la valeur initiale du Counter dans README.md"
      );
    }
  } else {
    fs.writeFileSync(readmePath, "");
    log("info", "📄 README.md created in mirrorRepoPath.");
  }

  // 3. Extract all dates present in the JSON files in the records-folder folder
  const logsDir = path.join(projectRoot, "records-folder");
  if (!fs.existsSync(logsDir)) {
    log("error", `❌ Logs directory not found: ${logsDir}`);
    return;
  }
  const files = fs
    .readdirSync(logsDir)
    .filter((f) => fs.statSync(path.join(logsDir, f)).isFile());
  const allDates = new Set<string>();
  for (const file of files) {
    if (file.endsWith(".json")) {
      try {
        const content = fs.readFileSync(path.join(logsDir, file), "utf-8");
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
          json.forEach((entry: any) => {
            allDates.add(entry);
          });
        }
      } catch (e) {
        log("warn", `⚠️ Error parsing file ${file}`);
      }
    }
  }
  // --- Correction robustesse dépôt git ---
  const { execSync } = require("child_process");
  // 1. Initialiser le dépôt s'il n'existe pas
  if (!fs.existsSync(path.join(mirrorRepoPath, ".git"))) {
    log("info", `🆕 Initializing git repo in ${mirrorRepoPath}`);
    execSync(`git -C "${mirrorRepoPath}" init`);
    execSync(`git -C "${mirrorRepoPath}" config user.name "${userName}"`);
    execSync(`git -C "${mirrorRepoPath}" config user.email "${userEmail}"`);
    if (fs.existsSync(readmePath)) {
      execSync(`git -C "${mirrorRepoPath}" add README.md`);
      const status = execSync(
        `git -C "${mirrorRepoPath}" status --porcelain`
      ).toString();
      if (status.trim()) {
        execSync(`git -C "${mirrorRepoPath}" commit -m "Initial commit"`);
        log("info", "✅ Initial commit created.");
      }
    }
  }
  // --- Fin correction robustesse dépôt git ---

  // 4. For each unique date, create a commit
  let counter = initialCounter;
  let uniqueDays = new Set<string>();
  // Si on veut garder la continuité des jours uniques, il faudrait les stocker ailleurs ou les recalculer
  // Ici, on recommence le set, mais on démarre le compteur à la bonne valeur
  let existingCommitDates: string[] = [];
  try {
    const gitLogCmd = `git -C "${mirrorRepoPath}" log --pretty=format:%ad --date=iso8601-strict`;
    existingCommitDates = require("child_process")
      .execSync(gitLogCmd)
      .toString()
      .split("\n")
      .filter(Boolean);
  } catch (e) {}

  let newCommits = 0;
  const toCommit = Array.from(allDates)
    .sort()
    .filter(
      (date) =>
        !existingCommitDates.includes(String(date).trim().replace(/\r|\n/g, ""))
    );
  const totalToCommit = toCommit.length;
  log(
    "info",
    `📦 ${totalToCommit} commit(s) to create (not yet in history) out of ${allDates.size} extracted.`
  );
  if (totalToCommit === 0) {
    process.stdout.write("\n");
    log("info", "📡 No new commits to push");
    return;
  }
  const gitCmdBase = `git -C "${mirrorRepoPath}"`;
  let oldUserName = "";
  let oldUserEmail = "";
  try {
    oldUserName = execSync(`${gitCmdBase} config user.name`).toString().trim();
  } catch {}
  try {
    oldUserEmail = execSync(`${gitCmdBase} config user.email`).toString().trim();
  } catch {}

  let commitIndex = 0;
  for (const dateRaw of toCommit) {
    const date = String(dateRaw).trim().replace(/\r|\n/g, "");
    if (existingCommitDates.includes(date)) {
      continue;
    }
    newCommits++;
    counter++;
    commitIndex++;
    const content = [`Counter: ${counter}`, ""].join("\n");
    fs.writeFileSync(readmePath, content);
    const commitEnv = {
      ...process.env,
      GIT_COMMITTER_NAME: userName,
      GIT_COMMITTER_EMAIL: userEmail,
    };
    try {
      execSync(`${gitCmdBase} add README.md`);
      execSync(`${gitCmdBase} config core.autocrlf false`);
      const status = execSync(`${gitCmdBase} status --porcelain`).toString();
      if (!status.trim()) {
        continue;
      }
      const commitCmd = `${gitCmdBase} commit --author=\"${userName} <${userEmail}>\" -m "Commit #${counter} for ${date}" --date="${date}"`;
      execSync(commitCmd, { env: commitEnv });
      log(
        "info",
        `Commit ${commitIndex}/${totalToCommit} (${Math.round(
          (commitIndex / totalToCommit) * 100
        )}%)`
      );
    } catch (err: any) {
      log("error", `❌ Git commit failed: ${err.message}`);
      return;
    }
  }
  // Restaure la config git locale d'origine
  try {
    if (oldUserName) execSync(`${gitCmdBase} config user.name "${oldUserName}"`);
    if (oldUserEmail) execSync(`${gitCmdBase} config user.email "${oldUserEmail}"`);
  } catch {}

  process.stdout.write("\n");
  log("info", `Number of new commits: ${newCommits}`);

  // Push automatique vers le dépôt distant
  try {
    const gitCmdBase = `git -C "${mirrorRepoPath}"`;
    log("info", "🚀 Pushing commits to remote repository...");
    execSync(`${gitCmdBase} push origin main`, { stdio: "inherit" });
    log("info", "✅ Push commits to remote completed.");
  } catch (err: any) {
    log("error", `❌ Git push failed: ${err.message}`);
  }
}
