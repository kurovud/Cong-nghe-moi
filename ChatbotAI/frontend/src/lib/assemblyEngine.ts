import {
  getProductsByCategory,
  checkCompatibility,
  getAllPrebuiltPCs,
} from "@/lib/productStore";
import type { AssemblyStepInfo } from "@/types/chat.type";
import type { Product, PrebuiltPC } from "@/types/product.type";

type AssemblyResult = {
  selected: Product[];
  steps: AssemblyStepInfo[];
  totalPrice: number;
  prebuilt?: PrebuiltPC | null;
};

const money = new Intl.NumberFormat("vi-VN");

const pickBest = (items: Product[], budget: number, prefer?: (item: Product) => number) => {
  const affordable = items.filter((item) => (item.discountPrice ?? item.price) <= budget);
  const pool = affordable.length > 0 ? affordable : items;
  return [...pool].sort((a, b) => {
    const scoreA = (prefer?.(a) ?? 0) + a.rating * 10 - (a.discountPrice ?? a.price) / 1_000_000;
    const scoreB = (prefer?.(b) ?? 0) + b.rating * 10 - (b.discountPrice ?? b.price) / 1_000_000;
    return scoreB - scoreA;
  })[0];
};

const buildStep = (step: number, title: string, description: string, tips: string[], warning?: string): AssemblyStepInfo => ({
  step,
  title,
  description,
  tips,
  warning,
});

// Deterministic budget builder: chooses a compatible CPU/platform first, then fills the rest
// of the tower with the highest-rated affordable components in each category.
export function assembleBuildByBudget(budget: number, purpose = "gaming"): AssemblyResult {
  const normalizedBudget = Math.max(0, Math.floor(budget));
  const cpuBudget = purpose.toLowerCase().includes("gaming") ? 0.24 : 0.2;
  const gpuBudget = purpose.toLowerCase().includes("gaming") ? 0.34 : 0.18;
  const cpu = pickBest(getProductsByCategory("cpu"), Math.floor(normalizedBudget * cpuBudget));
  const boardPool = cpu?.compatKey
    ? getProductsByCategory("mainboard").filter((item) => item.compatKey === cpu.compatKey)
    : getProductsByCategory("mainboard");
  const mainboard = pickBest(boardPool, Math.floor(normalizedBudget * 0.14));

  const ramPool = mainboard?.compatKey?.includes("DDR4")
    ? getProductsByCategory("ram").filter((item) => item.compatKey === "DDR4")
    : getProductsByCategory("ram").filter((item) => item.compatKey === "DDR5");
  const ram = pickBest(ramPool, Math.floor(normalizedBudget * 0.1));

  const gpu = pickBest(getProductsByCategory("gpu"), Math.floor(normalizedBudget * gpuBudget));

  const storage = pickBest(getProductsByCategory("ssd"), Math.floor(normalizedBudget * 0.08));

  const psuBudget = gpu?.compatKey === "PCIe4" && normalizedBudget >= 20_000_000 ? Math.floor(normalizedBudget * 0.08) : Math.floor(normalizedBudget * 0.07);
  const psu = pickBest(getProductsByCategory("psu"), psuBudget);

  const casePool = getProductsByCategory("case").filter((item) => item.compatKey === (mainboard?.compatKey ? "ATX" : item.compatKey));
  const caseItem = pickBest(casePool.length > 0 ? casePool : getProductsByCategory("case"), Math.floor(normalizedBudget * 0.05));

  const coolerPool = cpu?.compatKey
    ? getProductsByCategory("cooler").filter((item) => !item.compatKey || item.compatKey === "Universal")
    : getProductsByCategory("cooler");
  const cooler = pickBest(coolerPool, Math.floor(normalizedBudget * 0.05));

  const candidates = [cpu, mainboard, ram, gpu, storage, psu, caseItem, cooler].filter(Boolean) as Product[];
  const selected: Product[] = [];

  for (const item of candidates) {
    const compatible = selected.every((existing) => checkCompatibility(existing, item).compatible);
    if (compatible) selected.push(item);
  }

  const totalPrice = selected.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0);
  const prebuilt = getAllPrebuiltPCs()
    .filter((item) => item.price <= normalizedBudget)
    .sort((a, b) => b.rating - a.rating)[0] ?? null;

  const steps = selected.map((item, index) => {
    const price = money.format(item.discountPrice ?? item.price);
    const title = item.category.toUpperCase();
    const description = `${item.name} (${price}đ) được chọn vì phù hợp ngân sách và ưu tiên ${purpose}.`;
    const tips = [
      `Mức giá mục tiêu cho hạng mục này là khoảng ${price}đ.`,
      item.compatKey ? `Khóa tương thích: ${item.compatKey}.` : "Kiểm tra tương thích sau khi lắp ráp.",
    ];
    return buildStep(index + 1, title, description, tips);
  });

  if (prebuilt) {
    steps.push(buildStep(
      steps.length + 1,
      "PREBUILT",
      `Có sẵn bộ PC build sẵn phù hợp ngân sách: ${prebuilt.name} (${money.format(prebuilt.price)}đ).`,
      ["Nếu muốn lắp nhanh, chọn build sẵn sẽ tiết kiệm thời gian.", `Đánh giá: ${prebuilt.rating}/5.`]
    ));
  }

  return { selected, steps, totalPrice, prebuilt };
}

export function suggestPrebuiltsByBudget(budget: number) {
  return getAllPrebuiltPCs()
    .filter((pc) => pc.price <= budget)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}

export default assembleBuildByBudget;
