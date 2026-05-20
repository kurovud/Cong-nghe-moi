# 🚀 QUICK START - Khởi Động Nhanh

## ⏱️ 2 Phút để Chạy Toàn Bộ Dự Án

### Option 1: Chạy Tự Động (Recommended)
```powershell
cd d:\KLTN\ChatbotAI\ChatbotAI
powershell -ExecutionPolicy Bypass -File run-all.ps1
```
✓ Tự động khởi động Docker stack + Frontend  
✓ Chỉ cần đợi ~30 giây  

### Option 2: Chạy Manual

**Terminal 1 - Backend (Docker):**
```powershell
cd d:\KLTN\ChatbotAI\ChatbotAI
docker compose up -d --remove-orphans
# Đợi 15-20 giây cho services khởi động
```

**Terminal 2 - Frontend (Next.js):**
```powershell
cd d:\KLTN\ChatbotAI\ChatbotAI\frontend
npm.cmd run dev
```

---

## 🌐 Sử Dụng Ứng Dụng

| Thành Phần | URL | Mô Tả |
|-----------|-----|-------|
| **Chatbot UI** | http://localhost:3000 | Chat & tư vấn |
| **API Gateway** | http://localhost:4000 | Backend API |
| **Chat API** | http://localhost:4007 | AI Service |

---

## ✅ Status Check

Mở browser hoặc PowerShell kiểm tra:

```powershell
# Tất cả services chạy?
docker compose ps -a

# API respond?
Invoke-RestMethod -Uri http://localhost:4000/api/chat -Method Post `
  -ContentType application/json `
  -Body '{"message":"hello","sessionId":"test"}' | Select-Object -ExpandProperty data
```

---

## 🤖 Test Chatbot (PowerShell)

```powershell
$test = @{ message = "intel hay amd"; sessionId = "test1" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:4000/api/chat" -Method Post `
  -ContentType application/json -Body $test | Select-Object -ExpandProperty data
```

---

## 🛑 Tắt Dự Án

```powershell
# Tắt Docker stack
docker compose down

# Tắt Frontend: Ctrl+C trong Terminal 2
```

---

## 📊 Covered Scenarios (82+ Q&A)

- ✅ Laptop vs PC
- ✅ Gaming PC Build
- ✅ Hardware Comparison (Intel vs AMD, RTX vs GTX)
- ✅ Software & OS (Windows install, Antivirus)
- ✅ Maintenance (Cleaning, Fan noise)
- ✅ Support (Water damage, Invoice)
- ✅ General Questions

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Port 3000/4000 occupied | `netstat -ano \| findstr :3000` → `taskkill /PID <PID> /F` |
| API not responding | `docker compose restart api-gateway` |
| Frontend build fails | `cd frontend && npm.cmd install && npm.cmd run build` |
| DB connection error | `docker compose restart postgres` |

---

**✨ All systems ready! Happy chatting! 🎉**
