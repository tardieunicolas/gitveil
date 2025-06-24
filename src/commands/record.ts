import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { log } from "../utils/logger";

interface RecordOptions {
  email: string;
  dryRun?: boolean;
  target?: string;
}

export async function recordActivity(options: RecordOptions): Promise<void> {
  let { email, dryRun = false, target = "./records-folder" } = options;
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
        log(
          "warn",
          `Failed to get local git user.email: ${
            e instanceof Error ? e.message : String(e)
          }`
        );
        try {
          authorEmail = execSync("git config user.email --global")
            .toString()
            .trim();
          console.log(`Using global git user.email: ${authorEmail}`);
        } catch (e2) {
          log(
            "warn",
            `Failed to get global git user.email: ${
              e2 instanceof Error ? e2.message : String(e2)
            }`
          );
        }
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
    console.log();
    console.log("> Fetching latest changes from origin...");
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
      commitDates.forEach((date) => console.log(date));
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
    console.log(`✅ Commits successfully exported for email: ${authorEmail}`);
    console.log(`🎉 JSON file generated: ${outputFile}`);
    console.log()
    console.log(`Use the command 'gitpulse push' to synchronize your records.`);
  } catch (error: any) {
    log("error", `Error recording activity: ${error?.message || error}`);
  }
}
