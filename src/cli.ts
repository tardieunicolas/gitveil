#!/usr/bin/env node
import { Command } from "commander";
import { recordActivity } from "./commands/record";
import { pushCommits } from "./commands/push";
import { checkStatus } from "./commands/status";
import { handleConfigCommand } from "./commands/config";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));
const program = new Command();

program
  .name("gitveil")
  .description("CLI tool for synchronizing development activity to GitHub")
  .version(packageJson.version);

program
  .command("record")
  .description("Record Git activity based on filters")
  .option("--email <email>", "Git email to filter activity")
  .option("--dry-run", "Show commits without creating them")
  .addHelpText(
    "after",
    `
Examples:
  $ gitveil record                    # Record activity using configured email
  $ gitveil record --email user@example.com  # Record activity for specific email
  $ gitveil record --dry-run          # Preview without saving`
  )
  .action((options) => recordActivity(options));

program
  .command("push")
  .description("Push anonymized commits to GitHub")
  .addHelpText(
    "after",
    `
Examples:
  $ gitveil push                      # Push anonymous commits to GitHub`
  )
  .action((options) => pushCommits(options));

program
  .command("status")
  .description("Check the synchronization status of the mirror repository")
  .addHelpText(
    "after",
    `
Examples:
  $ gitveil status                    # Show sync status and pending records`
  )
  .action((options) => checkStatus(options));

program
  .command("config")
  .description("Modify the configuration settings")
  .argument("[key]", "Config key to set (email, name, targetRepoPath)")
  .argument("[value]", "Value to set for the key")
  .option(
    "--init",
    "Initialize configuration interactively"
  )
  .addHelpText(
    "after",
    `
Examples:
  $ gitveil config --init             # Initialize configuration interactively
  $ gitveil config email user@personal.com  # Set email for target repo commits
  $ gitveil config name username      # Set name for target repo commits
  $ gitveil config targetRepoPath /path/to/repo  # Set target repository path`
  )
  .action(async (key, value, options) => {
    await handleConfigCommand(key, value, options);
  });

program
  .command("guide")
  .alias("help")
  .alias("h")
  .description("Show a quick start guide and usage examples")
  .action(() => {
    console.log(`
🚀 GitVeil - Keep your GitHub active, without exposing your code

QUICK START:
  1. CREATE TARGET REPOSITORY:
     mkdir my-target-repo && cd my-target-repo
     git init
     gitveil config --init
     
  2. RECORD AND SYNC:
     gitveil record           # Record your Git activity  
     gitveil status           # Check what will be synced
     gitveil push             # Push anonymous commits to GitHub

IMPORTANT:
  • Configured email/name are used for authoring anonymous commits
  • GitVeil automatically detects your commits using git config user.email from each repository
  • No manual email matching required - detection is automatic

WORKFLOW:
  record → status → push → repeat

COMMANDS:
  config    Configure email, name, and target repository
  record    Scan and record your Git activity
  status    Check synchronization status
  push      Push anonymous commits to GitHub
  guide     Show this quick start guide

For detailed help: gitveil <command> --help

Examples:
  # Set up target repository
  mkdir my-target-repo && cd my-target-repo
  git init
  gitveil config --init
  
  # Daily workflow
  gitveil record
  gitveil status
  gitveil push
`);
  });

program.parse(process.argv);
