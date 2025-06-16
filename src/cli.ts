#!/usr/bin/env node
import { Command } from 'commander';
import { initializeMirror } from './commands/init';
import { recordActivity } from './commands/record';
import { pushCommits } from './commands/push';
import { checkStatus } from './commands/status';

const program = new Command();

program
  .name('gitpulse')
  .description('CLI tool for synchronizing development activity to GitHub')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize the mirror repository')
  .option('--email <email>', 'Git email to filter activity')
  .option('--target <path>', 'Path to the mirror repository', './records-folder')
  .action((options) => initializeMirror(options.email, options.target));

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
  .option('--mirror-path <path>', 'Path to the mirror repository')
  .action((options) => {
    const fs = require('fs');
    const path = require('path');
    // Recherche la config à la racine du projet GitPulse, même si lancé ailleurs
    let projectRoot = path.dirname(require.main?.filename || process.argv[1]);
    while (!fs.existsSync(path.join(projectRoot, 'gitpulse.config.json'))) {
      const parent = path.dirname(projectRoot);
      if (parent === projectRoot) break;
      projectRoot = parent;
    }
    const configPath = path.join(projectRoot, 'gitpulse.config.json');
    if (!options.mirrorPath) {
      // Affiche tout le contenu si aucun argument
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        console.log(raw);
      } else {
        console.log('gitpulse.config.json not found');
      }
      return;
    }
    // Charger la config existante pour respecter le type Config
    let configUpdate: any = {};
    if (fs.existsSync(configPath)) {
      configUpdate = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    if (options.mirrorPath) {
      (configUpdate as any).mirrorRepoPath = options.mirrorPath;
    }
    require('./commands/config').setConfig(configUpdate);
  });

program.parse(process.argv);