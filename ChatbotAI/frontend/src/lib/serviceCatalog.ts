export type ServiceCategory = "assembly" | "delivery" | "support" | "consultation";

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  description: string;
  features: string[];
  icon: string;
  duration?: string;
  inStock: boolean;
}

export const SERVICE_CATALOG_STORAGE_KEY = "service-catalog-v1";

export const DEFAULT_SERVICES: ServiceCatalogItem[] = [
  {
    id: "1",
    name: "Lắp Ráp PC Tại Nhà",
    category: "assembly",
    price: 500000,
    description: "Lắp ráp hoàn toàn PC của bạn tại nhà với đội kỹ thuật chuyên nghiệp",
    features: [
      "Lắp ráp đầy đủ linh kiện",
      "Cài đặt hệ điều hành",
      "Kiểm tra hiệu năng",
      "Bảo hành 1 năm",
    ],
    icon: "🔧",
    duration: "2-3 giờ",
    inStock: true,
  },
  {
    id: "2",
    name: "Vận Chuyển Nhanh Hà Nội",
    category: "delivery",
    price: 50000,
    description: "Giao hàng nhanh trong vòng 24 giờ tại Hà Nội",
    features: [
      "Giao hàng 24 giờ",
      "Kiểm hóa đơn khi nhận",
      "Bảo hiểm vận chuyển",
      "Hỗ trợ 24/7",
    ],
    icon: "🚚",
    duration: "< 24 giờ",
    inStock: true,
  },
  {
    id: "3",
    name: "Vận Chuyển Toàn Quốc",
    category: "delivery",
    price: 100000,
    description: "Giao hàng an toàn đến toàn bộ Việt Nam",
    features: [
      "Giao hàng 2-7 ngày",
      "Bảo hiểm toàn bộ",
      "Theo dõi đơn hàng",
      "Hỗ trợ 24/7",
    ],
    icon: "🚛",
    duration: "2-7 ngày",
    inStock: true,
  },
  {
    id: "4",
    name: "Hỗ Trợ Kỹ Thuật 1 Năm",
    category: "support",
    price: 1500000,
    description: "Hỗ trợ kỹ thuật toàn bộ PC trong 1 năm",
    features: [
      "Hỗ trợ 24/7",
      "Sửa chữa miễn phí",
      "Tư vấn nâng cấp",
      "Bảo dưỡng định kỳ",
    ],
    icon: "🛡️",
    inStock: true,
  },
  {
    id: "5",
    name: "Tư Vấn Cấu Hình PC",
    category: "consultation",
    price: 250000,
    description: "Tư vấn chi tiết về cấu hình PC phù hợp nhu cầu",
    features: [
      "Tư vấn 1-1 trực tiếp",
      "Đánh giá ngân sách",
      "So sánh linh kiện",
      "Báo cáo chi tiết",
    ],
    icon: "💡",
    duration: "1 giờ",
    inStock: true,
  },
  {
    id: "6",
    name: "Kiểm Tra & Tối Ưu Hóa PC",
    category: "support",
    price: 400000,
    description: "Kiểm tra toàn bộ hệ thống và tối ưu hóa hiệu năng",
    features: [
      "Kiểm tra phần cứng",
      "Cập nhật driver",
      "Tối ưu hóa Windows",
      "Báo cáo chi tiết",
    ],
    icon: "⚙️",
    duration: "1-2 giờ",
    inStock: true,
  },
  {
    id: "7",
    name: "Thu Cũ Đổi Mới",
    category: "support",
    price: 0,
    description: "Đánh giá và thu mua linh kiện cũ giá tốt nhất",
    features: [
      "Đánh giá miễn phí",
      "Giá tốt nhất thị trường",
      "Thanh toán ngay",
      "Hỗ trợ nâng cấp",
    ],
    icon: "🔄",
    inStock: true,
  },
  {
    id: "8",
    name: "Bảo Hành Mở Rộng 3 Năm",
    category: "support",
    price: 2000000,
    description: "Mở rộng bảo hành lên 3 năm toàn bộ linh kiện",
    features: [
      "Bảo hành 3 năm",
      "Sửa chữa miễn phí",
      "Thay thế nếu không sửa được",
      "Hỗ trợ 24/7",
    ],
    icon: "📋",
    inStock: true,
  },
];

const isBrowser = () => typeof window !== "undefined";

export const loadServiceCatalog = (): ServiceCatalogItem[] => {
  if (!isBrowser()) return DEFAULT_SERVICES;
  try {
    const saved = window.localStorage.getItem(SERVICE_CATALOG_STORAGE_KEY);
    if (!saved) return DEFAULT_SERVICES;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
};

export const saveServiceCatalog = (services: ServiceCatalogItem[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(SERVICE_CATALOG_STORAGE_KEY, JSON.stringify(services));
};