# ![GitVeil Badge](https://img.shields.io/badge/GitHub%20Activity-Synced%20by%20GitVeil-brightgreen)

# 🚀 GitVeil

**Keep your GitHub contribution graph active without exposing your private code.**

GitVeil is a local CLI tool that automatically synchronizes your professional development activity to a personal GitHub repository. It creates anonymized commits that maintain your contribution streak while keeping your actual code completely private.

---

## 📦 Installation

Install GitVeil globally using npm:

```bash
npm install git-veil -g
```

Verify the installation:
```bash
gitveil --version
```

---

## 🚀 Quick Start

Get up and running in 4 simple steps:

### Step 1: Initialize Configuration
```bash
gitveil config --init
```
This will guide you through setting up:
- Your Git email (to identify your commits)
- Your GitHub username 
- Path to your target GitHub repository (where anonymized commits will be pushed)

### Step 2: Record Your Activity
```bash
gitveil record
```
Scans your Git history and creates records of your commits (without any code).

### Step 3: Check Status
```bash
gitveil status
```
Shows pending records and synchronization status.

### Step 4: Push to GitHub
```bash
gitveil push
```
Pushes anonymized commits to your GitHub repository.

**That's it!** Your GitHub activity graph will now reflect your work.

---

## 📚 Commands Reference

### `gitveil config`
Manage your GitVeil configuration:

```bash
# Interactive setup (recommended for first time)
gitveil config --init

# Set specific values
gitveil config email john@company.com
gitveil config name john-doe
gitveil config targetRepoPath /path/to/your/github/repo

# View current configuration
gitveil config
```

### `gitveil record` 
Record your Git activity:

```bash
# Record using configured email
gitveil record

# Record for a specific email
gitveil record --email john@company.com

# Preview what would be recorded (dry run)
gitveil record --dry-run
```

### `gitveil status`
Check synchronization status:

```bash
gitveil status
```
Shows:
- Number of pending records
- Last sync date
- Repository status

### `gitveil push`
Push anonymized commits to GitHub:

```bash
gitveil push
```

### `gitveil guide`
Show help and examples:

```bash
gitveil guide
# or
gitveil help
```

---

## 💡 How It Works

1. **Scan**: GitVeil scans your Git history for commits associated with your email
2. **Record**: Creates anonymous records of commit activity (dates, frequency)
3. **Generate**: Creates dummy commits in your target repository
4. **Push**: Synchronizes to GitHub maintaining your contribution pattern

**What GitVeil does:**
- ✅ Preserves your commit frequency and timing
- ✅ Maintains your GitHub contribution streak
- ✅ Works with any Git repository structure

**What GitVeil doesn't do:**
- ❌ Never copies or exposes your source code
- ❌ Never accesses remote repositories
- ❌ Never transmits sensitive data

---

## 🎯 Use Cases

**Perfect for developers who:**
- Work on private/proprietary projects during the day
- Want to maintain an active GitHub profile
- Care about privacy and code confidentiality  
- Want automated solution (no manual maintenance)

**Common scenarios:**
- Enterprise developers with private corporate repos
- Freelancers working on confidential client projects
- Open source contributors who also do private work
- Students working on both school and personal projects

---

## 🔧 Configuration Examples

### Basic Setup
```bash
# Quick interactive setup
gitveil config --init
```

### Manual Configuration
```bash
# Set your work email
gitveil config email john.doe@company.com

# Set your GitHub username
gitveil config name john-doe

# Set path to your public GitHub repo
gitveil config targetRepoPath /Users/john/github/my-activity-repo
```

### Configuration File Location
GitVeil stores configuration in `gitveil.config.json` in your project directory.

---

## 🔄 Daily Workflow

Once configured, your typical workflow is:

```bash
# At the end of your workday
gitveil record    # Record today's activity
gitveil push      # Push to GitHub

# Or run both at once
gitveil record && gitveil push
```

You can also automate this with a daily cron job or task scheduler.

---

## 🛠 Troubleshooting

### Common Issues

**"No Git repository found"**
- Make sure you're running GitVeil from a Git repository
- Verify Git is installed and accessible

**"No commits found for email"**
- Check your Git email configuration: `git config user.email`
- Verify the email matches your commits: `git log --author="your@email.com"`

**"Target repository not found"**
- Ensure the target repository path exists and is a Git repository
- Create the repository first: `git init` in the target directory

### Getting Help

```bash
# Show detailed help for any command
gitveil <command> --help

# Show quick start guide
gitveil guide

# Check version
gitveil --version
```

---

## 🔒 Privacy & Security

![Privacy](https://img.shields.io/badge/100%25%20private-0%25%20code%20shared-blue)
![Open Source](https://img.shields.io/badge/Open%20Source-MIT%20License-green)
![npm](https://img.shields.io/npm/v/git-veil)
![Auditable](https://img.shields.io/badge/Code-Fully%20Auditable-brightgreen)

**GitVeil is designed with privacy and security as core principles:**

### What We Guarantee
- 🔒 **No code copying**: Your source code never leaves your machine
- 🌐 **No network access**: GitVeil doesn't access your private repositories remotely
- 📊 **No telemetry**: No data collection, tracking, or analytics
- 🔍 **100% transparent**: Complete source code available for audit

### Security Features
- **Local processing only**: All operations happen on your machine
- **Minimal dependencies**: Only essential, well-audited npm packages
- **Open source**: Full source code available for security review
- **No hidden functionality**: Every feature clearly documented

### Audit GitVeil Yourself
```bash
# Clone and examine the source code
git clone https://github.com/tardieunicolas/gitveil
cd gitveil

# Review the code
npm install
npm run build
npm test

# Check dependencies
npm audit
```

---

## 📸 Before & After

See GitVeil in action:

**Before GitVeil:**
![Before](https://github.com/tardieunicolas/gitveil/blob/main/assets/gitpulse-demo-2024.png)

**After GitVeil:**
![After](https://github.com/tardieunicolas/gitveil/blob/main/assets/gitpulse-demo-2024-after.png)

Your contribution graph stays active without exposing any private work!

---

## 💬 Support

If **GitVeil** has been helpful to you, consider supporting its continued development:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-☕-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://coff.ee/nicolastardieu)

Your support helps keep this project alive and motivates further improvements. 
Even a small gesture makes a big difference — thank you! 🙏

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
