![npm](https://img.shields.io/npm/v/git-veil)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)
![Privacy](https://img.shields.io/badge/100%25%20private-0%25%20code%20shared-blue)
![Auditable](https://img.shields.io/badge/Code-Fully%20Auditable-brightgreen)
![npm](https://img.shields.io/npm/dw/git-veil)

# GitVeil

**Keep your GitHub contribution graph active without exposing your private code.**

![Before](https://github.com/tardieunicolas/gitveil/blob/main/assets/how-it-work.gif)

## 🆕 What's New in v1.0.4

> **[View Full Changelog](CHANGELOG.md)** 

## How To Use

1. Ensure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and
   [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. Install GitVeil globally:
   ```bash
   npm install git-veil -g
   ```
3. Create [a private repository](https://github.com/new) for your contribution activity (e.g., `my-activity`).
4. Setup your target repository:
   ```bash
   mkdir my-activity && cd my-activity
   git init
   git remote add origin git@github.com:<USERNAME>/my-activity.git
   git branch -M main
   gitveil config --init
   ```
5. Record and sync your activity:
   ```bash
   cd /path/to/your/work/repo
   gitveil record
   gitveil push
   ```

**Done!** Now your GitHub graph reflects your private work.

## Main commands

- `gitveil record`: Extract and save filtered Git activity
- `gitveil status`: Show sync status and pending record
- `gitveil push`: Push anonymized commits to GitHub
- `gitveil config --init`: Edit configuration (email, path, etc)
- `gitveil guide`: Show quick start guide


## How It Works

1. **Scan**: Reads commit dates from your repositories (no code access)
2. **Generate**: Creates anonymous commits in your target repository
3. **Sync**: Pushes to GitHub to update your contribution graph

**Privacy Guarantee**: Only commit timestamps are processed - your code never leaves your machine, no network access to your professional repositories.

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


### Having issues? 
Check our comprehensive troubleshooting guide:

**[→ View Troubleshooting Guide](TROUBLESHOOTING.md)**

---

## Support This Project

If you rely on this tool and find it useful, please consider supporting it. Maintaining an open source project takes time, and a cup of coffee would be greatly appreciated!

<a href="https://coff.ee/nicolastardieu" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

---

### 📧 Questions & Suggestions

Have questions, suggestions, or feedback? I'd love to hear from you!

[Contact me by email](mailto:ntardieu.contact@gmail.com?subject=GitVeil%20-%20Question/Suggestion)

---

## Disclaimer

This tool was created to address the unfair practice of judging developers solely by their GitHub contribution graphs. While maintaining authentic professional integrity is always encouraged, your true skills shouldn't be measured by green squares on a chart. GitVeil helps ensure your valuable private work gets the recognition it deserves.

**GitHub Terms of Service**: By using GitVeil, you acknowledge that you are responsible for ensuring your usage complies with [GitHub's Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) and [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies). GitVeil creates commits based on your actual work activity and does not generate fake or misleading contribution data. Users should use this tool responsibly and in accordance with GitHub's community guidelines.

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.