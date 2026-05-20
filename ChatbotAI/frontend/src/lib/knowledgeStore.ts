import { KnowledgeItem } from "@/types/knowledge";
import { MEGA_KNOWLEDGE } from "@/lib/data/mega-knowledge";

const createSeedData = (): KnowledgeItem[] => [
  ...MEGA_KNOWLEDGE,
  // ══════ KIẾN THỨC KỸ THUẬT - CPU ══════
  { id: "kb-cpu-architecture", title: "Kiến trúc CPU: Core, Thread, Cache",
    content: "CPU có nhiều core (nhân vật lý), mỗi core xử lý 1 tác vụ. Hyper-Threading (Intel) / SMT (AMD) cho phép mỗi core chạy 2 thread. Ví dụ: i5-14400F có 10 core 16 thread (6P+4E). Cache L3 lớn giúp truy xuất dữ liệu nhanh hơn – AMD 3D V-Cache (7800X3D) có 96MB L3 cache, cải thiện gaming 15-20%. TDP (Thermal Design Power) cho biết lượng nhiệt cần tản – TDP cao = cần tản nhiệt mạnh hơn.",
    tags: ["cpu", "core", "thread", "cache", "tdp", "v-cache"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-cpu-intel-gen", title: "Các thế hệ CPU Intel (Gen 12-14)",
    content: "Gen 12 (Alder Lake, 2021): kiến trúc hybrid P-core + E-core đầu tiên, LGA 1700, DDR4/DDR5. Gen 13 (Raptor Lake, 2022): tăng E-core, cache lớn hơn, cải thiện đa nhân. Gen 14 (Raptor Lake Refresh, 2023): tối ưu xung nhịp, i5-14400F best value, i9-14900K flagship 24 nhân. Socket LGA 1700 dùng chung cho cả 3 thế hệ. Chipset B760 phổ biến nhất, Z790 cho ép xung.",
    tags: ["intel", "cpu", "lga1700", "gen12", "gen13", "gen14"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-cpu-amd-zen", title: "Các thế hệ CPU AMD Ryzen (Zen 3-4)",
    content: "Zen 3 (Ryzen 5000, 2020): AM4 socket, DDR4, PCIe 4.0. Ryzen 5 5600/5800X vẫn rất mạnh, giá rẻ cho nâng cấp AM4. Zen 4 (Ryzen 7000, 2022): AM5 socket, DDR5 bắt buộc, PCIe 5.0, iGPU RDNA 2. Ryzen 5 7600X budget, 7800X3D gaming king, 7950X workstation. AM5 sẽ được hỗ trợ đến 2025+, đầu tư dài hạn tốt.",
    tags: ["amd", "ryzen", "zen3", "zen4", "am4", "am5"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },

  // ══════ KIẾN THỨC KỸ THUẬT - GPU ══════
  { id: "kb-gpu-nvidia-rtx40", title: "NVIDIA RTX 4000 Series - Ada Lovelace",
    content: "Kiến trúc Ada Lovelace (2022-2024): RTX 4060 (8GB, 115W) → 1080p gaming. RTX 4060 Ti (8/16GB, 160W) → 1080p Ultra/1440p. RTX 4070 Super (12GB, 220W) → 1440p Ultra. RTX 4070 Ti Super (16GB, 285W) → 1440p Ultra/4K. RTX 4080 Super (16GB, 320W) → 4K gaming. RTX 4090 (24GB, 450W) → 4K Ultra flagship. Tính năng: DLSS 3.5 (Frame Generation + Ray Reconstruction), AV1 hardware encode, CUDA cho AI/ML.",
    tags: ["nvidia", "rtx4000", "ada lovelace", "dlss", "gpu"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-gpu-amd-rx7000", title: "AMD Radeon RX 7000 Series - RDNA 3",
    content: "Kiến trúc RDNA 3 (2023-2024): RX 7600 (8GB, 165W) → 1080p gaming giá rẻ. RX 7700 XT (12GB, 245W) → 1440p budget. RX 7800 XT (16GB, 263W) → 1440p Ultra, cạnh tranh RTX 4070. RX 7900 XTX (24GB, 355W) → 4K flagship AMD. Tính năng: FSR 3 (Frame Generation), AV1 encode, giá thường rẻ hơn NVIDIA cùng tier. Ray tracing yếu hơn NVIDIA nhưng rasterization tốt.",
    tags: ["amd", "rx7000", "rdna3", "fsr", "gpu"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-gpu-vram", title: "VRAM bao nhiêu là đủ cho gaming?",
    content: "6GB: 1080p Medium, đang dần thiếu cho game mới. 8GB: 1080p Ultra đủ, 1440p cần giảm texture. 12GB: 1440p Ultra thoải mái, 4K Medium. 16GB: 4K Ultra, future-proof cho 2-3 năm tới. 24GB: 4K Ultra max settings, AI/ML, 3D rendering. Game 2024 ngày càng ngốn VRAM: The Last of Us Part I dùng 8GB+ ở 1080p Ultra, Cyberpunk 2077 RT Overdrive 12GB+ ở 1440p.",
    tags: ["vram", "gpu", "gaming", "texture", "resolution"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },

  // ══════ KIẾN THỨC KỸ THUẬT - RAM ══════
  { id: "kb-ram-ddr4-vs-ddr5", title: "DDR4 vs DDR5 chi tiết",
    content: "DDR4: bandwidth 25-50GB/s, voltage 1.2V, giá rẻ, vẫn đủ cho gaming. Sweet spot: 3200MHz CL16 hoặc 3600MHz CL18. DDR5: bandwidth 38-90GB/s, voltage 1.1V, latency thực tế tương đương DDR4 nhờ băng thông lớn. Sweet spot: 6000MHz CL30 (optimal cho AMD) hoặc 5600MHz CL36 (giá rẻ). Trong gaming: DDR5 6000 nhanh hơn DDR4 3600 khoảng 5-8% FPS. Trong productivity: DDR5 nhanh hơn 15-25%.",
    tags: ["ram", "ddr4", "ddr5", "bandwidth", "latency"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-ram-dual-channel", title: "Dual-channel RAM là gì và tại sao quan trọng",
    content: "Dual-channel: dùng 2 thanh RAM cắm vào khe xen kẽ (A2-B2) để tăng gấp đôi băng thông. 2x8GB LUÔN tốt hơn 1x16GB (tăng 10-20% FPS trong game). Quad-channel: 4 thanh RAM, chỉ cần cho workstation/server. Quy tắc: luôn mua RAM thành CẶP, lắp vào khe A2-B2 (khe 2 và 4 tính từ CPU).",
    tags: ["ram", "dual-channel", "bandwidth", "performance"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },

  // ══════ KIẾN THỨC KỸ THUẬT - STORAGE ══════
  { id: "kb-ssd-types", title: "Các loại SSD: SATA vs NVMe vs PCIe 5.0",
    content: "SSD SATA 2.5\": 550MB/s, cổng SATA, giá rẻ nhất, tốt cho nâng cấp PC cũ từ HDD. SSD NVMe PCIe 3.0: 3500MB/s, M.2 slot. SSD NVMe PCIe 4.0: 5000-7000MB/s, phổ biến nhất (Samsung 990 EVO, WD SN770). SSD NVMe PCIe 5.0: 10000-14000MB/s, nóng hơn, đắt hơn (Crucial T500). Với gaming: PCIe 3.0 và 4.0 gần như không khác biệt load time. PCIe 4.0 là sweet spot cho hầu hết mọi người.",
    tags: ["ssd", "nvme", "sata", "pcie", "storage"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-hdd-vs-ssd", title: "HDD vs SSD – khi nào cần HDD?",
    content: "SSD: nhanh hơn HDD 10-50 lần, không tiếng ồn, bền hơn khi di chuyển. HDD: giá/GB rẻ hơn nhiều (4TB HDD ~2.5tr vs 4TB SSD ~8tr). Nên dùng HDD cho: lưu trữ dữ liệu lớn (phim, backup, game library không chơi thường xuyên). Setup lý tưởng: 1TB SSD NVMe cho OS + game đang chơi + 2-4TB HDD cho lưu trữ.",
    tags: ["hdd", "ssd", "storage", "lưu trữ", "backup"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },

  // ══════ KIẾN THỨC KỸ THUẬT - PSU ══════
  { id: "kb-psu-efficiency", title: "80+ Rating PSU nghĩa là gì?",
    content: "80+ certification đo hiệu suất chuyển đổi điện: 80+ (80%): tiêu chuẩn. 80+ Bronze (82-85%): phổ biến, đủ dùng. 80+ Gold (87-90%): khuyến nghị cho gaming. 80+ Platinum (90-92%): cho workstation. 80+ Titanium (94%+): cao cấp nhất. Hiệu suất cao hơn = ít nhiệt, ít tiền điện, bền hơn. Ví dụ: PSU 750W Gold ở 50% tải tiêu thụ ~420W từ ổ điện để cấp 375W cho PC.",
    tags: ["psu", "80+", "efficiency", "gold", "bronze"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-psu-modular", title: "PSU Modular vs Non-modular",
    content: "Non-modular: tất cả dây cắm sẵn, rẻ nhất nhưng dây thừa chiếm chỗ. Semi-modular: dây 24-pin + 8-pin CPU cắm sẵn, dây khác tháo rời. Full-modular: tất cả dây tháo rời, đi dây đẹp nhất. Khuyến nghị: build mới nên chọn full-modular (Corsair RM, NZXT C) cho cable management tốt. Lưu ý: KHÔNG dùng dây của PSU khác hãng – pinout khác nhau sẽ cháy linh kiện!",
    tags: ["psu", "modular", "cable", "dây nguồn"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },

  // ══════ KIẾN THỨC KỸ THUẬT - MONITOR ══════
  { id: "kb-monitor-panel", title: "Panel màn hình: IPS vs VA vs TN",
    content: "IPS: màu sắc chính xác, góc nhìn rộng 178°, response time 1-5ms. Tốt nhất cho gaming + content creation. VA: contrast ratio cao (3000:1 vs IPS 1000:1), đen sâu hơn. Tốt cho xem phim, horror games. Nhưng ghosting/smearing ở dark scenes. TN: response time nhanh nhất (0.5ms), giá rẻ, nhưng màu sắc xấu, góc nhìn hẹp. Chỉ cho eSports competitive. Năm 2024: IPS là lựa chọn tốt nhất cho hầu hết mọi người.",
    tags: ["monitor", "ips", "va", "tn", "panel", "màn hình"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-monitor-resolution", title: "Độ phân giải màn hình cho gaming",
    content: "1080p (Full HD): 24-25 inch optimal. GPU cần: RTX 4060/RX 7600 trở lên. 1440p (QHD): 27 inch optimal. GPU cần: RTX 4060 Ti/RX 7700 XT trở lên. Sweet spot hiện tại. 4K (UHD): 27-32 inch. GPU cần: RTX 4070 Ti Super/RX 7900 XTX trở lên. Ultrawide 3440x1440: 34 inch. GPU cần: RTX 4070 Super trở lên. Tần số quét: 60Hz đủ cho casual, 144Hz cho gaming, 240Hz+ cho eSports competitive.",
    tags: ["monitor", "resolution", "1080p", "1440p", "4k", "hz"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },

  // ══════ HƯỚNG DẪN BUILD PC THEO MỤC ĐÍCH ══════
  { id: "kb-build-esports", title: "Build PC cho eSports (Valorant, LoL, CSGO)",
    content: "eSports games nhẹ, ưu tiên FPS cao + input lag thấp. CPU quan trọng hơn GPU. Gợi ý: CPU i5-14400F hoặc R5 7600X (single-core mạnh). GPU RX 7600 hoặc RTX 4060 (đủ 300+ FPS 1080p). RAM 16GB DDR5 5600MHz. Màn hình 24 inch 1080p 240Hz (tần số cao quan trọng nhất). Budget: 15-18 triệu (không tính màn hình).",
    tags: ["build", "esports", "valorant", "csgo", "fps"], source: "Hướng dẫn build", createdAt: new Date().toISOString() },
  { id: "kb-build-aaa-gaming", title: "Build PC cho game AAA (Cyberpunk, RDR2, Hogwarts Legacy)",
    content: "AAA games cần GPU mạnh + VRAM nhiều. Gợi ý 1440p Ultra: CPU R7 7800X3D (3D V-Cache tối ưu). GPU RTX 4070 Super 12GB hoặc RX 7800 XT 16GB. RAM 32GB DDR5 6000MHz. SSD NVMe 1TB PCIe 4.0. PSU 750W Gold. Budget: 25-30 triệu. Gợi ý 4K Ultra: GPU RTX 4080 Super hoặc RTX 4090. Budget: 40-60 triệu.",
    tags: ["build", "aaa", "gaming", "cyberpunk", "1440p", "4k"], source: "Hướng dẫn build", createdAt: new Date().toISOString() },
  { id: "kb-build-streaming", title: "Build PC cho streaming + gaming",
    content: "Single PC streaming dùng NVENC encoder (hardware trên GPU NVIDIA) – không hao CPU. Gợi ý: CPU R7 7800X3D hoặc i7-14700K (≥8 nhân). GPU RTX 4060 trở lên (NVENC bắt buộc). RAM 32GB DDR5 (OBS + game + Chrome). SSD 1TB+ (recordings). Internet: upload ≥10Mbps (1080p60). Phần mềm: OBS Studio + StreamElements/Streamlabs. Capture card KHÔNG cần nếu single PC.",
    tags: ["streaming", "obs", "nvenc", "build", "content"], source: "Hướng dẫn build", createdAt: new Date().toISOString() },
  { id: "kb-build-video-editing", title: "Build PC cho dựng video (Premiere Pro / DaVinci Resolve)",
    content: "Premiere Pro: ưu tiên CPU nhiều nhân + RAM lớn. DaVinci Resolve: ưu tiên GPU CUDA. Gợi ý: CPU Ryzen 9 7900X (12 nhân render nhanh) hoặc i7-14700K (20 nhân). GPU RTX 4060+ (CUDA + NVENC). RAM 64GB DDR5 (timeline 4K dày). SSD 1: OS + phần mềm (500GB NVMe). SSD 2: project files (1-2TB NVMe). HDD: backup footage (4TB). Budget: 30-40 triệu.",
    tags: ["video editing", "premiere", "davinci", "render", "build"], source: "Hướng dẫn build", createdAt: new Date().toISOString() },
  { id: "kb-build-office", title: "Build PC văn phòng tiết kiệm",
    content: "Không cần GPU rời cho văn phòng. Gợi ý: CPU i5-14400 (có iGPU) hoặc Ryzen 5 7600 (có iGPU RDNA 2). RAM 16GB DDR5. SSD 500GB NVMe. PSU 450-550W. Case nhỏ gọn mATX. Đủ cho: Office 365, trình duyệt 30+ tabs, Zoom/Teams, Photoshop nhẹ. Budget: 8-12 triệu. Tip: chọn CPU có iGPU, không cần mua card đồ họa.",
    tags: ["office", "văn phòng", "build", "budget", "igpu"], source: "Hướng dẫn build", createdAt: new Date().toISOString() },
  { id: "kb-build-3d-ai", title: "Build PC cho 3D Rendering / AI / Machine Learning",
    content: "3D Rendering (Blender, Cinema4D): CPU nhiều nhân + GPU CUDA. AI/ML (PyTorch, TensorFlow): GPU VRAM lớn quan trọng nhất. Gợi ý: CPU Ryzen 9 7950X (16 nhân) hoặc i9-14900K. GPU RTX 4080 Super 16GB hoặc RTX 4090 24GB (VRAM cho training). RAM 64GB DDR5 (dataset lớn). SSD 2TB NVMe (dataset + model). Budget: 50-100 triệu. RTX 4090 24GB VRAM cho training model ~7B parameters.",
    tags: ["3d", "ai", "ml", "blender", "build", "workstation"], source: "Hướng dẫn build", createdAt: new Date().toISOString() },

  // ══════ BENCHMARK & SO SÁNH ══════
  { id: "kb-benchmark-cpu-gaming", title: "Bảng xếp hạng CPU Gaming 2024",
    content: "Top CPU gaming (1080p, high-end GPU): 1. AMD Ryzen 7 7800X3D – vua gaming, 3D V-Cache. 2. Intel Core i9-14900K – gần bằng, đa nhân mạnh hơn. 3. AMD Ryzen 9 7950X3D – flagship nhưng overkill. 4. Intel Core i7-14700K – 20 nhân, value tốt. 5. AMD Ryzen 5 7600X – budget AM5 tốt nhất. 6. Intel Core i5-14400F – best value overall. 7. AMD Ryzen 5 5600 – budget AM4 king. Lưu ý: ở 1440p/4K, GPU quan trọng hơn CPU nhiều.",
    tags: ["benchmark", "cpu", "ranking", "gaming", "2024"], source: "Benchmark data", createdAt: new Date().toISOString() },
  { id: "kb-benchmark-gpu-gaming", title: "Bảng xếp hạng GPU Gaming 2024",
    content: "Top GPU (1440p Ultra average FPS, AAA games): 1. RTX 4090 (100+ FPS) – flagship, overkill cho 1440p. 2. RTX 4080 Super (~85 FPS) – 4K gaming. 3. RX 7900 XTX (~82 FPS) – AMD flagship, giá tốt hơn. 4. RTX 4070 Ti Super (~72 FPS) – 1440p-4K sweet spot. 5. RTX 4070 Super (~62 FPS) – 1440p Ultra sweet spot. 6. RX 7800 XT (~58 FPS) – best value 1440p. 7. RTX 4060 Ti (~48 FPS) – 1080p Ultra/1440p Medium. 8. RX 7600 (~38 FPS) – budget 1080p.",
    tags: ["benchmark", "gpu", "ranking", "gaming", "fps", "2024"], source: "Benchmark data", createdAt: new Date().toISOString() },

  // ══════ KIẾN THỨC CHUNG ══════
  { id: "kb-pc-terminology", title: "Thuật ngữ PC thường gặp",
    content: "OC (Overclock): ép xung, tăng tốc độ linh kiện. RGB: đèn LED màu. AIO (All-in-One): tản nước liền khối. BIOS: firmware mainboard. POST: Power-On Self-Test khi khởi động. DIMM: khe RAM desktop. M.2: khe SSD NVMe trên mainboard. PCIe: bus kết nối GPU/SSD. TDP: nhiệt thiết kế, đo bằng Watt. VRM: module ổn áp trên mainboard (VRM mạnh = chạy CPU nặng ổn định). RAID: kết hợp nhiều ổ cứng.",
    tags: ["thuật ngữ", "terminology", "newbie", "cơ bản"], source: "Kiến thức phần cứng", createdAt: new Date().toISOString() },
  { id: "kb-troubleshooting", title: "Sửa lỗi PC không boot / không lên hình",
    content: "1. Không lên nguồn: kiểm tra công tắc PSU, dây nguồn 220V, dây 24-pin + 8-pin CPU. 2. Lên nguồn nhưng không lên hình: kiểm tra RAM cắm chặt chưa, thử từng thanh RAM. Kiểm tra GPU cắm chặt + dây nguồn PCIe. Cắm màn hình vào GPU (không cắm mainboard nếu dùng GPU rời). 3. Boot loop (restart liên tục): reset CMOS (tháo pin CR2032 30 giây). 4. Debug LED trên mainboard: CPU (đỏ), DRAM (vàng), VGA (trắng), BOOT (xanh) – xem LED nào sáng để biết lỗi ở đâu.",
    tags: ["troubleshooting", "sửa lỗi", "không boot", "debug"], source: "Hướng dẫn sửa lỗi", createdAt: new Date().toISOString() },
  { id: "kb-upgrade-path", title: "Lộ trình nâng cấp PC thông minh",
    content: "Nâng cấp theo thứ tự hiệu quả nhất: Bước 1: HDD → SSD (cải thiện nhiều nhất, giá rẻ nhất). Bước 2: 8GB → 16GB RAM (đa nhiệm tốt hơn). Bước 3: GPU mới (FPS game tăng rõ). Bước 4: CPU + Mainboard (đổi platform, thường cần đổi RAM theo). Tip: kiểm tra bottleneck trước khi nâng cấp. Dùng Task Manager xem CPU/GPU usage khi gaming. Nâng cấp linh kiện yếu nhất trước.",
    tags: ["nâng cấp", "upgrade", "lộ trình", "tư vấn"], source: "Hướng dẫn nâng cấp", createdAt: new Date().toISOString() },

  // ══════ RAG & AI PIPELINE (INTERNAL) ══════
  { id: "rag-pipeline", title: "Pipeline RAG chuẩn",
    content: "RAG kết hợp keyword search, semantic search, re-ranking và đóng gói ngữ cảnh trước khi gọi LLM để đảm bảo câu trả lời dựa trên bằng chứng. Chatbot sử dụng Gemini 2.0 Flash với context window chứa sản phẩm, FAQ, prebuilt PCs, và knowledge base.",
    tags: ["rag", "pipeline", "retrieval"], source: "Spec nội bộ", createdAt: new Date().toISOString() },
  { id: "semantic-routing", title: "Semantic routing",
    content: "Semantic routing phân loại truy vấn (spam, sản phẩm, tư vấn, đặt hàng) để quyết định gọi cache, trả lời nhanh hoặc chuyển High Research Layer. Intent detection bao gồm: greeting, product_search, price_inquiry, comparison, compatibility, recommendation, build_pc, troubleshooting, policy.",
    tags: ["routing", "intent"], source: "Spec nội bộ", createdAt: new Date().toISOString() },
  { id: "cache-policy", title: "Cache & TTL",
    content: "Cache lưu phản hồi cho các truy vấn tương tự, áp dụng TTL và ngưỡng similarity để giảm số lần gọi LLM và tối ưu chi phí. Conversation history giữ 20 messages gần nhất cho context.",
    tags: ["cache", "cost"], source: "Spec nội bộ", createdAt: new Date().toISOString() }
];

const getStore = () => {
  const globalStore = globalThis as typeof globalThis & {
    __knowledgeStore?: KnowledgeItem[];
  };

  if (!globalStore.__knowledgeStore) {
    globalStore.__knowledgeStore = createSeedData();
  }

  return globalStore.__knowledgeStore;
};

export const listKnowledge = () => getStore();

export const addKnowledge = (items: KnowledgeItem[]) => {
  const store = getStore();
  const next = [...items, ...store];
  (globalThis as typeof globalThis & { __knowledgeStore?: KnowledgeItem[] }).__knowledgeStore = next;
  return next;
};

export const removeKnowledge = (id: string) => {
  const store = getStore();
  const next = store.filter((item) => item.id !== id);
  (globalThis as typeof globalThis & { __knowledgeStore?: KnowledgeItem[] }).__knowledgeStore = next;
  return next;
};
