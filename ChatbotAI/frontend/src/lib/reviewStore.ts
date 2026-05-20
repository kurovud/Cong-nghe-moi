/* ══════════════════════════════════════════════
   REVIEW STORE — In-memory (globalThis)
   ══════════════════════════════════════════════ */

import type { ProductReview } from "@/types/order.type";
import { MEGA_REVIEWS } from "@/lib/data/mega-reviews";

interface ReviewStore {
  reviews: ProductReview[];
}

const getStore = (): ReviewStore => {
  const g = globalThis as unknown as { __reviewStore?: ReviewStore };
  if (!g.__reviewStore) {
    g.__reviewStore = {
      reviews: [
        ...MEGA_REVIEWS,
        // ══════ CPU Reviews ══════
        { id: "rev1", productId: "cpu-001", userId: "user_minh", userName: "Trần Quốc Minh", rating: 5,
          title: "CPU gaming tuyệt vời", content: "i5-14400F chơi game mượt mà, nhiệt độ ổn định 65°C khi gaming. Rất hài lòng với mức giá này!", pros: ["Hiệu năng cao", "Giá hợp lý", "10 nhân mạnh mẽ"], cons: ["Không kèm tản nhiệt box tốt"], verified: true, createdAt: "2025-11-20T14:30:00Z" },
        { id: "rev2", productId: "cpu-001", userId: "user_hoa", userName: "Nguyễn Thị Hoa", rating: 4,
          title: "Đáng đồng tiền bát gạo", content: "Mua cho em trai build PC, chạy Valorant 300+ FPS, GTA V Ultra 80+ FPS. Không có gì để chê ở tầm giá.", pros: ["Gaming 1080p rất tốt", "Đa nhiệm ổn"], cons: ["Không ép xung được"], verified: true, createdAt: "2025-12-01T10:20:00Z" },
        { id: "rev3", productId: "cpu-002", userId: "user_tuan", userName: "Phạm Anh Tuấn", rating: 5,
          title: "7800X3D đúng là vua gaming", content: "Upgrade từ Ryzen 5 3600 lên 7800X3D, FPS tăng 40-50% trong Cyberpunk 2077. 3D V-Cache quá đỉnh. Nhiệt ổn 75°C với tản khí PA120.", pros: ["FPS gaming cao nhất phân khúc", "3D V-Cache amazing", "Tiêu thụ điện thấp"], cons: ["Giá cao hơn i5-14400F nhiều"], verified: true, createdAt: "2025-11-25T08:45:00Z" },
        { id: "rev4", productId: "cpu-003", userId: "user_long", userName: "Lê Hoàng Long", rating: 5,
          title: "Quái vật đa nhân", content: "Dùng Ryzen 9 7950X cho render Blender + After Effects. 16 nhân 32 luồng cắt thời gian render gần 50% so với Ryzen 7 5800X cũ. Cần tản nước AIO 360.", pros: ["16 nhân cực mạnh", "Render nhanh kinh khủng", "AM5 nâng cấp được"], cons: ["Nóng, cần tản nước", "Giá cao"], verified: true, createdAt: "2025-11-28T13:10:00Z" },
        { id: "rev5", productId: "cpu-005", userId: "user_duc", userName: "Vũ Thanh Đức", rating: 4,
          title: "i7-14700K cho workstation", content: "20 nhân xử lý đa nhiệm tuyệt vời. Premiere Pro render nhanh, compile code nhanh. Nhưng nóng hơn mong đợi, cần AIO 280 trở lên.", pros: ["20 nhân mạnh", "Gaming + workstation", "Ép xung được"], cons: ["TDP cao 253W", "Cần tản tốt"], verified: true, createdAt: "2025-12-03T16:30:00Z" },
        { id: "rev6", productId: "cpu-008", userId: "user_nam", userName: "Hoàng Văn Nam", rating: 5,
          title: "Best budget CPU cho AM4", content: "Build lại PC cũ B550 với Ryzen 5 5600, giá chỉ 2.7tr mà chơi game cực ngon. Cặp với RX 7600 là auto 1080p Ultra.", pros: ["Cực rẻ", "6 nhân đủ dùng", "Tương thích B550 cũ"], cons: ["AM4 platform cũ"], verified: true, createdAt: "2025-12-05T09:00:00Z" },

        // ══════ GPU Reviews ══════
        { id: "rev10", productId: "gpu-001", userId: "user_khoa", userName: "Đỗ Trung Khoa", rating: 5,
          title: "RTX 4060 Ti tuyệt vời cho 1440p", content: "DLSS 3 Frame Generation biến game 60fps thành 120fps mượt mà. Cyberpunk 2077 RT Ultra 1080p chạy 70+ FPS. Rất ít tiêu thụ điện.", pros: ["DLSS 3 tuyệt vời", "Tiêu thụ điện thấp 160W", "1080p Ultra mượt"], cons: ["VRAM 8GB hơi ít cho 4K texture"], verified: true, createdAt: "2025-11-22T09:15:00Z" },
        { id: "rev11", productId: "gpu-001", userId: "user_huong", userName: "Trần Thu Hương", rating: 4,
          title: "Tốt nhưng wish có 12GB VRAM", content: "Gaming 1080p hoàn hảo, 1440p Medium-High cũng ổn. Nhưng một số game mới như The Last of Us cần >8GB VRAM ở Ultra.", pros: ["Gaming 1080p đỉnh", "Mát và yên tĩnh"], cons: ["8GB VRAM không đủ cho tương lai", "Giá hơi cao so với RX 7600"], verified: true, createdAt: "2025-12-02T14:20:00Z" },
        { id: "rev12", productId: "gpu-002", userId: "user_binh", userName: "Nguyễn Xuân Bình", rating: 5,
          title: "RX 7600 ngon bổ rẻ", content: "Build PC 15 triệu mà chơi Valorant 300+ FPS, GTA V High 90+ FPS. Giá 6tr5 quá tốt. Driver AMD giờ ổn rồi, không bị lỗi như trước.", pros: ["Giá cực tốt", "1080p High mượt", "FSR 3 miễn phí"], cons: ["VRAM 8GB", "Ray tracing yếu hơn NVIDIA"], verified: true, createdAt: "2025-11-30T11:00:00Z" },
        { id: "rev13", productId: "gpu-003", userId: "user_hieu", userName: "Phạm Quang Hiếu", rating: 5,
          title: "RTX 4070 Super - Sweet spot 1440p", content: "Chơi mọi game 1440p Ultra 80-120+ FPS. DLSS 3 cho Cyberpunk 2077 RT Overdrive 60+ FPS. Upgrade từ RTX 3060 Ti, khác biệt rõ rệt.", pros: ["1440p Ultra mượt", "12GB VRAM đủ dùng", "DLSS 3 + Ray Tracing đỉnh"], cons: ["Giá 14tr hơi cao"], verified: true, createdAt: "2025-12-04T17:45:00Z" },
        { id: "rev14", productId: "gpu-005", userId: "user_dat", userName: "Lê Thành Đạt", rating: 5,
          title: "RTX 4080 Super cho 4K", content: "4K Ultra mọi game 80-100+ FPS, có DLSS còn lên 120+. Render video 4K nhanh kinh khủng nhờ NVENC. Card chạy mát, quạt yên tĩnh.", pros: ["4K gaming mượt", "16GB VRAM", "NVENC tốt cho streaming"], cons: ["Giá 30tr không phải ai cũng mua được"], verified: true, createdAt: "2025-11-27T12:30:00Z" },
        { id: "rev15", productId: "gpu-008", userId: "user_phuong", userName: "Cao Thị Phương", rating: 4,
          title: "RX 7800 XT - giá tốt hơn RTX 4070", content: "16GB VRAM + hiệu năng ngang 4070 Super mà rẻ hơn 2-3 triệu. FSR 3 ngày càng tốt. Game 1440p Ultra mượt mà.", pros: ["16GB VRAM future-proof", "Giá tốt hơn NVIDIA", "1440p Ultra mượt"], cons: ["DLSS vẫn tốt hơn FSR", "Ray tracing yếu hơn RTX"], verified: true, createdAt: "2025-12-06T15:00:00Z" },

        // ══════ Mainboard Reviews ══════
        { id: "rev20", productId: "mb-001", userId: "user_quang", userName: "Trần Hữu Quang", rating: 5,
          title: "B650 Tomahawk WiFi quá chất", content: "VRM mạnh chạy thoải mái Ryzen 9 7900X. WiFi 6E nhanh, Bluetooth 5.3 tiện. BIOS dễ dùng, cập nhật đều đặn.", pros: ["VRM mạnh", "WiFi 6E + BT 5.3", "BIOS tốt", "4 khe RAM"], cons: ["Giá hơi cao cho B650"], verified: true, createdAt: "2025-11-23T10:00:00Z" },
        { id: "rev21", productId: "mb-003", userId: "user_thi", userName: "Nguyễn Thị Thi", rating: 4,
          title: "B760M DS3H AX - budget nhưng đủ dùng", content: "Mainboard giá rẻ nhưng chạy i5-14400F ổn định. Có WiFi AX, 2 khe M.2. Không cần gì hơn cho build gaming budget.", pros: ["Giá rẻ 2.8tr", "Có WiFi", "Đủ feature cần thiết"], cons: ["Chỉ 2 khe RAM", "VRM không mạnh cho i7/i9"], verified: true, createdAt: "2025-12-02T08:30:00Z" },
        { id: "rev22", productId: "mb-005", userId: "user_khanh", userName: "Lê Bá Khánh", rating: 5,
          title: "ROG STRIX Z790-A đẹp quá", content: "Build trắng tuyệt đẹp! Chạy i9-14900K ổn định, VRM cực mạnh. 4 khe M.2, WiFi 6E, USB-C header. Đáng đồng tiền.", pros: ["Thiết kế trắng đẹp", "VRM khỏe cho i9", "Nhiều M.2 slot"], cons: ["Giá 8tr không rẻ"], verified: true, createdAt: "2025-11-29T14:15:00Z" },

        // ══════ RAM Reviews ══════
        { id: "rev30", productId: "ram-001", userId: "user_hung", userName: "Phạm Đức Hưng", rating: 4,
          title: "RAM DDR5 tốc độ cao", content: "Kingston Fury Beast DDR5 5600 chạy XMP ổn định trên B760. Heatsink nhôm đẹp, tản nhiệt tốt. Giá vừa phải cho DDR5.", pros: ["Tốc độ 5600MHz", "Ổn định", "Thiết kế đẹp"], cons: ["Không có LED RGB"], verified: true, createdAt: "2025-12-01T16:00:00Z" },
        { id: "rev31", productId: "ram-002", userId: "user_thao", userName: "Vũ Phương Thảo", rating: 5,
          title: "DDR5 6000MHz CL30 - sweet spot", content: "Corsair Vengeance DDR5 6000 CL30 chạy EXPO trên B650 cực ổn. Infinity Fabric 1:1 với FCLK 3000MHz, hiệu năng tối ưu cho Ryzen 7000.", pros: ["6000MHz CL30 optimal cho AMD", "32GB dual-channel", "Low profile dễ lắp tản"], cons: ["Không RGB"], verified: true, createdAt: "2025-11-26T11:45:00Z" },
        { id: "rev32", productId: "ram-005", userId: "user_son", userName: "Hoàng Đình Sơn", rating: 5,
          title: "G.Skill Trident Z5 RGB đẹp kinh khủng", content: "RGB xuyên suốt thanh RAM, hiệu ứng đẹp nhất tôi từng thấy. 64GB 6000MHz cho workstation render Blender cực nhanh. Worth the money.", pros: ["RGB đẹp nhất thị trường", "64GB cho workstation", "Tốc độ 6000MHz"], cons: ["Giá cao 7tr"], verified: true, createdAt: "2025-12-07T13:20:00Z" },

        // ══════ SSD Reviews ══════
        { id: "rev40", productId: "ssd-001", userId: "user_anh", userName: "Đặng Tuấn Anh", rating: 5,
          title: "Samsung 990 EVO tốc độ đáng kinh ngạc", content: "Read 5000MB/s, write 4200MB/s thực tế. Game load nhanh hơn rõ rệt so với SSD SATA cũ. Windows boot 8 giây.", pros: ["Tốc độ cao PCIe 5.0 x2", "1TB đủ dùng", "Endurance 600TBW"], cons: ["Nóng nếu không có heatsink"], verified: true, createdAt: "2025-11-24T09:30:00Z" },
        { id: "rev41", productId: "ssd-003", userId: "user_ly", userName: "Trần Phương Ly", rating: 4,
          title: "WD SN770 ngon bổ rẻ", content: "1TB PCIe 4.0 giá chỉ 2tr, tốc độ 5150MB/s read. Dùng làm game drive, load time nhanh. Không heatsink cũng ổn 50-60°C.", pros: ["Giá rẻ nhất phân khúc PCIe 4.0", "Tốc độ tốt", "Không cần heatsink"], cons: ["Không có DRAM cache"], verified: true, createdAt: "2025-12-03T10:15:00Z" },
        { id: "rev42", productId: "ssd-002", userId: "user_duy", userName: "Nguyễn Thành Duy", rating: 5,
          title: "Samsung 990 Pro 2TB cho workstation", content: "7450MB/s read, 6900MB/s write. Dùng làm scratch disk cho Premiere Pro, timeline scrub mượt như bơ. 2TB chứa cả OS + project.", pros: ["Tốc độ PCIe 4.0 nhanh nhất", "2TB dung lượng lớn", "DRAM cache"], cons: ["Giá 5.5tr hơi cao"], verified: true, createdAt: "2025-11-30T15:45:00Z" },

        // ══════ PSU Reviews ══════
        { id: "rev50", productId: "psu-001", userId: "user_tai", userName: "Lê Minh Tài", rating: 5,
          title: "Corsair RM750e chạy êm ru", content: "Zero RPM mode khi tải nhẹ, cực kỳ yên tĩnh. Dây modular gọn gàng, dễ đi dây. Đủ cho RTX 4070 Super + i5-14400F.", pros: ["Zero RPM mode", "Modular", "Bảo hành 10 năm"], cons: ["Không có dây cáp sleeved đẹp"], verified: true, createdAt: "2025-11-21T11:00:00Z" },
        { id: "rev51", productId: "psu-002", userId: "user_thinh", userName: "Phạm Đình Thịnh", rating: 5,
          title: "NZXT C850 xứng đáng best PSU", content: "850W Gold, fully modular, chạy cực êm. Cáp dẹp dễ đi dây hơn cáp tròn. Đủ cho RTX 4080 Super. 10 năm bảo hành an tâm.", pros: ["Cáp dẹp dễ đi dây", "Rất yên tĩnh", "850W đủ cho GPU cao cấp"], cons: ["Giá 3tr hơi premium"], verified: true, createdAt: "2025-12-04T08:00:00Z" },

        // ══════ Case Reviews ══════
        { id: "rev55", productId: "case-001", userId: "user_phuc", userName: "Vũ Hoàng Phúc", rating: 5,
          title: "NZXT H5 Flow airflow tuyệt vời", content: "Thiết kế đẹp, tối giản. Airflow front panel mesh giảm nhiệt GPU 5°C so với case cũ kín. Đi dây dễ, cable management space rộng.", pros: ["Thiết kế đẹp tối giản", "Airflow tốt", "Cable management dễ"], cons: ["Chỉ có 2 quạt đi kèm"], verified: true, createdAt: "2025-11-25T14:00:00Z" },
        { id: "rev56", productId: "case-004", userId: "user_van", userName: "Ngô Thanh Vân", rating: 5,
          title: "Fractal North đẹp nhất thị trường", content: "Panel gỗ walnut + mesh airflow = đẹp và mát. Ai đến nhà cũng hỏi 'Case gì đẹp vậy?'. Build quality tuyệt vời.", pros: ["Design gỗ walnut sang trọng", "Airflow tốt", "Build quality cao"], cons: ["Giá 4tr hơi đắt", "Nặng"], verified: true, createdAt: "2025-12-01T17:30:00Z" },

        // ══════ Cooler Reviews ══════
        { id: "rev60", productId: "cooler-001", userId: "user_tung", userName: "Trần Thanh Tùng", rating: 5,
          title: "PA120 SE tản khí tốt nhất giá rẻ", content: "500K mà ép i5-14400F chỉ 60°C gaming, i7-14700K khoảng 78°C. So với tản stock thì khác biệt trời vực. Best budget cooler.", pros: ["Giá cực rẻ 500K", "Hiệu năng tốt", "Lắp dễ"], cons: ["Hơi cao, check clearance case"], verified: true, createdAt: "2025-11-28T10:30:00Z" },
        { id: "rev61", productId: "cooler-003", userId: "user_ngoc", userName: "Lê Thị Ngọc", rating: 5,
          title: "NH-D15 – huyền thoại tản khí", content: "Ép i9-14900K dưới 80°C ở PL1 253W. Yên tĩnh hơn hẳn AIO cũ. Noctua quality không phải bàn. Lắp hơi khó nhưng hướng dẫn rõ ràng.", pros: ["Mát hơn nhiều AIO 240mm", "Cực yên tĩnh", "Bảo hành 6 năm"], cons: ["To và nặng", "Che khe RAM đầu tiên"], verified: true, createdAt: "2025-12-05T12:00:00Z" },
        { id: "rev62", productId: "cooler-005", userId: "user_huy", userName: "Đỗ Quang Huy", rating: 5,
          title: "Arctic Liquid Freezer II 360 đỉnh cao giá rẻ", content: "AIO 360mm giá 2.5tr mà mát hơn Corsair H150i giá 4tr. Ryzen 9 7950X chỉ 72°C full load. Không RGB nhưng ai cần khi hiệu năng thế này.", pros: ["Hiệu năng/giá tốt nhất", "360mm mát cực", "Pump yên tĩnh"], cons: ["Không có RGB", "Ống hơi cứng"], verified: true, createdAt: "2025-12-06T09:45:00Z" },

        // ══════ Monitor Reviews ══════
        { id: "rev70", productId: "mon-001", userId: "user_cuong", userName: "Phạm Quốc Cường", rating: 5,
          title: "LG 27GP850-B cho gaming 1440p", content: "27 inch 1440p 165Hz IPS, màu sắc tuyệt đẹp. GTA V, Cyberpunk nhìn sống động. G-Sync compatible hoạt động tốt với RTX 4070. Response time nhanh.", pros: ["1440p 165Hz mượt", "IPS màu đẹp", "G-Sync compatible"], cons: ["HDR 400 không ấn tượng"], verified: true, createdAt: "2025-11-23T16:00:00Z" },
        { id: "rev71", productId: "mon-003", userId: "user_ha", userName: "Trần Thị Hà", rating: 5,
          title: "ASUS VG249Q1A eSports tuyệt vời", content: "165Hz 1080p IPS, chơi Valorant mượt như nước. Response 1ms, không ghosting. Giá 3.5tr quá hợp lý cho màn gaming.", pros: ["165Hz smooth", "IPS 1ms", "Giá rẻ"], cons: ["Chỉ 1080p", "Chân đế không xoay được"], verified: true, createdAt: "2025-12-02T13:00:00Z" },

        // ══════ Laptop Reviews ══════
        { id: "rev80", productId: "lap-001", userId: "user_lam", userName: "Vũ Hoàng Lâm", rating: 5,
          title: "ASUS TUF Gaming F15 đáng mua", content: "i5-12500H + RTX 4060 laptop chơi mọi game 1080p High-Ultra. 16GB RAM + 512GB SSD. Pin 5-6h cho công việc. Fan hơi ồn khi gaming nhưng chấp nhận được.", pros: ["RTX 4060 laptop mạnh", "Bền MIL-STD-810H", "Pin tạm ổn"], cons: ["Fan ồn khi gaming", "Màn hình không sRGB 100%"], verified: true, createdAt: "2025-11-26T15:30:00Z" },
        { id: "rev81", productId: "lap-004", userId: "user_my", userName: "Nguyễn Hồng My", rating: 5,
          title: "MacBook Air M2 cho sinh viên", content: "Mỏng nhẹ, pin 15h, không quạt nên im lặng tuyệt đối. Đủ cho học tập, code, Photoshop nhẹ. macOS ecosystem tuyệt vời nếu dùng iPhone.", pros: ["Pin 15h thực tế", "Không quạt, im lặng", "Nhẹ 1.24kg"], cons: ["Không chơi game được", "RAM 8GB hơi ít"], verified: true, createdAt: "2025-12-04T11:00:00Z" },

        // ══════ Keyboard Reviews ══════
        { id: "rev85", productId: "kb-001", userId: "user_trung", userName: "Hoàng Nhật Trung", rating: 5,
          title: "Razer DeathStalker V2 Pro mỏng gọn", content: "Switch quang học low-profile gõ sướng, phản hồi nhanh. Kết nối HyperSpeed không delay. Pin 40h đủ dùng cả tuần. RGB đẹp.", pros: ["Switch quang học nhanh", "Wireless không delay", "Pin 40h"], cons: ["Giá 5tr đắt", "Không có numpad"], verified: true, createdAt: "2025-12-03T14:00:00Z" },

        // ══════ Mouse Reviews ══════
        { id: "rev88", productId: "mouse-001", userId: "user_hoan", userName: "Lê Thanh Hoàn", rating: 5,
          title: "Logitech G Pro X Superlight 2 nhẹ kinh khủng", content: "60g siêu nhẹ, sensor Hero 2 chính xác tuyệt đối. Battery 95h. Chơi Valorant aim nhanh hơn hẳn so với mouse cũ 100g. Worth every penny.", pros: ["Siêu nhẹ 60g", "Sensor Hero 2 đỉnh", "Pin 95h"], cons: ["Giá 3.5tr cao", "Chỉ có shape thon"], verified: true, createdAt: "2025-12-01T09:00:00Z" },

        // ══════ Headset Reviews ══════
        { id: "rev90", productId: "hs-001", userId: "user_khang", userName: "Trần Đình Khang", rating: 4,
          title: "HyperX Cloud III Wireless bass đầm", content: "Âm thanh tốt cho gaming, bass đầm, treble rõ. Mic ngon cho Discord/Zoom. Pin 120h dùng cả tháng. Nhưng hơi nặng đeo lâu mỏi.", pros: ["Âm thanh gaming tốt", "Mic chất lượng", "Pin 120h"], cons: ["Hơi nặng 370g", "Không có ANC"], verified: true, createdAt: "2025-12-05T16:30:00Z" },
      ],
    };
  }
  return g.__reviewStore;
};

/* ── Public API ── */

export const getReviewsByProduct = (productId: string): ProductReview[] =>
  getStore().reviews.filter((r) => r.productId === productId);

export const getReviewsByUser = (userId: string): ProductReview[] =>
  getStore().reviews.filter((r) => r.userId === userId);

export const addReview = (
  review: Omit<ProductReview, "id" | "createdAt">
): ProductReview => {
  const store = getStore();
  const newReview: ProductReview = {
    ...review,
    id: `rev_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.reviews.unshift(newReview);
  return newReview;
};

export const getAverageRating = (
  productId: string
): { average: number; count: number; distribution: number[] } => {
  const reviews = getReviewsByProduct(productId);
  if (reviews.length === 0)
    return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
  const distribution = [0, 0, 0, 0, 0];
  let total = 0;
  reviews.forEach((r) => {
    distribution[r.rating - 1]++;
    total += r.rating;
  });
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
    distribution,
  };
};

export const getAllReviews = (): ProductReview[] => getStore().reviews;
