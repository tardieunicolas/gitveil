const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Retrieve the git user's email
  const AUTHOR_EMAIL = execSync('git config --global user.email').toString().trim();
  const BRANCH = 'origin/main';
  const DATE = new Date().toISOString().slice(0, 10);
  const OUTPUT_FILE = `record_${DATE}.js`;

  console.log('------------------------------------');
  console.log(`🚀 Using git user email: ${AUTHOR_EMAIL}`);
  if (!AUTHOR_EMAIL) {
    console.error("❌ Error: Unable to retrieve the git user's email.");
    process.exit(1);
  }

  console.log("Fetching latest changes from origin...");
  execSync('git fetch origin', { stdio: 'inherit' });
  console.log(`Extracting commits from ${AUTHOR_EMAIL} on ${BRANCH}...`);

  const commitsRaw = execSync(
    `git log ${BRANCH} --author="${AUTHOR_EMAIL}" --pretty=format:"%ad" --date=iso8601-strict`
  ).toString();

  // Format commit dates for JS export
  const commitDates = commitsRaw
    .split('\n')
    .filter(Boolean);

  const commitDatesArray = commitDates
    .map(date => `"${date}"`)
    .join(',\n  ');

  const jsContent = `module.exports = [\n  ${commitDatesArray}\n];\n`;

  fs.writeFileSync(OUTPUT_FILE, jsContent);

  const COMMIT_COUNT = commitDates.length;
  const uniqueDays = new Set(commitDates.map(d => d.slice(0, 10)));
  const UNIQUE_DAYS_COUNT = uniqueDays.size;
  console.log('\n'); // Log a visual line break for spacing
  console.log(`✅ Number of commits for ${AUTHOR_EMAIL}: ${COMMIT_COUNT}`);
  console.log(`📅 Number of unique days: ${UNIQUE_DAYS_COUNT}`);
  console.log('\n'); // Log a visual line break for spacing
  console.log(`🎉 JS file generated: ${OUTPUT_FILE}`);
  console.log('------------------------------------');
} catch (err) {
  console.error("❗ Error while executing the script:", err.message);
  process.exit(1);
}