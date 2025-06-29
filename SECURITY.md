# Security Policy

## 🔒 Privacy First

GitVeil is designed with privacy as the core principle:

- **No code extraction**: GitVeil never copies or extracts your source code
- **Local processing only**: All operations happen locally on your machine
- **No network access to private repos**: GitVeil only accesses your configured public mirror repository
- **Anonymized commits**: Only commit metadata (dates, frequency) is replicated, not content

## 🔍 Transparency

This project is fully open source and auditable:

- All source code is available on GitHub
- Published on npm public registry for community review
- MIT licensed for maximum transparency
- No hidden dependencies or obfuscated code

## 🐛 Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
2. Email: [ntardieu.contact@gmail.com](mailto:ntardieu.contact@gmail.com?subject=GitVeil:%20Security%20Vulnerability%20Report)
3. Include detailed description of the vulnerability
4. We will respond within 48 hours

## 🛡️ Security Measures

- Dependencies are regularly updated
- No telemetry or data collection
- All operations are logged locally for debugging
- Configuration stored locally in plain text JSON

## ✅ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 📋 Security Checklist

- [x] Open source code
- [x] No code extraction
- [x] Local processing only
- [x] No hidden network calls
- [x] Clear logging
- [x] Transparent configuration
