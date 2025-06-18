#!/usr/bin/env node
import { Command } from 'commander';
import { recordActivity } from './commands/record';
import { pushCommits } from './commands/push';
import { checkStatus } from './commands/status';

const program = new Command();

program
  .name('gitpulse')
  .description('CLI tool for synchronizing development activity to GitHub')
  .version('1.0.0');

program
  .command('record')
  .description('Record Git activity based on filters')
  .option('--email <email>', 'Git email to filter activity')
  .option('--dry-run', 'Show commits without creating them')
  .option('--target <path>', 'Path to the mirror repository', './records-folder')
  .action((options) => recordActivity(options));

program
  .command('push')
  .description('Push anonymized commits to GitHub')
  .option('--target <path>', 'Path to the mirror repository', './records-folder')
  .action((options) => pushCommits(options));

program
  .command('status')
  .description('Check the synchronization status of the mirror repository')
  .option('--target <path>', 'Path to the mirror repository', './records-folder')
  .action((options) => checkStatus(options));

program
  .command('config')
  .description('Modify the configuration settings')
  .argument('[key]', 'Config key to set (email, name, mirrorRepoPath)')
  .argument('[value]', 'Value to set for the key')
  .option('--here', 'Set value from current git context or working directory')
  .option('--init', 'Initialize all config values from current git context and working directory')
  .action(async (key, value, options) => {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');
    // Toujours utiliser le gitpulse.config.json du module courant
    const configPath = path.join(__dirname, '../gitpulse.config.json');
    let configUpdate: Record<string, string> = {};
    if (fs.existsSync(configPath)) {
      configUpdate = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    if (options.init) {
      // Initialise les trois valeurs depuis git et cwd
      try {
        configUpdate['mirrorRepoPath'] = process.cwd();
      } catch {}
      try {
        configUpdate['name'] = execSync('git config user.name').toString().trim();
      } catch {
        console.log('Could not get git user.name');
      }
      try {
        configUpdate['email'] = execSync('git config user.email').toString().trim();
      } catch {
        console.log('Could not get git user.email');
      }
    } else if (options.here && key) {
      if (key === 'mirrorRepoPath') {
        configUpdate['mirrorRepoPath'] = process.cwd();
      } else if (key === 'name') {
        try {
          configUpdate['name'] = execSync('git config user.name').toString().trim();
        } catch {
          console.log('Could not get git user.name');
        }
      } else if (key === 'email') {
        try {
          configUpdate['email'] = execSync('git config user.email').toString().trim();
        } catch {
          console.log('Could not get git user.email');
        }
      } else {
        console.log(`Unknown config key: ${key}`);
        return;
      }
    } else if (key && value) {
      if (["email", "name", "mirrorRepoPath"].includes(key)) {
        configUpdate[key] = value;
      } else {
        console.log(`Unknown config key: ${key}`);
        return;
      }
    }
    if (!options.here && !options.init && !(key && value)) {
      // Affiche tout le contenu si aucun argument
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        console.log(raw);
      } else {
        console.log('gitpulse.config.json not found');
      }
      return;
    }
    require('./commands/config').setConfig(configUpdate);
    console.log('Config updated:', configUpdate);
  });

program.parse(process.argv);