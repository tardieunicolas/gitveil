![npm](https://img.shields.io/npm/v/git-veil)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)
![Privacy](https://img.shields.io/badge/100%25%20private-0%25%20code%20shared-blue)
![Auditable](https://img.shields.io/badge/Code-Fully%20Auditable-brightgreen)
![npm](https://img.shields.io/npm/dw/git-veil)

# 🚀 GitVeil

**Keep your GitHub contribution graph active without exposing your private code.**

---

## Overview

**GitVeil** is a local CLI tool that syncs your professional development activity to a personal GitHub repository, in a **discreet**, **automated**, and **confidential** way. It replays your commits in an anonymized form, never copying any source code.

---

## Why choose GitVeil ?

- ✅ **Visibility**: Keep your GitHub contribution graph active, even for private work.
- 🔒 **Privacy**: No code is copied, everything stays local, 100% private.
- 🧘 **Simplicity**: Quick installation, guided configuration, minimalist usage.

---

## See GitVeil in action:

**Before GitVeil :**

![Before](https://github.com/tardieunicolas/gitveil/blob/main/assets/gitpulse-demo-2024.png)

**After GitVeil :**

![After](https://github.com/tardieunicolas/gitveil/blob/main/assets/gitpulse-demo-2024-after.png)

Your contribution graph stays active without exposing any private work!

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

Get up and running in 2 simple steps:

### Step 1: Create and Configure Your Target Repository

**Create a dedicated Git repository for your anonymous commits:**

```bash
# Create a new directory for your target repository
mkdir my-target-repo
cd my-target-repo

# Initialize as a Git repository
git init

# Add a remote origin (your personal GitHub repo)
git remote add origin https://github.com/yourusername/my-target-repo.git

# Initialize GitVeil configuration
gitveil config --init
```

This will guide you through setting up:

- Your email (used for authoring anonymous commits in target repository)
- Your name (used for authoring anonymous commits in target repository)
- Path to your target repository (where anonymous commits will be stored)

**Important:** GitVeil automatically identifies your commits using the `git config user.email` from each private repository you scan. The configured email is only used for creating anonymous commits in your target repository.

### Step 2: Record and Sync Your Activity

Navigate to any Git repository and start recording:

```bash
# Record your Git activity
gitveil record

# Check what will be synchronized
gitveil status

# Push anonymous commits to GitHub
gitveil push
```

**That's it!** Your GitHub activity graph will now reflect your work.

---

## Main commands

- `gitveil record`: Extract and save filtered Git activity
- `gitveil status`: Show sync status and pending records
- `gitveil push`: Push anonymized commits to GitHub
- `gitveil config --init`: Edit configuration (email, path, etc)
- `gitveil guide`: Show quick start guide

---

## Privacy

![Privacy](https://img.shields.io/badge/100%25%20private-0%25%20code%20shared-blue)

- No code is ever copied
- No network access to professional repositories
- Everything happens locally, on your machine

---

## Default flow

1. Detect Git context
2. Extract commits linked to your email
3. Generate discrete commits
4. Push to GitHub

---

## How It Works

GitVeil bridges the gap between your private development work and your public GitHub profile through a sophisticated yet simple anonymization process.

### Step-by-Step Process

#### 1. **Detection & Analysis**

- **Email Identification**: GitVeil reads `git config user.email` from your current repository
- **Commit Scanning**: Analyzes your local Git history to find commits authored by your email
- **Date Extraction**: Records commit dates and frequency patterns
- **Privacy Filter**: Only commit metadata (dates/times) are processed - **never your code**

#### 2. **Anonymous Commit Generation**

- **Target Repository**: Creates commits in your configured public repository
- **Identity Mapping**: Uses your configured public identity (name/email for target repo)
- **Timestamp Preservation**: Maintains original commit dates to preserve activity patterns
- **Content Generation**: Creates minimal, harmless commit content (e.g., updating counter in README)

#### 3. **Synchronization**

- **Local Processing**: All operations happen locally first
- **GitHub Push**: Only anonymous commits are pushed to your public repository
- **Activity Graph**: Your GitHub contribution graph reflects your actual work schedule
- **Streak Maintenance**: Keeps your contribution streak alive

---

## 🛠 Troubleshooting

### Common Issues

**"No Git repository found"**

- Make sure you're running GitVeil from a Git repository
- Verify Git is installed and accessible

**"No commits found for email"**

- GitVeil uses the `git config user.email` from your current repository
- Verify your Git email configuration: `git config user.email`
- Check if you have commits in the current repository: `git log --oneline`

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

## 💬 Support

If **GitVeil** has been helpful to you, consider supporting its continued development:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-☕-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://coff.ee/nicolastardieu)

Your support helps keep this project alive and motivates further improvements.
Even a small gesture makes a big difference — thank you! 🙏

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
