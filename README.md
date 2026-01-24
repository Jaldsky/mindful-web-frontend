# 🌐 Mindful Web Frontend
*React dashboard and analytics for mindful internet tracking*

[![React](https://img.shields.io/badge/React-18%2B-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6%2B-646cff)](https://vite.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

> Production-ready React dashboard for authentication, profile, and analytics.

## 🔗 Project Links

| Component | Repository | Description |
|-----------|-----------|-------------|
| 🔌 **Extensions** | [mindful-web-extensions](https://github.com/Jaldsky/mindful-web-extensions) | Browser extensions (Chrome) |
| ⚙️ **Backend** | [mindful-web-backend](https://github.com/Jaldsky/mindful-web-backend) | FastAPI backend server |
| 🖥️ **Frontend** | [mindful-web-frontend](https://github.com/Jaldsky/mindful-web-frontend) | React dashboard and analytics |

---

## ✨ Key Features

- 🔐 **Auth Flow** — login, registration, verification, anonymous sessions
- 📊 **Analytics UI** — domain usage charts and statistics
- 👤 **Profile** — username, email, timezone settings
- 🎨 **Theming & i18n** — light/dark theme, locale support
- 🧪 **Well-Tested** — unit and hook tests with Vitest
- 🐳 **Docker-Ready** — build + Nginx runtime

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (optional, for containerized deploy)

### Local Development
```bash
npm install
npm run start
```

### Production Build
```bash
npm run build
```

### Docker Deploy
```bash
npm run compose-up
```

Access: http://localhost:8080

---

## 🛠️ Development

### Tech Stack
- **Frontend**: React 18+, TypeScript 5+, Vite 6+
- **UI**: Tailwind CSS
- **Routing**: React Router
- **Testing**: Vitest + Testing Library

### Scripts
```bash
npm run start         # dev server
npm run build         # type-check + production build
npm run preview       # serve built dist
npm run lint          # lint
npm run test          # tests
npm run type-check    # types only
npm run compose-up    # docker compose up -d --build
```

---

## 🌐 API & Proxy

The frontend expects API calls under `/api/v1` by default. In Docker, Nginx proxies:

- `https://app.example.com` → frontend
- `https://app.example.com/api` → backend (`mwb-app:8000`)

For local development, override the API URL via `.env`:
```
VITE_API_URL=/api/v1
```

---

<div align="center">

**[🔌 Extensions](https://github.com/Jaldsky/mindful-web-extensions)** • **[🖥️ Frontend](https://github.com/Jaldsky/mindful-web-frontend)** • **[⚙️ Backend](https://github.com/Jaldsky/mindful-web-backend)**

Stay mindful on the web. 🧘‍♀️

</div>
