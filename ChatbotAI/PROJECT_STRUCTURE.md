# PC Builder Shop - Project Structure

## 📁 Directory Layout

```
ChatbotAI/
├── frontend/                 # Next.js React frontend
│   ├── src/                  # Source code
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json
│
├── services/                 # Microservices
│   ├── api-gateway/          # API Gateway (4000)
│   ├── auth-service/         # Auth (4001)
│   ├── product-service/      # Products (4002)
│   ├── order-service/        # Orders (4003)
│   ├── review-service/       # Reviews (4004)
│   ├── notification-service/ # Notifications (4005)
│   ├── file-service/         # File uploads (4006)
│   └── chat-service/         # Chat AI (4007)
│
├── scripts/                  # Project scripts
│   ├── seed-data/            # Seed data files
│   ├── seed-all.ts           # Seed database
│   └── init-db.sql           # Database initialization
│
├── common/                   # Shared code
│   ├── src/                  # Common utilities
│   └── package.json
│
├── docs/                     # Documentation
│   ├── ARCHIVE/              # Archived docs
│   ├── README.md             # Main docs
│   ├── QUICK_START.md        # Getting started
│   └── GETTING_STARTED.md    # Setup guide
│
├── docker-compose.yml        # Docker orchestration
├── package.json              # Root package (utilities)
├── README.md                 # Main project README
├── TESTING_REPORT.md         # Test results
├── COMPLETION_STATUS.md      # Feature checklist
└── RECOMMENDATIONS.md        # Production guide
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start all services
npm run start:all

# Seed database
npm run seed:all

# Build frontend
cd frontend && npm run build

# Run development server
cd frontend && npm run dev
```

## 📦 Key Components

### Frontend (Next.js 14.2.5)
- **Stack**: React 18 + TypeScript + CSS Grid
- **Features**: Product listing, shopping cart, checkout, user auth
- **Port**: 3000

### Backend Services (8 microservices)
- **Pattern**: Microservices with API Gateway
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Ports**: 4000-4007

## 🗂️ Important Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Service orchestration |
| `README.md` | Main documentation |
| `RECOMMENDATIONS.md` | Production deployment guide |
| `TESTING_REPORT.md` | QA test results |
| `COMPLETION_STATUS.md` | Feature status tracker |

## 🧹 Cleanup

Old documentation and scripts have been archived to `docs/ARCHIVE/` to keep the root clean.

### Archived Items (20 files)
- Old reports: AUDIT_DETAILED_FINDINGS.md, OPTIMIZATION_REPORT.md, etc.
- Merge scripts: merge-budget-seed-data.ps1, merge-laptop-general-seed-data.ps1, etc.
- Outdated docs: PRODUCTION_READY.md, SETUP_VERIFICATION.md, etc.

## ✨ Recent Changes

✅ **Cleanup completed**:
- Removed 9 old documentation files from root
- Removed 5 old merge scripts
- Archived 10 outdated docs from docs folder
- Total: 20 files archived

**Result**: Cleaner, more maintainable project structure

## 📝 Documentation

- **Getting Started**: See `docs/GETTING_STARTED.md`
- **Quick Setup**: See `docs/QUICK_START.md`
- **Production Guide**: See `RECOMMENDATIONS.md`
- **Test Results**: See `TESTING_REPORT.md`
- **Features**: See `COMPLETION_STATUS.md`

---

*Last updated: May 11, 2026*  
*Status: Production Ready ✅*
