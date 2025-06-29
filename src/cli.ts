#!/usr/bin/env node
import { Command } from 'commander';
import { recordActivity } from './commands/record';
import { pushCommits } from './commands/push';
import { checkStatus } from './commands/status';
import { handleConfigCommand } from './commands/config';

const program = new Command();

program
  .name('gitveil')
  .description('CLI tool for synchronizing development activity to GitHub')
  .version('1.0.0');

program
  .command('record')
  .description('Record Git activity based on filters')
  .option('--email <email>', 'Git email to filter activity')
  .option('--dry-run', 'Show commits without creating them')
  .action((options) => recordActivity(options));

program
  .command('push')
  .description('Push anonymized commits to GitHub')
  .action((options) => pushCommits(options));

program
  .command('status')
  .description('Check the synchronization status of the mirror repository')
  .action((options) => checkStatus(options));

program
  .command('config')
  .description('Modify the configuration settings')
  .argument('[key]', 'Config key to set (email, name, targetRepoPath)')
  .argument('[value]', 'Value to set for the key')
  .option('--here', 'Set value from current git context or working directory')
  .option('--init', 'Initialize all config values from current git context and working directory')
  .action(async (key, value, options) => {
    await handleConfigCommand(key, value, options);
  });

program.parse(process.argv);