# 🛠 Troubleshooting Guide

This guide covers common issues and their solutions when using GitVeil.

## Common Issues

### "No Git repository found"

**Symptoms:**
- GitVeil reports it cannot find a Git repository
- Commands fail with repository-related errors

**Solutions:**
- Run command from inside a Git repository
- Check if `.git` folder exists in your current directory
- Run `git status` to verify Git initialization
- If not a Git repo, run `git init` to initialize

### "No commits found for email"

**Symptoms:**
- GitVeil cannot find any commits to record
- Empty activity despite having commits

**Solutions:**
- Check `git config user.email` matches your commits
- Use `git log --author="your@email.com"` to verify commits exist
- Update email with `git config user.email "correct@email.com"`
- Ensure the email in your commits matches your GitVeil configuration

### "Target repository not found"

**Symptoms:**
- Cannot push to target repository
- Path-related errors during push

**Solutions:**
- Ensure target path exists and is Git-initialized
- Run `gitveil config --init` to set correct path
- Verify remote with `git remote -v`
- Check if the target directory has proper Git setup

### "Permission denied (publickey)"

**Symptoms:**
- SSH authentication failures
- Cannot push to GitHub

**Solutions:**
- Check SSH key setup: `ssh -T git@github.com`
- Add SSH key to GitHub or use HTTPS instead
- Run `git config --global credential.helper store`
- Verify your SSH key is properly configured in GitHub settings

### "Nothing to commit"

**Symptoms:**
- GitVeil reports no activity to sync
- Status shows no pending commits

**Solutions:**
- Ensure you have commits in source repository
- Check date range with `gitveil config`
- Verify email configuration matches commit author
- Run `git log` to confirm commits exist in the expected date range

### "Configuration issues"

**Symptoms:**
- GitVeil fails to read or write configuration
- Permission or path errors

**Solutions:**
- Run `gitveil config --init` to reset configuration
- Check file permissions in target directory
- Verify paths are absolute and accessible
- Ensure you have write permissions to the target directory

## Advanced Troubleshooting

### Debug Mode

For more detailed error information, you can:
1. Check the configuration file: `gitveil.config.json`
2. Verify Git configuration: `git config --list`
3. Test Git connectivity: `git ls-remote origin`

### Manual Verification

To manually verify your setup:
1. Check if target repo exists: `ls -la /path/to/target`
2. Verify remote URL: `cd /path/to/target && git remote -v`
3. Test Git operations: `cd /path/to/target && git status`

### Environment Issues

**Node.js Version:**
- Ensure Node.js version 14+ is installed
- Run `node --version` to check

**Git Version:**
- Ensure Git 2.0+ is installed
- Run `git --version` to check

**File System Permissions:**
- Ensure read access to source repositories
- Ensure write access to target repository
- Check directory ownership and permissions

### When Reporting Issues

Please include:
- Your operating system
- Node.js and Git versions
- The exact command you ran
- The complete error message
- Your GitVeil configuration (without sensitive data)

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| No repository | `cd` to Git repo or run `git init` |
| Wrong email | `git config user.email "correct@email.com"` |
| No target | `gitveil config --init` |
| SSH issues | `ssh -T git@github.com` |
| No commits | Check `git log` and date range |
| Config broken | `gitveil config --init` |

---

[← Back to README](README.md)
