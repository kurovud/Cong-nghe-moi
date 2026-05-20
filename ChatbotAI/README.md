# 🛍️ PC Builder Shop - E-Commerce Platform

**Status**: ✅ Production Ready | **Last Updated**: May 11, 2026

A modern e-commerce platform for PC components and gaming hardware with AI-powered chatbot assistance.

---

## ⚡ Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- PowerShell or Bash

### Option 1: Auto Start (Recommended)

```powershell
cd ChatbotAI
powershell -ExecutionPolicy Bypass -File run-all.ps1
```

### Option 2: Manual Start

```bash
# Start backend services (Terminal 1)
docker compose up -d

# Start frontend (Terminal 2 - wait 30s)
cd frontend
npm run dev
```

### Access Points

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3000 | 3000 |
| **API Gateway** | http://localhost:4000 | 4000 |
| **Database** | localhost | 5432 |
| **Redis** | localhost | 6379 |

---

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed layout.

**Key Directories**:
- `frontend/` - Next.js React application
- `services/` - 8 microservices (Auth, Product, Order, etc.)
- `scripts/` - Database seeds and utilities
- `docs/` - Full documentation

---

## 🧪 Test Credentials

After seeding database:

```
User: user@pcshop.vn
Password: User@123

Admin: admin@pcshop.vn
Password: Admin@123
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START](./docs/QUICK_START.md)** | 2-minute setup guide |
| **[PROJECT_STRUCTURE](./PROJECT_STRUCTURE.md)** | Folder organization |
| **[RECOMMENDATIONS](./RECOMMENDATIONS.md)** | Production deployment |
| **[TESTING_REPORT](./TESTING_REPORT.md)** | QA test results |
| **[COMPLETION_STATUS](./COMPLETION_STATUS.md)** | Feature checklist |

---

## ✨ Features

### Shopping
- ✅ Browse 349+ computer products
- ✅ Filter by category, price range
- ✅ Full-text search
- ✅ Product details & reviews
- ✅ Add to cart & wishlist

### Recent UI / Workflow Updates
- ✅ Homepage deal carousel is now wrapped in a dedicated frame and auto-scrolls continuously.
- ✅ Build PC page (`/builds`) was redesigned as a storefront with category filters and system-cart integration.
- ✅ Service page (`/services`) was simplified to focus on booking and tracking requests; admin CRUD moved to `/admin/services`.
- ✅ Wishlist page (`/account/wishlist`) was redesigned with a clearer card layout and product data hydration from the product catalog.
- ✅ Product images are normalized through the shared image resolver so missing paths fall back safely.
- ✅ Account-area screens are being aligned to a single visual language for easier browsing and order review.

### Checkout
- ✅ Shopping cart management
- ✅ Shipping address input
- ✅ 5 payment methods
- ✅ Automatic shipping fees
- ✅ Coupon code support

### Account
- ✅ User registration & login
- ✅ Order history
- ✅ Wishlist management
- ✅ Profile settings

### Admin
- ✅ Product management
- ✅ Order tracking
- ✅ User management
- ✅ Analytics dashboard

### AI Features
- ✅ AI chatbot for product advice
- ✅ Product recommendations
- ✅ Chat context awareness

---

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14.2.5
- **Styling**: CSS Grid + Responsive Design
- **State**: Context API + React Hooks
- **Type Safety**: TypeScript

### Backend
- **Pattern**: Microservices
- **Services**: 8 independent services
- **API Gateway**: Centralized routing
- **Database**: PostgreSQL 16
- **Cache**: Redis 7

### Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Environment**: Node.js + TypeScript

---

## 🚀 Development

### Install Dependencies

```bash
# Root-level utilities
npm install

# Frontend
cd frontend && npm install

# Services (install in each)
cd services/api-gateway && npm install
```

### Build Frontend

```bash
cd frontend
npm run build
npm run dev
```

### Seed Database

```bash
npm run seed:all
```

---

## 🧹 Project Cleanup

**Recently Cleaned**:
- Archived 9 old documentation files
- Removed 5 merge scripts
- Consolidated docs folder
- Kept: 4 essential reference docs

**Archive Location**: `docs/ARCHIVE/`

---

## 📊 System Status

| Component | Status | Port |
|-----------|--------|------|
| PostgreSQL | ✅ Running | 5432 |
| Redis | ✅ Running | 6379 |
| API Gateway | ✅ Running | 4000 |
| Auth Service | ✅ Running | 4001 |
| Product Service | ✅ Running | 4002 |
| Order Service | ✅ Running | 4003 |
| Review Service | ✅ Running | 4004 |
| Notification Service | ✅ Running | 4005 |
| File Service | ✅ Running | 4006 |
| Chat Service | ✅ Running | 4007 |
| Frontend | ✅ Running | 3000 |

---

## 📝 Commands

```bash
# Start all services
npm run start:all

# Seed database
npm run seed:all

# Build frontend
cd frontend && npm run build

# Development server
cd frontend && npm run dev

# Run tests
npm test
```

---

## 🔐 Security

Before production deployment:
- [ ] Configure SSL/HTTPS
- [ ] Set strong database passwords
- [ ] Configure rate limiting
- [ ] Set CORS properly
- [ ] Enable monitoring
- [ ] Setup backups

See [RECOMMENDATIONS.md](./RECOMMENDATIONS.md) for full security checklist.

---

## 📞 Support

- **Issues**: Check `docs/ARCHIVE/` for FAQ
- **Documentation**: See `docs/` folder
- **Setup Help**: See `docs/GETTING_STARTED.md`

---

## 📄 License

[Add your license here]

---

**Built with ❤️ for PC enthusiasts**
- **[README](./docs/README.md)** - Complete guide
- **[SETUP_VERIFICATION](./docs/SETUP_VERIFICATION.md)** - Verification steps
- **[IMPLEMENTATION_COMPLETE](./docs/IMPLEMENTATION_COMPLETE.md)** - What was built

### Project History
- [PHASE1_SUMMARY](./docs/PHASE1_SUMMARY.md) - Laptop scenarios
- [LAPTOP_GENERAL_EXPANSION_COMPLETE](./docs/LAPTOP_GENERAL_EXPANSION_COMPLETE.md) - Details
- [PROJECT_UPDATE_SUMMARY](./docs/PROJECT_UPDATE_SUMMARY.md) - Updates

---

## 🎯 Features

✅ **82+ Q&A Scenarios** covering:
- Laptop vs PC recommendations
- Gaming PC builds (by budget)
- Hardware comparisons (Intel/AMD, RTX/GTX, etc.)
- Software & OS installation
- Maintenance & troubleshooting
- Water damage & support issues

✅ **Microservices Architecture**
- API Gateway (Express)
- Chat Service (AI Q&A)
- Auth Service (JWT)
- Product Service
- Review Service
- Notification Service
- File Service

✅ **Full Stack**
- Frontend: Next.js 14.2.5 + React 18
- Backend: Express + TypeScript
- Database: PostgreSQL 16 + Redis 7
- Deployment: Docker Compose

---

## 🔧 Tech Stack

```
Frontend:     Next.js 14.2.5, React 18, TypeScript 5.5.4
Backend:      Express 4.19, TypeScript 5.5.4
Database:     PostgreSQL 16, Redis 7 (session cache)
Q&A Engine:   Jaccard Similarity Matching (82+ records)
Deployment:   Docker Compose (10 containers)
```

---

## 📁 Project Structure

```
ChatbotAI/
├── docs/              # 📚 Documentation (13 files)
├── scripts/           # 🔧 Utilities & automation
│   ├── automation/    # PowerShell scripts
│   └── seed-data/     # JSON data files
├── services/          # 🔧 Microservices (10 services)
├── frontend/          # ⚛️ Next.js UI
├── common/            # 🔗 Shared utilities
├── docker-compose.yml # 🐳 Docker orchestration
└── PROJECT_STRUCTURE.md
```

Full details: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## ⚡ Common Tasks

### Stop everything
```powershell
docker compose down
# Ctrl+C in frontend terminal
```

### View logs
```powershell
docker compose logs -f chat-service
docker compose logs -f api-gateway
```

### Restart a service
```powershell
docker compose restart chat-service
```

### Run tests
```powershell
pwsh -File scripts/automation/quick-test.ps1
```

---

## 🛠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| Port already in use | `netstat -ano \| findstr :3000` → kill process |
| API not responding | `docker compose restart api-gateway` |
| Database connection error | `docker compose restart postgres` |
| Frontend build fails | `cd frontend && npm.cmd install` |

More: [PRODUCTION_READY.md](./docs/PRODUCTION_READY.md#troubleshooting)

---

## 📊 Q&A Coverage

**82+ Q&A Records** with 95%+ user query coverage:
- ✅ Laptop vs PC (19 scenarios)
- ✅ Gaming PC Build (18 scenarios)
- ✅ Hardware Comparison (15 scenarios)
- ✅ Software & OS (12 scenarios)
- ✅ Maintenance (10 scenarios)
- ✅ Support Issues (8 scenarios)

Sample queries:
```
"intel hay amd tốt hơn cho gaming?"
→ Detailed comparison with product recommendations

"cài windows như thế nào?"
→ Step-by-step installation guide

"máy bị dính nước phải làm sao?"
→ Emergency procedures & recovery steps

"cpu có cần vệ sinh định kỳ không?"
→ Maintenance schedule & best practices
```

---

## 📞 API Example

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"intel hay amd","sessionId":"user123"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "📊 **CPU Comparison...",
    "intent": "compare",
    "agent": "compare",
    "products": [...],
    "suggestedQuestions": [...]
  }
}
```

---

## 🎓 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│                   localhost:3000 (React UI)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────┐
│              API Gateway (Express)                          │
│                localhost:4000                               │
│  ├─ Routes requests to microservices                        │
│  ├─ JWT authentication                                      │
│  └─ Load balancing                                          │
└──────────────────────┬──────────────────────────────────────┘
       ┌───────────────┼───────────────┬───────────────┐
       │               │               │               │
    ┌──▼──┐        ┌──▼──┐        ┌──▼──┐        ┌──▼───┐
    │Auth │        │Chat │        │Product       │Review│
    │4001 │        │4007 │        │4002  │       │4004  │
    └─────┘        └─────┘        └──────┘       └──────┘
       │ PostgreSQL  │ Redis/Q&A │ PostgreSQL  │ PostgreSQL
       │             │ (82+Q/A) │             │
       └─────────────┼──────────┴─────────────┘
                     │
            ┌────────▼────────┐
            │  PostgreSQL 16  │
            │  Redis 7        │
            └─────────────────┘
```

---

## 📈 Performance

- **Chat Response**: ~50-100ms (local Q&A matching)
- **Startup Time**: ~30s (Docker + services)
- **Database**: PostgreSQL 16 (replaces old API calls)
- **Cache**: Redis 7 (session + chat history)
- **Cost**: $0 (no external APIs needed)

---

## ✅ Production Checklist

- ✅ All 10 microservices running
- ✅ Database initialized with seed data
- ✅ Q&A dataset loaded (82+ records)
- ✅ Frontend built successfully
- ✅ E2E tests passing (4/4)
- ✅ No TypeScript errors
- ✅ Docker health checks passing
- ✅ Zero compilation warnings

See [PRODUCTION_READY.md](./docs/PRODUCTION_READY.md) for full checklist.

---

## 📝 License

Khóa Luận Tốt Nghiệp — FPTU

---

**Last Updated**: 2026-05-05  
**For full documentation**: See [docs/README.md](./docs/README.md)
