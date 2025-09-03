# Repository Guidelines

## Project Structure & Module Organization
- `src/`: core server code. Notables: `index.js`, `bootstrap.js`, `Server.js`, `router/`, `provider/` (heroku, scalingo, clever-cloud), `registry/`, `events/`, `config.js`.
- `bin/`: CLI entry (`bin/index.js`) exposed as `paastis`.
- `db/`: Sequelize setup (`models/`, `migrations/`, `config.json`).
- `test/`: Jest tests (`**/*.test.js`).
- `docs/`: diagrams and notes. Assets like logos live at repo root.
- Samples: `sample.env`, `paastis.yml.sample` (copy locally; do not commit secrets).

## Build, Test, and Development Commands
- `npm start`: run DB migrations then start the server (defaults to `0.0.0.0:3000`).
- `npx paastis` or `node bin/index.js -H 0.0.0.0 -P 3000 --max-idle-time 15`: run the CLI locally.
- `npm test`: run Jest (coverage enabled).
- `npm run db:migrate` | `npm run db:migrate:down`: apply/undo Sequelize migrations.
- `npm run format:check` | `npm run format:write`: Prettier check/fix.
- Optional: `docker compose up -d paastis-db paastis-registry` to start Postgres/Redis for local dev.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; LF; UTF-8 (`.editorconfig`).
- Prettier: `semi: true`, `singleQuote: true`, `trailingComma: es5`.
- Runtime: Node 16, ES modules (`type: module`).
- Naming: PascalCase for classes, camelCase for variables/functions, `kebab-case` file names where applicable; `.js` source.
- Logging: Pino; respect `LOG_LEVEL` and prefer structured messages.

## Testing Guidelines
- Framework: Jest with coverage on. Place tests in `test/**` and name files `*.test.js` (e.g., `test/provider/heroku/HerokuApp.test.js`).
- Run with `npm test`. Add tests alongside new modules; mock network/Paas clients.
- Aim to keep or improve coverage; avoid flaky, time-based assertions.

## Commit & Pull Request Guidelines
- Commit style: conventional prefixes (`feat`, `fix`, `chore`, `refactor`, `doc`, `ci`). Example: `fix(router): rewrite Origin when matching Host`.
- PRs: concise description, linked issues, reproduction/verification notes, screenshots or logs when helpful. Include config/env changes, update docs/README, and ensure tests + `npm run format:write` pass.

## Security & Configuration Tips
- Never commit `.env` or `paastis.yml`. Use `sample.env` and `paastis.yml.sample` as templates.
- Required provider credentials via env vars (e.g., `PROVIDER_NAME`, `PROVIDER_HEROKU_API_TOKEN`, etc.). Rotate tokens regularly.
