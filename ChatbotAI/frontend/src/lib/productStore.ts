import {
  Product,
  PrebuiltPC,
  CompatibilityRule,
  AssemblyGuide
} from "@/types/product.type";
import { ALL_MEGA_PRODUCTS } from "@/lib/data/mega-products";
import { MEGA_PREBUILT_PCS, MEGA_COMPAT_RULES, MEGA_ASSEMBLY_GUIDES } from "@/lib/data/mega-builds";
import { MEGA_FAQ } from "@/lib/data/mega-faq";

/* ═══════════════════════════════════════════════════
   LEGACY DATA MERGED WITH MEGA DATA
   ═══════════════════════════════════════════════════ */
const createProducts = (): Product[] => [
  ...ALL_MEGA_PRODUCTS,

  /* ══════════════ CPU ══════════════ */
  {
    id: "cpu-001", name: "Intel Core i5-14400F", category: "cpu", brand: "Intel",
    price: 4890000, image: "/images/products/i5-14400f.jpg",
    shortDesc: "10 nhân 16 luồng, xung boost 4.7 GHz, socket LGA 1700. Lựa chọn tối ưu cho gaming & làm việc.",
    specs: { "Số nhân / luồng": "10C / 16T", "Xung cơ bản / Boost": "2.5 GHz / 4.7 GHz", Socket: "LGA 1700", TDP: "65W", Cache: "20MB L3" },
    stock: 50, rating: 4.7, tags: ["gaming", "mid-range", "intel", "gen 14"], compatKey: "LGA1700"
  },
  {
    id: "cpu-002", name: "Intel Core i7-14700K", category: "cpu", brand: "Intel",
    price: 9990000, image: "/images/products/i7-14700k.jpg",
    shortDesc: "20 nhân 28 luồng, xung boost 5.6 GHz, mở khóa ép xung. Hiệu năng cao cho gaming & sáng tạo nội dung.",
    specs: { "Số nhân / luồng": "20C / 28T", "Xung cơ bản / Boost": "3.4 GHz / 5.6 GHz", Socket: "LGA 1700", TDP: "125W", Cache: "33MB L3" },
    stock: 30, rating: 4.8, tags: ["high-end", "gaming", "content creation", "intel", "overclock"], compatKey: "LGA1700"
  },
  {
    id: "cpu-003", name: "AMD Ryzen 5 7600X", category: "cpu", brand: "AMD",
    price: 5490000, image: "/images/products/r5-7600x.jpg",
    shortDesc: "6 nhân 12 luồng, xung boost 5.3 GHz, socket AM5. Hiệu năng gaming xuất sắc ở tầm giá.",
    specs: { "Số nhân / luồng": "6C / 12T", "Xung cơ bản / Boost": "4.7 GHz / 5.3 GHz", Socket: "AM5", TDP: "105W", Cache: "32MB L3" },
    stock: 40, rating: 4.6, tags: ["gaming", "mid-range", "amd", "zen4"], compatKey: "AM5"
  },
  {
    id: "cpu-004", name: "AMD Ryzen 7 7800X3D", category: "cpu", brand: "AMD",
    price: 9290000, image: "/images/products/r7-7800x3d.jpg",
    shortDesc: "8 nhân 16 luồng, 3D V-Cache 96MB, CPU gaming mạnh nhất phân khúc.",
    specs: { "Số nhân / luồng": "8C / 16T", "Xung cơ bản / Boost": "4.2 GHz / 5.0 GHz", Socket: "AM5", TDP: "120W", Cache: "96MB 3D V-Cache" },
    stock: 25, rating: 4.9, tags: ["gaming", "high-end", "amd", "3d-vcache"], compatKey: "AM5"
  },
  {
    id: "cpu-005", name: "Intel Core i3-12100F", category: "cpu", brand: "Intel",
    price: 2290000, image: "/images/products/i3-12100f.jpg",
    shortDesc: "4 nhân 8 luồng, xung boost 4.3 GHz. CPU giá rẻ cho gaming nhẹ và văn phòng.",
    specs: { "Số nhân / luồng": "4C / 8T", "Xung cơ bản / Boost": "3.3 GHz / 4.3 GHz", Socket: "LGA 1700", TDP: "58W", Cache: "12MB L3" },
    stock: 60, rating: 4.5, tags: ["budget", "entry-level", "intel", "văn phòng"], compatKey: "LGA1700"
  },
  {
    id: "cpu-006", name: "Intel Core i9-14900K", category: "cpu", brand: "Intel",
    price: 14990000, image: "/images/products/i9-14900k.jpg",
    shortDesc: "24 nhân 32 luồng, xung boost 6.0 GHz. Flagship Intel cho workstation & gaming đỉnh cao.",
    specs: { "Số nhân / luồng": "24C / 32T (8P+16E)", "Xung cơ bản / Boost": "3.2 GHz / 6.0 GHz", Socket: "LGA 1700", TDP: "125W (253W PBP)", Cache: "36MB L3" },
    stock: 15, rating: 4.7, tags: ["flagship", "workstation", "gaming", "intel", "overclock"], compatKey: "LGA1700"
  },
  {
    id: "cpu-007", name: "AMD Ryzen 9 7950X", category: "cpu", brand: "AMD",
    price: 13490000, image: "/images/products/r9-7950x.jpg",
    shortDesc: "16 nhân 32 luồng, xung boost 5.7 GHz. Quái vật đa nhân cho sáng tạo nội dung & rendering.",
    specs: { "Số nhân / luồng": "16C / 32T", "Xung cơ bản / Boost": "4.5 GHz / 5.7 GHz", Socket: "AM5", TDP: "170W", Cache: "64MB L3" },
    stock: 12, rating: 4.8, tags: ["flagship", "workstation", "content creation", "amd", "zen4"], compatKey: "AM5"
  },
  {
    id: "cpu-008", name: "AMD Ryzen 5 5600", category: "cpu", brand: "AMD",
    price: 2990000, image: "/images/products/r5-5600.jpg",
    shortDesc: "6 nhân 12 luồng, socket AM4. CPU giá rẻ hoàn hảo để nâng cấp hệ thống AM4 cũ.",
    specs: { "Số nhân / luồng": "6C / 12T", "Xung cơ bản / Boost": "3.5 GHz / 4.4 GHz", Socket: "AM4", TDP: "65W", Cache: "32MB L3" },
    stock: 45, rating: 4.6, tags: ["budget", "gaming", "amd", "zen3", "am4"], compatKey: "AM4"
  },
  {
    id: "cpu-009", name: "Intel Core i5-13400F", category: "cpu", brand: "Intel",
    price: 4290000, image: "/images/products/i5-13400f.jpg",
    shortDesc: "10 nhân 16 luồng, xung boost 4.6 GHz. Giá rẻ hơn 14400F, hiệu năng tương đương 95%.",
    specs: { "Số nhân / luồng": "10C / 16T (6P+4E)", "Xung cơ bản / Boost": "2.5 GHz / 4.6 GHz", Socket: "LGA 1700", TDP: "65W", Cache: "20MB L3" },
    stock: 35, rating: 4.6, tags: ["gaming", "mid-range", "intel", "gen 13", "giá rẻ"], compatKey: "LGA1700"
  },
  {
    id: "cpu-010", name: "AMD Ryzen 7 5800X", category: "cpu", brand: "AMD",
    price: 4990000, image: "/images/products/r7-5800x.jpg",
    shortDesc: "8 nhân 16 luồng, AM4. CPU đa nhiệm tốt, giá đã giảm sâu.",
    specs: { "Số nhân / luồng": "8C / 16T", "Xung cơ bản / Boost": "3.8 GHz / 4.7 GHz", Socket: "AM4", TDP: "105W", Cache: "32MB L3" },
    stock: 20, rating: 4.5, tags: ["mid-range", "amd", "zen3", "am4", "đa nhiệm"], compatKey: "AM4"
  },
  {
    id: "cpu-011", name: "Intel Core i5-12400F", category: "cpu", brand: "Intel",
    price: 2890000, image: "/images/products/i5-12400f.jpg",
    shortDesc: "6 nhân 12 luồng, LGA 1700. Lựa chọn tiết kiệm cho gaming 1080p mượt mà.",
    specs: { "Số nhân / luồng": "6C / 12T", "Xung cơ bản / Boost": "2.5 GHz / 4.4 GHz", Socket: "LGA 1700", TDP: "65W", Cache: "18MB L3" },
    stock: 55, rating: 4.5, tags: ["budget", "gaming", "intel", "gen 12"], compatKey: "LGA1700"
  },
  {
    id: "cpu-012", name: "AMD Ryzen 9 7900X", category: "cpu", brand: "AMD",
    price: 10990000, image: "/images/products/r9-7900x.jpg",
    shortDesc: "12 nhân 24 luồng, xung boost 5.6 GHz. Cân bằng hoàn hảo giữa gaming và workstation.",
    specs: { "Số nhân / luồng": "12C / 24T", "Xung cơ bản / Boost": "4.7 GHz / 5.6 GHz", Socket: "AM5", TDP: "170W", Cache: "64MB L3" },
    stock: 18, rating: 4.7, tags: ["high-end", "workstation", "gaming", "amd", "zen4"], compatKey: "AM5"
  },

  /* ══════════════ GPU ══════════════ */
  {
    id: "gpu-001", name: "NVIDIA RTX 4060 Ti 8GB", category: "gpu", brand: "NVIDIA",
    price: 9990000, image: "/images/products/rtx4060ti.jpg",
    shortDesc: "8GB GDDR6X, ray tracing, DLSS 3. Card đồ họa gaming 1080p - 1440p tối ưu.",
    specs: { VRAM: "8GB GDDR6X", "Bus width": "128-bit", "Boost Clock": "2535 MHz", TDP: "160W", "Cổng xuất": "3x DP 1.4, 1x HDMI 2.1" },
    stock: 35, rating: 4.6, tags: ["gaming", "1080p", "1440p", "ray tracing", "dlss"], compatKey: "PCIe4"
  },
  {
    id: "gpu-002", name: "NVIDIA RTX 4070 Super 12GB", category: "gpu", brand: "NVIDIA",
    price: 15990000, image: "/images/products/rtx4070super.jpg",
    shortDesc: "12GB GDDR6X, hiệu năng 1440p mạnh mẽ, ray tracing & DLSS 3 Frame Gen.",
    specs: { VRAM: "12GB GDDR6X", "Bus width": "192-bit", "Boost Clock": "2475 MHz", TDP: "220W", "Cổng xuất": "3x DP 1.4, 1x HDMI 2.1" },
    stock: 20, rating: 4.8, tags: ["gaming", "1440p", "4k", "ray tracing", "high-end"], compatKey: "PCIe4"
  },
  {
    id: "gpu-003", name: "AMD RX 7600 8GB", category: "gpu", brand: "AMD",
    price: 6990000, image: "/images/products/rx7600.jpg",
    shortDesc: "8GB GDDR6, hiệu năng gaming 1080p giá rẻ, hỗ trợ FSR 3.",
    specs: { VRAM: "8GB GDDR6", "Bus width": "128-bit", "Boost Clock": "2655 MHz", TDP: "165W", "Cổng xuất": "3x DP 2.1, 1x HDMI 2.1" },
    stock: 45, rating: 4.4, tags: ["budget", "gaming", "1080p", "amd"], compatKey: "PCIe4"
  },
  {
    id: "gpu-004", name: "NVIDIA RTX 4090 24GB", category: "gpu", brand: "NVIDIA",
    price: 45990000, image: "/images/products/rtx4090.jpg",
    shortDesc: "24GB GDDR6X, card đồ họa mạnh nhất, 4K gaming & AI workload.",
    specs: { VRAM: "24GB GDDR6X", "Bus width": "384-bit", "Boost Clock": "2520 MHz", TDP: "450W", "Cổng xuất": "3x DP 1.4, 1x HDMI 2.1" },
    stock: 10, rating: 5.0, tags: ["flagship", "4k", "gaming", "ai", "workstation"], compatKey: "PCIe4"
  },
  {
    id: "gpu-005", name: "NVIDIA RTX 4060 8GB", category: "gpu", brand: "NVIDIA",
    price: 7490000, image: "/images/products/rtx4060.jpg",
    shortDesc: "8GB GDDR6, DLSS 3, ray tracing. Card gaming 1080p tiết kiệm điện nhất thế hệ.",
    specs: { VRAM: "8GB GDDR6", "Bus width": "128-bit", "Boost Clock": "2460 MHz", TDP: "115W", "Cổng xuất": "3x DP 1.4, 1x HDMI 2.1" },
    stock: 50, rating: 4.5, tags: ["gaming", "1080p", "budget", "dlss", "tiết kiệm điện"], compatKey: "PCIe4"
  },
  {
    id: "gpu-006", name: "NVIDIA RTX 4080 Super 16GB", category: "gpu", brand: "NVIDIA",
    price: 27990000, image: "/images/products/rtx4080super.jpg",
    shortDesc: "16GB GDDR6X, hiệu năng 4K đỉnh cao, chỉ sau RTX 4090. DLSS 3 Frame Gen.",
    specs: { VRAM: "16GB GDDR6X", "Bus width": "256-bit", "Boost Clock": "2550 MHz", TDP: "320W", "Cổng xuất": "3x DP 1.4, 1x HDMI 2.1" },
    stock: 12, rating: 4.9, tags: ["high-end", "4k", "gaming", "ray tracing", "premium"], compatKey: "PCIe4"
  },
  {
    id: "gpu-007", name: "AMD RX 7800 XT 16GB", category: "gpu", brand: "AMD",
    price: 12490000, image: "/images/products/rx7800xt.jpg",
    shortDesc: "16GB GDDR6, đối thủ RTX 4070 với VRAM gấp đôi. Gaming 1440p cực đỉnh.",
    specs: { VRAM: "16GB GDDR6", "Bus width": "256-bit", "Boost Clock": "2430 MHz", TDP: "263W", "Cổng xuất": "2x DP 2.1, 1x HDMI 2.1" },
    stock: 28, rating: 4.7, tags: ["gaming", "1440p", "amd", "16gb vram", "giá tốt"], compatKey: "PCIe4"
  },
  {
    id: "gpu-008", name: "AMD RX 7900 XTX 24GB", category: "gpu", brand: "AMD",
    price: 24990000, image: "/images/products/rx7900xtx.jpg",
    shortDesc: "24GB GDDR6, flagship AMD, gaming 4K & content creation. Đối thủ RTX 4080.",
    specs: { VRAM: "24GB GDDR6", "Bus width": "384-bit", "Boost Clock": "2500 MHz", TDP: "355W", "Cổng xuất": "2x DP 2.1, 1x HDMI 2.1, 1x USB-C" },
    stock: 8, rating: 4.7, tags: ["flagship", "4k", "amd", "workstation", "content creation"], compatKey: "PCIe4"
  },
  {
    id: "gpu-009", name: "NVIDIA RTX 4070 Ti Super 16GB", category: "gpu", brand: "NVIDIA",
    price: 21990000, image: "/images/products/rtx4070tisuper.jpg",
    shortDesc: "16GB GDDR6X, tầm giá cao cấp, 1440p-4K gaming. Nâng cấp từ 4070 Ti.",
    specs: { VRAM: "16GB GDDR6X", "Bus width": "256-bit", "Boost Clock": "2610 MHz", TDP: "285W", "Cổng xuất": "3x DP 1.4, 1x HDMI 2.1" },
    stock: 15, rating: 4.8, tags: ["high-end", "1440p", "4k", "gaming", "ray tracing"], compatKey: "PCIe4"
  },
  {
    id: "gpu-010", name: "Intel Arc A770 16GB", category: "gpu", brand: "Intel",
    price: 6490000, image: "/images/products/arc-a770.jpg",
    shortDesc: "16GB GDDR6, card đồ họa Intel, giá rẻ nhất có ray tracing + 16GB VRAM.",
    specs: { VRAM: "16GB GDDR6", "Bus width": "256-bit", "Boost Clock": "2100 MHz", TDP: "225W", "Cổng xuất": "3x DP 2.0, 1x HDMI 2.1" },
    stock: 30, rating: 4.1, tags: ["budget", "gaming", "1080p", "intel", "16gb vram"], compatKey: "PCIe4"
  },
  {
    id: "gpu-011", name: "AMD RX 7700 XT 12GB", category: "gpu", brand: "AMD",
    price: 10490000, image: "/images/products/rx7700xt.jpg",
    shortDesc: "12GB GDDR6, gaming 1440p giá tốt hơn RTX 4060 Ti. FSR 3 hỗ trợ.",
    specs: { VRAM: "12GB GDDR6", "Bus width": "192-bit", "Boost Clock": "2544 MHz", TDP: "245W", "Cổng xuất": "2x DP 2.1, 1x HDMI 2.1" },
    stock: 25, rating: 4.5, tags: ["gaming", "1440p", "amd", "mid-range"], compatKey: "PCIe4"
  },

  /* ══════════════ MAINBOARD ══════════════ */
  {
    id: "mb-001", name: "MSI PRO B760M-A WiFi", category: "mainboard", brand: "MSI",
    price: 3490000, image: "/images/products/b760m-a.jpg",
    shortDesc: "Mainboard mATX, socket LGA 1700, DDR5, WiFi 6E, 2x M.2 SSD.",
    specs: { Socket: "LGA 1700", Chipset: "Intel B760", RAM: "DDR5 up to 128GB", "Form Factor": "Micro-ATX", "M.2 Slots": "2" },
    stock: 40, rating: 4.5, tags: ["intel", "ddr5", "wifi", "mid-range"], compatKey: "LGA1700"
  },
  {
    id: "mb-002", name: "ASUS TUF Gaming B650-Plus WiFi", category: "mainboard", brand: "ASUS",
    price: 4790000, image: "/images/products/b650-plus.jpg",
    shortDesc: "Mainboard ATX, socket AM5, DDR5, WiFi 6, PCIe 5.0 M.2.",
    specs: { Socket: "AM5", Chipset: "AMD B650", RAM: "DDR5 up to 128GB", "Form Factor": "ATX", "M.2 Slots": "3" },
    stock: 30, rating: 4.6, tags: ["amd", "ddr5", "wifi", "gaming"], compatKey: "AM5"
  },
  {
    id: "mb-003", name: "Gigabyte B760M DS3H AX", category: "mainboard", brand: "Gigabyte",
    price: 2890000, image: "/images/products/b760m-ds3h.jpg",
    shortDesc: "Mainboard mATX giá rẻ, LGA 1700, DDR5, WiFi 6E. Lựa chọn tiết kiệm.",
    specs: { Socket: "LGA 1700", Chipset: "Intel B760", RAM: "DDR5 up to 96GB", "Form Factor": "Micro-ATX", "M.2 Slots": "2" },
    stock: 50, rating: 4.3, tags: ["budget", "intel", "ddr5", "wifi"], compatKey: "LGA1700"
  },
  {
    id: "mb-004", name: "MSI MAG B650 Tomahawk WiFi", category: "mainboard", brand: "MSI",
    price: 5490000, image: "/images/products/b650-tomahawk.jpg",
    shortDesc: "Mainboard ATX, AM5, DDR5, WiFi 6E, USB4, VRM mạnh cho ép xung.",
    specs: { Socket: "AM5", Chipset: "AMD B650", RAM: "DDR5 up to 128GB", "Form Factor": "ATX", "M.2 Slots": "3", USB: "USB4 Type-C" },
    stock: 22, rating: 4.7, tags: ["amd", "ddr5", "wifi", "high-end", "usb4"], compatKey: "AM5"
  },
  {
    id: "mb-005", name: "ASUS ROG STRIX Z790-A Gaming WiFi", category: "mainboard", brand: "ASUS",
    price: 8990000, image: "/images/products/z790-a.jpg",
    shortDesc: "Mainboard ATX cao cấp, LGA 1700, DDR5, PCIe 5.0, WiFi 6E. Cho ép xung.",
    specs: { Socket: "LGA 1700", Chipset: "Intel Z790", RAM: "DDR5 up to 128GB (7800MHz+)", "Form Factor": "ATX", "M.2 Slots": "4", "PCIe 5.0": "1x16 GPU + 1x M.2" },
    stock: 15, rating: 4.8, tags: ["intel", "ddr5", "high-end", "overclock", "z790"], compatKey: "LGA1700"
  },
  {
    id: "mb-006", name: "ASUS ROG STRIX X670E-E Gaming WiFi", category: "mainboard", brand: "ASUS",
    price: 11490000, image: "/images/products/x670e-e.jpg",
    shortDesc: "Mainboard ATX flagship AM5, DDR5, PCIe 5.0 cả GPU lẫn M.2. Dành cho Ryzen 9.",
    specs: { Socket: "AM5", Chipset: "AMD X670E", RAM: "DDR5 up to 128GB (6400MHz+)", "Form Factor": "ATX", "M.2 Slots": "4", "PCIe 5.0": "1x16 GPU + 2x M.2" },
    stock: 10, rating: 4.9, tags: ["amd", "ddr5", "flagship", "overclock", "x670e"], compatKey: "AM5"
  },
  {
    id: "mb-007", name: "Gigabyte B550 AORUS Elite V2", category: "mainboard", brand: "Gigabyte",
    price: 2690000, image: "/images/products/b550-aorus.jpg",
    shortDesc: "Mainboard ATX, socket AM4, DDR4. Giá rẻ cho nâng cấp Ryzen 5000.",
    specs: { Socket: "AM4", Chipset: "AMD B550", RAM: "DDR4 up to 128GB", "Form Factor": "ATX", "M.2 Slots": "2" },
    stock: 35, rating: 4.4, tags: ["amd", "ddr4", "am4", "budget"], compatKey: "AM4"
  },
  {
    id: "mb-008", name: "MSI PRO B660M-A WiFi DDR4", category: "mainboard", brand: "MSI",
    price: 2390000, image: "/images/products/b660m-a.jpg",
    shortDesc: "Mainboard mATX, LGA 1700, DDR4, WiFi 6. Tiết kiệm khi dùng lại RAM DDR4.",
    specs: { Socket: "LGA 1700", Chipset: "Intel B660", RAM: "DDR4 up to 64GB", "Form Factor": "Micro-ATX", "M.2 Slots": "2" },
    stock: 30, rating: 4.3, tags: ["intel", "ddr4", "budget", "wifi"], compatKey: "LGA1700"
  },

  /* ══════════════ RAM ══════════════ */
  {
    id: "ram-001", name: "Kingston Fury Beast DDR5 16GB (2x8GB) 5600MHz", category: "ram", brand: "Kingston",
    price: 1490000, image: "/images/products/fury-beast-16.jpg",
    shortDesc: "Kit 2x8GB DDR5-5600, CL36, tản nhiệt nhôm. Phù hợp gaming & văn phòng.",
    specs: { Dung_luong: "16GB (2x8GB)", Loai: "DDR5", "Tốc độ": "5600 MHz", CAS: "CL36", "Điện áp": "1.25V" },
    stock: 80, rating: 4.5, tags: ["ddr5", "gaming", "mid-range"], compatKey: "DDR5"
  },
  {
    id: "ram-002", name: "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz", category: "ram", brand: "Corsair",
    price: 2990000, image: "/images/products/vengeance-32.jpg",
    shortDesc: "Kit 2x16GB DDR5-6000, CL30, EXPO/XMP. Lý tưởng cho Ryzen 7000 & Intel 14th Gen.",
    specs: { Dung_luong: "32GB (2x16GB)", Loai: "DDR5", "Tốc độ": "6000 MHz", CAS: "CL30", "Điện áp": "1.35V" },
    stock: 50, rating: 4.8, tags: ["ddr5", "high-end", "gaming", "content creation"], compatKey: "DDR5"
  },
  {
    id: "ram-003", name: "G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz", category: "ram", brand: "G.Skill",
    price: 3690000, image: "/images/products/tridentz5-rgb.jpg",
    shortDesc: "Kit 2x16GB DDR5-6400, CL32, RGB rực rỡ. RAM cao cấp cho hệ thống mạnh.",
    specs: { Dung_luong: "32GB (2x16GB)", Loai: "DDR5", "Tốc độ": "6400 MHz", CAS: "CL32", "Điện áp": "1.35V", LED: "RGB" },
    stock: 25, rating: 4.9, tags: ["ddr5", "high-end", "rgb", "overclock"], compatKey: "DDR5"
  },
  {
    id: "ram-004", name: "Kingston Fury Beast DDR4 16GB (2x8GB) 3200MHz", category: "ram", brand: "Kingston",
    price: 890000, image: "/images/products/fury-beast-ddr4.jpg",
    shortDesc: "Kit 2x8GB DDR4-3200, CL16. RAM DDR4 phổ thông, giá cực rẻ.",
    specs: { Dung_luong: "16GB (2x8GB)", Loai: "DDR4", "Tốc độ": "3200 MHz", CAS: "CL16", "Điện áp": "1.35V" },
    stock: 100, rating: 4.5, tags: ["ddr4", "budget", "gaming"], compatKey: "DDR4"
  },
  {
    id: "ram-005", name: "Corsair Vengeance LPX DDR4 32GB (2x16GB) 3600MHz", category: "ram", brand: "Corsair",
    price: 1790000, image: "/images/products/vengeance-lpx.jpg",
    shortDesc: "Kit 2x16GB DDR4-3600, CL18. RAM DDR4 dung lượng lớn, tối ưu cho Ryzen.",
    specs: { Dung_luong: "32GB (2x16GB)", Loai: "DDR4", "Tốc độ": "3600 MHz", CAS: "CL18", "Điện áp": "1.35V" },
    stock: 60, rating: 4.6, tags: ["ddr4", "gaming", "content creation", "32gb"], compatKey: "DDR4"
  },
  {
    id: "ram-006", name: "G.Skill Trident Z5 RGB DDR5 64GB (2x32GB) 6000MHz", category: "ram", brand: "G.Skill",
    price: 5990000, image: "/images/products/tridentz5-64.jpg",
    shortDesc: "Kit 2x32GB DDR5-6000, CL30. 64GB cho workstation, rendering, AI/ML.",
    specs: { Dung_luong: "64GB (2x32GB)", Loai: "DDR5", "Tốc độ": "6000 MHz", CAS: "CL30", "Điện áp": "1.35V", LED: "RGB" },
    stock: 15, rating: 4.8, tags: ["ddr5", "workstation", "64gb", "ai", "rendering"], compatKey: "DDR5"
  },
  {
    id: "ram-007", name: "TeamGroup T-Force Delta RGB DDR5 32GB (2x16GB) 5600MHz", category: "ram", brand: "TeamGroup",
    price: 2290000, image: "/images/products/tforce-delta.jpg",
    shortDesc: "Kit 2x16GB DDR5-5600, CL36, RGB đẹp. Giá rẻ hơn Corsair/G.Skill.",
    specs: { Dung_luong: "32GB (2x16GB)", Loai: "DDR5", "Tốc độ": "5600 MHz", CAS: "CL36", "Điện áp": "1.25V", LED: "RGB" },
    stock: 40, rating: 4.4, tags: ["ddr5", "mid-range", "rgb", "giá tốt"], compatKey: "DDR5"
  },

  /* ══════════════ SSD ══════════════ */
  {
    id: "ssd-001", name: "Samsung 990 EVO 1TB NVMe M.2", category: "ssd", brand: "Samsung",
    price: 2490000, image: "/images/products/990evo.jpg",
    shortDesc: "SSD NVMe PCIe 5.0 x2, đọc 5000MB/s, ghi 4200MB/s. Nhanh và bền bỉ.",
    specs: { "Dung lượng": "1TB", "Giao tiếp": "NVMe PCIe 5.0 x2", "Đọc tuần tự": "5000 MB/s", "Ghi tuần tự": "4200 MB/s", "Bảo hành": "5 năm" },
    stock: 60, rating: 4.7, tags: ["nvme", "pcie5", "fast"], compatKey: "M2-NVMe"
  },
  {
    id: "ssd-002", name: "WD Black SN770 1TB NVMe", category: "ssd", brand: "Western Digital",
    price: 1890000, image: "/images/products/sn770.jpg",
    shortDesc: "SSD NVMe PCIe 4.0, đọc 5150MB/s. Giá tốt, hiệu năng cao.",
    specs: { "Dung lượng": "1TB", "Giao tiếp": "NVMe PCIe 4.0 x4", "Đọc tuần tự": "5150 MB/s", "Ghi tuần tự": "4900 MB/s", "Bảo hành": "5 năm" },
    stock: 70, rating: 4.6, tags: ["nvme", "pcie4", "giá tốt"], compatKey: "M2-NVMe"
  },
  {
    id: "ssd-003", name: "Samsung 990 Pro 2TB NVMe", category: "ssd", brand: "Samsung",
    price: 5490000, image: "/images/products/990pro-2tb.jpg",
    shortDesc: "SSD NVMe PCIe 4.0, đọc 7450MB/s. Hiệu năng cao nhất phân khúc PCIe 4.",
    specs: { "Dung lượng": "2TB", "Giao tiếp": "NVMe PCIe 4.0 x4", "Đọc tuần tự": "7450 MB/s", "Ghi tuần tự": "6900 MB/s", "Bảo hành": "5 năm", TBW: "1200TB" },
    stock: 25, rating: 4.9, tags: ["nvme", "pcie4", "high-end", "2tb"], compatKey: "M2-NVMe"
  },
  {
    id: "ssd-004", name: "Kingston NV2 500GB NVMe", category: "ssd", brand: "Kingston",
    price: 690000, image: "/images/products/nv2-500.jpg",
    shortDesc: "SSD NVMe PCIe 4.0, 500GB. Lựa chọn rẻ nhất cho SSD NVMe.",
    specs: { "Dung lượng": "500GB", "Giao tiếp": "NVMe PCIe 4.0 x4", "Đọc tuần tự": "3500 MB/s", "Ghi tuần tự": "2100 MB/s", "Bảo hành": "3 năm" },
    stock: 90, rating: 4.3, tags: ["nvme", "budget", "500gb"], compatKey: "M2-NVMe"
  },
  {
    id: "ssd-005", name: "Crucial T500 1TB NVMe PCIe 5.0", category: "ssd", brand: "Crucial",
    price: 3290000, image: "/images/products/t500.jpg",
    shortDesc: "SSD PCIe 5.0, đọc 7300MB/s. Gen 5 tốc độ kinh hoàng, kèm heatsink.",
    specs: { "Dung lượng": "1TB", "Giao tiếp": "NVMe PCIe 5.0 x4", "Đọc tuần tự": "7300 MB/s", "Ghi tuần tự": "6800 MB/s", "Bảo hành": "5 năm" },
    stock: 20, rating: 4.7, tags: ["nvme", "pcie5", "high-end", "heatsink"], compatKey: "M2-NVMe"
  },
  {
    id: "ssd-006", name: "Samsung 870 EVO 1TB SATA", category: "ssd", brand: "Samsung",
    price: 1690000, image: "/images/products/870evo.jpg",
    shortDesc: "SSD SATA 2.5\", đọc 560MB/s. Ổ cứng nâng cấp cho laptop cũ & PC có sẵn.",
    specs: { "Dung lượng": "1TB", "Giao tiếp": "SATA III 6Gb/s", "Đọc tuần tự": "560 MB/s", "Ghi tuần tự": "530 MB/s", "Bảo hành": "5 năm", TBW: "600TB" },
    stock: 45, rating: 4.7, tags: ["sata", "2.5 inch", "nâng cấp laptop"], compatKey: "SATA"
  },

  /* ══════════════ HDD ══════════════ */
  {
    id: "hdd-001", name: "Seagate Barracuda 2TB 7200RPM", category: "hdd", brand: "Seagate",
    price: 1290000, image: "/images/products/barracuda-2tb.jpg",
    shortDesc: "HDD 3.5\" 2TB, 7200RPM, 256MB cache. Lưu trữ dữ liệu lớn giá rẻ.",
    specs: { "Dung lượng": "2TB", "Tốc độ quay": "7200 RPM", Cache: "256MB", "Giao tiếp": "SATA III", "Form Factor": "3.5 inch" },
    stock: 50, rating: 4.3, tags: ["hdd", "lưu trữ", "2tb", "giá rẻ"], compatKey: "SATA"
  },
  {
    id: "hdd-002", name: "WD Blue 4TB 5400RPM", category: "hdd", brand: "Western Digital",
    price: 2290000, image: "/images/products/wd-blue-4tb.jpg",
    shortDesc: "HDD 3.5\" 4TB, 5400RPM, yên tĩnh. Dung lượng khổng lồ cho backup & media.",
    specs: { "Dung lượng": "4TB", "Tốc độ quay": "5400 RPM", Cache: "256MB", "Giao tiếp": "SATA III", "Form Factor": "3.5 inch" },
    stock: 35, rating: 4.4, tags: ["hdd", "lưu trữ", "4tb", "backup"], compatKey: "SATA"
  },

  /* ══════════════ PSU ══════════════ */
  {
    id: "psu-001", name: "Corsair RM750e 750W 80+ Gold", category: "psu", brand: "Corsair",
    price: 2290000, image: "/images/products/rm750e.jpg",
    shortDesc: "Nguồn 750W Full Modular, 80+ Gold, quạt 0 RPM, bảo hành 7 năm.",
    specs: { "Công suất": "750W", "Chứng nhận": "80+ Gold", Modular: "Full Modular", "Quạt": "135mm Rifle Bearing", "Bảo hành": "7 năm" },
    stock: 40, rating: 4.7, tags: ["750w", "gold", "modular"], compatKey: "ATX"
  },
  {
    id: "psu-002", name: "NZXT C850 850W 80+ Gold", category: "psu", brand: "NZXT",
    price: 2790000, image: "/images/products/nzxt-c850.jpg",
    shortDesc: "Nguồn 850W Full Modular, 80+ Gold, tối ưu cho RTX 4070/4080.",
    specs: { "Công suất": "850W", "Chứng nhận": "80+ Gold", Modular: "Full Modular", "Quạt": "120mm FDB", "Bảo hành": "10 năm" },
    stock: 30, rating: 4.8, tags: ["850w", "gold", "high-end"], compatKey: "ATX"
  },
  {
    id: "psu-003", name: "Corsair RM1000x 1000W 80+ Gold", category: "psu", brand: "Corsair",
    price: 4290000, image: "/images/products/rm1000x.jpg",
    shortDesc: "Nguồn 1000W Full Modular, 80+ Gold. Đủ sức cho RTX 4090 + i9.",
    specs: { "Công suất": "1000W", "Chứng nhận": "80+ Gold", Modular: "Full Modular", "Quạt": "135mm FDB", "Bảo hành": "10 năm" },
    stock: 20, rating: 4.9, tags: ["1000w", "gold", "flagship", "rtx4090"], compatKey: "ATX"
  },
  {
    id: "psu-004", name: "Corsair CV550 550W 80+ Bronze", category: "psu", brand: "Corsair",
    price: 990000, image: "/images/products/cv550.jpg",
    shortDesc: "Nguồn 550W Non-Modular, 80+ Bronze. Giá rẻ cho build văn phòng & gaming nhẹ.",
    specs: { "Công suất": "550W", "Chứng nhận": "80+ Bronze", Modular: "Non-Modular", "Quạt": "120mm", "Bảo hành": "3 năm" },
    stock: 55, rating: 4.2, tags: ["550w", "bronze", "budget", "văn phòng"], compatKey: "ATX"
  },
  {
    id: "psu-005", name: "Seasonic Focus GX-650 650W 80+ Gold", category: "psu", brand: "Seasonic",
    price: 1990000, image: "/images/products/focus-gx650.jpg",
    shortDesc: "Nguồn 650W Full Modular, 80+ Gold, Seasonic chất lượng Nhật. Bảo hành 10 năm.",
    specs: { "Công suất": "650W", "Chứng nhận": "80+ Gold", Modular: "Full Modular", "Quạt": "120mm FDB", "Bảo hành": "10 năm" },
    stock: 30, rating: 4.7, tags: ["650w", "gold", "seasonic", "chất lượng"], compatKey: "ATX"
  },
  {
    id: "psu-006", name: "be quiet! Dark Power 13 1000W 80+ Titanium", category: "psu", brand: "be quiet!",
    price: 7290000, image: "/images/products/darkpower13.jpg",
    shortDesc: "Nguồn 1000W Titanium, cực yên tĩnh, ATX 3.0. Flagship cho workstation im lặng.",
    specs: { "Công suất": "1000W", "Chứng nhận": "80+ Titanium", Modular: "Full Modular", "Quạt": "135mm Silent Wings", "Chuẩn": "ATX 3.0 + PCIe 5.0 16-pin" },
    stock: 8, rating: 5.0, tags: ["1000w", "titanium", "flagship", "silent", "atx3.0"], compatKey: "ATX"
  },

  /* ══════════════ CASE ══════════════ */
  {
    id: "case-001", name: "NZXT H5 Flow", category: "case", brand: "NZXT",
    price: 2190000, image: "/images/products/h5-flow.jpg",
    shortDesc: "Case Mid-Tower ATX, mặt lưới, 2 quạt 120mm, kính cường lực.",
    specs: { "Form Factor": "Mid-Tower ATX", "Quạt đi kèm": "2x 120mm", "Max GPU length": "365mm", "Max CPU Cooler": "165mm", Material: "Steel + Tempered Glass" },
    stock: 35, rating: 4.6, tags: ["airflow", "mid-tower", "gaming"], compatKey: "ATX"
  },
  {
    id: "case-002", name: "Lian Li Lancool II Mesh", category: "case", brand: "Lian Li",
    price: 2490000, image: "/images/products/lancool2.jpg",
    shortDesc: "Case Mid-Tower ATX, tản nhiệt tối ưu, 3 quạt ARGB, dễ lắp đặt.",
    specs: { "Form Factor": "Mid-Tower ATX", "Quạt đi kèm": "3x 120mm ARGB", "Max GPU length": "384mm", "Max CPU Cooler": "176mm", Material: "Steel + Tempered Glass" },
    stock: 25, rating: 4.8, tags: ["airflow", "rgb", "mid-tower", "gaming"], compatKey: "ATX"
  },
  {
    id: "case-003", name: "Corsair 4000D Airflow", category: "case", brand: "Corsair",
    price: 2390000, image: "/images/products/4000d.jpg",
    shortDesc: "Case Mid-Tower ATX, airflow xuất sắc, 2 quạt 120mm, cable management tốt.",
    specs: { "Form Factor": "Mid-Tower ATX", "Quạt đi kèm": "2x 120mm", "Max GPU length": "360mm", "Max CPU Cooler": "170mm", Material: "Steel + Tempered Glass" },
    stock: 30, rating: 4.7, tags: ["airflow", "mid-tower", "cable management"], compatKey: "ATX"
  },
  {
    id: "case-004", name: "Fractal Design North", category: "case", brand: "Fractal Design",
    price: 3290000, image: "/images/products/fractal-north.jpg",
    shortDesc: "Case Mid-Tower ATX, thiết kế gỗ Bắc Âu độc đáo, airflow tốt.",
    specs: { "Form Factor": "Mid-Tower ATX", "Quạt đi kèm": "2x 140mm", "Max GPU length": "355mm", "Max CPU Cooler": "170mm", Material: "Steel + Wood Panel + Mesh" },
    stock: 18, rating: 4.8, tags: ["design", "airflow", "premium", "Bắc Âu"], compatKey: "ATX"
  },
  {
    id: "case-005", name: "Cooler Master NR200P", category: "case", brand: "Cooler Master",
    price: 1890000, image: "/images/products/nr200p.jpg",
    shortDesc: "Case Mini-ITX, SFF nhỏ gọn, hỗ trợ GPU 3-slot, tản AIO 240mm.",
    specs: { "Form Factor": "Mini-ITX", "Quạt đi kèm": "2x 120mm", "Max GPU length": "330mm", "Max CPU Cooler": "155mm", Material: "Steel + Tempered Glass/Mesh" },
    stock: 22, rating: 4.7, tags: ["mini-itx", "sff", "nhỏ gọn"], compatKey: "ITX"
  },

  /* ══════════════ COOLER ══════════════ */
  {
    id: "cooler-001", name: "Thermalright Peerless Assassin 120 SE", category: "cooler", brand: "Thermalright",
    price: 790000, image: "/images/products/pa120se.jpg",
    shortDesc: "Tản nhiệt khí dual-tower, 6 ống đồng, hỗ trợ LGA1700 & AM5. Giá cực rẻ.",
    specs: { Loai: "Tower Air Cooler", "Ống đồng": "6 heat pipes", "Quạt": "2x 120mm", Socket: "LGA1700 / AM5 / AM4", TDP: "220W" },
    stock: 55, rating: 4.7, tags: ["air-cooler", "budget", "lga1700", "am5"], compatKey: "Universal"
  },
  {
    id: "cooler-002", name: "NZXT Kraken 240 AIO", category: "cooler", brand: "NZXT",
    price: 3290000, image: "/images/products/kraken240.jpg",
    shortDesc: "Tản nước AIO 240mm, bơm Asetek 7th Gen, LCD màn hình trên pump.",
    specs: { Loai: "AIO Liquid Cooler", "Kích thước rad": "240mm", "Quạt": "2x 120mm", Socket: "LGA1700 / AM5 / AM4", TDP: "250W+" },
    stock: 20, rating: 4.8, tags: ["aio", "liquid", "premium", "lcd"], compatKey: "Universal"
  },
  {
    id: "cooler-003", name: "Noctua NH-D15", category: "cooler", brand: "Noctua",
    price: 2490000, image: "/images/products/nh-d15.jpg",
    shortDesc: "Tản nhiệt khí huyền thoại, hiệu năng ngang AIO 240mm, cực yên tĩnh.",
    specs: { Loai: "Tower Air Cooler (Dual)", "Ống đồng": "6 heat pipes", "Quạt": "2x NF-A15 140mm", Socket: "LGA1700 / AM5 / AM4", TDP: "250W" },
    stock: 15, rating: 4.9, tags: ["air-cooler", "premium", "silent", "huyền thoại"], compatKey: "Universal"
  },
  {
    id: "cooler-004", name: "Arctic Liquid Freezer II 360 AIO", category: "cooler", brand: "Arctic",
    price: 2990000, image: "/images/products/lf2-360.jpg",
    shortDesc: "AIO 360mm, hiệu năng đỉnh cao, quạt P12 PWM, tích hợp quạt VRM nhỏ.",
    specs: { Loai: "AIO Liquid Cooler", "Kích thước rad": "360mm", "Quạt": "3x 120mm P12 PWM", Socket: "LGA1700 / AM5 / AM4", TDP: "350W+" },
    stock: 18, rating: 4.8, tags: ["aio", "360mm", "high-end", "giá tốt"], compatKey: "Universal"
  },
  {
    id: "cooler-005", name: "ID-Cooling SE-214-XT", category: "cooler", brand: "ID-Cooling",
    price: 290000, image: "/images/products/se214xt.jpg",
    shortDesc: "Tản nhiệt khí single-tower, 4 ống đồng, giá cực rẻ. Đủ mát cho i5/R5.",
    specs: { Loai: "Tower Air Cooler", "Ống đồng": "4 heat pipes", "Quạt": "1x 120mm", Socket: "LGA1700 / AM5 / AM4", TDP: "180W" },
    stock: 80, rating: 4.3, tags: ["air-cooler", "budget", "giá rẻ nhất"], compatKey: "Universal"
  },
  {
    id: "cooler-006", name: "Corsair iCUE H150i Elite LCD XT", category: "cooler", brand: "Corsair",
    price: 5990000, image: "/images/products/h150i-elite.jpg",
    shortDesc: "AIO 360mm flagship, màn LCD IPS 2.1\" trên pump, quạt AF Elite RGB.",
    specs: { Loai: "AIO Liquid Cooler", "Kích thước rad": "360mm", "Quạt": "3x 120mm AF Elite RGB", Socket: "LGA1700 / AM5", "Màn hình": "IPS LCD 2.1 inch" },
    stock: 10, rating: 4.9, tags: ["aio", "360mm", "lcd", "flagship", "rgb"], compatKey: "Universal"
  },

  /* ══════════════ MONITOR ══════════════ */
  {
    id: "mon-001", name: "LG 27GP850-B 27\" 1440p 165Hz", category: "monitor", brand: "LG",
    price: 7990000, image: "/images/products/27gp850.jpg",
    shortDesc: "Màn 27\" QHD Nano IPS, 165Hz, 1ms, HDR400. Tuyệt vời cho gaming.",
    specs: { "Kích thước": "27 inch", "Độ phân giải": "2560 x 1440 (QHD)", "Tấm nền": "Nano IPS", "Tần số quét": "165Hz", "Thời gian phản hồi": "1ms GtG" },
    stock: 25, rating: 4.7, tags: ["gaming", "1440p", "ips", "165hz"], compatKey: "HDMI-DP"
  },
  {
    id: "mon-002", name: "ASUS VG249Q1A 24\" 1080p 165Hz", category: "monitor", brand: "ASUS",
    price: 3990000, image: "/images/products/vg249q1a.jpg",
    shortDesc: "Màn 24\" FHD IPS, 165Hz, 1ms, FreeSync. Giá rẻ cho eSports.",
    specs: { "Kích thước": "24 inch", "Độ phân giải": "1920 x 1080 (FHD)", "Tấm nền": "IPS", "Tần số quét": "165Hz", "Thời gian phản hồi": "1ms MPRT" },
    stock: 40, rating: 4.5, tags: ["gaming", "1080p", "ips", "budget", "esports"], compatKey: "HDMI-DP"
  },
  {
    id: "mon-003", name: "Dell S2722QC 27\" 4K USB-C", category: "monitor", brand: "Dell",
    price: 8490000, image: "/images/products/s2722qc.jpg",
    shortDesc: "Màn 27\" 4K IPS, 60Hz, USB-C 65W. Lý tưởng cho làm việc, thiết kế & MacBook.",
    specs: { "Kích thước": "27 inch", "Độ phân giải": "3840 x 2160 (4K UHD)", "Tấm nền": "IPS", "Tần số quét": "60Hz", "Kết nối": "HDMI 2.0, USB-C 65W PD, DP 1.2" },
    stock: 20, rating: 4.6, tags: ["4k", "usb-c", "văn phòng", "thiết kế", "dell"], compatKey: "HDMI-DP"
  },
  {
    id: "mon-004", name: "Samsung Odyssey G7 32\" 1440p 240Hz", category: "monitor", brand: "Samsung",
    price: 12990000, image: "/images/products/odyssey-g7.jpg",
    shortDesc: "Màn cong 32\" QHD VA, 240Hz, 1ms, HDR600. Trải nghiệm gaming đỉnh cao.",
    specs: { "Kích thước": "32 inch", "Độ phân giải": "2560 x 1440 (QHD)", "Tấm nền": "VA Cong 1000R", "Tần số quét": "240Hz", "HDR": "HDR600" },
    stock: 15, rating: 4.8, tags: ["gaming", "1440p", "240hz", "cong", "high-end"], compatKey: "HDMI-DP"
  },
  {
    id: "mon-005", name: "LG 27UL500-W 27\" 4K IPS", category: "monitor", brand: "LG",
    price: 5990000, image: "/images/products/27ul500.jpg",
    shortDesc: "Màn 27\" 4K IPS, HDR10, 98% sRGB. Giá rẻ nhất cho 4K thực thụ.",
    specs: { "Kích thước": "27 inch", "Độ phân giải": "3840 x 2160 (4K UHD)", "Tấm nền": "IPS", "Tần số quét": "60Hz", "Thời gian phản hồi": "5ms" },
    stock: 30, rating: 4.4, tags: ["4k", "ips", "budget", "văn phòng"], compatKey: "HDMI-DP"
  },
  {
    id: "mon-006", name: "Gigabyte M34WQC 34\" Ultrawide 1440p 144Hz", category: "monitor", brand: "Gigabyte",
    price: 9990000, image: "/images/products/m34wqc.jpg",
    shortDesc: "Màn ultrawide 34\" UWQHD VA, 144Hz, USB-C. Đa nhiệm & gaming cực sướng.",
    specs: { "Kích thước": "34 inch", "Độ phân giải": "3440 x 1440 (UWQHD)", "Tấm nền": "VA", "Tần số quét": "144Hz", "Kết nối": "HDMI, DP, USB-C 65W PD" },
    stock: 12, rating: 4.6, tags: ["ultrawide", "1440p", "144hz", "đa nhiệm", "usb-c"], compatKey: "HDMI-DP"
  },

  /* ══════════════ LAPTOP ══════════════ */
  {
    id: "laptop-001", name: "ASUS TUF Gaming A15 (2024)", category: "laptop", brand: "ASUS",
    price: 22990000, image: "/images/products/tuf-a15.jpg",
    shortDesc: "Ryzen 7 7735HS, RTX 4060 8GB, 16GB DDR5, 512GB SSD, 15.6\" FHD 144Hz.",
    specs: { CPU: "AMD Ryzen 7 7735HS", GPU: "NVIDIA RTX 4060 8GB", RAM: "16GB DDR5", "Ổ cứng": "512GB NVMe SSD", "Màn hình": "15.6\" FHD 144Hz IPS", Pin: "90Wh", "Trọng lượng": "2.2 kg" },
    stock: 20, rating: 4.5, tags: ["gaming laptop", "rtx4060", "ryzen"]
  },
  {
    id: "laptop-002", name: "Lenovo Legion 5 Pro 16\" (2024)", category: "laptop", brand: "Lenovo",
    price: 32990000, image: "/images/products/legion5pro.jpg",
    shortDesc: "Ryzen 7 7745HX, RTX 4070 8GB, 32GB DDR5, 1TB SSD, 16\" WQXGA 165Hz.",
    specs: { CPU: "AMD Ryzen 7 7745HX", GPU: "NVIDIA RTX 4070 8GB", RAM: "32GB DDR5", "Ổ cứng": "1TB NVMe SSD", "Màn hình": "16\" WQXGA 165Hz IPS", Pin: "80Wh", "Trọng lượng": "2.5 kg" },
    stock: 15, rating: 4.8, tags: ["gaming laptop", "high-end", "rtx4070", "content creation"]
  },
  {
    id: "laptop-003", name: "Acer Aspire 5 A515 (2024)", category: "laptop", brand: "Acer",
    price: 12990000, image: "/images/products/aspire5.jpg",
    shortDesc: "Intel Core i5-1335U, Intel Iris Xe, 8GB DDR4, 512GB SSD, 15.6\" FHD IPS.",
    specs: { CPU: "Intel Core i5-1335U", GPU: "Intel Iris Xe Graphics", RAM: "8GB DDR4", "Ổ cứng": "512GB NVMe SSD", "Màn hình": "15.6\" FHD IPS", Pin: "50Wh", "Trọng lượng": "1.7 kg" },
    stock: 30, rating: 4.3, tags: ["văn phòng", "học tập", "budget laptop", "mỏng nhẹ"]
  },
  {
    id: "laptop-004", name: "MSI GF63 Thin (2024)", category: "laptop", brand: "MSI",
    price: 16990000, image: "/images/products/gf63thin.jpg",
    shortDesc: "Intel i5-12450H, RTX 4050 6GB, 8GB DDR4, 512GB SSD, 15.6\" FHD 144Hz. Gaming rẻ nhất có RTX 40.",
    specs: { CPU: "Intel Core i5-12450H", GPU: "NVIDIA RTX 4050 6GB", RAM: "8GB DDR4", "Ổ cứng": "512GB NVMe SSD", "Màn hình": "15.6\" FHD 144Hz IPS", Pin: "52.4Wh", "Trọng lượng": "1.86 kg" },
    stock: 25, rating: 4.3, tags: ["gaming laptop", "budget", "rtx4050", "mỏng nhẹ"]
  },
  {
    id: "laptop-005", name: "ASUS ROG Strix G16 (2024)", category: "laptop", brand: "ASUS",
    price: 39990000, image: "/images/products/rog-g16.jpg",
    shortDesc: "Intel i9-14900HX, RTX 4070 8GB, 16GB DDR5, 1TB SSD, 16\" WQXGA 240Hz.",
    specs: { CPU: "Intel Core i9-14900HX", GPU: "NVIDIA RTX 4070 8GB Laptop", RAM: "16GB DDR5-4800", "Ổ cứng": "1TB NVMe PCIe 4.0", "Màn hình": "16\" WQXGA 240Hz IPS", Pin: "90Wh", "Trọng lượng": "2.4 kg" },
    stock: 10, rating: 4.8, tags: ["gaming laptop", "high-end", "rtx4070", "240hz"]
  },
  {
    id: "laptop-006", name: "Lenovo IdeaPad Slim 5 14\" (2024)", category: "laptop", brand: "Lenovo",
    price: 14990000, image: "/images/products/ideapad-slim5.jpg",
    shortDesc: "AMD Ryzen 5 7530U, 16GB LPDDR4X, 512GB SSD, 14\" FHD+ IPS. Mỏng nhẹ, pin trâu.",
    specs: { CPU: "AMD Ryzen 5 7530U", GPU: "AMD Radeon Graphics", RAM: "16GB LPDDR4X", "Ổ cứng": "512GB NVMe SSD", "Màn hình": "14\" FHD+ IPS 300nit", Pin: "56.6Wh (10+ giờ)", "Trọng lượng": "1.46 kg" },
    stock: 35, rating: 4.5, tags: ["văn phòng", "mỏng nhẹ", "pin trâu", "học tập"]
  },
  {
    id: "laptop-007", name: "MacBook Air M2 15\" (2023)", category: "laptop", brand: "Apple",
    price: 29990000, image: "/images/products/macbook-air-m2.jpg",
    shortDesc: "Apple M2 chip, 8GB unified memory, 256GB SSD, 15.3\" Liquid Retina. Siêu mỏng nhẹ.",
    specs: { CPU: "Apple M2 (8-core)", GPU: "M2 10-core GPU", RAM: "8GB Unified", "Ổ cứng": "256GB SSD", "Màn hình": "15.3\" Liquid Retina 2880x1864", Pin: "18 giờ", "Trọng lượng": "1.51 kg" },
    stock: 20, rating: 4.7, tags: ["macbook", "mỏng nhẹ", "apple", "content creation"]
  },

  /* ══════════════ KEYBOARD ══════════════ */
  {
    id: "kb-001", name: "Akko 3068B Plus Black & Gold", category: "keyboard", brand: "Akko",
    price: 1290000, image: "/images/products/akko3068b.jpg",
    shortDesc: "Bàn phím cơ 65%, switch CS Jelly Pink, kết nối 3 chế độ (BT/2.4G/USB-C).",
    specs: { Layout: "65% (68 phím)", Switch: "Akko CS Jelly Pink", "Kết nối": "Bluetooth 5.0 / 2.4GHz / USB-C", "Đèn nền": "RGB", Pin: "3000mAh" },
    stock: 40, rating: 4.6, tags: ["cơ", "wireless", "65%", "rgb"]
  },
  {
    id: "kb-002", name: "Logitech G Pro X TKL", category: "keyboard", brand: "Logitech",
    price: 2990000, image: "/images/products/gprox-tkl.jpg",
    shortDesc: "Bàn phím cơ TKL gaming, GX switch, LIGHTSYNC RGB, USB-C tháo rời.",
    specs: { Layout: "TKL (87 phím)", Switch: "Logitech GX Brown/Blue/Red", "Kết nối": "USB-C tháo rời", "Đèn nền": "LIGHTSYNC RGB", "Tính năng": "Macro, Onboard Memory" },
    stock: 25, rating: 4.7, tags: ["cơ", "tkl", "gaming", "logitech"]
  },
  {
    id: "kb-003", name: "Razer BlackWidow V4 75%", category: "keyboard", brand: "Razer",
    price: 3490000, image: "/images/products/blackwidow-v4.jpg",
    shortDesc: "Bàn phím cơ 75%, Razer Orange switch, hot-swap, knob xoay, RGB Chroma.",
    specs: { Layout: "75%", Switch: "Razer Orange Tactile (hot-swap)", "Kết nối": "USB-C", "Đèn nền": "Razer Chroma RGB", "Tính năng": "Hot-swap, Command Dial, Onboard Memory" },
    stock: 20, rating: 4.7, tags: ["cơ", "75%", "hot-swap", "razer", "premium"]
  },
  {
    id: "kb-004", name: "Akko 3098B Multi-Mode", category: "keyboard", brand: "Akko",
    price: 1590000, image: "/images/products/akko3098b.jpg",
    shortDesc: "Bàn phím cơ Full-size, CS switch, 3 chế độ kết nối. Phù hợp văn phòng & gaming.",
    specs: { Layout: "Full-size (98 phím)", Switch: "Akko CS Silver/Blue", "Kết nối": "BT 5.0 / 2.4GHz / USB-C", "Đèn nền": "RGB", Pin: "3000mAh" },
    stock: 35, rating: 4.5, tags: ["cơ", "wireless", "full-size", "văn phòng"]
  },

  /* ══════════════ MOUSE ══════════════ */
  {
    id: "mouse-001", name: "Logitech G502 X Lightspeed", category: "mouse", brand: "Logitech",
    price: 2890000, image: "/images/products/g502x.jpg",
    shortDesc: "Chuột gaming wireless, HERO 25K, 25.600 DPI, 89g, 5 nút bấm tùy chỉnh.",
    specs: { "Cảm biến": "HERO 25K", DPI: "100 – 25,600", "Kết nối": "Lightspeed 2.4GHz / BT", "Trọng lượng": "89g", Pin: "~130 giờ" },
    stock: 35, rating: 4.8, tags: ["wireless", "gaming", "premium"]
  },
  {
    id: "mouse-002", name: "Razer DeathAdder V3", category: "mouse", brand: "Razer",
    price: 1990000, image: "/images/products/deathadder-v3.jpg",
    shortDesc: "Chuột gaming có dây, Focus Pro 30K, 63g siêu nhẹ, hình dáng ergonomic huyền thoại.",
    specs: { "Cảm biến": "Focus Pro 30K", DPI: "100 – 30,000", "Kết nối": "USB (Speedflex cable)", "Trọng lượng": "63g", "Switch": "Optical Gen-3" },
    stock: 30, rating: 4.7, tags: ["gaming", "ergonomic", "siêu nhẹ", "razer"]
  },
  {
    id: "mouse-003", name: "Logitech G304 Lightspeed", category: "mouse", brand: "Logitech",
    price: 690000, image: "/images/products/g304.jpg",
    shortDesc: "Chuột gaming wireless giá rẻ, HERO 12K, pin AA 250 giờ. Best seller.",
    specs: { "Cảm biến": "HERO 12K", DPI: "200 – 12,000", "Kết nối": "Lightspeed 2.4GHz", "Trọng lượng": "99g (với pin)", Pin: "~250 giờ (1 pin AA)" },
    stock: 60, rating: 4.6, tags: ["wireless", "budget", "gaming", "best seller"]
  },
  {
    id: "mouse-004", name: "Logitech MX Master 3S", category: "mouse", brand: "Logitech",
    price: 2390000, image: "/images/products/mx-master3s.jpg",
    shortDesc: "Chuột văn phòng cao cấp, 8000 DPI, MagSpeed scroll, kết nối 3 thiết bị.",
    specs: { "Cảm biến": "Darkfield 8000 DPI", "Kết nối": "BT / USB receiver (3 thiết bị)", "Trọng lượng": "141g", Pin: "USB-C, 70 ngày", "Tính năng": "MagSpeed, Flow cross-computer" },
    stock: 25, rating: 4.8, tags: ["văn phòng", "wireless", "premium", "ergonomic"]
  },

  /* ══════════════ HEADSET ══════════════ */
  {
    id: "hs-001", name: "HyperX Cloud III Wireless", category: "headset", brand: "HyperX",
    price: 3290000, image: "/images/products/cloud3-wireless.jpg",
    shortDesc: "Tai nghe gaming wireless, driver 53mm, DTS Headphone:X, micro tháo rời, 120h pin.",
    specs: { Driver: "53mm", "Kết nối": "2.4GHz Wireless / 3.5mm", Micro: "Detachable, Noise-cancelling", Pin: "120 giờ", "Trọng lượng": "330g" },
    stock: 20, rating: 4.7, tags: ["gaming", "wireless", "120h pin", "hyperx"]
  },
  {
    id: "hs-002", name: "Razer BlackShark V2 X", category: "headset", brand: "Razer",
    price: 990000, image: "/images/products/blackshark-v2x.jpg",
    shortDesc: "Tai nghe gaming giá rẻ, driver 50mm TriForce, 7.1 Surround, micro Cardioid.",
    specs: { Driver: "50mm TriForce", "Kết nối": "3.5mm", Micro: "Cardioid HyperClear", "Trọng lượng": "240g", "Âm thanh": "7.1 Surround" },
    stock: 45, rating: 4.4, tags: ["gaming", "budget", "7.1 surround", "razer"]
  },
  {
    id: "hs-003", name: "SteelSeries Arctis Nova Pro Wireless", category: "headset", brand: "SteelSeries",
    price: 8490000, image: "/images/products/arctis-nova-pro.jpg",
    shortDesc: "Tai nghe gaming flagship, ANC, 2 pin hot-swap, Bluetooth + 2.4GHz, Hi-Res Audio.",
    specs: { Driver: "40mm custom", "Kết nối": "2.4GHz + Bluetooth (Dual)", ANC: "Active Noise Cancelling 4-mic", Pin: "2x hot-swap (44h total)", "Âm thanh": "360° Spatial Audio, Hi-Res" },
    stock: 8, rating: 4.9, tags: ["gaming", "wireless", "anc", "flagship", "hi-res"]
  },
  {
    id: "hs-004", name: "Logitech G435 Lightspeed", category: "headset", brand: "Logitech",
    price: 1490000, image: "/images/products/g435.jpg",
    shortDesc: "Tai nghe gaming wireless nhẹ nhất, 165g, Lightspeed + BT, 18h pin. Phù hợp cả console.",
    specs: { Driver: "40mm", "Kết nối": "Lightspeed 2.4GHz / Bluetooth", Pin: "18 giờ", "Trọng lượng": "165g", "Tương thích": "PC, PS5, Mobile" },
    stock: 35, rating: 4.4, tags: ["gaming", "wireless", "siêu nhẹ", "budget"]
  }
];

/* ═══════════════════════════════════════════════════
   2. BỘ PC BUILD SẴN
   ═══════════════════════════════════════════════════ */
const createPrebuiltPCs = (): PrebuiltPC[] => [
  ...MEGA_PREBUILT_PCS,
  {
    id: "build-gaming-10m", name: "PC Gaming Entry 10 Triệu", purpose: "Gaming 1080p eSports",
    price: 10000000, image: "/images/builds/gaming-10m.jpg",
    components: { cpu: "Intel Core i3-12100F", gpu: "AMD RX 7600 8GB (secondhand/sale)", mainboard: "Gigabyte B760M DS3H AX", ram: "Kingston Fury Beast DDR5 16GB 5600MHz", storage: "Kingston NV2 500GB", psu: "Corsair CV550 550W", case: "Case giá rẻ mATX", cooler: "ID-Cooling SE-214-XT" },
    description: "PC gaming siêu rẻ, chạy mượt Valorant, LoL, CSGO ở 1080p High. Hoàn hảo cho sinh viên.", rating: 4.2
  },
  {
    id: "build-gaming-15m", name: "PC Gaming Starter 15 Triệu", purpose: "Gaming 1080p",
    price: 15000000, image: "/images/builds/gaming-15m.jpg",
    components: { cpu: "Intel Core i5-14400F", gpu: "AMD RX 7600 8GB", mainboard: "Gigabyte B760M DS3H AX", ram: "Kingston Fury Beast DDR5 16GB 5600MHz", storage: "WD Black SN770 1TB", psu: "Corsair RM750e 750W", case: "NZXT H5 Flow", cooler: "Thermalright PA120 SE" },
    description: "Bộ PC gaming giá tốt, chơi mượt mọi game eSports ở 1080p High-Ultra. Linh kiện tin cậy, dễ nâng cấp sau này.", rating: 4.5
  },
  {
    id: "build-gaming-20m", name: "PC Gaming Sweet Spot 20 Triệu", purpose: "Gaming 1080p Ultra / 1440p Medium",
    price: 20000000, image: "/images/builds/gaming-20m.jpg",
    components: { cpu: "Intel Core i5-14400F", gpu: "NVIDIA RTX 4060 Ti 8GB", mainboard: "MSI PRO B760M-A WiFi", ram: "Kingston Fury Beast DDR5 16GB 5600MHz", storage: "Samsung 990 EVO 1TB", psu: "Corsair RM750e 750W", case: "Corsair 4000D Airflow", cooler: "Thermalright PA120 SE" },
    description: "Điểm cân bằng hoàn hảo giữa giá và hiệu năng. RTX 4060 Ti cho 1080p Ultra mượt mà, bắt đầu chơi được 1440p.", rating: 4.6
  },
  {
    id: "build-gaming-25m", name: "PC Gaming Performance 25 Triệu", purpose: "Gaming 1440p",
    price: 25000000, image: "/images/builds/gaming-25m.jpg",
    components: { cpu: "AMD Ryzen 5 7600X", gpu: "NVIDIA RTX 4060 Ti 8GB", mainboard: "ASUS TUF Gaming B650-Plus WiFi", ram: "Corsair Vengeance DDR5 32GB 6000MHz", storage: "Samsung 990 EVO 1TB", psu: "Corsair RM750e 750W", case: "Lian Li Lancool II Mesh", cooler: "Thermalright PA120 SE" },
    description: "PC gaming mạnh mẽ cho 1440p, chơi AAA mượt ở Ultra. Có WiFi, 32GB RAM cho đa nhiệm và streaming.", rating: 4.7
  },
  {
    id: "build-gaming-30m", name: "PC Gaming 1440p Max 30 Triệu", purpose: "Gaming 1440p Ultra",
    price: 30000000, image: "/images/builds/gaming-30m.jpg",
    components: { cpu: "AMD Ryzen 7 7800X3D", gpu: "NVIDIA RTX 4070 Super 12GB", mainboard: "MSI MAG B650 Tomahawk WiFi", ram: "Corsair Vengeance DDR5 32GB 6000MHz", storage: "Samsung 990 EVO 1TB", psu: "NZXT C850 850W", case: "Lian Li Lancool II Mesh", cooler: "Arctic Liquid Freezer II 360" },
    description: "3D V-Cache + RTX 4070 Super = combo gaming 1440p đỉnh nhất. Mọi game AAA Ultra 100+ FPS.", rating: 4.8
  },
  {
    id: "build-gaming-40m", name: "PC Gaming Ultra 40 Triệu", purpose: "Gaming 4K / Content Creation",
    price: 40000000, image: "/images/builds/gaming-40m.jpg",
    components: { cpu: "AMD Ryzen 7 7800X3D", gpu: "NVIDIA RTX 4070 Ti Super 16GB", mainboard: "ASUS TUF Gaming B650-Plus WiFi", ram: "Corsair Vengeance DDR5 32GB 6000MHz", storage: "Samsung 990 Pro 2TB", psu: "NZXT C850 850W", case: "Fractal Design North", cooler: "NZXT Kraken 240 AIO" },
    description: "PC gaming cao cấp với 3D V-Cache + RTX 4070 Ti Super. Gaming 4K mượt, dựng video 4K, streaming chuyên nghiệp.", rating: 4.9
  },
  {
    id: "build-gaming-60m", name: "PC Gaming Enthusiast 60 Triệu", purpose: "Gaming 4K Ultra / Workstation",
    price: 60000000, image: "/images/builds/gaming-60m.jpg",
    components: { cpu: "Intel Core i9-14900K", gpu: "NVIDIA RTX 4080 Super 16GB", mainboard: "ASUS ROG STRIX Z790-A Gaming WiFi", ram: "G.Skill Trident Z5 RGB DDR5 64GB 6000MHz", storage: "Samsung 990 Pro 2TB + WD Blue 4TB HDD", psu: "Corsair RM1000x 1000W", case: "Fractal Design North", cooler: "Corsair iCUE H150i Elite LCD XT" },
    description: "Quái vật gaming 4K Ultra, render video 8K, AI/ML, streaming 4K. Mọi thứ đều đỉnh.", rating: 4.9
  },
  {
    id: "build-gaming-100m", name: "PC Gaming Flagship 100 Triệu", purpose: "Flagship mọi tác vụ",
    price: 100000000, image: "/images/builds/gaming-100m.jpg",
    components: { cpu: "Intel Core i9-14900K", gpu: "NVIDIA RTX 4090 24GB", mainboard: "ASUS ROG STRIX Z790-A Gaming WiFi", ram: "G.Skill Trident Z5 RGB DDR5 64GB 6400MHz", storage: "Samsung 990 Pro 2TB x2 (RAID 0)", psu: "be quiet! Dark Power 13 1000W Titanium", case: "Lian Li O11 Dynamic EVO", cooler: "Corsair iCUE H150i Elite LCD XT" },
    description: "Flagship tuyệt đối. RTX 4090 + i9-14900K, 64GB DDR5, 4TB SSD. Không có gì không làm được.", rating: 5.0
  },
  {
    id: "build-office-8m", name: "PC Văn Phòng 8 Triệu", purpose: "Văn phòng / Học tập",
    price: 8000000, image: "/images/builds/office-8m.jpg",
    components: { cpu: "Intel Core i3-12100F", gpu: "Onboard (không cần GPU rời)", mainboard: "Gigabyte B760M DS3H AX", ram: "Kingston Fury Beast DDR5 16GB 5600MHz", storage: "Kingston NV2 500GB", psu: "Corsair CV550 550W", case: "Case mATX giá rẻ", cooler: "ID-Cooling SE-214-XT" },
    description: "PC văn phòng tiết kiệm, đủ mạnh cho Office, duyệt web, xem phim. Chạy rất mát và êm.", rating: 4.3
  },
  {
    id: "build-office-12m", name: "PC Văn Phòng Cao Cấp 12 Triệu", purpose: "Văn phòng nặng / Photoshop nhẹ",
    price: 12000000, image: "/images/builds/office-12m.jpg",
    components: { cpu: "Intel Core i5-14400F", gpu: "Onboard", mainboard: "MSI PRO B760M-A WiFi", ram: "Kingston Fury Beast DDR5 16GB 5600MHz", storage: "WD Black SN770 1TB", psu: "Corsair CV550 550W", case: "NZXT H5 Flow", cooler: "Thermalright PA120 SE" },
    description: "PC văn phòng mạnh, chạy Excel nặng, Photoshop nhẹ, nhiều tab Chrome. Có WiFi, SSD 1TB.", rating: 4.5
  },
  {
    id: "build-creator-35m", name: "PC Content Creator 35 Triệu", purpose: "Dựng video / Đồ họa / Streaming",
    price: 35000000, image: "/images/builds/creator-35m.jpg",
    components: { cpu: "AMD Ryzen 9 7900X", gpu: "NVIDIA RTX 4070 Super 12GB", mainboard: "MSI MAG B650 Tomahawk WiFi", ram: "G.Skill Trident Z5 RGB DDR5 64GB 6000MHz", storage: "Samsung 990 Pro 2TB", psu: "NZXT C850 850W", case: "Fractal Design North", cooler: "Arctic Liquid Freezer II 360" },
    description: "Workstation cho content creator: 12 nhân cho render nhanh, RTX 4070S cho CUDA/AI upscale, 64GB RAM cho timeline dày.", rating: 4.8
  },
  {
    id: "build-workstation-50m", name: "Workstation Chuyên Nghiệp 50 Triệu", purpose: "3D Rendering / AI / Machine Learning",
    price: 50000000, image: "/images/builds/workstation-50m.jpg",
    components: { cpu: "AMD Ryzen 9 7950X", gpu: "NVIDIA RTX 4080 Super 16GB", mainboard: "ASUS ROG STRIX X670E-E Gaming WiFi", ram: "G.Skill Trident Z5 RGB DDR5 64GB 6000MHz", storage: "Samsung 990 Pro 2TB + Seagate Barracuda 4TB HDD", psu: "Corsair RM1000x 1000W", case: "Fractal Design North", cooler: "Corsair iCUE H150i Elite LCD XT" },
    description: "Workstation đỉnh cao: 16 nhân Zen4 cho render Blender/Cinema4D, RTX 4080S cho CUDA/Tensor, 64GB DDR5 cho dataset lớn.", rating: 4.9
  },
  {
    id: "build-miniitx-20m", name: "PC Mini-ITX Compact 20 Triệu", purpose: "Gaming nhỏ gọn",
    price: 20000000, image: "/images/builds/miniitx-20m.jpg",
    components: { cpu: "AMD Ryzen 5 7600X", gpu: "NVIDIA RTX 4060 8GB", mainboard: "Gigabyte B650I Aorus Ultra (ITX)", ram: "Kingston Fury Beast DDR5 16GB 5600MHz", storage: "Samsung 990 EVO 1TB", psu: "Corsair SF600 600W SFX", case: "Cooler Master NR200P", cooler: "Noctua NH-D15 (hoặc AIO 240mm)" },
    description: "PC gaming nhỏ gọn đặt gọn trên bàn, hiệu năng không thua kém mid-tower. Case NR200P siêu đẹp.", rating: 4.6
  }
];

/* ═══════════════════════════════════════════════════
   3. QUY TẮC TƯƠNG THÍCH
   ═══════════════════════════════════════════════════ */
const createCompatRules = (): CompatibilityRule[] => [
  ...MEGA_COMPAT_RULES,
  // === CPU + Mainboard Socket ===
  { id: "compat-cpu-mb-lga1700", component1Category: "cpu", component2Category: "mainboard", matchKey: "LGA1700",
    description: "CPU Intel Gen 12/13/14 (LGA 1700) phải dùng mainboard socket LGA 1700 (chipset B660/B760/Z690/Z790)." },
  { id: "compat-cpu-mb-am5", component1Category: "cpu", component2Category: "mainboard", matchKey: "AM5",
    description: "CPU AMD Ryzen 7000 (AM5) phải dùng mainboard socket AM5 (chipset B650/X670E)." },
  { id: "compat-cpu-mb-am4", component1Category: "cpu", component2Category: "mainboard", matchKey: "AM4",
    description: "CPU AMD Ryzen 5000/3000 (AM4) phải dùng mainboard socket AM4 (chipset B450/B550/X570). Không lắp được lên AM5." },
  { id: "compat-cpu-mb-lga1200", component1Category: "cpu", component2Category: "mainboard", matchKey: "LGA1200",
    description: "CPU Intel Gen 10/11 (LGA 1200) dùng mainboard B460/B560/Z490/Z590. Không dùng được trên B760/Z790 (LGA 1700)." },

  // === Mainboard + RAM ===
  { id: "compat-mb-ram-ddr5", component1Category: "mainboard", component2Category: "ram", matchKey: "DDR5",
    description: "Mainboard DDR5 chỉ dùng được RAM DDR5. Không tương thích ngược DDR4. Kiểm tra khe RAM trên mainboard." },
  { id: "compat-mb-ram-ddr4", component1Category: "mainboard", component2Category: "ram", matchKey: "DDR4",
    description: "Mainboard DDR4 (B550, B450, B660 DDR4) chỉ dùng được RAM DDR4. Không cắm được DDR5." },

  // === GPU + Mainboard PCIe ===
  { id: "compat-gpu-pcie4", component1Category: "mainboard", component2Category: "gpu", matchKey: "PCIe4",
    description: "GPU PCIe 4.0 tương thích với mainboard có slot PCIe x16. Hầu hết mainboard B650/B760 đều hỗ trợ PCIe 4.0." },
  { id: "compat-gpu-pcie5", component1Category: "mainboard", component2Category: "gpu", matchKey: "PCIe5",
    description: "GPU PCIe 5.0 (thế hệ tương lai) tương thích ngược PCIe 4.0, nhưng chỉ chạy full tốc độ trên mainboard X670E/Z790 có PCIe 5.0 x16." },

  // === SSD + Mainboard M.2 ===
  { id: "compat-ssd-m2-pcie4", component1Category: "mainboard", component2Category: "ssd", matchKey: "M.2_PCIe4",
    description: "SSD M.2 PCIe 4.0 (Samsung 990 EVO, WD SN770) cần slot M.2 PCIe 4.0 trên mainboard. Hầu hết mainboard B650/B760 đều có." },
  { id: "compat-ssd-m2-pcie5", component1Category: "mainboard", component2Category: "ssd", matchKey: "M.2_PCIe5",
    description: "SSD PCIe 5.0 (Crucial T500) cần slot M.2 PCIe 5.0 – chỉ có trên X670E và Z790 cao cấp. Vẫn chạy được slot PCIe 4.0 nhưng giảm tốc." },
  { id: "compat-ssd-sata", component1Category: "mainboard", component2Category: "ssd", matchKey: "SATA",
    description: "SSD SATA 2.5 inch (Samsung 870 EVO) dùng cổng SATA trên mainboard. Mọi mainboard đều có cổng SATA, nhưng tốc độ tối đa chỉ 550MB/s." },

  // === PSU Wattage Guidelines ===
  { id: "compat-psu-gpu-4060", component1Category: "psu", component2Category: "gpu", matchKey: "550W",
    description: "RTX 4060 / RX 7600 cần PSU tối thiểu 550W. Khuyến nghị 650W để có dự phòng." },
  { id: "compat-psu-gpu-4070", component1Category: "psu", component2Category: "gpu", matchKey: "700W",
    description: "RTX 4070 Super / 4070 Ti Super / RX 7800 XT cần PSU tối thiểu 700W. Khuyến nghị 750-850W." },
  { id: "compat-psu-gpu-4080", component1Category: "psu", component2Category: "gpu", matchKey: "850W",
    description: "RTX 4080 Super / RX 7900 XTX cần PSU tối thiểu 850W. Khuyến nghị 1000W." },
  { id: "compat-psu-gpu-4090", component1Category: "psu", component2Category: "gpu", matchKey: "1000W",
    description: "RTX 4090 cần PSU tối thiểu 850W nhưng khuyến nghị 1000W trở lên do power spike." },

  // === Case Form Factor ===
  { id: "compat-case-mb-atx", component1Category: "case", component2Category: "mainboard", matchKey: "ATX",
    description: "Case ATX (Lian Li Lancool II, NZXT H5 Flow) chứa được mainboard ATX, mATX và ITX." },
  { id: "compat-case-mb-matx", component1Category: "case", component2Category: "mainboard", matchKey: "mATX",
    description: "Case mATX chỉ chứa mainboard mATX và ITX, KHÔNG chứa mainboard ATX full-size." },
  { id: "compat-case-mb-itx", component1Category: "case", component2Category: "mainboard", matchKey: "ITX",
    description: "Case Mini-ITX (NR200P) chỉ chứa mainboard Mini-ITX. Cần PSU SFX thay vì ATX thường." },

  // === Cooler + Socket ===
  { id: "compat-cooler-lga1700", component1Category: "cooler", component2Category: "cpu", matchKey: "LGA1700",
    description: "Tản nhiệt phải hỗ trợ socket LGA 1700 cho CPU Intel Gen 12/13/14. Hầu hết tản mới đều kèm bracket LGA 1700." },
  { id: "compat-cooler-am5", component1Category: "cooler", component2Category: "cpu", matchKey: "AM5",
    description: "Tản nhiệt AM5 dùng chung mounting với AM4. Hầu hết tản AM4 đều lắp được AM5 không cần thêm bracket." },
  { id: "compat-cooler-clearance", component1Category: "case", component2Category: "cooler", matchKey: "height",
    description: "Kiểm tra chiều cao tản nhiệt tháp so với clearance của case. Noctua NH-D15 cao 165mm – cần case có clearance ≥ 165mm." }
];

/* ═══════════════════════════════════════════════════
   4. HƯỚNG DẪN LẮP RÁP
   ═══════════════════════════════════════════════════ */
const createAssemblyGuides = (): AssemblyGuide[] => [
  ...MEGA_ASSEMBLY_GUIDES,
  {
    id: "guide-basic-build",
    title: "Hướng dẫn lắp ráp PC cơ bản từ A-Z",
    difficulty: "easy",
    estimatedTime: "45 – 60 phút",
    tools: [
      "Tua-vít Phillips #2",
      "Dây rút (cable ties)",
      "Vòng đeo tay chống tĩnh điện (khuyến nghị)",
      "Bề mặt làm việc sạch, không dẫn điện"
    ],
    steps: [
      {
        step: 1,
        title: "Chuẩn bị & kiểm tra linh kiện",
        description: "Mở hộp tất cả linh kiện, kiểm tra đủ phụ kiện (ốc vít, cáp, sách hướng dẫn). Đặt mainboard lên hộp đựng để tránh tĩnh điện.",
        tips: [
          "Chạm tay vào vật kim loại trước khi cầm linh kiện để xả tĩnh điện.",
          "Đọc quick-start guide của mainboard trước."
        ]
      },
      {
        step: 2,
        title: "Lắp CPU lên mainboard",
        description: "Mở nắp socket trên mainboard. Đặt CPU đúng chiều (tam giác vàng trùng với tam giác trên socket). Đóng nắp socket lại nhẹ nhàng.",
        tips: [
          "KHÔNG ấn mạnh CPU xuống – chỉ đặt nhẹ.",
          "Kiểm tra tam giác góc vàng trên CPU trùng với dấu trên socket."
        ],
        warning: "Cong chân socket = hỏng mainboard! Cẩn thận tuyệt đối."
      },
      {
        step: 3,
        title: "Lắp RAM",
        description: "Mở khóa khe RAM trên mainboard. Đặt thanh RAM đúng rãnh (notch), ấn đều 2 đầu cho đến khi khóa tự bấm vào. Ưu tiên khe A2-B2 (khe 2 và 4) cho dual-channel.",
        tips: [
          "Luôn lắp cặp RAM vào khe A2-B2 để chạy dual-channel.",
          "Ấn thẳng đứng, không nghiêng."
        ]
      },
      {
        step: 4,
        title: "Lắp SSD M.2",
        description: "Tháo ốc M.2 trên mainboard, gắn SSD M.2 vào slot ở góc 30°, rồi ấn xuống và vặn ốc cố định.",
        tips: [
          "Ưu tiên slot M.2 đầu tiên (gần CPU nhất) để tốc độ tốt nhất.",
          "Gỡ miếng tản nhiệt M.2 (nếu có) trước khi lắp."
        ]
      },
      {
        step: 5,
        title: "Lắp tản nhiệt CPU",
        description: "Bôi keo tản nhiệt (nếu chưa có sẵn trên tản). Lắp tản nhiệt theo hướng dẫn của nhà sản xuất, siết ốc chéo đều.",
        tips: [
          "Lượng keo tản nhiệt = 1 hạt gạo ở giữa CPU.",
          "Siết ốc theo hình chữ X để áp lực đều."
        ],
        warning: "Không bôi quá nhiều keo – sẽ tràn ra mạch mainboard."
      },
      {
        step: 6,
        title: "Chuẩn bị case",
        description: "Tháo 2 nắp hông case. Lắp standoff (ốc đỡ mainboard) đúng vị trí form factor (ATX/mATX). Tháo nắp I/O shield và thay bằng tấm shield đi kèm mainboard.",
        tips: [
          "Đếm số standoff phải khớp số lỗ trên mainboard.",
          "Lắp I/O shield trước khi đặt mainboard."
        ]
      },
      {
        step: 7,
        title: "Đặt mainboard vào case",
        description: "Đặt mainboard xuống, canh các lỗ ốc với standoff. Vặn ốc cố định mainboard (thường 9 ốc cho ATX, 6 cho mATX).",
        tips: [
          "Vặn ốc nhẹ tay trước, rồi siết chéo dần.",
          "Kiểm tra I/O shield không đè lên cổng."
        ]
      },
      {
        step: 8,
        title: "Lắp nguồn (PSU)",
        description: "Đặt PSU vào vị trí ở dưới/trên case (tuỳ case). Quạt nguồn hướng xuống (nếu case có lỗ thông gió dưới). Vặn 4 ốc cố định phía sau.",
        tips: [
          "Với nguồn modular, cắm dây trước khi lắp vào case sẽ dễ hơn.",
          "Quạt nguồn hướng xuống = hút khí mát từ dưới."
        ]
      },
      {
        step: 9,
        title: "Cắm dây nguồn",
        description: "Cắm dây 24-pin ATX vào mainboard. Cắm dây 8-pin CPU (ở góc trên mainboard). Cắm dây PCIe cho GPU (nếu có).",
        tips: [
          "Dây 24-pin và 8-pin CPU phải nghe 'click' mới chắc.",
          "Luồn dây phía sau case để gọn gàng."
        ]
      },
      {
        step: 10,
        title: "Lắp card đồ họa (GPU)",
        description: "Tháo nắp slot PCI phía sau case. Gắn GPU vào khe PCIe x16 trên mainboard, ấn đến khi nghe tiếng click. Vặn ốc cố định. Cắm dây nguồn PCIe.",
        tips: [
          "Hãy gỡ nắp bảo vệ cổng xuất trên GPU trước.",
          "GPU nặng có thể cần giá đỡ chống cong."
        ],
        warning: "Đảm bảo PSU đủ watt cho GPU. RTX 4070 Super cần tối thiểu 700W."
      },
      {
        step: 11,
        title: "Cắm dây front panel & quạt",
        description: "Cắm dây Power SW, Reset SW, HDD LED, Power LED từ case vào header trên mainboard. Cắm dây quạt case vào SYS_FAN header.",
        tips: [
          "Xem sơ đồ header trong sách mainboard.",
          "Power SW không cần phân biệt cực (+/-), nhưng LED thì có."
        ]
      },
      {
        step: 12,
        title: "Kiểm tra & khởi động lần đầu",
        description: "Kiểm tra lại tất cả kết nối. Cắm màn hình vào GPU (không cắm vào mainboard). Bật nguồn. Vào BIOS để kiểm tra CPU, RAM, ổ cứng được nhận đúng.",
        tips: [
          "Nếu không lên hình: kiểm tra lại dây 24-pin, 8-pin CPU và dây nguồn GPU.",
          "Bật XMP/EXPO trong BIOS để RAM chạy đúng tốc độ.",
          "Cài Windows bằng USB boot."
        ]
      }
    ]
  },
  {
    id: "guide-upgrade-gpu",
    title: "Hướng dẫn nâng cấp / thay card đồ họa",
    difficulty: "easy",
    estimatedTime: "15 – 20 phút",
    tools: ["Tua-vít Phillips #2"],
    steps: [
      {
        step: 1,
        title: "Tắt máy & rút nguồn",
        description: "Tắt PC hoàn toàn, rút dây nguồn. Nhấn nút Power 5 giây để xả điện còn lại.",
        tips: ["Chờ đèn LED trên mainboard tắt hẳn."]
      },
      {
        step: 2,
        title: "Tháo GPU cũ",
        description: "Rút dây nguồn PCIe khỏi GPU cũ. Tháo ốc cố định. Bấm khóa khe PCIe và rút GPU ra.",
        tips: ["Nhớ bấm khóa khe PCIe trước khi rút, không giật mạnh."]
      },
      {
        step: 3,
        title: "Lắp GPU mới",
        description: "Gắn GPU mới vào khe PCIe x16, ấn đến khi nghe click. Vặn ốc cố định. Cắm dây nguồn PCIe.",
        tips: [
          "Kiểm tra PSU đủ watt cho GPU mới.",
          "Dùng 2 dây PCIe riêng biệt (không dùng 1 dây chia 2 đầu) nếu GPU yêu cầu."
        ]
      },
      {
        step: 4,
        title: "Cài driver mới",
        description: "Khởi động máy, gỡ driver GPU cũ bằng DDU (Display Driver Uninstaller). Tải và cài driver mới nhất từ NVIDIA/AMD.",
        tips: ["Dùng DDU trong Safe Mode để gỡ sạch driver cũ."]
      }
    ]
  },
  {
    id: "guide-install-windows",
    title: "Hướng dẫn cài Windows 11 bằng USB",
    difficulty: "easy",
    estimatedTime: "30 – 45 phút",
    tools: ["USB 8GB trở lên", "Máy tính có internet để tạo USB boot", "Key Windows (nếu có)"],
    steps: [
      { step: 1, title: "Tạo USB cài Windows", description: "Tải Media Creation Tool từ microsoft.com. Chạy tool, chọn 'Create installation media', chọn USB flash drive. Tool sẽ tự tải Windows và ghi vào USB.", tips: ["USB sẽ bị format – backup dữ liệu trước.", "Cần internet ổn định, file ~6GB."] },
      { step: 2, title: "Boot từ USB", description: "Cắm USB vào PC mới. Bật máy và nhấn F12/F2/Del (tùy mainboard) để vào Boot Menu. Chọn boot từ USB.", tips: ["ASUS: nhấn F8/Del, MSI: nhấn F11/Del, Gigabyte: nhấn F12/Del."] },
      { step: 3, title: "Cài đặt Windows", description: "Chọn ngôn ngữ, nhấn 'Install Now'. Nhập key hoặc chọn 'I don't have a product key'. Chọn Windows 11 Home/Pro. Chọn 'Custom: Install Windows only'.", tips: ["Chọn Pro nếu cần BitLocker, Remote Desktop, Hyper-V."] },
      { step: 4, title: "Phân vùng ổ cứng", description: "Chọn ổ SSD chính (dung lượng lớn nhất). Nhấn 'New' để tạo phân vùng, hoặc chọn 'Unallocated Space' rồi nhấn Next. Windows sẽ tự tạo phân vùng.", tips: ["Không cần tạo phân vùng thủ công – Windows tự quản lý.", "Nếu có nhiều ổ, chọn đúng ổ SSD NVMe (thường là ổ nhỏ hơn HDD)."], warning: "Chọn sai ổ sẽ XÓA HẾT dữ liệu trên ổ đó!" },
      { step: 5, title: "Hoàn tất & cài driver", description: "Windows tự cài và restart vài lần. Sau khi vào desktop: cài driver chipset từ AMD/Intel, driver GPU từ NVIDIA/AMD, bật XMP/EXPO trong BIOS.", tips: ["Cài driver GPU trước tiên để có độ phân giải đúng.", "Windows Update sẽ tự cài hầu hết driver còn lại.", "Tải driver từ trang chủ hãng mainboard cho đầy đủ nhất."] }
    ]
  },
  {
    id: "guide-upgrade-ram",
    title: "Hướng dẫn nâng cấp RAM",
    difficulty: "easy",
    estimatedTime: "10 – 15 phút",
    tools: ["Không cần dụng cụ"],
    steps: [
      { step: 1, title: "Kiểm tra tương thích", description: "Xác định mainboard dùng DDR4 hay DDR5. Kiểm tra số khe RAM trống. Xem tốc độ RAM hiện tại trong Task Manager > Performance > Memory.", tips: ["Mua cùng hãng, cùng tốc độ, cùng dung lượng để đảm bảo tương thích.", "DDR4 và DDR5 có rãnh khác nhau, không cắm nhầm được."] },
      { step: 2, title: "Tắt máy & tháo nắp case", description: "Tắt PC, rút nguồn, nhấn nút Power 5s để xả điện. Tháo nắp hông case.", tips: ["Chạm tay vào vỏ case kim loại để xả tĩnh điện."] },
      { step: 3, title: "Lắp RAM mới", description: "Mở khóa khe RAM (bẻ ra 2 bên). Đặt thanh RAM đúng chiều (khớp rãnh), ấn đều xuống đến khi khóa tự bấm vào.", tips: ["Nếu thêm RAM (không thay): cắm vào khe trống cùng màu để chạy dual-channel.", "Nếu thay mới: tháo RAM cũ ra trước rồi lắp cặp RAM mới vào khe A2-B2."] },
      { step: 4, title: "Bật máy & bật XMP/EXPO", description: "Bật máy, vào BIOS (nhấn Del/F2). Bật XMP (Intel) hoặc EXPO (AMD) để RAM chạy đúng tốc độ quảng cáo.", tips: ["Không bật XMP = RAM chạy mặc định 4800MHz thay vì 6000MHz.","Nếu máy không boot được sau khi bật XMP, reset CMOS rồi thử profile thấp hơn."] }
    ]
  },
  {
    id: "guide-cable-management",
    title: "Hướng dẫn đi dây gọn gàng (Cable Management)",
    difficulty: "medium",
    estimatedTime: "30 – 45 phút",
    tools: ["Dây rút (zip ties)", "Kéo", "Băng dính 2 mặt (tùy chọn)"],
    steps: [
      { step: 1, title: "Lên kế hoạch", description: "Xác định vị trí các cổng cắm trên mainboard (24-pin, 8-pin CPU, SATA, USB header). Luồn dây từ mặt sau case qua lỗ grommet gần nhất.", tips: ["Case tốt có nhiều lỗ grommet + kênh đi dây phía sau.", "Nguồn modular giúp đi dây dễ hơn nhiều – chỉ cắm dây cần dùng."] },
      { step: 2, title: "Đi dây nguồn chính", description: "Luồn dây 24-pin từ phía sau, qua lỗ grommet bên phải mainboard. Dây 8-pin CPU luồn từ phía sau lên góc trên mainboard.", tips: ["Dây 24-pin thường cứng – bẻ cong trước khi luồn cho dễ."] },
      { step: 3, title: "Đi dây GPU & SATA", description: "Dây nguồn GPU luồn từ dưới lên, qua lỗ grommet dưới GPU. Dây SATA (nếu có HDD/SSD 2.5\") luồn gọn phía sau.", tips: ["Dùng 2 dây PCIe riêng cho GPU cao cấp, tránh dùng 1 dây chia đôi."] },
      { step: 4, title: "Gom & cố định", description: "Dùng dây rút gom các dây thừa ở mặt sau case. Buộc gọn vào các móc đi dây có sẵn trong case. Đóng nắp case.", tips: ["Không siết dây rút quá chặt vào dây nguồn.", "Để thừa 1 chút slack cho dây front panel để dễ tháo sau này."] }
    ]
  },
  {
    id: "guide-clean-pc",
    title: "Hướng dẫn vệ sinh PC",
    difficulty: "easy",
    estimatedTime: "20 – 30 phút",
    tools: ["Bình xịt khí nén (compressed air)", "Cọ mềm chống tĩnh điện", "Khăn microfiber", "Keo tản nhiệt (nếu thay)"],
    steps: [
      { step: 1, title: "Tắt máy & chuẩn bị", description: "Tắt PC, rút nguồn, chờ 10 phút. Mang PC ra nơi thoáng khí (ban công/sân). Tháo cả 2 nắp hông case.", tips: ["Vệ sinh PC mỗi 3-6 tháng.", "KHÔNG dùng máy hút bụi – tĩnh điện sẽ hỏng linh kiện."] },
      { step: 2, title: "Thổi bụi", description: "Dùng bình khí nén xịt bụi trên quạt, tản nhiệt, GPU, PSU. Xịt ngắn, giữ bình thẳng đứng.", tips: ["Giữ quạt không cho quay khi xịt khí – quạt quay ngược sẽ tạo điện ngược.", "Xịt từ trong ra ngoài case."] },
      { step: 3, title: "Vệ sinh filter", description: "Tháo các lưới lọc bụi (dust filter) của case. Rửa nước, phơi khô hoàn toàn rồi lắp lại.", tips: ["Lưới lọc bẩn = luồng gió bị chặn = nhiệt tăng đáng kể."] },
      { step: 4, title: "Thay keo tản nhiệt (tùy chọn)", description: "Nếu nhiệt CPU cao bất thường (>85°C khi gaming): tháo tản nhiệt, lau sạch keo cũ bằng cồn isopropyl 99%, bôi keo mới (hạt gạo), lắp tản lại.", tips: ["Thay keo mỗi 1-2 năm.", "Dùng keo tốt: Thermal Grizzly Kryonaut, Noctua NT-H1, Arctic MX-6."] }
    ]
  }
];

/* ═══════════════════════════════════════════════════
   5. FAQ & CHÍNH SÁCH
   ═══════════════════════════════════════════════════ */
interface FAQItem {
  question: string;
  answer: string;
  tags: string[];
}

const createFAQ = (): FAQItem[] => [
  // === MEGA FAQ DATA ===
  ...MEGA_FAQ.map(f => ({ question: f.question, answer: f.answer, tags: f.tags })),
  // === CHÍNH SÁCH CỬA HÀNG ===
  { question: "Chính sách bảo hành như thế nào?",
    answer: "Chúng tôi bảo hành theo chính sách nhà sản xuất: CPU 3 năm, GPU 3 năm, RAM lifetime, SSD 3-5 năm, PSU 5-10 năm tuỳ hãng. Đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất. Bảo hành 1 đổi 1 trong 30 ngày đầu cho linh kiện bị DOA (dead on arrival).",
    tags: ["bảo hành", "đổi trả", "chính sách"] },
  { question: "Có hỗ trợ lắp ráp PC không?",
    answer: "Có! Chúng tôi lắp ráp MIỄN PHÍ khi mua combo từ 3 linh kiện trở lên. Nếu mua lẻ, phí lắp ráp là 200.000 VNĐ. Chúng tôi cũng có dịch vụ lắp ráp tại nhà với phí ship tùy khu vực (nội thành HCM: 100K, ngoại thành: 200K).",
    tags: ["lắp ráp", "dịch vụ", "phí"] },
  { question: "Thanh toán bằng hình thức nào?",
    answer: "Chúng tôi hỗ trợ: chuyển khoản ngân hàng (Vietcombank, Techcombank, MB Bank), ví MoMo/ZaloPay/VNPay, thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), trả góp 0% qua thẻ tín dụng (kỳ hạn 3-12 tháng), COD (thanh toán khi nhận hàng) cho đơn dưới 20 triệu.",
    tags: ["thanh toán", "trả góp", "cod", "momo", "zalopay"] },
  { question: "Thời gian giao hàng bao lâu?",
    answer: "Nội thành HCM/HN: 1-2 ngày làm việc. Các tỉnh lân cận: 2-3 ngày. Tỉnh xa: 3-5 ngày. Đơn hàng PC lắp sẵn cần thêm 1 ngày để test burn-in 24h. Miễn phí ship cho đơn từ 2 triệu.",
    tags: ["giao hàng", "vận chuyển", "thời gian", "ship"] },
  { question: "Có trả góp được không?",
    answer: "Có! Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng (Visa/Mastercard) kỳ hạn 3, 6, 12 tháng. Hoặc trả góp qua công ty tài chính (Home Credit, FE Credit) với lãi suất ưu đãi. Đơn từ 3 triệu trở lên đều có thể trả góp.",
    tags: ["trả góp", "tín dụng", "thanh toán"] },
  { question: "Có chương trình khuyến mãi nào không?",
    answer: "Chúng tôi thường xuyên có combo giảm giá khi mua nhiều linh kiện, flash sale cuối tuần, và chương trình trade-in (đổi linh kiện cũ lấy giảm giá). Theo dõi fanpage và đăng ký nhận thông báo để không bỏ lỡ!",
    tags: ["khuyến mãi", "giảm giá", "combo", "trade-in"] },

  // === TƯ VẤN CHỌN LINH KIỆN ===
  { question: "Tôi nên chọn Intel hay AMD?",
    answer: "AMD Ryzen 7 7800X3D: vua gaming nhờ 3D V-Cache, FPS cao nhất ở 1080p/1440p. Intel i5-14400F: best value, 10 nhân giá rẻ. Intel i7-14700K: 20 nhân mạnh cho đa nhiệm + content creation. AMD Ryzen 9 7950X: 16 nhân cho workstation/render nặng. Tóm lại: Gaming thuần = AMD 7800X3D. Đa nhiệm + gaming = Intel. Workstation = Ryzen 9.",
    tags: ["tư vấn", "intel", "amd", "so sánh", "cpu"] },
  { question: "DDR4 hay DDR5 – nên chọn loại nào?",
    answer: "DDR5 nhanh hơn (~15-20% trong tác vụ nặng) nhưng đắt hơn. DDR4 vẫn rất đủ dùng cho gaming. Nếu build mới từ đầu → DDR5 (AM5/LGA1700 DDR5) cho tương lai. Nếu nâng cấp PC cũ AM4/B660 DDR4 → giữ DDR4. DDR5 6000MHz CL30 là sweet spot, DDR4 3200MHz CL16 là đủ dùng.",
    tags: ["ram", "ddr4", "ddr5", "so sánh", "tư vấn"] },
  { question: "Cần nguồn (PSU) bao nhiêu watt?",
    answer: "Quy tắc: tổng TDP GPU + CPU + 200W dự phòng. Chi tiết: RTX 4060/RX 7600 → 550-650W. RTX 4060 Ti/RX 7700 XT → 650W. RTX 4070 Super/RX 7800 XT → 750W. RTX 4070 Ti Super → 750-850W. RTX 4080 Super/RX 7900 XTX → 850-1000W. RTX 4090 → 1000W+. Luôn chọn PSU 80+ Bronze trở lên cho hiệu suất và độ bền.",
    tags: ["psu", "nguồn", "watt", "tư vấn"] },
  { question: "RAM bao nhiêu GB là đủ?",
    answer: "8GB: tối thiểu, chỉ đủ cho văn phòng nhẹ. 16GB (2x8GB): đủ cho gaming & đa nhiệm thông thường. 32GB (2x16GB): tốt cho streaming, dựng video, chạy nhiều tab Chrome, game AAA nặng. 64GB (2x32GB): chỉ cần nếu làm 3D rendering, AI/ML, chạy máy ảo, hoặc edit video 4K timeline dày. Luôn mua CẶP RAM để chạy dual-channel.",
    tags: ["ram", "dung lượng", "tư vấn"] },
  { question: "Nên mua laptop hay PC để bàn?",
    answer: "PC để bàn: hiệu năng/tiền tốt hơn 30-50%, dễ nâng cấp, tản nhiệt tốt, màn hình lớn. Laptop: di động, gọn nhẹ, có pin. Cùng 20 triệu: PC desktop chơi game mạnh hơn đáng kể. Sinh viên hay di chuyển → laptop. Ở nhà/văn phòng cố định → PC desktop. Lý tưởng nhất: 1 PC desktop mạnh + 1 laptop nhẹ cho di động.",
    tags: ["laptop", "pc", "so sánh", "tư vấn"] },
  { question: "SSD SATA, NVMe PCIe 3.0, PCIe 4.0, PCIe 5.0 khác nhau sao?",
    answer: "SSD SATA: 550MB/s, giá rẻ, dùng cổng SATA – vẫn nhanh hơn HDD 10 lần. NVMe PCIe 3.0: 3500MB/s, giá tốt cho nâng cấp PC cũ. NVMe PCIe 4.0: 5000-7000MB/s, phổ biến nhất hiện nay (Samsung 990 EVO, WD SN770). NVMe PCIe 5.0: 12000-14000MB/s, nóng hơn và đắt hơn, chỉ cần cho workstation chuyên nghiệp. Với gaming, PCIe 4.0 là đủ tốt.",
    tags: ["ssd", "nvme", "sata", "pcie", "tốc độ", "so sánh"] },
  { question: "Card đồ họa nào chơi game gì?",
    answer: "1080p 60fps eSports (Valorant, LoL): RX 7600 / RTX 4060. 1080p 144fps competitive: RTX 4060 Ti / RX 7700 XT. 1440p 60fps AAA: RTX 4060 Ti / RX 7700 XT. 1440p 144fps: RTX 4070 Super / RX 7800 XT. 4K 60fps: RTX 4070 Ti Super / RX 7900 XTX. 4K 120fps+: RTX 4080 Super / RTX 4090. Lưu ý: NVIDIA có DLSS 3.5 + Frame Generation ưu thế hơn AMD FSR trong upscaling.",
    tags: ["gpu", "card đồ họa", "game", "fps", "tư vấn", "rtx", "rx"] },
  { question: "Nên mua mainboard chipset gì?",
    answer: "Intel: B660/B760 – đủ dùng cho i5/i7, giá tốt. Z790 – cho i9, hỗ trợ ép xung, PCIe 5.0 đầy đủ. AMD: B550 – cho Ryzen 5000 (AM4), giá rẻ. B650 – cho Ryzen 7000 (AM5), DDR5, PCIe 4.0. X670E – cho Ryzen 9, PCIe 5.0 đầy đủ cho cả GPU + SSD. Quy tắc: CPU mainstream → chipset B. CPU cao cấp/ép xung → chipset X/Z.",
    tags: ["mainboard", "chipset", "b760", "z790", "b650", "x670e", "tư vấn"] },
  { question: "Keo tản nhiệt có quan trọng không?",
    answer: "CÓ! Keo tản nhiệt giúp dẫn nhiệt từ CPU sang tản nhiệt. Keo tốt giảm 3-5°C so với keo đi kèm tản. Keo phổ biến: Noctua NT-H1 (dễ bôi, bền), Thermal Grizzly Kryonaut (hiệu năng cao), Arctic MX-6 (giá rẻ mà tốt). Nên thay keo mỗi 1-2 năm. Bôi 1 hạt gạo ở giữa CPU, KHÔNG tráng đều.",
    tags: ["keo tản nhiệt", "thermal paste", "nhiệt độ", "tản nhiệt"] },
  { question: "Tản nhiệt khí hay tản nhiệt nước AIO?",
    answer: "Tản khí (air cooler): rẻ, bền, ít rủi ro, đủ dùng cho hầu hết CPU. Tản nước AIO (All-in-One): mát hơn, đẹp hơn, nhưng đắt hơn và có rủi ro rò rỉ (rất hiếm). Gợi ý: i5/Ryzen 5 → tản khí Thermalright PA120 SE (~500K). i7/Ryzen 7 → AIO 240mm hoặc tản khí cao cấp (Noctua NH-D15). i9/Ryzen 9 → AIO 360mm (Arctic Liquid Freezer II 360).",
    tags: ["tản nhiệt", "cooler", "aio", "air cooler", "nước", "tư vấn"] },

  // === NÂNG CẤP & BẢO TRÌ ===
  { question: "Nên nâng cấp gì đầu tiên cho PC cũ?",
    answer: "Thứ tự ưu tiên nâng cấp: 1️⃣ SSD (nếu đang dùng HDD) – cải thiện rõ rệt nhất, boot Windows từ 60s → 10s. 2️⃣ RAM (nếu đang dùng 8GB) – lên 16GB cho đa nhiệm tốt hơn. 3️⃣ GPU – nếu muốn chơi game mới. 4️⃣ CPU + Mainboard – cuối cùng vì phải thay cả combo. PSU nâng khi cần thiết cho GPU mới.",
    tags: ["nâng cấp", "upgrade", "pc cũ", "tư vấn"] },
  { question: "Làm sao biết PC mình bị bottleneck?",
    answer: "Bottleneck = linh kiện yếu kìm linh kiện mạnh. Cách kiểm tra: chạy game, mở Task Manager > Performance. Nếu GPU 99% + CPU 50% = GPU bottleneck (yếu GPU). Nếu CPU 99% + GPU 60% = CPU bottleneck (yếu CPU). Dùng MSI Afterburner để xem chi tiết hơn. Ví dụ: i3-12100F + RTX 4080 = CPU bottleneck nặng. R7 7800X3D + RTX 4060 = GPU bottleneck.",
    tags: ["bottleneck", "hiệu năng", "tối ưu", "tư vấn"] },
  { question: "Bao lâu nên vệ sinh PC một lần?",
    answer: "Mỗi 3-6 tháng tùy môi trường. Nhà nhiều bụi/thú cưng: mỗi 2-3 tháng. Môi trường sạch: mỗi 6 tháng. Dấu hiệu cần vệ sinh: nhiệt CPU/GPU tăng 5-10°C so với mới mua, quạt kêu to hơn bình thường, PC tự tắt do quá nhiệt. Dùng bình khí nén để thổi bụi, KHÔNG dùng máy hút bụi.",
    tags: ["vệ sinh", "bảo trì", "bụi", "nhiệt độ"] },
  { question: "BIOS là gì và khi nào cần update?",
    answer: "BIOS (Basic Input/Output System) là firmware trên mainboard, quản lý phần cứng trước khi Windows khởi động. Nên update BIOS khi: hỗ trợ CPU mới (ví dụ B650 cần update BIOS để dùng Ryzen 9000), fix lỗi RAM không ổn định, cải thiện hiệu năng. KHÔNG cần update nếu mọi thứ đang chạy ổn. Cách update: tải file BIOS từ trang chủ mainboard, copy vào USB, vào BIOS → Flash. KHÔNG tắt điện khi đang flash!",
    tags: ["bios", "update", "mainboard", "firmware"] },

  // === GAMING ===
  { question: "DLSS, FSR, XeSS là gì?",
    answer: "Đều là công nghệ upscaling (nâng độ phân giải bằng AI): DLSS (NVIDIA) – chỉ có trên RTX, dùng Tensor Core, chất lượng tốt nhất. FSR (AMD) – chạy trên mọi GPU, miễn phí, chất lượng tốt. XeSS (Intel) – chạy tốt nhất trên Arc, cũng hỗ trợ GPU khác. Frame Generation (DLSS 3/FSR 3): tạo frame giả giữa 2 frame thật, tăng FPS 50-100% nhưng tăng input lag nhẹ. Khuyến nghị: RTX → dùng DLSS. Non-RTX → dùng FSR.",
    tags: ["dlss", "fsr", "xess", "upscaling", "fps", "game"] },
  { question: "FreeSync và G-Sync là gì? Có cần không?",
    answer: "FreeSync (AMD) và G-Sync (NVIDIA): đồng bộ tần số quét màn hình với FPS game, loại bỏ hiện tượng screen tearing (xé hình). FreeSync: miễn phí, hầu hết màn hình đều có. G-Sync Compatible: màn hình FreeSync nhưng NVIDIA đã test hoạt động tốt. G-Sync Ultimate: module riêng, đắt hơn, chất lượng tốt nhất. Nên có FreeSync/G-Sync nếu chơi game, đặc biệt khi FPS không ổn định.",
    tags: ["freesync", "gsync", "màn hình", "gaming", "tearing"] },
  { question: "Nên chọn màn hình bao nhiêu inch và Hz?",
    answer: "24 inch 1080p 144Hz: eSports competitive (Valorant, CSGO) – giá rẻ, phản hồi nhanh. 27 inch 1440p 165Hz: sweet spot, đẹp + mượt cho mọi game. 27 inch 4K 144Hz: cao cấp, cần GPU mạnh (RTX 4070 Ti trở lên). 34 inch Ultrawide 1440p: cho immersive gaming + content creation. Panel: IPS (màu đẹp, góc nhìn rộng) > VA (contrast cao, đen sâu) > TN (phản hồi nhanh nhưng màu xấu).",
    tags: ["màn hình", "monitor", "hz", "inch", "panel", "tư vấn"] },
  { question: "Làm sao tối ưu Windows cho gaming?",
    answer: "1. Bật Game Mode (Settings > Gaming). 2. Cập nhật driver GPU mới nhất. 3. Tắt startup programs không cần thiết (Task Manager > Startup). 4. Bật XMP/EXPO cho RAM trong BIOS. 5. Chọn High Performance power plan. 6. Tắt Hardware-accelerated GPU scheduling nếu bị stutter. 7. Trong game: tắt V-Sync nếu có FreeSync/G-Sync, giảm shadow và volumetric fog trước tiên nếu cần FPS.",
    tags: ["tối ưu", "windows", "gaming", "fps", "performance"] },

  // === STREAMING & CONTENT CREATION ===
  { question: "PC để streaming cần gì?",
    answer: "CPU: tối thiểu 8 nhân (Ryzen 7 7800X3D hoặc i7-14700K). RAM: 32GB DDR5. GPU: RTX 4060 trở lên (NVENC encoder rất tốt). SSD: 1TB trở lên. Internet: upload 10Mbps+ cho 1080p, 20Mbps+ cho 1440p. Phần mềm: OBS Studio (miễn phí). NVIDIA NVENC tốt hơn x264 cho single-PC streaming – không hao CPU. Budget tối thiểu ~25 triệu cho setup stream 1080p60.",
    tags: ["streaming", "obs", "nvenc", "content creation", "tư vấn"] },
  { question: "PC dựng video cần cấu hình như nào?",
    answer: "Premiere Pro / DaVinci Resolve: CPU nhiều nhân quan trọng nhất (Ryzen 9 7900X / i7-14700K). RAM: 32GB tối thiểu, 64GB cho 4K timeline dày. GPU: RTX 4060 trở lên cho CUDA acceleration. SSD NVMe nhanh cho media drive. Tip: 2 ổ SSD – 1 cho OS + phần mềm, 1 cho project files. DaVinci Resolve dùng GPU nhiều hơn Premiere Pro.",
    tags: ["video editing", "premiere", "davinci", "render", "content creation"] },

  // === KỸ THUẬT NÂNG CAO ===
  { question: "XMP/EXPO là gì?",
    answer: "XMP (Extreme Memory Profile – Intel) và EXPO (Extended Profiles for Overclocking – AMD): profile ép xung RAM có sẵn. RAM DDR5 6000MHz mua về mặc định chạy 4800MHz – phải bật XMP/EXPO trong BIOS mới chạy đúng tốc độ. Cách bật: khởi động → nhấn Del/F2 vào BIOS → tìm mục XMP/EXPO → bật → Save & Exit. Nếu không ổn định: chọn profile tốc độ thấp hơn.",
    tags: ["xmp", "expo", "ram", "ép xung", "bios", "overclock"] },
  { question: "Có nên ép xung (overclock) không?",
    answer: "Cho người mới: KHÔNG khuyến nghị. Rủi ro cao, lợi ích nhỏ (5-10% FPS). Nếu muốn: chỉ ép xung RAM (bật XMP/EXPO) – an toàn và hiệu quả nhất. Ép xung CPU/GPU cần kiến thức về điện áp, nhiệt độ, stress test. CPU Intel K-series và AMD Ryzen đều hỗ trợ OC. GPU có thể OC nhẹ bằng MSI Afterburner (tăng core clock 50-100MHz, tăng mem clock 200-500MHz).",
    tags: ["ép xung", "overclock", "hiệu năng", "rủi ro"] },
  { question: "Cách kiểm tra nhiệt độ CPU/GPU?",
    answer: "Phần mềm miễn phí: HWiNFO64 (chi tiết nhất), MSI Afterburner (hiện overlay trong game), Core Temp (nhẹ, chỉ CPU). Nhiệt độ an toàn: CPU idle: 30-45°C, CPU load: 60-85°C. GPU idle: 30-45°C, GPU load: 65-85°C. Trên 90°C = cần kiểm tra tản nhiệt/keo/quạt. Trên 100°C = tự throttle, cần xử lý ngay.",
    tags: ["nhiệt độ", "temperature", "hwinfo", "afterburner", "monitoring"] },
  { question: "Cách chọn quạt case và airflow?",
    answer: "Nguyên tắc: intake (hút vào) ở mặt trước/dưới, exhaust (đẩy ra) ở mặt sau/trên. Cấu hình tối thiểu: 2 intake trước + 1 exhaust sau. Lý tưởng: 3 intake trước + 1 exhaust sau + 2 exhaust trên. Positive pressure (nhiều intake hơn exhaust): ít bụi hơn. Quạt tốt giá rẻ: Arctic P12 (5 cái ~300K). Quạt RGB: Corsair iCUE, Lian Li UNI FAN.",
    tags: ["quạt", "airflow", "case", "tản nhiệt", "setup"] },

  // === MUA SẮM THÔNG MINH ===
  { question: "Nên mua linh kiện ở đâu?",
    answer: "Chính hãng/đại lý uy tín: An Phát Computer, Phong Vũ, GearVN, Nguyễn Công, Hanoicomputer. Hoặc mua tại shop chúng tôi với giá cạnh tranh + tư vấn AI chatbot 24/7! Tránh mua hàng xách tay không rõ nguồn gốc. Kiểm tra giá trên websosanh.vn hoặc các group Facebook PC Hardware để so giá.",
    tags: ["mua hàng", "cửa hàng", "uy tín", "giá"] },
  { question: "Linh kiện secondhand (đã qua sử dụng) có nên mua?",
    answer: "Nên mua secondhand: GPU (kiểm tra kỹ), RAM (ít hỏng), Case, Quạt. Cần cẩn thận: CPU (kiểm tra chân pin), Mainboard (test đầy đủ). KHÔNG nên mua secondhand: PSU (nguy hiểm nếu hỏng), SSD (không biết tuổi thọ còn lại). Tip: kiểm tra GPU secondhand bằng FurMark stress test 10 phút. Kiểm tra SSD bằng CrystalDiskInfo xem health %.",
    tags: ["secondhand", "cũ", "qua sử dụng", "tip", "mua hàng"] },
  { question: "Ngân sách bao nhiêu để build PC gaming?",
    answer: "8-10 triệu: PC eSports 1080p (Valorant, LoL, CSGO). 15 triệu: PC gaming 1080p tốt (mọi game Medium-High). 20 triệu: Sweet spot 1080p Ultra / 1440p Medium. 25-30 triệu: 1440p Ultra mọi game AAA. 40 triệu: 4K gaming + content creation. 60+ triệu: Flagship, không thiếu thứ gì. Tip: đầu tư 35-40% ngân sách cho GPU, 20-25% cho CPU, còn lại cho linh kiện khác.",
    tags: ["ngân sách", "budget", "build pc", "tư vấn", "giá"] }
];

/* ═══════════════════════════════════════════════════
   6. STORE MANAGEMENT
   ═══════════════════════════════════════════════════ */
interface ProductStore {
  products: Product[];
  prebuiltPCs: PrebuiltPC[];
  compatRules: CompatibilityRule[];
  assemblyGuides: AssemblyGuide[];
  faq: FAQItem[];
}

const getProductStore = (): ProductStore => {
  const g = globalThis as typeof globalThis & { __productStore?: ProductStore };
  if (!g.__productStore) {
    g.__productStore = {
      products: createProducts(),
      prebuiltPCs: createPrebuiltPCs(),
      compatRules: createCompatRules(),
      assemblyGuides: createAssemblyGuides(),
      faq: createFAQ()
    };
  }
  return g.__productStore;
};

/* ──── Query Helpers ──── */

export const getAllProducts = () => getProductStore().products;

export const getProductsByCategory = (category: string) =>
  getProductStore().products.filter((p) => p.category === category);

export const getProductById = (id: string) =>
  getProductStore().products.find((p) => p.id === id);

export const searchProducts = (query: string, maxResults = 15): Product[] => {
  const tokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  const scored = getProductStore().products.map((p) => {
    const text = `${p.name} ${p.brand} ${p.category} ${p.shortDesc} ${p.tags.join(" ")}`.toLowerCase();
    const score = tokens.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
    return { product: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.product);
};

export const getProductsByBudget = (
  budget: number,
  category?: string
): Product[] => {
  let products = getProductStore().products;
  if (category) products = products.filter((p) => p.category === category);
  return products
    .filter((p) => (p.discountPrice ?? p.price) <= budget)
    .sort((a, b) => b.rating - a.rating);
};

export const getAllPrebuiltPCs = () => getProductStore().prebuiltPCs;

export const getPrebuiltByBudget = (budget: number) =>
  getProductStore().prebuiltPCs.filter((pc) => pc.price <= budget);

export const getPrebuiltByPurpose = (purpose: string) =>
  getProductStore().prebuiltPCs.filter((pc) =>
    pc.purpose.toLowerCase().includes(purpose.toLowerCase())
  );

export const getCompatRules = () => getProductStore().compatRules;

export const checkCompatibility = (
  product1: Product,
  product2: Product
): { compatible: boolean; message: string } => {
  const rules = getProductStore().compatRules;
  for (const rule of rules) {
    const match1 =
      product1.category === rule.component1Category &&
      product2.category === rule.component2Category;
    const match2 =
      product1.category === rule.component2Category &&
      product2.category === rule.component1Category;

    if (match1 || match2) {
      const key1 = product1.compatKey ?? "";
      const key2 = product2.compatKey ?? "";
      if (key1 && key2 && key1 !== key2) {
        return {
          compatible: false,
          message: `❌ KHÔNG tương thích! ${rule.description}`
        };
      }
    }
  }
  return { compatible: true, message: "✅ Tương thích!" };
};

export const getAssemblyGuides = () => getProductStore().assemblyGuides;

export const getAssemblyGuideById = (id: string) =>
  getProductStore().assemblyGuides.find((g) => g.id === id);

export const getFAQ = () => getProductStore().faq;

export const searchFAQ = (query: string) => {
  const tokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  return getProductStore()
    .faq.map((item) => {
      const text = `${item.question} ${item.answer} ${item.tags.join(" ")}`.toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
};

/* ═══════════════════════════════════════════════════
   MUTATIONS (CRUD)
   ═══════════════════════════════════════════════════ */

/* ──── Products ──── */
export const addProduct = (product: Product): Product => {
  const store = getProductStore();
  const p = { ...product, id: product.id || `prod-${Date.now()}` };
  store.products.push(p);
  return p;
};

export const updateProduct = (id: string, data: Partial<Product>): Product | null => {
  const store = getProductStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  store.products[idx] = { ...store.products[idx], ...data };
  return store.products[idx];
};

export const deleteProduct = (id: string): boolean => {
  const store = getProductStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.products.splice(idx, 1);
  return true;
};

/* ──── Prebuilt PCs ──── */
export const addPrebuiltPC = (pc: PrebuiltPC): PrebuiltPC => {
  const store = getProductStore();
  const p = { ...pc, id: pc.id || `build-${Date.now()}` };
  store.prebuiltPCs.push(p);
  return p;
};

export const updatePrebuiltPC = (id: string, data: Partial<PrebuiltPC>): PrebuiltPC | null => {
  const store = getProductStore();
  const idx = store.prebuiltPCs.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  store.prebuiltPCs[idx] = { ...store.prebuiltPCs[idx], ...data };
  return store.prebuiltPCs[idx];
};

export const deletePrebuiltPC = (id: string): boolean => {
  const store = getProductStore();
  const idx = store.prebuiltPCs.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.prebuiltPCs.splice(idx, 1);
  return true;
};

/* ──── FAQ ──── */
export const addFAQ = (item: FAQItem): FAQItem => {
  getProductStore().faq.push(item);
  return item;
};

export const updateFAQ = (index: number, data: FAQItem): FAQItem | null => {
  const store = getProductStore();
  if (index < 0 || index >= store.faq.length) return null;
  store.faq[index] = data;
  return data;
};

export const deleteFAQ = (index: number): boolean => {
  const store = getProductStore();
  if (index < 0 || index >= store.faq.length) return false;
  store.faq.splice(index, 1);
  return true;
};

/* ──── Assembly Guides ──── */
export const addAssemblyGuide = (guide: AssemblyGuide): AssemblyGuide => {
  const store = getProductStore();
  const g = { ...guide, id: guide.id || `guide-${Date.now()}` };
  store.assemblyGuides.push(g);
  return g;
};

export const deleteAssemblyGuide = (id: string): boolean => {
  const store = getProductStore();
  const idx = store.assemblyGuides.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  store.assemblyGuides.splice(idx, 1);
  return true;
};

/* ──── Stats ──── */
export const getStoreStats = () => {
  const store = getProductStore();
  const categories = new Set(store.products.map((p) => p.category));
  const brands = new Set(store.products.map((p) => p.brand));
  const totalValue = store.products.reduce((acc, p) => acc + p.price * p.stock, 0);

  return {
    totalProducts: store.products.length,
    totalPrebuiltPCs: store.prebuiltPCs.length,
    totalFAQ: store.faq.length,
    totalGuides: store.assemblyGuides.length,
    categories: categories.size,
    brands: brands.size,
    totalValue,
    lowStock: store.products.filter((p) => p.stock < 10).length
  };
};
