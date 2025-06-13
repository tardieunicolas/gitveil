import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { log } from "../utils/logger";

interface RecordOptions {
  email: string;
  since?: string;
  dryRun?: boolean;
  target?: string;
}

export async function recordActivity(options: RecordOptions): Promise<void> {
  let {
    email,
    since = "24h",
    dryRun = false,
    target = "./records-folder",
  } = options;
  // Always resolve records-folder relative to the project root
  const projectRoot = path.resolve(__dirname, "../../");
  target = path.join(projectRoot, "records-folder");
  try {
    let authorEmail = email;
    let filterByEmail = true;
    if (!authorEmail) {
      try {
        authorEmail = execSync("git config user.email").toString().trim();
      } catch (e) {
        // ignore, will fallback to all commits
      }
    }
    if (!authorEmail) {
      filterByEmail = false;
      log(
        "warn",
        "No email provided and unable to retrieve from git config. All commits will be included."
      );
    }
    // 2. Fetch latest changes
    log("info", "Fetching latest changes from origin...");
    try {
      execSync("git fetch origin", { stdio: "inherit" });
    } catch (e) {
      log("warn", "Could not fetch from origin. Continuing anyway.");
    }
    // 3. Extract commit dates
    const branch = "origin/main";
    const gitLogCmd = filterByEmail
      ? `git log ${branch} --author=\"${authorEmail}\" --pretty=format:%ad --date=iso8601-strict`
      : `git log ${branch} --pretty=format:%ad --date=iso8601-strict`;
    let commitsRaw = "";
    try {
      commitsRaw = execSync(gitLogCmd).toString();
    } catch (e) {
      log("error", "Error running git log.");
      return;
    }
    const commitDates = commitsRaw.split("\n").filter(Boolean);
    if (dryRun) {
      log(
        "info",
        `[DRY RUN] Commits found${
          filterByEmail ? " for " + authorEmail : ""
        }: ${commitDates.length}`
      );
      commitDates.forEach((date) => log("info", date));
      return;
    }
    // 4. Write to JSON file
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toISOString().slice(11, 19).replace(/:/g, ""); // HHmmss
    let baseName = `record_${date}_${time}`;
    let outputFile = path.join(target, `${baseName}.json`);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    fs.writeFileSync(outputFile, JSON.stringify(commitDates, null, 2), "utf-8");
    // 5. Log summary
    const uniqueDays = new Set(commitDates.map((d) => d.slice(0, 10)));
    log("info", `✅ Commits successfully exported for email: ${authorEmail}`);
    log("info", `🎉 JSON file generated: ${outputFile}`);
  } catch (error: any) {
    log("error", `Error recording activity: ${error?.message || error}`);
  }
}
