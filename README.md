# agentic-i18n-core

> High-precision internationalization validation and calibration engine for AI translation agents, LLMs, and multilingual CMS platforms.

[![Node.js CI](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![i18n Precision](https://img.shields.io/badge/i18n-Evaluation%20Engine-teal.svg)](https://github.com/roclee0703/agentic-i18n-core)

---

## Overview

When LLMs and autonomous localization agents translate web software and CMS databases, automated translations routinely introduce critical breaking bugs:
1. **Placeholder Mutation**: `{username}`, `{{count}}`, or `%s` format specifiers get translated, deleted, or spaced into `{ count }`.
2. **HTML Tag Corruption**: Broken attribute quotes (e.g. `<a href="/login>`) corrupt frontend page rendering.
3. **Glossary Drift**: Core technical or industry terms (such as specialized industrial part numbers or material grades) are inconsistently translated across pages.

**`agentic-i18n-core`** provides a deterministic verification engine that audits translation strings and JSON catalogs before publishing.

---

## Quickstart

```bash
# Clone and setup
git clone https://github.com/roclee0703/agentic-i18n-core.git
cd agentic-i18n-core

# Run unit tests
npm test

# Audit a JSON localization file pair
node bin/agentic-i18n.mjs verify-json ./locales/en.json ./locales/zh.json
```

---

## Core Capabilities

- **Placeholder Integrity Validator**: Guarantees variable tokens are symmetrically preserved between source and target text.
- **Tag & Attribute Validator**: Catches truncated quotes and unclosed HTML markup within localized strings.
- **Domain Glossary Enforcement**: Validates that mandatory technical terminology mappings are respected.

---

## License

MIT License (c) 2026 roclee0703
