/**
 * Q&A Dataset - Pre-built knowledge base cho chatbot
 * Không cần gọi Gemini API, lookup từ dataset này để trả lời
 * Được thiết kế để cover tất cả các trường hợp query có thể xảy ra
 */

export type QAIntent = "greeting" | "compare" | "build" | "support" | "recommendation" | "general";
export type QAAgent = "advisor" | "compare" | "build" | "support";

export interface QARecord {
  id: string;
  questions: string[]; // Multiple phrasings of same question
  answer: string;
  intent: QAIntent;
  agent: QAAgent;
  tags: string[];
  category?: string;
  relatedProducts?: string[]; // Product IDs
  priority?: number; // Matching priority (higher = match more likely)
}

export const QA_DATASET: QARecord[] = [
  // ==================== GREETING ====================
  {
    id: "qa-greeting-1",
    questions: [
      "xin chào",
      "chào",
      "hello",
      "hi",
      "chào bạn",
      "chào mừng",
      "tôi là ai",
    ],
    answer:
      "👋 Xin chào! Mình là PC Advisor Bot. Mình giúp bạn tư vấn cấu hình PC, so sánh linh kiện, hoặc trả lời câu hỏi về bảo hành & kỹ thuật.\n\nBạn có thể hỏi mình:\n- 🎮 Build PC gaming 15 triệu → mình sẽ gợi ý cấu hình tối ưu\n- ⚙️ i7 hay Ryzen 7 tốt hơn? → mình so sánh chi tiết\n- 💰 Có nên upgrade GPU không? → mình tư vấn\n- 🔧 Bảo hành, giao hàng như thế nào? → mình hỗ trợ\n\nBạn muốn hỏi gì?",
    intent: "greeting",
    agent: "advisor",
    tags: ["greeting", "intro"],
  },

  // ==================== CPU COMPARISON ====================
  {
    id: "qa-cpu-compare-1",
    questions: [
      "intel hay amd tốt hơn cho gaming?",
      "nên chọn intel hay amd?",
      "cpu nào tốt nhất gaming?",
      "intel vs amd so sánh",
      "i7 hay ryzen 7 tốt hơn?",
    ],
    answer:
      "🎯 **Kết luận nhanh:**\n- **Gaming thuần FPS**: AMD Ryzen 7 7800X3D thắng nhờ V-Cache 96MB, nhanh hơn i9-14900K 10-20% trong game\n- **Gaming + Streaming**: Intel i9-14900K (24C/32T) + i7-14700K (20C/28T) tốt hơn vì nhiều nhân\n- **Budget (<10 triệu)**: Intel i5-14400F = best value, game FHD 60fps+ mượt mà\n- **Work + Gaming**: AMD Ryzen 7 7800X3D (9 triệu) hay i7-14700K (9.5 triệu) đều tốt\n\n**Bảng so sánh nhanh:**\n| Gaming FPS | Multi-task | Value | Ép Xung |\n|--|--|--|--|\n| 7800X3D 🥇 | 14900K 🥇 | 14400F 🥇 | 14900K 🥇 |\n| 14900K 🥈 | 14700K 🥈 | 5600 🥈 | 14700K 🥈 |\n| 14700K 🥉 | 7950X 🥉 | 7600X 🥉 | 7600X 🥉 |\n\n**Chi tiết từng trường hợp bạn đặc biệt quan tâm không?**",
    intent: "compare",
    agent: "compare",
    tags: ["cpu", "so sánh", "intel", "amd", "gaming"],
    priority: 10,
  },

  {
    id: "qa-cpu-compare-2",
    questions: [
      "nên mua i5-14400f hay ryzen 5 5600?",
      "i5-14400f vs ryzen 5 5600 so sánh",
      "14400f hay 5600 tốt hơn?",
    ],
    answer:
      "💪 **So sánh i5-14400F vs Ryzen 5 5600:**\n\n| Tiêu chí | i5-14400F | Ryzen 5 5600 |\n|--|--|--|\n| **Nhân/Luồng** | 10C/16T | 6C/12T |\n| **Tốc độ** | 2.5-5.2GHz | 3.5-4.6GHz |\n| **Gaming FPS** | Hơn 3-5% | Ổn định |\n| **Giá** | 3.8 triệu | 2.5 triệu |\n| **Board hỗ trợ** | B660, Z790 | B550, X570 |\n| **DDR hỗ trợ** | DDR4/DDR5 | DDR4 only |\n| **Tương lai** | 👍 Socket còn hỗ trợ | ⚠️ AM4 sắp phased out |\n\n**Khuyến nghị:**\n- **Lấy i5-14400F nếu**: Budget cho board + DDR5 (tháng 6/2025 DDR5 rẻ hơn)\n- **Lấy Ryzen 5 5600 nếu**: Chỉ gaming, tiết kiệm ngay (B550 rẻ, DDR4 rẻ)\n\n**Gaming FPS**: Cả 2 chơi FHD 60fps+ mượt. Ryzen 5600 cũng đủ tốt, rẻ hơn 1 triệu!",
    intent: "compare",
    agent: "compare",
    tags: ["cpu", "i5-14400f", "ryzen 5 5600", "so sánh", "budget"],
  },

  {
    id: "qa-cpu-compare-3",
    questions: [
      "v-cache là gì? tại sao 7800x3d mạnh?",
      "3d v-cache của amd tốt như thế nào?",
      "v-cache giúp gì trong gaming?",
    ],
    answer:
      "🚀 **V-Cache là gì?**\n\n**Khái niệm:**\n- V-Cache = công nghệ xếp chồng thêm lớp cache lên CPU bằng 3D stacking\n- Ryzen 7 7800X3D có **96MB L3 cache** (64MB V-Cache + 32MB gốc) vs 32MB thường\n- Cache càng lớn → CPU tìm data nhanh → ít phải xuống RAM → FPS cao hơn\n\n**Tại sao gaming hưởng lợi?**\n- Game engine access dữ liệu lặp đi lặp lại (texture, shader, model)\n- Cache lớn = hit rate cao = data sẵn sàng ngay = FPS tăng 10-25%\n- Không cần boost clock cao, chỉ nhờ cache lớn mà FPS bằng i9-14900K\n\n**Kết quả thực tế:**\n- **Valorant, CS2**: 7800X3D 350fps vs 14900K 280fps ✅\n- **Cyberpunk 2077 1440p**: 7800X3D 90fps vs 14900K 75fps ✅\n- **Work/Rendering**: 14900K hơn vì nhiều nhân (V-Cache không giúp)\n\n**Kết luận:** Nếu chỉ gaming FPS → 7800X3D = best choice. Nếu gaming + work → i9-14900K hơn.",
    intent: "general",
    agent: "advisor",
    tags: ["cpu", "v-cache", "7800x3d", "cache", "gaming", "technology"],
    relatedProducts: ["cpu-r7-7800x3d"],
  },

  {
    id: "qa-cpu-compare-4",
    questions: [
      "i9-14900k hay i9-14900kf nên chọn cái nào?",
      "i9-14900k vs 14900kf khác gì?",
      "k hay kf của intel tốt hơn?",
    ],
    answer:
      "🎯 **i9-14900K vs i9-14900KF:**\n\n| Điểm | 14900K | 14900KF |\n|--|--|--|\n| **Giá** | 15 triệu | 14.5 triệu |\n| **iGPU** | UHD 770 ✅ | Không ❌ |\n| **Chênh giá** | Baseline | -500k |\n| **Gaming FPS** | Như nhau 🟰 | Như nhau 🟰 |\n| **Lúc GPU hỏng** | Dự phòng ✅ | Phải sửa ❌ |\n\n**Kết luận:**\n- **Lấy 14900K nếu**: Có GPU rời + muốn iGPU làm dự phòng/troubleshooting\n- **Lấy 14900KF nếu**: Tiết kiệm 500k, đã chắc chắn xài GPU rời\n\n**Hầu hết gamer chọn KF** để tiết kiệm, vì cần GPU rời chơi game anyway.",
    intent: "compare",
    agent: "compare",
    tags: ["cpu", "i9-14900k", "i9-14900kf", "so sánh", "igpu"],
  },

  // ==================== PC BUILD ====================
  {
    id: "qa-build-8m",
    questions: [
      "build pc gaming 8 triệu",
      "cấu hình pc 8 triệu",
      "pc chơi game 8 triệu",
      "build pc 8tr cho gaming",
    ],
    answer:
      "💻 **PC Gaming 8 Triệu - Entry eSports**\n\n**Cấu hình tối ưu:**\n- 🔧 **CPU**: Intel i3-12100F (4C/8T, 2.3 triệu)\n- 🎮 **GPU**: NVIDIA GTX 1650 4GB (1.5 triệu)\n- 🖥️ **Board**: Gigabyte B660M DDR4 (900k)\n- 🎛️ **RAM**: 8GB DDR4-3200 (600k)\n- 💾 **SSD**: Kingston NV2 500GB (400k)\n- ⚡ **PSU**: Thermaltake Smart 600W (600k)\n- 🏠 **Case**: Phanteks Eclipse G360A (800k)\n- ❄️ **Cooler**: Box Intel (có sẵn)\n\n**Hiệu năng:**\n- ✅ Valorant, CS2, LOL: 100-144fps FHD\n- ✅ Minecraft: 100+ fps\n- ✅ Fortnite: 60-80fps Medium\n- ❌ AAA mới: Chỉ Low-Medium\n\n**Nâng cấp sau 1 năm:** GTX 1650 → RTX 4060 (thêm 3-4 triệu) → FHD Ultra ngon!\n\n**Bạn có thích config này hay muốn tăng lên 10-12 triệu để chơi AAA tốt hơn?**",
    intent: "build",
    agent: "build",
    tags: ["build", "8 triệu", "entry gaming", "esports"],
    relatedProducts: ["cpu-i3-12100f", "gpu-gtx-1650"],
    priority: 9,
  },

  {
    id: "qa-build-12m",
    questions: [
      "build pc 12 triệu chơi game",
      "cấu hình pc 12 triệu",
      "pc gaming 12 triệu",
      "pc 12tr",
    ],
    answer:
      "💪 **PC Gaming 12 Triệu - FHD All Games High-Ultra**\n\n**Cấu hình recommended:**\n- 🔧 **CPU**: Intel i5-12400F (3.8 triệu) hoặc Ryzen 5 5600 (2.5 triệu)\n- 🎮 **GPU**: AMD RX 7600 8GB (2.8 triệu) hoặc RTX 4060 (3 triệu)\n- 🖥️ **Board**: MSI B660M-A WiFi DDR4 (1 triệu)\n- 🎛️ **RAM**: 16GB DDR4-3200 2x8 (1 triệu)\n- 💾 **SSD**: WD Black SN770 1TB (800k)\n- ⚡ **PSU**: Corsair CV650 Bronze (1 triệu)\n- 🏠 **Case**: Corsair 4000D Airflow (800k)\n- ❄️ **Cooler**: Thermalright PA120 SE (400k)\n\n**Hiệu năng:**\n- ✅ Mọi game FHD High-Ultra 60fps+\n- ✅ Cyberpunk 2077: 55-70fps Medium-High\n- ✅ Baldur's Gate 3: 70-90fps High\n- ✅ Streaming + Gaming: Ổn\n\n**Tầm hot nhất:**\nTàm 12 triệu là **best value 2024** - chơi được mọi game FHD + chát lựu!\n\n**Bạn muốn tôi giải thích chi tiết từng linh kiện không?**",
    intent: "build",
    agent: "build",
    tags: ["build", "12 triệu", "fhd", "all games", "best value"],
    relatedProducts: ["cpu-i5-12400f", "gpu-rx-7600"],
    priority: 10,
  },

  {
    id: "qa-build-15m",
    questions: [
      "build pc 15 triệu",
      "cấu hình pc 15 triệu gaming",
      "pc gaming 15 triệu mạnh cỡ nào",
    ],
    answer:
      "🔥 **PC Gaming 15 Triệu - RTX 4060 Gaming Mạnh**\n\n**Cấu hình optimized:**\n- 🔧 **CPU**: AMD Ryzen 5 5600 (2.5 triệu) hoặc i5-13400F (3.2 triệu)\n- 🎮 **GPU**: NVIDIA RTX 4060 8GB (3.5 triệu) ← bộ não\n- 🖥️ **Board**: MSI MAG B550 TOMAHAWK (1.5 triệu)\n- 🎛️ **RAM**: 16GB DDR4-3600 2x8 (1.2 triệu)\n- 💾 **SSD**: WD Black SN770 1TB (800k)\n- ⚡ **PSU**: Corsair RM650e 650W Gold (1.5 triệu)\n- 🏠 **Case**: NZXT H5 Flow (900k)\n- ❄️ **Cooler**: DeepCool AK400 (300k)\n\n**Hiệu năng (thực tế benchmark):**\n- ✅ **FHD**: Mọi game Ultra 60-100fps\n- ✅ **Cyberpunk 2077**: 75-85fps High + DLSS 3\n- ✅ **Baldur's Gate 3**: 80-90fps High\n- ✅ **Ray Tracing**: OK Medium\n- 🎯 **DLSS 3**: Chơi được, FPS tăng 40-50%\n\n**RTX 4060 là bực máu:** Cực mạnh ở tầm giá 15 triệu, ngang ngửa RTX 3070 cũ!\n\n**Nâng cấp tương lai:** Giữ nguyên GPU 3-4 năm, sau đó upgrade CPU + Board.\n\n**Muốn xem config 17-20 triệu cho 1440p không?**",
    intent: "build",
    agent: "build",
    tags: ["build", "15 triệu", "rtx 4060", "dlss 3", "ray tracing"],
    relatedProducts: ["cpu-r5-5600", "gpu-rtx-4060"],
    priority: 8,
  },

  {
    id: "qa-build-20m",
    questions: [
      "build pc 20 triệu",
      "cấu hình pc 20 triệu mạnh cỡ nào",
      "pc gaming 20 triệu 1440p",
    ],
    answer:
      "⚡ **PC Gaming 20 Triệu - 1440p High-Ultra + Streaming**\n\n**Cấu hình tối ưu:**\n- 🔧 **CPU**: Intel i7-14700K (9.5 triệu) ← Streaming + Gaming\n- 🎮 **GPU**: NVIDIA RTX 4070 12GB (6.5 triệu) ← Vua 1440p\n- 🖥️ **Board**: MSI MAG Z790 TOMAHAWK WiFi (2 triệu)\n- 🎛️ **RAM**: 32GB DDR5-5600 2x16 (2 triệu)\n- 💾 **SSD**: WD Black SN770 2TB (1.3 triệu)\n- ⚡ **PSU**: Corsair RM750e 750W Gold (1.8 triệu)\n- 🏠 **Case**: Lian Li Lancool II Mesh (1 triệu)\n- ❄️ **Cooler**: Thermalright PA120 SE (400k)\n- 🌡️ **AIO**: NZXT Kraken Z63 280mm (1 triệu) ← Optional\n\n**Hiệu năng:**\n- ✅ **1440p**: Mọi game High-Ultra 60-100fps\n- ✅ **Cyberpunk 2077**: 85-100fps High + Ray Tracing\n- ✅ **4K**: Medium settings 40-60fps OK\n- ✅ **Streaming**: OBS RTX encoding, game 1440p 100fps + 1080p stream 60fps cùng lúc\n- 🎯 **Future-proof**: DDR5, PCIe 5.0, socket lâu dài\n\n**Lưu ý:**\n- RTX 4070 không xứng đáng với i9-14900K (bottleneck) → i7-14700K vừa đủ\n- DDR5 tên bây giờ rẻ → 1 năm sau rẻ hơn 30-40%\n- Config này dùng được 4-5 năm không lo\n\n**Bạn định streaming hay chỉ gaming?** (Sẽ impact chọn CPU/RAM)",
    intent: "build",
    agent: "build",
    tags: ["build", "20 triệu", "1440p", "rtx 4070", "i7-14700k", "streaming"],
    relatedProducts: ["cpu-i7-14700k", "gpu-rtx-4070"],
    priority: 8,
  },

  // ==================== RECOMMENDATIONS ====================
  {
    id: "qa-recommend-1",
    questions: [
      "nên upgrade cpu hay gpu?",
      "upgrade cpu trước hay gpu?",
      "có nên nâng cấp gpu?",
    ],
    answer:
      "🎯 **Upgrade CPU hay GPU trước? Hướng dẫn chi tiết:**\n\n**Kiểm tra bottleneck đơn giản:**\n1. Chơi game yêu thích → mở **MSI Afterburner**\n2. Xem **GPU Usage** vs **CPU Usage**\n   - GPU < 85%: CPU bottleneck → **Nâng CPU trước**\n   - GPU 95-100%: GPU bottleneck → **Nâng GPU trước**\n   - Cân bằng: Upgrade cùng lúc OK, nhưng priority GPU\n\n**Heuristic đơn giản:**\n| GPU | Nâng CPU | Nâng GPU |\n|--|--|--|\n| RTX 4090 | ⚠️ URGENT | - |\n| RTX 4080 | Nên | Cân nhắc |\n| RTX 4070 | OK | Xem FPS |\n| RTX 4060 | Sau | Trước |\n| GTX 1650 | Sau | URGENT |\n\n**Quy tắc ngón tay:**\n- GPU cũ (>2 năm): **Nâng GPU** (FPS tăng 40-60%)\n- CPU cũ (>2 năm): **Nâng CPU** (FPS tăng 15-30%)\n- Budget < 2 triệu: **GPU** hưởng lợi hơn\n- Budget > 5 triệu: **CPU + GPU cùng** là tối ưu\n\n**Ví dụ:**\n- RTX 1660 + i7-12700K → **Upgrade GPU** (RTX 4060)\n- RTX 4070 + i5-12400F → **Upgrade CPU** (i7-14700K)\n- RTX 3080 + i5-10400 → **Cân nhắc upgrade cả 2** hoặc CPU trước\n\n**Bạn setup hiện tại như thế nào? Mình tư vấn cụ thể!**",
    intent: "recommendation",
    agent: "advisor",
    tags: ["upgrade", "cpu", "gpu", "bottleneck", "tư vấn"],
    priority: 8,
  },

  {
    id: "qa-recommend-2",
    questions: [
      "nên chọn loại gpu nào cho gaming?",
      "gpu nào tốt cho gaming?",
      "rtx hay radeon tốt hơn?",
    ],
    answer:
      "🎮 **Chọn GPU cho Gaming 2024:**\n\n**RTX vs Radeon so sánh nhanh:**\n| Tiêu chí | RTX | Radeon |\n|--|--|--|\n| **Driver** | Stable ✅ | Ổn định ✅ |\n| **DLSS 3** | Có ✅ | Không ❌ |\n| **Ray Tracing** | Cực mạnh | OK |\n| **Encode** | Tốt (NVENC) | OK (VCE) |\n| **Giá** | Chuẩn | Rẻ hơn 10-15% |\n| **Thị trường** | Nhiều driver | Ít support |\n\n**GPU tầm giá (2024):**\n| Tầm giá | RTX | Radeon | FPS 1440p |\n|--|--|--|--|\n| **3tr** | RTX 4050 ⚠️ | RX 7600 ✅ | FHD |\n| **3.5tr** | RTX 4060 ✅ | RX 7700 XT ✅ | FHD |\n| **5.5tr** | RTX 4070 ✅ | RX 7800 XT ✅ | 1440p |\n| **7.5tr** | RTX 4080 ✅ | RX 7900 XT ✅ | 1440p+ |\n| **12tr** | RTX 4090 ⚠️ | RX 7900 XTX ✅ | 4K |\n\n**Khuyến nghị:**\n- **Gaming FPS**: RTX 4060 (DLSS 3 ngon)\n- **Giá rẻ**: RX 7600 (rẻ 300k, FPS bằng)\n- **Streaming**: RTX (NVENC tốt)\n- **Content Creator**: RTX (CUDA hỗ trợ nhiều software)\n- **Ép xung**: Radeon ổn, RTX hơi hạn chế\n\n**GPU hiện nay bạn có? Mình giúp tìm nâng cấp phù hợp!**",
    intent: "recommendation",
    agent: "advisor",
    tags: ["gpu", "rtx", "radeon", "so sánh", "lựa chọn", "gaming"],
  },

  // ==================== SUPPORT / FAQ ====================
  {
    id: "qa-support-warranty",
    questions: [
      "bảo hành bao lâu?",
      "sản phẩm có bảo hành không?",
      "warranty cpu gpu bao lâu?",
      "bảo hành linh kiện",
      "hết bảo hành sửa chữa thế nào?",
    ],
    answer:
      "🛡️ **Chính sách bảo hành:**\n\n**Thời gian bảo hành:**\n- **CPU**: 36 tháng (3 năm) từ ngày mua\n- **GPU**: 24 tháng (2 năm) từ ngày mua\n- **Mainboard**: 36 tháng (3 năm)\n- **RAM**: 36-60 tháng (tùy hãng)\n- **SSD/HDD**: 36-60 tháng\n- **PSU**: 36-60 tháng\n- **Case**: 12-24 tháng\n\n**Các trường hợp bảo hành:**\n✅ Được bảo hành:\n- Lỗi kỹ thuật từ nhà sản xuất\n- Hỏng do lão hóa linh kiện\n- Hỏng quạt, không khởi động\n\n❌ KHÔNG bảo hành:\n- Hỏng do sơ suất (dropped, water damage)\n- Hỏng do ép xung quá mức\n- Phong ba hết\n- Mất serial number\n\n**Hết bảo hành sửa chữa?**\n- 📞 Liên hệ cửa hàng → sửa lẻ (200k-1 triệu tùy linh kiện)\n- Hoặc thay linh kiện mới (thường rẻ hơn sửa)\n\n**Lưu ý quan trọng:**\n- ⚠️ Giữ hóa đơn + phiếu bảo hành\n- ⚠️ Không tháo ra sửa tại nhà (mất bảo hành)\n- ⚠️ Liên hệ cửa hàng trước khi sửa\n\n**Bạn có vấn đề gì với linh kiện không? Mình giúp xác định bảo hành!**",
    intent: "support",
    agent: "support",
    tags: ["bảo hành", "warranty", "hỗ trợ", "support"],
    priority: 8,
  },

  {
    id: "qa-support-shipping",
    questions: [
      "giao hàng mất bao lâu?",
      "phí ship bao nhiêu?",
      "miễn phí giao hàng?",
      "giao hàng có an toàn không?",
      "hàng hỏng khi nhận làm sao?",
    ],
    answer:
      "🚚 **Chính sách giao hàng:**\n\n**Phí giao hàng:**\n- **Đơn ≥ 2,000,000đ**: **MIỄN PHÍ** 🎁\n- **Đơn 1-2,000,000đ**: 30,000đ\n- **Đơn < 1,000,000đ**: 50,000đ\n- **Ngoại thành**: Cộng thêm 20-50k\n\n**Thời gian giao hàng:**\n- **TP HCM**: 1-2 ngày (sau khi xác nhận)\n- **Hà Nội**: 2-3 ngày\n- **Tỉnh khác**: 3-5 ngày\n- **Ngoại thành xa**: 5-7 ngày\n\n**Bảo đảm an toàn:**\n✅ Đóng gói cẩn thận (bubble wrap, carton cứng)\n✅ Bảo hiểm 100% giá sản phẩm\n✅ Kiểm tra hàng trước khi giao\n✅ Video unboxing (tuỳ chọn)\n\n**Hàng hỏng/mất khi nhận?**\n1. 📸 Chụp ảnh ngay, không mở hàng\n2. 📞 Gọi cửa hàng trong 24h\n3. 🚐 Giao hàng lại miễn phí hoặc refund 100%\n4. ✅ Xử lý xong trong 3-5 ngày\n\n**Các hình thức nhận hàng:**\n- 📦 Ship COD (trả tiền khi nhận)\n- 💳 Transfer trước + ship (rẻ hơn 10k)\n- 🏪 Nhận tại cửa hàng\n\n**Bạn muốn đặt hàng không? Mình giúp tư vấn cấu hình + giao hàng!**",
    intent: "support",
    agent: "support",
    tags: ["giao hàng", "shipping", "phí ship", "miễn phí", "support"],
    priority: 7,
  },

  {
    id: "qa-support-compatibility",
    questions: [
      "cpu mainboard tương thích không?",
      "socket cpu khác nhau sao?",
      "am4 am5 lga1700 là gì?",
      "cpu này tương thích board này không?",
      "kiểm tra tương thích linh kiện",
    ],
    answer:
      "🔌 **Tương thích CPU & Mainboard - Guide Đầy Đủ:**\n\n**Socket CPU chính 2024:**\n| Socket | Thế hệ CPU | Hỗ trợ RAM | Hết support | Giá board |\n|--|--|--|--|--|\n| **LGA1700** | Intel Gen 12-14 | DDR4/5 | 2025+ | 1-2tr |\n| **AM5** | AMD Ryzen 7000 | DDR5 only | 2025+ | 1.5-2.5tr |\n| **AM4** | AMD Ryzen 3000-5000 | DDR4 | 2024 | 0.7-1.5tr |\n| **sTRX40** | AMD Ryzen Threadripper | DDR4 | EOL | 2-4tr |\n\n**Cách chọn CPU & Board tương thích:**\n\n✅ **Intel i5-14400F**:\n- ✓ Socket: LGA 1700\n- ✓ Board: B660, B760, Z690, Z790 (tất cả DDR4 hoặc DDR5)\n- ❌ Board cũ: H610, Z590 (lỗi thời)\n\n✅ **AMD Ryzen 5 5600**:\n- ✓ Socket: AM4\n- ✓ Board: B450, B550, X470, X570 (tất cả DDR4)\n- ✓ BIOS cần update nếu board cũ\n\n✅ **AMD Ryzen 7 7800X3D**:\n- ✓ Socket: AM5\n- ✓ Board: B650, X670, B850, X870 (tất cả DDR5 only)\n- ❌ Không support DDR4\n\n**Kiểm tra trước mua:**\n1. Xem Socket của CPU (LGA1700, AM5, AM4)\n2. Chọn Board cùng socket\n3. Xem RAM hỗ trợ (DDR4 vs DDR5)\n4. Đảm bảo BIOS hỗ trợ thế hệ CPU mới\n\n**Bạn chưa chắc cấu hình nào tương thích? Cho mình biết CPU + Board, mình check!**",
    intent: "support",
    agent: "support",
    tags: ["tương thích", "socket", "compatibility", "cpu", "mainboard", "support"],
    priority: 9,
  },

  {
    id: "qa-support-psu",
    questions: [
      "psu bao nhiêu w là đủ?",
      "tính toán công suất psu",
      "nguon máy tính bao nhiêu w",
      "psu 600w có đủ không?",
      "i7 + rtx 4070 cần psu bao nhiêu?",
    ],
    answer:
      "⚡ **Tính toán công suất PSU (Power Supply Unit):**\n\n**TDP (Thermal Design Power) của linh kiện:**\n| Thành phần | TDP |\n|--|--|\n| **CPU** |\n| i3-12100F | 65W |\n| i5-14400F | 65W |\n| i7-14700K | 125W |\n| i9-14900K | 125W |\n| R5 5600 | 65W |\n| R7 7800X3D | 105W |\n| **GPU** |\n| GTX 1650 | 75W |\n| RX 7600 | 190W |\n| RTX 4060 | 130W |\n| RTX 4070 | 200W |\n| RTX 4090 | 450W |\n\n**Công thức tính PSU:**\n```\nPSU cần = (CPU TDP + GPU TDP) × 1.3 + Overhead (±50W)\n```\n\n**Ví dụ tính toán:**\n- **i5-14400F + RTX 4060**: (65 + 130) × 1.3 + 50 = **305W** → PSU 550W OK ✅\n- **i7-14700K + RTX 4070**: (125 + 200) × 1.3 + 50 = **525W** → PSU 650W cần ✅\n- **i9-14900K + RTX 4090**: (125 + 450) × 1.3 + 50 = **800W** → PSU 850-1000W ✅\n\n**Khuyến nghị PSU theo config:**\n| Cấu hình | PSU |\n|--|--|\n| Gaming 8 triệu | 500-600W Bronze |\n| Gaming 12 triệu | 600-650W Bronze/Gold |\n| Gaming 15-17 triệu | 650-750W Gold |\n| Gaming 20+ triệu | 750-850W Gold/Platinum |\n| Workstation 4CPU | 1200W+ |\n\n**Lưu ý quan trọng:**\n⚠️ Không chọn PSU vừa đủ → chọn thêm 20% buffer\n⚠️ PSU 80+ Gold tốt hơn (ít hao điện)\n⚠️ PSU cũ (>3 năm) → kiểm tra dung lượng còn lại\n\n**Bạn build pc nào? Mình tính PSU chính xác!**",
    intent: "support",
    agent: "support",
    tags: ["psu", "công suất", "tdp", "power supply", "tính toán", "support"],
    priority: 8,
  },

  // ==================== GENERAL QUESTIONS ====================
  {
    id: "qa-general-1",
    questions: [
      "nên mua pc hay upgrade pc cũ?",
      "mình có nên xây mới pc không?",
      "thay thế toàn bộ hay nâng cấp từng phần?",
    ],
    answer:
      "🔄 **Nên mua PC mới hay upgrade PC cũ?**\n\n**So sánh nhanh:**\n| Tiêu chí | Mua mới | Upgrade |\n|--|--|--|\n| **Chi phí** | 10-20tr | 2-8tr |\n| **Thời gian** | 1 ngày | 1-2 tiếng |\n| **Bảo hành** | 3 năm | 1-2 năm |\n| **Support** | Tốt | Ổn |\n| **Tương lai** | Modern tech | Sẽ lại hỏng |\n\n**Nên mua mới khi:**\n✅ PC > 4 năm tuổi\n✅ Mainboard hỏng/lỗi\n✅ Hết bảo hành tất cả linh kiện\n✅ Muốn platform mới (DDR5, PCIe 5.0)\n✅ Budget > 12 triệu\n\n**Nên upgrade khi:**\n✅ CPU/GPU vẫn hoạt động OK\n✅ Board/PSU còn khỏe\n✅ Chỉ muốn nâng FPS 20-30%\n✅ Budget < 5 triệu\n✅ PC 1-2 năm tuổi\n\n**Ví dụ:**\n- **i5-9400 + GTX 1060** (6 tuổi) → **Mua mới** (hết platform)\n- **i7-12700K + RTX 3070** (2 tuổi) → **Upgrade GPU** (RTX 4070)\n- **R5 5600 + RX 6700XT** (3 tuổi) → **Upgrade GPU** (RX 7800XT)\n\n**PC hiện tại bạn bao nhiêu tuổi? Mình tư vấn nên mua hay upgrade!**",
    intent: "general",
    agent: "advisor",
    tags: ["tư vấn", "mua mới", "upgrade", "quyết định"],
  },

  {
    id: "qa-general-2",
    questions: [
      "pc chơi game bao nhiêu tiền?",
      "budget bao nhiêu là vừa?",
      "nên chi bao nhiêu tiền cho pc gaming?",
    ],
    answer:
      "💰 **Bao nhiêu tiền là vừa cho PC Gaming?**\n\n**Bảng giá tham khảo:**\n| Mục đích | Ngân sách | Chơi được | Ưu điểm |\n|--|--|--|--|\n| **Esports** | 8-10tr | Valorant, CS2, LOL FHD 100+ fps | Rẻ, entry |\n| **FHD Gaming** | 12-15tr | AAA games FHD High 60+ fps | Best value, phổ biến |\n| **FHD + Streaming** | 15-18tr | FHD Ultra + stream 1080p 60fps | Đa nhiệm |\n| **1440p Gaming** | 18-22tr | AAA 1440p High 60-90fps | Beautiful, mượt |\n| **4K Gaming** | 25-35tr | 4K Medium 60fps, 1440p Ultra | Overkill, hiếm ai |\n\n**Khuyến nghị theo mục đích:**\n- 🎮 **Chỉ gaming esports**: 10-12 triệu (i5 + RX 6600)\n- 🎮 **Gaming casual**: 12-15 triệu (i5 + RTX 4060) ← MOST POPULAR\n- 🎮 **Gaming hardcore + streaming**: 18-20 triệu (i7 + RTX 4070)\n- 🎮 **Creator/professional**: 25-30 triệu (i9/R9 + RTX 4070 Ti)\n\n**Lưu ý quan trọng:**\n- ⚠️ Tầm **12-15 triệu** là **tối ưu 2024** (không quá đắt, không quá rẻ)\n- ⚠️ Không nên chi quá 50% ngân sách cho GPU\n- ⚠️ Để dự phòng 2-3 triệu cho nâng cấp sau\n\n**Ưu tiên chi tiêu:**\n1. 🎮 GPU: 35-40% (vì FPS phụ thuộc GPU)\n2. 🔧 CPU: 25-30%\n3. 🖥️ Board + RAM: 20%\n4. ⚡ PSU + Case + Cooler: 15%\n\n**Bạn có ngân sách bao nhiêu? Mình giúp lên cấu hình tối ưu!**",
    intent: "general",
    agent: "advisor",
    tags: ["budget", "giá cả", "tư vấn", "ngân sách"],
    priority: 8,
  },

  {
    id: "qa-general-3",
    questions: [
      "pc gaming bao nhiêu tuổi thì nâng cấp?",
      "bao lâu nên upgrade cpu?",
      "thay linh kiện bao lâu?",
    ],
    answer:
      "⏰ **Bao lâu nên nâng cấp PC?**\n\n**Chu kỳ nâng cấp theo linh kiện:**\n| Linh kiện | Tuổi thọ | Nâng cấp khi |\n|--|--|--|\n| **GPU** | 4-5 năm | Sau 3 năm nếu muốn FPS cao |\n| **CPU** | 5-6 năm | Sau 4 năm nếu muốn performance |\n| **Mainboard** | 6-7 năm | Hiếm hỏng, nâng khi thay CPU |\n| **RAM** | 8-10 năm | Rất hiếm hỏng |\n| **PSU** | 5-7 năm | Kiểm tra dung lượng/hiệu năng |\n| **Case** | 10+ năm | Không cần nâng |\n| **Storage** | 5-6 năm | SSD hiếm hỏng, HDD kiểm tra |\n\n**Timeline nâng cấp chi tiết:**\n\n**Năm 0-2:** Không nâng (PC còn mới, FPS OK)\n**Năm 2-3:** Nâng GPU nếu muốn 30% FPS tăng thêm\n**Năm 3-4:** Nâng GPU + CPU (platform có thể cũ)\n**Năm 4+:** Nâng lên platform mới (CPU + Board + RAM) hoặc mua PC mới\n\n**Ví dụ thực tế:**\n```\n2022 mua: i5-12400 + RTX 3070\n├─ 2024 (2 năm): Upgrade GPU RTX 4070 → FPS +25%\n├─ 2025 (3 năm): PC vẫn OK, không cần nâng\n└─ 2026 (4 năm): CPU cũ, nâng CPU + Board\n```\n\n**Quy tắc ngón tay:**\n- 🎮 Gaming casual: Nâng GPU mỗi 3 năm\n- 🎮 Gaming enthusiast: Nâng GPU 2 năm 1 lần\n- 💪 Creator: Upgrade mỗi năm (video, rendering)\n- 📊 Khách hàng: Mua mới mỗi 4 năm\n\n**PC hiện tại bao nhiêu tuổi? Mình xem có cần nâng không!**",
    intent: "general",
    agent: "advisor",
    tags: ["upgrade cycle", "thay linh kiện", "tuổi thọ", "tư vấn"],
  },

  {
    id: "qa-general-4",
    questions: [
      "cách bảo quản pc gaming",
      "vệ sinh máy tính",
      "quạt máy bảo dưỡng thế nào?",
      "máy tính nóng làm sao?",
    ],
    answer:
      "🧹 **Bảo quản & Vệ sinh PC Gaming - Guide Đầy Đủ:**\n\n**Vệ sinh định kỳ:**\n| Tần suất | Công việc | Công cụ |\n|--|--|--|\n| **Hàng tuần** | Lau màn hình | Khăn mềm |\n| **Hàng tháng** | Vệ sinh case (bụi) | Quạt khí nén |\n| **Mỗi 3 tháng** | Thay đệm khí | N/A |\n| **Mỗi 6 tháng** | Vệ sinh quạt + tản nhiệt | Khí nén + tẩu |\n| **Mỗi 12 tháng** | Thay keo tản nhiệt CPU | Keo tản nhiệt mới |\n\n**Cách vệ sinh chi tiết:**\n1. 🔌 Tắt máy + rút điện 5 phút\n2. 🪟 Dùng khí nén thổi bụi từ bên trong case ra ngoài\n3. 🧹 Lau tản nhiệt CPU, quạt với khăn dry cloth\n4. 🌡️ Check nhiệt độ sau khi vệ sinh → giảm 5-10°C\n\n**Cách giữ máy mát:**\n✅ Để máy ở nơi thoáng mát (20-24°C)\n✅ Case cần 2 quạt đều: 1 quạt intake (trước), 1 quạt exhaust (sau)\n✅ Không che chắn cảng hút hơi của case\n✅ Máy 10+ tiếng/ngày → đầu tư AIO cooler\n✅ Ép xung → bắt buộc tắt + keo tản nhiệt tốt\n\n**Nhiệt độ an toàn:**\n| Linh kiện | Idle | Load | Max |\n|--|--|--|--|\n| **CPU** | 30-40°C | 60-75°C | <85°C |\n| **GPU** | 30-50°C | 70-80°C | <90°C |\n| **HDD** | <40°C | <45°C | <55°C |\n\n**Nếu máy quá nóng:**\n1. Vệ sinh bụi (giảm 5°C)\n2. Thay keo tản nhiệt CPU (giảm 10-15°C)\n3. Tăng tốc độ quạt (hơi ồn)\n4. Nâng cấp cooler (AIO hoặc air tower mạnh)\n\n**Lưu ý lưu trữ:**\n- 🌧️ Nơi khô ráo (15-25°C, <60% độ ẩm)\n- 🎒 Tránh ánh sáng trực tiếp\n- 🪫 Bảo quản lâu → bật máy 1-2 tuần 1 lần\n- 🔋 Bảo quản quạt riêng: túi dứa khô, nơi tối\n\n**Máy tính bạn nhiệt độ bao nhiêu? Có cần vệ sinh không?**",
    intent: "general",
    agent: "advisor",
    tags: ["bảo quản", "vệ sinh", "tản nhiệt", "maintenance"],
  },

  // ==================== PRODUCT SPECIFIC ====================
  {
    id: "qa-product-ram",
    questions: [
      "ddr4 hay ddr5 nên chọn?",
      "ram 8gb hay 16gb?",
      "32gb ram cần thiết không?",
      "tốc độ ram ảnh hưởng fps?",
    ],
    answer:
      "🎛️ **RAM - DDR4 vs DDR5, Dung lượng & Tốc độ:**\n\n**DDR4 vs DDR5:**\n| Tiêu chí | DDR4 | DDR5 |\n|--|--|--|\n| **Giá** | 700-800k | 1.2-1.5tr |\n| **Socket** | AM4, LGA1200 | AM5, LGA1700 |\n| **Tốc độ gốc** | 3200 MHz | 4800 MHz |\n| **Gaming FPS** | Bằng nhau 🟰 | Bằng nhau 🟰 |\n| **Tương lai** | Hết support 2024 | Hỗ trợ đến 2025+ |\n| **Giá board** | Rẻ 20% | Mắc 20% |\n\n**Kết luận DDR4 vs DDR5:**\n- **DDR4**: Lựa chọn tiết kiệm 2024 (rẻ 1-2 triệu tổng setup)\n- **DDR5**: Long-term (upgrade path lâu dài)\n- **Gaming FPS**: Khác biệt < 2%, có thể bỏ qua\n\n**Dung lượng RAM:**\n| Mục đích | Dung lượng | Ghi chú |\n|--|--|--|\n| **Gaming FHD** | 16GB | Đủ, ổn định 60fps |\n| **Gaming 1440p+** | 16GB | OK, background app |\n| **Streaming** | 32GB | Khuyến nghị |\n| **Creator** | 32-64GB | Video 4K, 3D |\n| **Casual user** | 8GB | Minimum, chật nếu game AAA |\n\n**Khuyến nghị 2024:**\n- 🎮 **Gaming**: 16GB DDR4-3200 (12-15 triệu) hoặc 16GB DDR5-5600 (17-20 triệu)\n- 🎮 **Gaming + Streaming**: 32GB DDR5-5600 (20-22 triệu)\n- 💻 **Văn phòng**: 8GB DDR4-3200 hoặc DDR5 cũng OK\n\n**Tốc độ RAM ảnh hưởng FPS?**\n- DDR4-3200 vs DDR4-4000: Khác 1-2% FPS (bỏ qua)\n- DDR5-4800 vs DDR5-6000: Khác 2-5% FPS (có chút ích)\n- **Ưu tiên**: Dung lượng > tốc độ\n\n**Bạn dự định gaming hay streaming? Mình gợi ý dung lượng/tốc độ phù hợp!**",
    intent: "general",
    agent: "advisor",
    tags: ["ram", "ddr4", "ddr5", "dung lượng", "tốc độ"],
  },

  {
    id: "qa-product-ssd",
    questions: [
      "nvme hay sata ssd?",
      "ssd bao nhiêu gb là đủ?",
      "1tb hay 2tb ssd?",
      "nvme tốc độ ảnh hưởng game không?",
    ],
    answer:
      "💾 **SSD - NVME vs SATA, Dung lượng:**\n\n**NVME vs SATA SSD:**\n| Tiêu chí | NVME M.2 | SATA SSD |\n|--|--|--|\n| **Tốc độ** | 3000-7000 MB/s | 400-600 MB/s |\n| **Gaming** | Như nhau 🟰 | Như nhau 🟰 |\n| **Load game** | 2-3 phút | 2-3 phút |\n| **Boot PC** | 15s | 20s |\n| **Giá/TB** | 600-800k | 400-600k |\n| **Tiên cảnh** | Hiện đại ✅ | Lỗi thời ❌ |\n\n**Kết luận:**\n- **Gaming**: NVME vs SATA FPS khác 0% (tốc độ chỉ ảnh hưởng load time)\n- **Lựa chọn**: NVME (rẻ hơn, chuẩn 2024, M.2 gọn)\n\n**Dung lượng SSD:**\n| Dùng | 500GB | 1TB | 2TB |\n|--|--|--|--|\n| **OS + 1 game AAA** | Chật | OK | Thoải mái |\n| **OS + 3-4 games** | Hỏng | OK | Tốt |\n| **Full library (20+ games)** | - | Chật | Vừa đủ |\n| **Creator (video 4K)** | - | - | Chật |\n\n**Khuyến nghị 2024:**\n- 🎮 **Gaming**: 500GB + HDD 1TB backup = OK (4 triệu)\n- 🎮 **Gaming + Work**: 1TB NVME (6-8 triệu) ← POPULAR\n- 🎮 **Heavy gamer + Streaming**: 2TB NVME (10-12 triệu)\n- 💾 **Content creator**: 2TB + external SSD backup\n\n**Kế hoạch storage gợi ý:**\n```\nSSD 1TB: OS + 3-4 games mới\nHDD 2TB: Backup + game cũ\nExternal SSD 1TB: Backup dữ liệu quan trọng\nTổng: 4TB, chi ~10 triệu\n```\n\n**Bạn có bao nhiêu games? Mình tính dung lượng cần!**",
    intent: "general",
    agent: "advisor",
    tags: ["ssd", "nvme", "sata", "dung lượng", "storage"],
  },

  {
    id: "qa-product-cooler",
    questions: [
      "nên mua cooler gì?",
      "air cooler hay liquid cooler?",
      "cooler cpu tốt như thế nào?",
      "many tuần tật cooler pc",
    ],
    answer:
      "❄️ **CPU Cooler - Air vs Liquid, Chọn phù hợp:**\n\n**Air Cooler vs Liquid Cooler (AIO):**\n| Tiêu chí | Air | AIO Liquid |\n|--|--|--|\n| **Giá** | 300-500k | 800-1.5tr |\n| **Hiệu năng tản** | 60-70°C (load) | 50-60°C (load) |\n| **Âm thanh** | Ít ồn | Hơi ồn quạt |\n| **Bền** | 5-7 năm | 3-5 năm |\n| **Bảo trì** | 0 (dùng mãi) | Check nước 1 năm |\n| **Ép xung** | OK | Tốt hơn |\n| **Chiếm chỗ** | Ít | Nhiều |\n\n**Khuyến nghị cho CPU:**\n| CPU | Cooler | Giá |\n|--|--|--|\n| **i3-12100F (65W)** | Box cooler | 0 (có sẵn) |\n| **i5-14400F (65W)** | Air tower (Thermalright) | 400k |\n| **i7-14700K (125W)** | AIO 240/280mm | 1tr |\n| **i9-14900K (125W)** | AIO 280/360mm | 1.2-1.5tr |\n| **Ryzen 5 5600 (65W)** | Air tower hoặc box | 300-500k |\n| **Ryzen 7 7800X3D (105W)** | AIO 240mm | 900k |\n\n**Top air cooler 2024:**\n1. Thermalright PA120 SE: 400k (best value)\n2. Deepcool AK400: 300k (rẻ)\n3. Noctua NH-D15: 1tr (hơi mắc)\n\n**Top AIO cooler 2024:**\n1. NZXT Kraken Z63: 1tr (240mm, good pump)\n2. Corsair H150i Elite: 1.2tr (360mm, mạnh)\n3. MSI MAG Coreliquid E360: 900k (budget)\n\n**Lựa chọn:**\n- 💰 **Tiết kiệm**: Air cooler Thermalright 400k\n- ⚡ **Ép xung mạnh**: AIO 240-280mm 900k-1tr\n- 🔥 **Ép xung extreme**: AIO 360mm + custom loop\n\n**CPU bạn bao nhiêu watt (TDP)? Mình tư vấn cooler phù hợp!**",
    intent: "general",
    agent: "advisor",
    tags: ["cooler", "cpu cooler", "air", "liquid", "aio"],
  },

  // ==================== ADDITIONAL SUPPORT & ORDER CASES ====================
  {
    id: "qa-order-tracking",
    questions: [
      "đơn hàng của tôi đang ở đâu",
      "theo dõi đơn hàng",
      "track order",
      "tôi muốn biết trạng thái đơn hàng",
      "mã vận đơn của tôi là gì",
    ],
    answer:
      "📦 Để theo dõi đơn hàng: gửi cho mình `orderNumber` hoặc `trackingId` — mình sẽ kiểm tra trạng thái (Đang xử lý / Đã giao cho đối tác vận chuyển / Đang giao / Đã giao).\n\nNếu bạn chưa có mã, kiểm tra email xác nhận hoặc mục 'Đơn hàng' trong tài khoản.\n\nBạn muốn mình kiểm tra ngay bây giờ không?",
    intent: "support",
    agent: "support",
    tags: ["order", "tracking", "vận chuyển", "support"],
    priority: 9,
  },

  {
    id: "qa-order-cancel-refund",
    questions: [
      "hủy đơn hàng như thế nào",
      "làm sao để hủy đơn",
      "refund order",
      "hoàn tiền mất bao lâu",
      "tôi muốn trả hàng và hoàn tiền",
    ],
    answer:
      "🔁 **Hủy/Hoàn tiền**:\n- Nếu đơn chưa giao: bạn có thể hủy online trong mục 'Đơn hàng' → Yêu cầu hủy.\n- Nếu đã giao: làm thủ tục trả hàng (ghi rõ lý do).\n- **Thời gian hoàn tiền:** 3-7 ngày làm việc sau khi hàng về kho và kiểm tra.\n\nGửi cho mình `orderNumber` để mình hỗ trợ hủy/khởi tạo refund ngay nhé.",
    intent: "support",
    agent: "support",
    tags: ["order", "cancel", "refund", "support"],
    priority: 9,
  },

  {
    id: "qa-payment-methods",
    questions: [
      "thanh toán bằng cách nào",
      "hỗ trợ thanh toán trả góp không",
      "có thanh toán khi nhận hàng không",
      "payment methods",
      "thanh toán online bằng thẻ",
    ],
    answer:
      "💳 **Phương thức thanh toán:**\n- Thanh toán khi nhận hàng (COD) ✅\n- Chuyển khoản ngân hàng / QR ✅\n- Thẻ tín dụng/debit (Visa, Mastercard) ✅\n- Trả góp 0% qua đối tác tài chính (áp dụng điều kiện) ✅\n\nNói mình biết bạn muốn phương thức nào, mình hướng dẫn chi tiết.",
    intent: "support",
    agent: "support",
    tags: ["payment", "thanh toán", "cod", "trả góp"],
    priority: 6,
  },

  {
    id: "qa-return-policy",
    questions: [
      "đổi trả như thế nào",
      "chính sách đổi trả",
      "return policy",
      "tôi muốn đổi sản phẩm",
    ],
    answer:
      "🔄 **Chính sách đổi trả:**\n- Đổi trả trong 7 ngày nếu linh kiện còn nguyên seal và lỗi từ nhà sản xuất.\n- Sau 7 ngày (trong vòng bảo hành) xử lý bảo hành theo hãng.\n- Quy trình: gửi yêu cầu đổi trả → nhận mã RMA → gửi hàng về kho → kiểm tra → đổi/hoàn tiền.\n\nGửi `orderNumber` để mình bắt đầu quy trình đổi trả giúp bạn.",
    intent: "support",
    agent: "support",
    tags: ["return", "đổi trả", "support"],
    priority: 7,
  },

  // ==================== INSTALLATION & DRIVER QUESTIONS ====================
  {
    id: "qa-installation-help",
    questions: [
      "lắp ráp pc thế nào",
      "cần giúp lắp đặt pc",
      "install pc",
      "không biết lắp main với cpu",
    ],
    answer:
      "🛠️ **Hướng dẫn lắp ráp cơ bản:**\n1) Chuẩn bị: tua-vít, keo tản nhiệt (nếu thay), dây nguồn.\n2) Gắn CPU vào socket (align dấu tam giác).\n3) Gắn tản nhiệt, lắp RAM, gắn SSD/HDD, gắn PSU, gắn GPU, kết nối cáp.\n4) Kiểm tra cáp nguồn 24-pin + CPU 8-pin + GPU 8-pin.\n5) Lần đầu bật, vào BIOS kiểm tra nhận RAM/SSD.\n\nNếu bạn muốn, chúng mình có dịch vụ lắp ráp/kiểm tra (cung cấp link hoặc đặt lịch).",
    intent: "support",
    agent: "support",
    tags: ["installation", "lắp ráp", "hướng dẫn", "support"],
    priority: 8,
  },

  {
    id: "qa-driver-bios",
    questions: [
      "cài driver như thế nào",
      "update bios sao",
      "driver card màn hình cài không được",
      "bios cập nhật",
    ],
    answer:
      "🔧 **Driver & BIOS:**\n- Driver GPU: tải từ trang chính hãng (NVIDIA/AMD) -> cài đặt bằng installer.\n- Chipset driver: tải từ trang nhà sản xuất mainboard.\n- BIOS: chỉ update khi cần (fix tương thích). Sao lưu cài đặt trước khi flash.\n\nGửi model mainboard/CPU, mình hướng dẫn link download và các bước an toàn.",
    intent: "support",
    agent: "support",
    tags: ["driver", "bios", "support", "cập nhật"],
    priority: 7,
  },

  // ==================== COMPATIBILITY EDGE CASES ====================
  {
    id: "qa-m2-compatibility",
    questions: [
      "m2 nvme length nào gắn vừa",
      "m2 2280 hay 2242 khác nhau",
      "ssd m.2 gắn được hay không",
    ],
    answer:
      "🔩 **M.2 form-factor & compatibility:**\n- Thông dụng: **2280** (22mm x 80mm) là chuẩn hiện nay.\n- 2242/2260/2280/22110: chi dài khác nhau — board có notch và vị trí lỗ bắt ốc tương ứng.\n- Kiểm tra tài liệu mainboard: nếu chỉ support 2280, dùng adapter hoặc chọn đúng kích thước.\n\nGửi model mainboard, mình kiểm tra giúp ngay.",
    intent: "support",
    agent: "support",
    tags: ["m.2", "ssd", "compatibility", "support"],
    priority: 8,
  },

  // ==================== PREBUILT VS CUSTOM / SALES ====================
  {
    id: "qa-prebuilt-vs-custom",
    questions: [
      "mua máy ráp hay mua prebuilt",
      "prebuilt hay custom nên chọn gì",
      "nên mua pc ráp hay hãng",
    ],
    answer:
      "⚖️ **Prebuilt vs Custom (Ráp)**:\n- **Prebuilt:** tiện lợi, bảo hành toàn bộ, cấu hình test sẵn, phù hợp người bận rộn.\n- **Custom (ráp):** linh hoạt, tiết kiệm tiền, dễ nâng cấp; nhưng bạn phải tự chọn linh kiện/kiểm tra.\n\n**Lời khuyên:** Nếu muốn đảm bảo bảo hành toàn bộ + sẵn sàng dùng ngay → Prebuilt. Nếu muốn tối ưu giá/linh kiện → Custom. Mình có thể lên cấu hình prebuilt tương đương hoặc gợi ý build tùy ngân sách.",
    intent: "recommendation",
    agent: "advisor",
    tags: ["prebuilt", "custom", "tư vấn", "sales"],
    priority: 6,
  },

  {
    id: "qa-bulk-discount",
    questions: [
      "mua số lượng lớn giá thế nào",
      "giảm giá cho đơn hàng công ty",
      "bulk order discount",
    ],
    answer:
      "🏷️ **Mua số lượng lớn / Đơn hàng công ty:**\n- Chúng tôi hỗ trợ báo giá riêng cho đơn hàng số lượng lớn (≥10 đơn vị).\n- Liên hệ sales@pcshop.vn hoặc cung cấp thông tin sản phẩm và số lượng để nhận báo giá, chiết khấu và thời gian giao hàng.\n\nBạn cần báo giá loại nào và số lượng bao nhiêu?",
    intent: "support",
    agent: "support",
    tags: ["bulk", "wholesale", "sales", "discount"],
    priority: 5,
  },

  {
    id: "qa-warranty-transfer",
    questions: [
      "bảo hành có chuyển nhượng được không",
      "chuyển bảo hành khi bán lại",
      "serial number transfer warranty",
    ],
    answer:
      "📜 **Chuyển nhượng bảo hành:**\n- Một số hãng cho phép chuyển nhượng nếu có hóa đơn mua bán hợp lệ; một số hãng chỉ bảo hành theo serial trên hoá đơn gốc.\n- Khi bán lại, giữ hóa đơn và phiếu bảo hành để người mua dễ làm thủ tục.\n\nGửi hãng + model sản phẩm, mình kiểm tra chính sách bảo hành chi tiết.",
    intent: "support",
    agent: "support",
    tags: ["warranty", "transfer", "support"],
    priority: 6,
  },

  // ==================== SOFTWARE / OS / MAINTENANCE ====================
  {
    id: "qa-software-windows-install",
    questions: [
      "cài windows như thế nào",
      "laptop mới có cần cài lại windows không",
      "cài win 11 và kích hoạt ra sao",
      "windows clean install",
    ],
    answer:
      "🪟 **Cài Windows & kích hoạt đúng cách:**\n\n- Nếu máy mới mua đã có Windows bản quyền, thường chỉ cần đăng nhập tài khoản Microsoft để tự kích hoạt.\n- Nếu muốn cài mới: tạo USB boot Windows 11, vào BIOS chọn boot từ USB, cài xong rồi cài driver chipset, GPU, LAN/WiFi.\n- Sau khi cài xong, kiểm tra Activation trong Settings > System > Activation.\n\n**Lưu ý:**\n- Chỉ dùng key hợp lệ từ hãng hoặc cửa hàng.\n- Không cài driver từ nguồn lạ.\n- Nếu bạn muốn, mình có thể hướng dẫn từng bước theo mẫu máy của bạn.",
    intent: "support",
    agent: "support",
    tags: ["windows", "install", "activation", "os", "software"],
    priority: 9,
  },

  {
    id: "qa-software-driver-update",
    questions: [
      "cập nhật driver ở đâu",
      "driver card màn hình tải từ đâu",
      "mainboard driver cập nhật thế nào",
    ],
    answer:
      "🔧 **Cập nhật driver an toàn:**\n\n- GPU NVIDIA: tải từ trang NVIDIA hoặc GeForce Experience.\n- GPU AMD: tải từ AMD Adrenalin.\n- Chipset / LAN / Audio: tải từ trang hỗ trợ của mainboard.\n- Windows Update chỉ dùng cho bản vá cơ bản, không thay thế driver GPU chính thức.\n\n**Quy tắc nhanh:**\n- Cài Windows xong -> ưu tiên chipset driver trước, GPU driver sau.\n- Nếu máy ổn định thì không cần update driver quá thường xuyên.\n- Chỉ update khi sửa lỗi, thêm tính năng, hoặc cài game/phần mềm mới.",
    intent: "support",
    agent: "support",
    tags: ["driver", "update", "gpu", "chipset", "software"],
    priority: 8,
  },

  {
    id: "qa-software-antivirus",
    questions: [
      "có cần cài antivirus không",
      "máy tính có virus phải làm sao",
      "windows defender có đủ không",
    ],
    answer:
      "🛡️ **Antivirus & malware:**\n\n- Với Windows 11, Windows Defender đã đủ tốt cho phần lớn người dùng nếu không tải file lạ.\n- Nếu thường xuyên tải file / cài phần mềm bên ngoài, có thể dùng thêm Malwarebytes để quét định kỳ.\n- Không nên cài nhiều antivirus cùng lúc vì dễ xung đột và làm máy chậm.\n\n**Nếu nghi có virus:**\n1. Ngắt mạng.\n2. Quét full scan bằng Defender.\n3. Quét thêm Malwarebytes.\n4. Gỡ phần mềm lạ gần đây.\n5. Nếu nặng, backup dữ liệu và cài lại Windows.",
    intent: "support",
    agent: "support",
    tags: ["antivirus", "malware", "windows defender", "security"],
    priority: 8,
  },

  {
    id: "qa-maintenance-cleaning",
    questions: [
      "vệ sinh máy tính bao lâu một lần",
      "lau chùi pc như nào",
      "cpu có cần vệ sinh định kỳ không",
      "có cần vệ sinh cpu không",
      "bụi nhiều có ảnh hưởng không",
    ],
    answer:
      "🧹 **Vệ sinh máy tính định kỳ:**\n\n- Mỗi 1-2 tháng: thổi bụi lưới lọc, mặt ngoài case.\n- Mỗi 3-6 tháng: vệ sinh quạt, heatsink, thay keo nếu nhiệt cao bất thường.\n- Mỗi 12-24 tháng: kiểm tra lại thermal paste và tình trạng quạt.\n\n**Ảnh hưởng của bụi:**\n- Nhiệt độ tăng 5-15°C.\n- Quạt quay to hơn.\n- Dễ throttle nếu bụi quá nhiều.\n\n**Mẹo:** đặt case nơi thoáng, không sát tường, không để dưới sàn quá thấp.",
    intent: "support",
    agent: "support",
    tags: ["maintenance", "cleaning", "dust", "cooling"],
    priority: 7,
  },

  {
    id: "qa-maintenance-fan-noise",
    questions: [
      "quạt máy tính kêu to có bình thường không",
      "cpu fan ồn phải làm sao",
      "quạt gpu quay mạnh liên tục",
    ],
    answer:
      "🌬️ **Quạt kêu to - bình thường hay lỗi?**\n\n- Khi chơi game hoặc render, quạt to là bình thường vì CPU/GPU đang tải cao.\n- Nếu máy idle mà quạt vẫn ồn, hãy kiểm tra bụi, nhiệt độ, và profile fan trong BIOS/Windows.\n- Quạt kêu lạch cạch, rung mạnh hoặc đổi tốc đột ngột thường là dấu hiệu hỏng quạt hoặc dây chạm vào cánh quạt.\n\n**Xử lý nhanh:**\n1. Kiểm tra nhiệt độ bằng HWiNFO.\n2. Vệ sinh bụi.\n3. Cập nhật BIOS/fan curve nếu cần.\n4. Thay quạt nếu có tiếng cơ khí bất thường.",
    intent: "support",
    agent: "support",
    tags: ["fan", "noise", "temperature", "maintenance"],
    priority: 8,
  },

  {
    id: "qa-support-water-damage",
    questions: [
      "máy dính nước phải làm sao",
      "máy bị dính nước phải làm sao",
      "water damage có sửa được không",
      "laptop bị đổ nước xử lý thế nào",
    ],
    answer:
      "💧 **Máy bị dính nước:**\n\n- Tắt nguồn ngay, rút sạc, không cố bật lại.\n- Nếu là laptop: úp nhẹ để nước chảy ra, lau khô bên ngoài, mang đi kiểm tra càng sớm càng tốt.\n- Nếu là PC: ngắt điện, tháo ổ cứng/GPU nếu an toàn, hong khô trước khi kiểm tra.\n- Không cho vào gạo. Cách đó không hiệu quả bằng sấy khô và kiểm tra linh kiện.\n\n**Quan trọng:** nước vào mainboard có thể gây chập sau vài giờ, nên xử lý trong 24h đầu là tốt nhất.",
    intent: "support",
    agent: "support",
    tags: ["water damage", "laptop", "pc", "support"],
    priority: 9,
  },

  {
    id: "qa-support-invoice",
    questions: [
      "có xuất hóa đơn vat không",
      "mua máy có hóa đơn được không",
      "invoice cho công ty thế nào",
    ],
    answer:
      "🧾 **Hóa đơn VAT / hóa đơn công ty:**\n\n- Có thể xuất hóa đơn nếu bạn cung cấp tên công ty, mã số thuế, địa chỉ và email nhận hóa đơn.\n- Nên báo trước khi thanh toán để bên bán chuẩn bị đúng thông tin.\n- Với đơn cá nhân, vẫn có hóa đơn bán lẻ và phiếu bảo hành đi kèm.\n\nNếu bạn cần, gửi thông tin xuất hóa đơn, mình sẽ hướng dẫn mẫu điền.",
    intent: "support",
    agent: "support",
    tags: ["invoice", "vat", "hóa đơn", "company"],
    priority: 7,
  },

  {
    id: "qa-naive-speakers",
    questions: [
      "case máy tính có loa sẵn không",
      "pc có loa trong không",
      "case có phát âm thanh được không",
    ],
    answer:
      "🔊 **Case máy tính có loa sẵn không?**\n\n- Hầu hết case PC không có loa. Âm thanh thường phát qua loa ngoài, tai nghe, hoặc màn hình có loa tích hợp.\n- Một số mainboard có buzzer nhỏ để báo lỗi POST, nhưng không phải loa nghe nhạc.\n- Nếu muốn nghe âm thanh, bạn cần loa ngoài hoặc tai nghe cắm vào cổng audio trên mainboard/monitor.",
    intent: "general",
    agent: "advisor",
    tags: ["speakers", "case", "audio", "naive"],
    priority: 6,
  },

  {
    id: "qa-naive-wifi",
    questions: [
      "máy không có lan thì có wifi không",
      "máy không có lan thì có dùng wifi được không",
      "pc bàn có bắt wifi được không",
      "không cắm dây mạng vẫn vào mạng được à",
    ],
    answer:
      "📶 **Không có LAN vẫn dùng WiFi được:**\n\n- Nhiều laptop và một số mainboard/PC có WiFi tích hợp sẵn.\n- Nếu mainboard không có WiFi, bạn có thể gắn card WiFi PCIe hoặc dùng USB WiFi.\n- LAN ổn định hơn WiFi cho game online và tải dữ liệu lớn, nhưng WiFi đủ tốt cho nhu cầu thường ngày.",
    intent: "general",
    agent: "advisor",
    tags: ["wifi", "lan", "network", "naive"],
    priority: 7,
  },

  {
    id: "qa-naive-storage-math",
    questions: [
      "1tb sao chỉ còn 930gb",
      "mua 512gb sao máy hiện 476gb",
      "ổ cứng bị mất dung lượng à",
    ],
    answer:
      "📦 **1TB hiển thị còn 930GB là bình thường:**\n\n- Nhà sản xuất tính theo hệ thập phân: 1TB = 1000^4 bytes.\n- Windows hiển thị theo hệ nhị phân: 1TB ≈ 931GB.\n- Ngoài ra, hệ điều hành và phân vùng khôi phục cũng chiếm một phần dung lượng.\n\nVậy nên đây không phải lỗi hay lừa đảo, mà là cách tính khác nhau giữa nhà sản xuất và hệ điều hành.",
    intent: "general",
    agent: "advisor",
    tags: ["storage", "capacity", "binary", "decimal"],
    priority: 7,
  },
];

/**
 * Hàm tìm Q&A gần nhất dựa trên similarity
 */
export function findBestQAMatch(userQuery: string, threshold = 0.3): QARecord | null {
  const normalized = normalizeQuery(userQuery);
  const tokens = tokenizeQuery(normalized);

  let bestMatch: QARecord | null = null;
  let bestScore = threshold;

  for (const qa of QA_DATASET) {
    for (const question of qa.questions) {
      const score = calculateSimilarity(tokens, tokenizeQuery(normalizeQuery(question)));
      if (score > bestScore) {
        bestScore = score;
        bestMatch = qa;
      }
    }
  }

  return bestMatch;
}

function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeQuery(text: string): Set<string> {
  return new Set(text.split(/\s+/).filter((t) => t.length > 1));
}

function calculateSimilarity(tokens1: Set<string>, tokens2: Set<string>): number {
  if (tokens1.size === 0 || tokens2.size === 0) return 0;
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  return intersection.size / union.size;
}

export default QA_DATASET;
