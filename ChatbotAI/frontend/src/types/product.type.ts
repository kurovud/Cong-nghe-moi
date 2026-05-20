/* ──────────── Danh mục sản phẩm ──────────── */
export type ProductCategory =
  | "cpu"
  | "gpu"
  | "mainboard"
  | "ram"
  | "ssd"
  | "hdd"
  | "psu"
  | "case"
  | "cooler"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "headset"
  | "laptop"
  | "prebuilt";

/* ──────────── Sản phẩm ──────────── */
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;           // VNĐ
  discountPrice?: number;
  image: string;
  shortDesc: string;
  specs: Record<string, string>;
  stock: number;
  rating: number;          // 1-5
  tags: string[];
  /** Socket / chipset tương thích (dùng cho kiểm tra build) */
  compatKey?: string;
}

/* ──────────── Bộ PC build sẵn ──────────── */
export interface PrebuiltPC {
  id: string;
  name: string;
  purpose: string;         // "Gaming", "Văn phòng", "Đồ họa", ...
  price: number;
  image: string;
  components: {
    cpu: string;
    gpu: string;
    mainboard: string;
    ram: string;
    storage: string;
    psu: string;
    case: string;
    cooler: string;
  };
  description: string;
  rating: number;
}

/* ──────────── Quy tắc tương thích ──────────── */
export interface CompatibilityRule {
  id: string;
  component1Category: ProductCategory;
  component2Category: ProductCategory;
  /** Khoá tương thích phải trùng nhau */
  matchKey: string;
  description: string;
}

/* ──────────── Hướng dẫn lắp ráp ──────────── */
export interface AssemblyStep {
  step: number;
  title: string;
  description: string;
  tips: string[];
  warning?: string;
}

export interface AssemblyGuide {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
  tools: string[];
  steps: AssemblyStep[];
}
