# 🤖 AI Chatbot - Hệ thống Tư vấn Linh kiện PC thông minh

> **Đồ án Khóa luận Tốt nghiệp** — Ứng dụng trí tuệ nhân tạo (AI Chatbot) trong tư vấn và bán hàng linh kiện máy tính.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?logo=google)](https://ai.google.dev/)

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Demo Screenshots](#-demo-screenshots)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [AI Chatbot - Chi tiết kỹ thuật](#-ai-chatbot---chi-tiết-kỹ-thuật)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [API Endpoints](#-api-endpoints)
- [Data Export](#-data-export)
- [Tác giả](#-tác-giả)

---

## 🎯 Giới thiệu

Hệ thống **AI Chatbot Tư vấn Linh kiện PC** là một ứng dụng web thương mại điện tử tích hợp trí tuệ nhân tạo, giúp người dùng:

- 💬 **Tư vấn thông minh** qua chatbot AI sử dụng Google Gemini 2.0 Flash
- 🛒 **Mua sắm linh kiện** với đầy đủ tính năng giỏ hàng, thanh toán, quản lý đơn hàng
- 🔧 **Build PC** với gợi ý cấu hình phù hợp ngân sách, kiểm tra tương thích linh kiện
- 📖 **Tra cứu kiến thức** về phần cứng máy tính qua kho bài viết và FAQ

Ứng dụng được xây dựng hoàn toàn bằng **Next.js 14** (App Router) với TypeScript, sử dụng kiến trúc **RAG (Retrieval-Augmented Generation)** để chatbot AI luôn trả lời chính xác dựa trên dữ liệu sản phẩm thực tế trong hệ thống.

---

## ✨ Tính năng chính

### 🤖 AI Chatbot thông minh
| Tính năng | Mô tả |
|---|---|
| **Tư vấn sản phẩm** | Gợi ý linh kiện phù hợp nhu cầu, ngân sách |
| **So sánh sản phẩm** | So sánh chi tiết specs giữa 2-3 sản phẩm |
| **Kiểm tra tương thích** | Kiểm tra socket CPU-Mainboard, RAM, PSU-GPU |
| **Gợi ý build PC** | Đề xuất cấu hình hoàn chỉnh theo ngân sách 8-70 triệu |
| **Hướng dẫn lắp ráp** | Hướng dẫn từng bước lắp PC với tips và cảnh báo |
| **Trả lời FAQ** | Giải đáp câu hỏi thường gặp về phần cứng |
| **Rich Content** | Hiển thị product cards, bảng so sánh, steps trong chat |

### 🛍️ Thương mại điện tử
| Tính năng | Mô tả |
|---|---|
| **Catalog sản phẩm** | 348+ sản phẩm across 14 danh mục |
| **Tìm kiếm & Lọc** | Tìm theo tên, brand, giá, tags, danh mục |
| **Giỏ hàng** | Thêm/xóa/cập nhật số lượng, tính tổng tự động |
| **Thanh toán** | Checkout với thông tin giao hàng, phương thức thanh toán |
| **Quản lý đơn hàng** | Theo dõi trạng thái đơn, lịch sử mua hàng |
| **Wishlist** | Danh sách yêu thích |
| **Đánh giá sản phẩm** | 411+ reviews với rating, pros/cons |
| **Thông báo** | Hệ thống notification realtime |

### 👤 Người dùng
| Tính năng | Mô tả |
|---|---|
| **Đăng ký / Đăng nhập** | Authentication với session management |
| **Quản lý profile** | Cập nhật thông tin cá nhân, địa chỉ |
| **Lịch sử đơn hàng** | Xem chi tiết và trạng thái đơn hàng |
| **Quản lý reviews** | Viết và quản lý đánh giá sản phẩm |

### 🔧 Admin Panel
| Tính năng | Mô tả |
|---|---|
| **Dashboard thống kê** | Tổng quan doanh thu, đơn hàng, sản phẩm |
| **Quản lý sản phẩm** | CRUD sản phẩm, cập nhật giá, tồn kho |
| **Quản lý bộ build PC** | CRUD cấu hình PC build sẵn |
| **Quản lý FAQ** | CRUD câu hỏi thường gặp |
| **Quản lý Knowledge Base** | CRUD bài viết kiến thức |
| **Quản lý đơn hàng** | Xem, cập nhật trạng thái đơn hàng |
| **Quản lý người dùng** | Xem, phân quyền users |

---

## 🆕 Cập nhật giao diện & nghiệp vụ gần đây

Các thay đổi dưới đây đã được áp dụng đồng bộ để UI dễ dùng hơn, rõ ràng hơn và phù hợp với luồng nghiệp vụ thực tế của hệ thống.

### 1) Homepage và hệ thống màu sắc
- Chuyển toàn bộ giao diện sang tông pastel mềm, sáng và đồng đều hơn.
- Loại bỏ các điểm nhấn chữ quá gắt, thay bằng màu chữ đậm, dễ đọc.
- Chuẩn hóa lại typography với `clamp()` để font không bị quá to khi có ảnh hoặc card nhỏ.
- Sửa khối sản phẩm nổi bật thành một **khung carousel rõ ràng**, có animation chạy ngang liên tục và dừng khi hover.
- Nút **Thêm Vào Giỏ** trên carousel đã được nối với giỏ hàng hệ thống, không còn chỉ là nút tĩnh.

### 2) Trang PC Build sẵn
Route: `/builds`

- Trang build sẵn đã được dựng thành một **storefront riêng** cho người dùng.
- Có bộ lọc theo nhóm build: Gaming, Văn phòng, Streaming, Creative, và chế độ xem tất cả.
- Mỗi build hiển thị đầy đủ:
  - tên build,
  - giá,
  - mô tả ngắn,
  - điểm hiệu năng,
  - cấu hình chi tiết CPU/GPU/RAM/Storage/PSU.
- Nút **Thêm vào giỏ** trên build đã được nối vào **giỏ hàng hệ thống** thông qua API thay vì lưu cục bộ.
- Phần CRUD build được giữ cho luồng quản trị, không để lẫn vào trải nghiệm mua sắm của khách hàng.

### 3) Trang Dịch vụ
Route: `/services`

- Giao diện dịch vụ được làm lại để tập trung vào **đặt lịch và theo dõi yêu cầu**.
- Mỗi dịch vụ hiển thị rõ:
  - biểu tượng,
  - tên,
  - mô tả,
  - thời lượng,
  - giá,
  - trạng thái còn nhận lịch.
- Có khối **Yêu cầu gần đây** để người dùng xem nhanh booking vừa tạo.
- Form đặt dịch vụ được kiểm tra dữ liệu bắt buộc trước khi gửi.
- CRUD dịch vụ đã được tách sang khu vực quản trị riêng.

### 4) Khu quản trị dịch vụ
Route: `/admin/services`

- Tạo trang admin riêng để **thêm / sửa / xóa** dịch vụ.
- Dữ liệu dịch vụ dùng chung với trang public nên thay đổi ở admin sẽ phản ánh lại ở giao diện người dùng.
- Phần public không còn hiển thị nút chỉnh sửa, tránh nhầm lẫn giữa khách hàng và quản trị viên.

### 5) Wishlist / Sản phẩm yêu thích
Route: `/account/wishlist`

- Thiết kế lại thành layout dạng card/panel dễ đọc hơn.
- Sản phẩm yêu thích được ghép lại từ **catalog sản phẩm thực tế**, nên hiện rõ:
  - tên sản phẩm,
  - brand,
  - giá bán,
  - giá khuyến mãi,
  - ảnh sản phẩm,
  - mô tả ngắn.
- Nút **Thêm vào giỏ** và **Xóa khỏi yêu thích** hiển thị rõ ràng, thao tác nhanh.
- Trang cũng hiển thị tổng số mục và tổng giá trị danh sách yêu thích.

### 6) Khu tài khoản và xem đơn hàng
- Chuẩn hóa lại các khối UI trong khu tài khoản để đồng bộ với wishlist và storefront.
- Trang xem đơn hàng được định hướng theo layout rõ ràng hơn: phân tách trạng thái, thông tin đơn, sản phẩm trong đơn và thao tác tiếp tục mua hàng.

### 7) Đồng bộ dữ liệu và ảnh sản phẩm
- Các item wishlist/cart/build được normalize ảnh qua `resolveProductImage()` để tránh lỗi ảnh khi dữ liệu backend thiếu đường dẫn đầy đủ.
- Với wishlist, hệ thống còn ghép thêm dữ liệu từ catalog sản phẩm để tránh tình trạng hiện tên hoặc ảnh placeholder không rõ ràng.

### 8) Tách luồng public và admin
- Người dùng chỉ thấy luồng mua hàng / đặt lịch / lưu yêu thích.
- Các chức năng CRUD nhạy cảm được chuyển sang khu admin.
- Điều này giúp giao diện công khai gọn hơn, giảm lỗi thao tác và đúng phân quyền hơn.

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────────────┐  │
│  │  Pages  │  │Components│  │ Hooks  │  │  State Stores │  │
│  └────┬────┘  └─────┬────┘  └───┬────┘  └───────┬───────┘  │
│       └─────────────┴───────────┴───────────────┘           │
│                          │                                   │
├──────────────────────────┼───────────────────────────────────┤
│                   Next.js API Routes                         │
│  ┌──────────┐  ┌─────────┐  ┌────────┐  ┌──────────────┐   │
│  │ /api/chat│  │/api/prod │  │/api/   │  │ /api/admin/* │   │
│  │ (Gemini) │  │  ucts   │  │orders  │  │  (CRUD)      │   │
│  └────┬─────┘  └────┬────┘  └───┬────┘  └──────┬───────┘   │
│       │             │           │               │            │
│  ┌────┴─────────────┴───────────┴───────────────┴────────┐  │
│  │              In-Memory Data Stores (globalThis)        │  │
│  │  productStore │ reviewStore │ knowledgeStore │ ...     │  │
│  └────────────────────────────┬───────────────────────────┘  │
│                               │                              │
│  ┌────────────────────────────┴───────────────────────────┐  │
│  │                 Mega Data Files (TSX)                   │  │
│  │  mega-products │ mega-builds │ mega-faq │ mega-reviews │  │
│  │  mega-knowledge                                        │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│                    Google Gemini AI API                       │
│              (gemini-2.0-flash model, RAG context)           │
└──────────────────────────────────────────────────────────────┘
```

### Luồng xử lý Chat AI (RAG Pipeline)

```
User Message
     │
     ▼
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Intent      │───▶│ RAG Context      │───▶│ Gemini AI       │
│ Detection   │    │ Builder          │    │ Generation      │
│ (12 intents)│    │ (search products,│    │ (System prompt  │
│             │    │  FAQ, knowledge, │    │  + RAG context  │
│             │    │  reviews, builds)│    │  + user query)  │
└─────────────┘    └──────────────────┘    └────────┬────────┘
                                                     │
                                                     ▼
                                           ┌─────────────────┐
                                           │ Response Parser │
                                           │ (text, products,│
                                           │  comparison,    │
                                           │  assembly steps)│
                                           └─────────────────┘
```

---

## 🛠️ Công nghệ sử dụng

### Frontend
| Công nghệ | Version | Mô tả |
|---|---|---|
| **Next.js** | 14.2.5 | React framework, App Router, SSR/SSG |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.5.4 | Type-safe JavaScript |
| **CSS Custom Properties** | — | Pure CSS, không dùng Tailwind, Inter font |

### AI & Data
| Công nghệ | Mô tả |
|---|---|
| **Google Gemini 2.0 Flash** | LLM model cho chatbot |
| **RAG Architecture** | Retrieval-Augmented Generation |
| **In-memory Store** | `globalThis` pattern, persistence qua hot reload |

### Tooling
| Tool | Mô tả |
|---|---|
| **tsx** | TypeScript executor cho scripts |
| **Git** | Version control |

---

## 📁 Cấu trúc dự án

```
frontend/
├── .env.local                    # Biến môi trường (API key)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
│
├── data-export/                  # 📊 CSV data export
│   ├── products.csv              #    348 sản phẩm
│   ├── prebuilt_pcs.csv          #    66 bộ PC build sẵn
│   ├── compatibility_rules.csv   #    55 quy tắc tương thích
│   ├── assembly_guides.csv       #    17 hướng dẫn lắp ráp
│   ├── faq.csv                   #    147 câu hỏi thường gặp
│   ├── reviews.csv               #    411 đánh giá sản phẩm
│   └── knowledge.csv             #    111 bài viết kiến thức
│
├── scripts/
│   └── export-csv.ts             # Script export data → CSV
│
├── public/
│   ├── robots.txt
│   └── images/                   # Static images
│
└── src/
    ├── app/                      # 📄 Pages (App Router)
    │   ├── layout.tsx            #    Root layout
    │   ├── page.tsx              #    Trang chủ
    │   │
    │   ├── (auth)/               #    🔐 Authentication
    │   │   ├── login/            #       Đăng nhập
    │   │   ├── register/         #       Đăng ký
    │   │   └── forgot-password/  #       Quên mật khẩu
    │   │
    │   ├── products/             #    📦 Sản phẩm
    │   │   ├── page.tsx          #       Danh sách sản phẩm
    │   │   └── [category]/       #       Lọc theo danh mục
    │   │
    │   ├── chat/                 #    💬 Chat AI page
    │   │   └── page.tsx
    │   │
    │   ├── cart/                 #    🛒 Giỏ hàng
    │   │   └── page.tsx
    │   │
    │   ├── checkout/             #    💳 Thanh toán
    │   │   └── page.tsx
    │   │
    │   ├── account/              #    👤 Tài khoản người dùng
    │   │   ├── page.tsx          #       Dashboard
    │   │   ├── profile/          #       Thông tin cá nhân
    │   │   ├── orders/           #       Lịch sử đơn hàng
    │   │   ├── wishlist/         #       Danh sách yêu thích
    │   │   ├── reviews/          #       Đánh giá của tôi
    │   │   └── addresses/        #       Sổ địa chỉ
    │   │
    │   ├── admin/                #    🔧 Admin Panel
    │   │   ├── page.tsx          #       Dashboard thống kê
    │   │   ├── layout.tsx        #       Admin layout + sidebar
    │   │   ├── products/         #       Quản lý sản phẩm
    │   │   ├── builds/           #       Quản lý build PC
    │   │   ├── faq/              #       Quản lý FAQ
    │   │   ├── knowledge/        #       Quản lý Knowledge Base
    │   │   ├── orders/           #       Quản lý đơn hàng
    │   │   ├── users/            #       Quản lý người dùng
    │   │   ├── roles/            #       Phân quyền
    │   │   └── settings/         #       Cài đặt
    │   │
    │   └── api/                  #    🔌 API Routes
    │       ├── chat/             #       POST /api/chat (Gemini AI)
    │       ├── products/         #       GET /api/products
    │       ├── reviews/          #       GET|POST /api/reviews
    │       ├── builds/           #       GET /api/builds
    │       ├── knowledge/        #       GET /api/knowledge
    │       ├── cart/             #       GET|POST /api/cart
    │       ├── orders/           #       GET|POST /api/orders
    │       ├── auth/             #       POST /api/auth
    │       ├── user/             #       GET|PUT /api/user
    │       ├── wishlist/         #       GET|POST /api/wishlist
    │       ├── notifications/    #       GET|POST /api/notifications
    │       ├── health/           #       GET /api/health
    │       └── admin/            #       Admin API endpoints
    │           ├── stats/        #          GET /api/admin/stats
    │           ├── products/     #          CRUD /api/admin/products
    │           ├── builds/       #          CRUD /api/admin/builds
    │           └── faq/          #          CRUD /api/admin/faq
    │
    ├── components/               # 🧩 React Components
    │   ├── chat/                 #    Chat components
    │   │   ├── ChatWindow.tsx    #       Main chat window
    │   │   ├── ChatMessage.tsx   #       Message bubble + rich content
    │   │   ├── FloatingChat.tsx  #       Floating chat button
    │   │   ├── ProductCard.tsx   #       Product card trong chat
    │   │   └── AssemblyGuide.tsx #       Assembly steps trong chat
    │   │
    │   ├── layout/               #    Layout components
    │   │   ├── Header.tsx        #       Navigation header
    │   │   ├── Footer.tsx        #       Footer
    │   │   └── Sidebar.tsx       #       Admin sidebar
    │   │
    │   ├── home/                 #    Homepage components
    │   │   └── ChatDemo.tsx      #       Chat demo on homepage
    │   │
    │   ├── common/               #    Shared components
    │   │   ├── Loading.tsx       #       Loading spinner
    │   │   └── Pagination.tsx    #       Pagination controls
    │   │
    │   ├── ui/                   #    UI primitives
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Modal.tsx
    │   │   └── Toast.tsx
    │   │
    │   └── providers/
    │       └── AuthProvider.tsx   #    Auth context provider
    │
    ├── lib/                      # 📚 Business Logic & Data
    │   ├── data/                 #    🗃️ Mega Data Files
    │   │   ├── mega-products.ts  #       348 sản phẩm (578 lines)
    │   │   ├── mega-builds.ts    #       66 builds + 55 rules + 17 guides (348 lines)
    │   │   ├── mega-faq.ts       #       147 FAQ entries (242 lines)
    │   │   ├── mega-reviews.ts   #       411 reviews (359 lines)
    │   │   └── mega-knowledge.ts #       111 bài viết (369 lines)
    │   │
    │   ├── productStore.ts       #    Product + Build + FAQ store
    │   ├── reviewStore.ts        #    Review store
    │   ├── knowledgeStore.ts     #    Knowledge article store
    │   ├── cartStore.ts          #    Shopping cart store
    │   ├── orderStore.ts         #    Order management store
    │   ├── userStore.ts          #    User store
    │   ├── wishlistStore.ts      #    Wishlist store
    │   ├── notificationStore.ts  #    Notification store
    │   ├── auth.ts               #    Auth utilities
    │   └── format.ts             #    Format helpers (currency, date)
    │
    ├── types/                    # 📝 TypeScript Type Definitions
    │   ├── product.type.ts       #    Product, PrebuiltPC, CompatibilityRule, AssemblyGuide
    │   ├── chat.type.ts          #    ChatMessage, ChatIntent, ProductCard, ComparisonData
    │   ├── order.type.ts         #    Cart, Order, ProductReview, Coupon
    │   ├── knowledge.ts          #    KnowledgeItem
    │   ├── auth.type.ts          #    User, AuthState
    │   └── index.ts              #    Re-exports
    │
    └── styles/
        └── globals.css           #    Global CSS with custom properties
```

---

## 🗃️ Cơ sở dữ liệu

Hệ thống sử dụng **in-memory data store** với pattern `globalThis` để persist dữ liệu qua Next.js hot reload. Dữ liệu được khởi tạo từ 5 file mega data.

### Tổng quan dữ liệu

| Bảng dữ liệu | Số lượng | Mô tả |
|---|---|---|
| **Products** | 348 | Sản phẩm linh kiện PC |
| **Prebuilt PCs** | 66 | Cấu hình PC build sẵn |
| **Compatibility Rules** | 55 | Quy tắc tương thích linh kiện |
| **Assembly Guides** | 17 | Hướng dẫn lắp ráp chi tiết |
| **FAQ** | 147 | Câu hỏi thường gặp |
| **Reviews** | 411 | Đánh giá sản phẩm |
| **Knowledge** | 111 | Bài viết kiến thức phần cứng |

### Chi tiết sản phẩm theo danh mục (348 SKUs)

| Danh mục | Số lượng | Brands |
|---|---|---|
| **CPU** | 53 | Intel (Gen 12/13/14), AMD (Ryzen 5000/7000/8000G) |
| **GPU** | 56 | NVIDIA (GTX 1650 → RTX 4090), AMD (RX 7600 → 7900 XTX), Intel Arc |
| **Mainboard** | 33 | ASUS, MSI, Gigabyte — Z790/B760/B660/X670E/B650/B550/A520 |
| **RAM** | 24 | Kingston, Corsair, G.Skill, Crucial, TeamGroup — DDR4 & DDR5 |
| **SSD** | 24 | Samsung, WD, Crucial, Kingston — PCIe 5.0/4.0/SATA |
| **HDD** | 11 | WD, Seagate, Toshiba — 1TB → 8TB |
| **PSU** | 22 | Corsair, Seasonic, be quiet!, NZXT, MSI — 550W → 1000W |
| **Case** | 16 | NZXT, Corsair, Lian Li, Fractal, Phanteks, be quiet! |
| **Cooler** | 23 | Noctua, be quiet!, Arctic, Corsair, NZXT, DeepCool — Air & AIO |
| **Monitor** | 19 | ASUS, LG, Samsung, Dell, MSI, BenQ — 24" → 49" |
| **Laptop** | 23 | ASUS, MSI, Lenovo, Acer, HP, Apple, Dell |
| **Keyboard** | 15 | Razer, Corsair, Logitech, Keychron, Ducky, Leopold, Akko |
| **Mouse** | 15 | Logitech, Razer, Pulsar, Zowie, SteelSeries |
| **Headset** | 14 | HyperX, Logitech, SteelSeries, Razer, Corsair, Beyerdynamic |

### Bộ PC Build sẵn (66 configs)

| Phân khúc | Số lượng | Tầm giá |
|---|---|---|
| Gaming Budget | 4 | 8 – 15 triệu |
| Gaming Mid-range | 4 | 15 – 25 triệu |
| Gaming High-end | 3 | 25 – 40 triệu |
| Gaming Extreme | 3 | 40 – 70 triệu |
| Văn phòng | 6 | 5 – 12 triệu |
| Đồ họa / Creator | 7 | 12 – 50 triệu |
| Streaming | 4 | 15 – 35 triệu |
| Sinh viên | 4 | 5 – 10 triệu |
| NAS / Server | 2 | 10 – 30 triệu |
| AI / Machine Learning | 3 | 30 – 80 triệu |
| Mini-ITX / SFF | 3 | 10 – 35 triệu |
| HTPC / Home Theater | 2 | 5 – 10 triệu |
| Hackintosh | 2 | 15 – 30 triệu |
| Themed builds (trắng, RGB, silent) | 6 | 15 – 40 triệu |
| Khác (CCTV, POS, kiosk, ...) | 5+ | Đa dạng |

### Cấu trúc dữ liệu chính

#### Product
```typescript
interface Product {
  id: string;                      // "cpu-i9-14900k"
  name: string;                    // "Intel Core i9-14900K"
  category: ProductCategory;       // "cpu" | "gpu" | "mainboard" | ...
  brand: string;                   // "Intel"
  price: number;                   // 14990000 (VNĐ)
  discountPrice?: number;          // Giá khuyến mãi
  image: string;                   // "/images/products/cpu/..."
  shortDesc: string;               // Mô tả ngắn
  specs: Record<string, string>;   // { Socket: "LGA 1700", ... }
  stock: number;                   // Tồn kho
  rating: number;                  // 4.8
  tags: string[];                  // ["intel", "i9", "flagship", ...]
  compatKey?: string;              // "LGA1700_DDR5" (kiểm tra tương thích)
}
```

#### PrebuiltPC
```typescript
interface PrebuiltPC {
  id: string;                      // "build-gaming-15m"
  name: string;                    // "PC Gaming 15 Triệu"
  purpose: string;                 // "gaming"
  price: number;                   // 15000000
  image: string;
  components: {
    cpu: string;                   // "AMD Ryzen 5 5600"
    gpu: string;                   // "NVIDIA RTX 4060 8GB"
    mainboard: string;             // "MSI MAG B550 TOMAHAWK"
    ram: string;                   // "16GB DDR4-3600 (2x8)"
    storage: string;               // "WD Black SN770 1TB"
    psu: string;                   // "Corsair RM650e 650W Gold"
    case: string;                  // "NZXT H5 Flow"
    cooler: string;                // "DeepCool AK400"
  };
  description: string;
  rating: number;
}
```

#### ProductReview
```typescript
interface ProductReview {
  id: string;                      // "rv-cpu-1"
  productId: string;               // "cpu-i5-14400f"
  userId: string;
  userName: string;                // "Minh Tuấn"
  rating: number;                  // 1-5
  title: string;                   // "Best value CPU 2024"
  content: string;                 // Nội dung đánh giá
  pros?: string[];                 // ["Giá rẻ", "Hiệu năng tốt"]
  cons?: string[];                 // ["Không ép xung"]
  verified: boolean;               // Mua hàng xác thực
  createdAt: string;               // "2024-05-01"
}
```

#### KnowledgeItem
```typescript
interface KnowledgeItem {
  id: string;                      // "kb-cpu-1"
  title: string;                   // "Kiến trúc CPU Intel Alder Lake"
  content: string;                 // Nội dung bài viết
  tags: string[];                  // ["cpu", "intel", "architecture"]
  source: string;                  // "PC Knowledge Base"
  createdAt: string;               // "2024-01-01"
}
```

---

## 🤖 AI Chatbot - Chi tiết kỹ thuật

### Model: Google Gemini 2.0 Flash

- **Provider:** Google Generative AI (`@google/generative-ai`)
- **Model:** `gemini-2.0-flash`
- **Max Output Tokens:** 4096
- **Temperature:** Mặc định (balanced)

### RAG (Retrieval-Augmented Generation)

Chatbot sử dụng kiến trúc RAG để đảm bảo câu trả lời dựa trên dữ liệu thực:

1. **Intent Detection** — Phân loại ý định người dùng (12 loại):
   - `greeting` — Chào hỏi
   - `product_inquiry` — Hỏi về sản phẩm cụ thể
   - `product_recommendation` — Yêu cầu tư vấn/gợi ý
   - `price_check` — Hỏi giá
   - `comparison` — So sánh sản phẩm
   - `compatibility_check` — Kiểm tra tương thích
   - `build_pc` — Yêu cầu build PC
   - `assembly_guide` — Hướng dẫn lắp ráp
   - `order` — Đặt hàng
   - `warranty` — Bảo hành
   - `general_support` — Hỗ trợ chung
   - `unknown` — Không xác định

2. **RAG Context Builder** — Tìm kiếm dữ liệu liên quan:
   - Tìm sản phẩm phù hợp (top 15)
   - Tìm sản phẩm theo ngân sách (top 10)
   - Lấy bộ PC build sẵn
   - Lấy hướng dẫn lắp ráp
   - Tìm FAQ liên quan (top 10)
   - Tìm bài viết kiến thức (top 10)
   - Lấy reviews (top 2 cho top 5 sản phẩm)
   - Kiểm tra tương thích linh kiện
   - Chính sách shop

3. **System Prompt** — Prompt hệ thống định nghĩa chatbot:
   - Vai trò: Chuyên gia tư vấn PC
   - Ngôn ngữ: Tiếng Việt tự nhiên
   - Quy tắc: Luôn dựa trên dữ liệu thực, giá VNĐ, gợi ý sản phẩm có ID
   - Format: Markdown, bảng so sánh, product cards

4. **Response Types** — Các loại phản hồi:
   - `text` — Văn bản thuần
   - `products` — Kèm product cards có thể click
   - `build-suggestion` — Gợi ý cấu hình PC
   - `assembly-guide` — Hướng dẫn lắp ráp theo bước
   - `comparison` — Bảng so sánh sản phẩm
   - `order-form` — Form đặt hàng

### Ví dụ câu hỏi chatbot có thể trả lời

```
💬 "Tôi muốn build PC gaming 15 triệu"
💬 "So sánh RTX 4060 vs RX 7600"
💬 "CPU i5-14400F có tương thích mainboard B550 không?"
💬 "SSD nào tốt nhất tầm giá 2 triệu?"
💬 "Hướng dẫn lắp PC cho người mới"
💬 "Laptop gaming dưới 20 triệu nên mua gì?"
💬 "DDR5 có đáng nâng cấp từ DDR4 không?"
💬 "PSU cần bao nhiêu W cho RTX 4070?"
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- **Node.js** >= 18.x
- **npm** hoặc **yarn**
- **Google AI API Key** (miễn phí tại [Google AI Studio](https://aistudio.google.com/))

### Cài đặt

```bash
# Clone repository
git clone https://github.com/kurovud/KLTN_Application-of-artificial-intelligence-AI-Chatbot.git
cd KLTN_Application-of-artificial-intelligence-AI-Chatbot/frontend

# Cài đặt dependencies
npm install

# Tạo file biến môi trường
cp .env.example .env.local
# Sau đó điền GOOGLE_AI_API_KEY vào .env.local
```

### Chạy Development

```bash
npm run dev
# → http://localhost:3000
```

### Build Production

```bash
npm run build
npm start
# → http://localhost:3000
```

### Export data CSV

```bash
npx tsx scripts/export-csv.ts
# → Tạo 7 file CSV trong folder data-export/
```

---

## 🔐 Biến môi trường

Tạo file `.env.local` trong thư mục `frontend/`:

```env
# Google Gemini AI API Key
# Lấy tại: https://aistudio.google.com/apikey
GOOGLE_AI_API_KEY=your_api_key_here
```

---

## 📡 API Endpoints

### Public APIs

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/chat` | Gửi tin nhắn đến AI Chatbot |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ filter, pagination) |
| `GET` | `/api/products?category=cpu` | Lọc theo danh mục |
| `GET` | `/api/products?search=rtx` | Tìm kiếm sản phẩm |
| `GET` | `/api/builds` | Lấy danh sách bộ PC build sẵn |
| `GET` | `/api/reviews` | Lấy đánh giá sản phẩm |
| `POST` | `/api/reviews` | Gửi đánh giá mới |
| `GET` | `/api/knowledge` | Lấy bài viết kiến thức |
| `GET` | `/api/health` | Health check |

### Auth APIs

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/auth` | Đăng nhập / Đăng ký / Logout |
| `GET` | `/api/user` | Lấy thông tin user hiện tại |
| `PUT` | `/api/user` | Cập nhật profile |

### Cart & Order APIs

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/cart` | Lấy giỏ hàng |
| `POST` | `/api/cart` | Thêm/xóa/cập nhật giỏ hàng |
| `GET` | `/api/orders` | Lấy lịch sử đơn hàng |
| `POST` | `/api/orders` | Tạo đơn hàng mới |
| `GET` | `/api/wishlist` | Lấy wishlist |
| `POST` | `/api/wishlist` | Thêm/xóa wishlist |
| `GET` | `/api/notifications` | Lấy thông báo |
| `POST` | `/api/notifications` | Đánh dấu đã đọc |

### Admin APIs

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/admin/stats` | Dashboard thống kê |
| `GET` | `/api/admin/products` | Lấy tất cả sản phẩm (admin) |
| `POST` | `/api/admin/products` | Thêm sản phẩm mới |
| `PUT` | `/api/admin/products` | Cập nhật sản phẩm |
| `DELETE` | `/api/admin/products` | Xóa sản phẩm |
| `GET/POST` | `/api/admin/builds` | CRUD bộ build PC |
| `GET/POST` | `/api/admin/faq` | CRUD FAQ |

### Ví dụ Chat API Request

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "Tôi muốn build PC gaming 20 triệu",
  "conversationId": "conv-123",
  "history": [
    { "role": "user", "content": "Xin chào" },
    { "role": "assistant", "content": "Chào bạn! Tôi có thể giúp gì?" }
  ]
}
```

### Ví dụ Chat API Response

```json
{
  "response": {
    "content": "Với ngân sách 20 triệu, tôi gợi ý cấu hình...",
    "contentType": "products",
    "products": [
      {
        "id": "cpu-r5-5600",
        "name": "AMD Ryzen 5 5600",
        "price": 2990000,
        "category": "cpu",
        "rating": 4.6,
        "specs": { "Socket": "AM4", ... }
      }
    ],
    "sources": ["product-search", "prebuilt-match"]
  }
}
```

---

## 📊 Data Export

Dữ liệu hệ thống được export ra 7 file CSV để dễ dàng xem và phân tích:

```bash
npx tsx scripts/export-csv.ts
```

### Danh sách file CSV

| File | Rows | Size | Mô tả |
|---|---|---|---|
| `products.csv` | 348 | 127.7 KB | Toàn bộ sản phẩm linh kiện |
| `reviews.csv` | 411 | 112.0 KB | Đánh giá sản phẩm |
| `knowledge.csv` | 111 | 65.9 KB | Bài viết kiến thức phần cứng |
| `faq.csv` | 147 | 61.8 KB | Câu hỏi thường gặp |
| `assembly_guides.csv` | 17 | 30.0 KB | Hướng dẫn lắp ráp PC |
| `prebuilt_pcs.csv` | 66 | 26.7 KB | Cấu hình PC build sẵn |
| `compatibility_rules.csv` | 55 | 7.5 KB | Quy tắc tương thích linh kiện |

> 💡 Các file CSV sử dụng UTF-8 BOM, mở trực tiếp bằng Excel hiển thị tiếng Việt đúng.  
> Các trường phức tạp (specs, tags, pros, cons, steps) được lưu dạng JSON string.

---

## 🖥️ Danh sách trang (47 pages)

### Trang công khai
| Trang | Route | Mô tả |
|---|---|---|
| Trang chủ | `/` | Landing page, featured products, chat demo |
| Danh sách sản phẩm | `/products` | Catalog với filter & search |
| Sản phẩm theo danh mục | `/products/[category]` | 14 danh mục |
| Chat AI | `/chat` | Fullscreen chatbot |
| Giỏ hàng | `/cart` | Quản lý giỏ hàng |
| Thanh toán | `/checkout` | Form checkout |

### Trang xác thực
| Trang | Route |
|---|---|
| Đăng nhập | `/login` |
| Đăng ký | `/register` |
| Quên mật khẩu | `/forgot-password` |

### Trang tài khoản
| Trang | Route |
|---|---|
| Dashboard | `/account` |
| Thông tin cá nhân | `/account/profile` |
| Đơn hàng | `/account/orders` |
| Wishlist | `/account/wishlist` |
| Đánh giá | `/account/reviews` |
| Địa chỉ | `/account/addresses` |

### Trang admin
| Trang | Route |
|---|---|
| Dashboard | `/admin` |
| Quản lý sản phẩm | `/admin/products` |
| Quản lý build PC | `/admin/builds` |
| Quản lý FAQ | `/admin/faq` |
| Quản lý Knowledge | `/admin/knowledge` |
| Quản lý đơn hàng | `/admin/orders` |
| Quản lý users | `/admin/users` |
| Phân quyền | `/admin/roles` |
| Cài đặt | `/admin/settings` |

---

## 👨‍💻 Tác giả

**Đồ án Khóa luận Tốt nghiệp**  
*Ứng dụng trí tuệ nhân tạo (AI Chatbot) trong tư vấn và bán hàng linh kiện máy tính*

- **Repository:** [github.com/kurovud/KLTN_Application-of-artificial-intelligence-AI-Chatbot](https://github.com/kurovud/KLTN_Application-of-artificial-intelligence-AI-Chatbot)
- **Branch:** `dev`

---

## 📄 License

Dự án này được phát triển cho mục đích học thuật (Khóa luận Tốt nghiệp).
