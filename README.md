![npm](https://img.shields.io/npm/v/git-veil)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)
![Privacy](https://img.shields.io/badge/100%25%20private-0%25%20code%20shared-blue)
![Auditable](https://img.shields.io/badge/Code-Fully%20Auditable-brightgreen)
![npm](https://img.shields.io/npm/dw/git-veil)

# 🚀 GitVeil

**Keep your GitHub contribution graph active without exposing your private code.**

## Overview

**GitVeil** is a local CLI tool that syncs your professional development activity to a personal GitHub repository, in a **discreet**, **automated**, and **confidential** way. It replays your commits in an anonymized form, never copying any source code.


## Why choose GitVeil ?

- ✅ **Visibility**: Keep your GitHub contribution graph active, even for private work.
- 🔒 **Privacy**: No code is copied, everything stays local, 100% private.
- 🧘 **Simplicity**: Quick installation, guided configuration, minimalist usage.


## See GitVeil in action:

**Before GitVeil :**

![Before](https://github.com/tardieunicolas/gitveil/blob/main/assets/gitpulse-demo-2024.png)

**After GitVeil :**

![After](https://github.com/tardieunicolas/gitveil/blob/main/assets/gitpulse-demo-2024-after.png)

Your contribution graph stays active without exposing any private work!


## 📦 Installation

Install GitVeil globally using npm:

```bash
npm install git-veil -g
```

Verify the installation:

```bash
gitveil --version
```



## 🚀 Quick Start

### 1. Setup Target Repository

```bash
mkdir my-target-repo && cd my-target-repo
git init && git remote add origin https://github.com/yourusername/my-target-repo.git
git branch -M main && git push -u origin main
gitveil config --init
```

### 2. Record & Sync Activity

```bash
cd /path/to/your/work/repo
gitveil record && gitveil push
```

**Done!** Your GitHub graph now reflects your private work.



## Main commands

- `gitveil record`: Extract and save filtered Git activity
- `gitveil status`: Show sync status and pending record
- `gitveil push`: Push anonymized commits to GitHub
- `gitveil config --init`: Edit configuration (email, path, etc)
- `gitveil guide`: Show quick start guide



## Privacy

![Privacy](https://img.shields.io/badge/100%25%20private-0%25%20code%20shared-blue)

- No code is ever copied
- No network access to professional repositories
- Everything happens locally, on your machine



## How It Works

1. **Scan**: Reads commit dates from your repositories (no code access)
2. **Generate**: Creates anonymous commits in your target repository
3. **Sync**: Pushes to GitHub to update your contribution graph

**Privacy**: Only commit timestamps are processed - your code never leaves your machine.


## 🛠 Troubleshooting


| Issue | Solution |
|-------|----------|
| **"No Git repository found"** | • Run command from inside a Git repository<br>• Check if `.git` folder exists<br>• Run `git status` to verify Git initialization |
| **"No commits found for email"** | • Check `git config user.email` matches your commits<br>• Use `git log --author="your@email.com"` to verify<br>• Update email with `git config user.email "correct@email.com"` |
| **"Target repository not found"** | • Ensure target path exists and is Git-initialized<br>• Run `gitveil config --init` to set correct path<br>• Verify remote with `git remote -v` |
| **"Permission denied (publickey)"** | • Check SSH key setup: `ssh -T git@github.com`<br>• Add SSH key to GitHub or use HTTPS instead<br>• Run `git config --global credential.helper store` |
| **"Nothing to commit"** | • Ensure you have commits in source repository<br>• Check date range with `gitveil config`<br>• Verify email configuration matches commit author |
| **"Configuration issues"** | • Run `gitveil config --init`<br>• Check file permissions in target directory<br>• Verify paths are absolute and accessible |


---

## ❓ FAQ

**Q: Is my code safe?**  
A: Yes. GitVeil only reads commit timestamps, never your source code.

**Q: Can I use multiple repositories?**  
A: Yes. Run `gitveil record` in each repository you want to track.

**Q: Will it affect my work repositories?**  
A: No. GitVeil is read-only for your work repos.

**Q: What if I miss some days?**  
A: Run `gitveil record && gitveil push` - original dates are preserved.

**Q: Can I preview before pushing?**  
A: Yes. Use `gitveil status` to see pending commits.

**Q: How does email detection work?**  
A: Uses `git config user.email` from each repository automatically.

### Getting Help

---

## 💬 Support

If **GitVeil** has been helpful to you, consider supporting its continued development:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-☕-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://coff.ee/nicolastardieu)

Your support helps keep this project alive and motivates further improvements.
Even a small gesture makes a big difference — thank you! 🙏

---

### 📧 Questions & Suggestions

Have questions, suggestions, or feedback? I'd love to hear from you!

[![Email](https://img.shields.io/badge/Email-Contact%20me-blue?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ntardieu.contact@gmail.com?subject=GitVeil%20-%20Question/Suggestion)

Whether it's a bug report, feature request, or just a quick question, don't hesitate to reach out.

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.