#!/usr/bin/env node
import { Command } from "commander";
import { recordActivity } from "./commands/record";
import { pushCommits } from "./commands/push";
import { checkStatus } from "./commands/status";
import { handleConfigCommand } from "./commands/config";

const program = new Command();

program
  .name("gitveil")
  .description("CLI tool for synchronizing development activity to GitHub")
  .version("1.0.0");

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
  $ gitveil record --dry-run          # Preview commits without saving them`
  )
  .action((options) => recordActivity(options));

program
  .command("push")
  .description("Push anonymized commits to GitHub")
  .addHelpText(
    "after",
    `
Examples:
  $ gitveil push                      # Push all pending commits to GitHub`
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
    "Initialize all config values from current git context and working directory"
  )
  .addHelpText(
    "after",
    `
Examples:
  $ gitveil config --init             # Initialize configuration interactively
  $ gitveil config email user@example.com  # Set email configuration, using git user.email if not provided
  $ gitveil config name username  # Set username configuration, using git user.name if not provided
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
  1. gitveil config --init    # Initialize configuration
  2. gitveil record           # Record your Git activity  
  3. gitveil status           # Check what will be synced
  4. gitveil push             # Push anonymized commits to GitHub

WORKFLOW:
  record → status → push → repeat

COMMANDS:
  config    Configure GitVeil (email, repository path, etc.)
  record    Scan and record your Git activity
  status    Check synchronization status
  push      Push anonymized commits to GitHub
  guide     Show this quick start guide

OPTIONS:
  -h, --help     Show help for any command
  -V, --version  Show version number

For detailed help on any command:
  gitveil <command> --help

Examples:
  gitveil config --init
  gitveil record --dry-run
  gitveil status
  gitveil push
`);
  });

program.parse(process.argv);
