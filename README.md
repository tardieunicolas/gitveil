# ![GitPulse Badge](https://img.shields.io/badge/GitHub%20Activity-Synced%20by%20GitPulse-brightgreen)

# 🚀 GitVeil

**Keep your GitHub active, without exposing your code.**

---

## Overview

**GitVeil** is a local CLI tool that syncs your professional development activity to a personal GitHub repository, in a **discreet**, **automated**, and **confidential** way. It replays your commits in an anonymized form, never copying any source code.

---

## Why choose GitVeil ?

- 👀 **Visibility**: Keep your GitHub contribution graph active, even for private work.
- 🔒 **Privacy**: No code is copied, everything stays local, 100% private.
- 🧘 **Simplicity**: Quick installation, guided configuration, minimalist usage.

---

## Installation (one click)

```bash
npm i
npm run build
npm install -g
```

---

## Main commands

- `gitveil init`: Initialize configuration
- `gitveil record`: Extract and save filtered Git activity
- `gitveil push`: Push anonymized commits to GitHub
- `gitveil status`: Show sync status and pending records
- `gitveil config`: Edit configuration (email, path, etc)

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

## Screenshot

Before :

![Before](img/gitpulse-demo-2024.png)

After :

![After](img/gitpulse-demo-2024-after.png)

---

## License

MIT