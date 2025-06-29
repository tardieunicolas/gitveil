import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import QRCode from "qrcode";
import { log } from "console";

// Options for the push command (can be extended for other parameters)
interface PushOptions {
  target?: string;
}

// Removes all files and folders in records-folder after a successful push
function clearRecordsFolder(recordsFolderPath: string) {
  if (!fs.existsSync(recordsFolderPath)) return;
  const files = fs.readdirSync(recordsFolderPath);
  for (const file of files) {
    const filePath = path.join(recordsFolderPath, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    } else if (fs.statSync(filePath).isDirectory()) {
      // Recursive deletion of subdirectories if needed
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }
}

// Main function for pushing anonymized commits
export async function pushCommits(options: PushOptions): Promise<void> {
  // Search for the GitVeil project root (to always use the correct config)
  let projectRoot = path.dirname(require.main?.filename || process.argv[1]);
  while (!fs.existsSync(path.join(projectRoot, "gitveil.config.json"))) {
    const parent = path.dirname(projectRoot);
    if (parent === projectRoot) break;
    projectRoot = parent;
  }
  const configPath = path.join(projectRoot, "gitveil.config.json");
  let targetRepoPath = "";
  let userName = "GitVeil";
  let userEmail = "gitveil@example.com";
  // Read the module config (always at the root)
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    targetRepoPath = config.targetRepoPath;
    userName = config.name || userName;
    userEmail = config.email || userEmail;
  } else {
    console.error("gitveil.config.json not found.");
    console.log(
      "Please run `gitveil config --init` to create the configuration file."
    );
    return;
  }

  console.log();
  console.log(`> Mirror repo path: ${targetRepoPath}`);
  // Check for the presence of README.md (serves as commit file)
  const readmePath = path.join(targetRepoPath, "README.md");
  let initialCounter = 0;
  if (fs.existsSync(readmePath)) {
    try {
      const readmeContent = fs.readFileSync(readmePath, "utf-8");
      const counterMatch = readmeContent.match(/Counter: (\d+)/);
      if (counterMatch) initialCounter = parseInt(counterMatch[1], 10);
    } catch (e) {
      console.warn("Unable to read the initial Counter value in README.md");
    }
  } else {
    // Create an empty README.md if needed
    fs.writeFileSync(readmePath, "");
    console.log("📄 README.md created in targetRepoPath.");
  }

  // Memory-optimized reading of JSON files (avoids parsing multiple times)
  const logsDir = path.join(projectRoot, "records-folder");
  if (!fs.existsSync(logsDir)) {
    console.error(`❌ Logs directory not found: ${logsDir}`);
    return;
  }
  // Only read .json files
  const files = fs.readdirSync(logsDir).filter((f) => f.endsWith(".json"));
  const allDates = new Set<string>();
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(logsDir, file), "utf-8");
      const json = JSON.parse(content);
      if (Array.isArray(json)) {
        json.forEach((entry: any) => allDates.add(entry));
      }
    } catch (e) {
      console.warn(`⚠️ Error parsing file ${file}`);
    }
  }

  // Initialize git repository only if needed
  const gitDir = path.join(targetRepoPath, ".git");
  if (!fs.existsSync(gitDir)) {
    // If the repository doesn't exist, initialize it and configure the user
    console.log(`🆕 Initializing git repo in ${targetRepoPath}`);
    execSync(`git -C "${targetRepoPath}" init`);
    execSync(`git -C "${targetRepoPath}" config user.name "${userName}"`);
    execSync(`git -C "${targetRepoPath}" config user.email "${userEmail}"`);
    if (fs.existsSync(readmePath)) {
      execSync(`git -C "${targetRepoPath}" add README.md`);
      const status = execSync(
        `git -C "${targetRepoPath}" status --porcelain`
      ).toString();
      if (status.trim()) {
        execSync(`git -C "${targetRepoPath}" commit -m "Initial commit"`);
        console.log("✅ Initial commit created.");
      }
    }
  } else {
    // If the repository exists, check user config
    let currentName = "";
    try {
      currentName = execSync(`git -C "${targetRepoPath}" config user.name`)
        .toString()
        .trim();
    } catch {}
    let currentEmail = "";
    try {
      currentEmail = execSync(`git -C "${targetRepoPath}" config user.email`)
        .toString()
        .trim();
    } catch {}
    if (currentName !== userName)
      execSync(`git -C "${targetRepoPath}" config user.name "${userName}"`);
    if (currentEmail !== userEmail)
      execSync(`git -C "${targetRepoPath}" config user.email "${userEmail}"`);
  }

  // Check if the repo has no commits and push an initial commit if needed
  let hasCommit = false;
  try {
    const logResult = execSync(
      `git -C "${targetRepoPath}" log --oneline main`,
      {
        stdio: "pipe",
      }
    ).toString();
    if (logResult.trim()) hasCommit = true;
  } catch (e) {}
  if (!hasCommit) {
    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, "# GitVeil\n");
    }
    execSync(`git -C "${targetRepoPath}" add README.md`);
    execSync(`git -C "${targetRepoPath}" commit -m "Initial commit"`);
    execSync(`git -C "${targetRepoPath}" push origin main --quiet`);
    execSync(`git -C "${targetRepoPath}" config core.autocrlf input`);
    console.log("> Initial commit created and pushed on main.");
  }

  // Get dates already present in git history (avoid duplicates)
  let existingCommitDates: string[] = [];
  try {
    const gitLogCmd = `git -C "${targetRepoPath}" log --pretty=format:%ad --date=iso8601-strict`;
    const stdout = execSync(gitLogCmd).toString();
    existingCommitDates = stdout.split("\n").filter(Boolean);
  } catch (e) {}

  // The counter must reflect the number of existing commits to avoid increment errors
  let counter = existingCommitDates.length;

  // Filter dates to commit (only new ones)
  let newCommits = 0;
  const toCommit = Array.from(allDates)
    .sort()
    .filter(
      (date) =>
        !existingCommitDates.includes(String(date).trim().replace(/\r|\n/g, ""))
    );
  const totalToCommit = toCommit.length;
  if (allDates.size > 0) {
    console.log(
      `📦 ${totalToCommit} commit(s) to create (not yet in history) out of ${allDates.size} extracted`
    );
    console.log();
    // Display a QR code to GitHub (small format)
    const qrAscii = await QRCode.toString("https://coff.ee/nicolastardieu", {
      type: "terminal",
      small: true,
    });
    console.log(
      "If GitVeil has been valuable to you, please consider supporting its continued development"
    );
    console.log(
      "Thank you for trusting GitVeil. Support the project here: https://coff.ee/nicolastardieu"
    );
    console.log();
    console.log(qrAscii);
    console.log();
  }
  if (totalToCommit === 0) {
    // Nothing to do, clean up and exit
    console.log();
    console.log("Everything is up to date, nothing to push.");
    clearRecordsFolder(logsDir);
    return;
  }
  const gitCmdBase = `git -C "${targetRepoPath}"`;
  let oldUserName = "";
  let oldUserEmail = "";
  try {
    oldUserName = execSync(`${gitCmdBase} config user.name`).toString().trim();
  } catch {}
  try {
    oldUserEmail = execSync(`${gitCmdBase} config user.email`)
      .toString()
      .trim();
  } catch {}

  // Synchronous loop for commits
  const lastCommitIndex = toCommit.length - 1;
  const commitCmds: {
    cmd: string;
    env: any;
    isLast: boolean;
    date: string;
    idx: number;
  }[] = [];
  for (const [idx, dateRaw] of toCommit.entries()) {
    const date = String(dateRaw).trim().replace(/\r|\n/g, "");
    if (existingCommitDates.includes(date)) {
      continue;
    }
    counter++;
    newCommits++;
    const commitEnv = {
      ...process.env,
      GIT_COMMITTER_NAME: userName,
      GIT_COMMITTER_EMAIL: userEmail,
    };
    if (idx !== lastCommitIndex) {
      commitCmds.push({
        cmd: `${gitCmdBase} commit --allow-empty --author="${userName} <${userEmail}>" -m "Commit #${counter} for ${date}" --date="${date}"`,
        env: commitEnv,
        isLast: false,
        date,
        idx,
      });
    } else {
      // Last commit: modify README.md
      const content = [`Counter: ${counter}`, ""].join("\n");
      fs.writeFileSync(readmePath, content);
      commitCmds.push({
        cmd: `${gitCmdBase} add -A`,
        env: commitEnv,
        isLast: false,
        date,
        idx,
      });
      commitCmds.push({
        cmd: `${gitCmdBase} status --porcelain`,
        env: commitEnv,
        isLast: true,
        date,
        idx,
      });
    }
  }
  for (const commit of commitCmds) {
    if (commit.isLast) {
      const stdout = execSync(commit.cmd, { env: commit.env }).toString();
      if (!stdout.trim()) continue;
      const lastCommitCmd = `${gitCmdBase} commit --author="${userName} <${userEmail}>" -m "Commit #${counter} for ${commit.date}" --date="${commit.date}"`;
      execSync(lastCommitCmd, { env: commit.env });
    } else {
      execSync(commit.cmd, { env: commit.env });
    }

    process.stdout.write(
      `\r> Commit ${commit.idx + 1}/${totalToCommit} (${Math.round(
        ((commit.idx + 1) / totalToCommit) * 100
      )}%)`
    );
  }

  // Restore original local git config
  try {
    if (oldUserName)
      execSync(`${gitCmdBase} config user.name "${oldUserName}"`);
    if (oldUserEmail)
      execSync(`${gitCmdBase} config user.email "${oldUserEmail}"`);
  } catch {}

  process.stdout.write("\n");
  // Automatic push to remote repository (--quiet option to speed up)
  try {
    console.log();
    console.log("> Pushing commits to remote repository... 🚀");
    execSync(`${gitCmdBase} push origin main --quiet`);
    console.log("> Push commits to remote completed ✅");
    // Clean up temporary files after push
    clearRecordsFolder(logsDir);
  } catch (err: any) {
    console.error(`❌ Git push failed: ${err.message}`);
  }
}
