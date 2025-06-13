const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Display a warning message and require user confirmation
console.log('\n'); // Log a visual line break for spacing
console.log('⚠️  WARNING: This script will modify your local git history by creating a commit for each date in feed_2025-06-06.js.');
console.log('Each commit will edit the PULSE.md file with an incremented counter and the number of unique days.');
console.log('\n'); // Log a visual line break for spacing
console.log('Make sure you want to proceed before continuing !');
console.log('Type "YES" (in uppercase) to continue, or anything else to cancel.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you confirm execution ? ', (answer) => {
  if (answer !== 'YES') {
    console.log('Operation cancelled.');
    rl.close();
    process.exit(0);
  }

  // Load commit dates
  const feed = require('./feed_strategy_2025-06-06.js');
  const pulsePath = path.join(__dirname, 'PULSE.md');

  let counter = 0;
  let uniqueDays = new Set();

  for (const date of feed) {
    counter++;
    uniqueDays.add(date.slice(0, 10));

    // Update PULSE.md content
    const content = [
      `Counter: ${counter}`,
      `Number of unique days: ${uniqueDays.size}`,
      ''
    ].join('\n');

    fs.writeFileSync(pulsePath, content);

    // Add and commit the file with the specific date
    execSync('git add PULSE.md');
    execSync(
      `git commit -m "seed: commit #${counter} for ${date.slice(0, 10)}" --date="${date}"`
    );
    console.log(`Commit #${counter} created for ${date}`);
  }

   console.log('\n'); // Log a visual line break for spacing
   console.log('Congratulations! 🎉');
   console.log('All commits have been created.');
   console.log('\n'); // Log a visual line break for spacing
  rl.close();
});