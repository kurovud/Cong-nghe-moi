import products from '@/../../scripts/seed-data/products.json';

type ChatRequest = { message: string; userId?: string };

// Very small rule-based + catalogue lookup chatbot for dev.
export async function respondToMessage(req: ChatRequest) {
  const msg = normalize(req.message);
  const catalog = Array.isArray(products) ? (products as any[]) : [];

  if (isGreeting(msg)) {
    return 'Chào bạn! Tôi hỗ trợ: hỏi giá, so sánh sản phẩm, build PC nhiều ngân sách, chọn laptop, xem linh kiện, tra đơn và tư vấn cấu hình chi tiết.';
  }

  if (isOutOfScope(msg)) {
    return 'Mình ưu tiên hỗ trợ về website, đơn hàng, PC/laptop/linh kiện và tư vấn build. Nếu bạn muốn, hãy gửi tên sản phẩm, ngân sách, mục đích dùng hoặc cấu hình cần so sánh.';
  }

  if (msg.includes('so sánh') || msg.includes('compare') || msg.includes('khác nhau')) {
    const matches = searchCatalog(msg, catalog, 2);
    if (matches.length >= 2) {
      return compareProducts(matches[0].product, matches[1].product);
    }
    return 'Bạn muốn mình so sánh sản phẩm nào? Ví dụ: RTX 4060 Ti và RX 7600, i5-12400F và Ryzen 5 7500F.';
  }

  if (msg.includes('nhiều bộ') || msg.includes('nhiều pc') || msg.includes('nhiều cấu hình') || msg.includes('multi build')) {
    return 'Bạn có thể gửi danh sách từng bộ PC/laptop cần build cùng ngân sách cho từng bộ. Mình sẽ tách riêng và đề xuất cấu hình phù hợp cho từng mục tiêu (gaming/office/creative/streaming).';
  }

  if (msg.includes('build') || msg.includes('cấu hình')) {
    const budget = extractBudget(msg);
    const useCase = extractUseCase(msg);
    return buildAdvice(budget, useCase, catalog);
  }

  if (msg.includes('giá') || msg.includes('bao nhiêu') || msg.includes('price')) {
    const results = searchCatalog(msg, catalog, 3);
    if (results.length > 0) return formatCatalogResults(results);
    return 'Bạn muốn hỏi giá sản phẩm nào? Hãy gửi tên/mã, hoặc dán link sản phẩm.';
  }

  const p = findProduct(msg, catalog);
  if (p) return `Mình tìm thấy: ${p.name} — Giá: ${p.price.toLocaleString('vi-VN')} đ — Còn: ${p.stock} — Phù hợp cho: ${p.category}.`;

  const catalogHit = searchCatalog(msg, catalog, 5);
  if (catalogHit.length > 0) return formatCatalogResults(catalogHit);

  return 'Mình chưa hiểu đủ chi tiết. Bạn có thể gửi: tên sản phẩm, mã sản phẩm, ngân sách, mục đích sử dụng, hoặc yêu cầu so sánh/build nhiều bộ.';
}

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGreeting(msg: string) {
  return /(xin chao|chao|hello|hi|hey|cho toi hoi)/.test(msg);
}

function isOutOfScope(msg: string) {
  return /(hack|tấn công|chiến tranh|bạo lực|spam|phá|vi phạm pháp luật)/.test(msg);
}

function extractBudget(msg: string) {
  const m = msg.match(/(\d+[\d.,]*)\s*(triệu|trieu|m|m\b|k|nghìn|ngan)/i);
  if (!m) return undefined;
  const raw = Number(m[1].replace(/[.,]/g, ''));
  const unit = m[2].toLowerCase();
  if (unit === 'k' || unit.includes('ngh')) return raw * 1000;
  return raw * 1_000_000;
}

function extractUseCase(msg: string) {
  if (msg.includes('gaming') || msg.includes('game')) return 'gaming';
  if (msg.includes('stream')) return 'streaming';
  if (msg.includes('design') || msg.includes('render') || msg.includes('edit') || msg.includes('creative')) return 'creative';
  if (msg.includes('office') || msg.includes('văn phòng')) return 'office';
  return 'general';
}

function findProduct(query: string, catalog: any[]) {
  const q = query.replace(/[^a-z0-9\s-]/gi, '').trim();
  return catalog.find(p => p.id?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q));
}

function searchCatalog(query: string, catalog: any[], limit = 3) {
  const terms = query.split(' ').filter(Boolean);
  return catalog
    .map((product) => {
      const hay = `${product.name} ${product.slug || ''} ${product.category || ''} ${product.brand || ''} ${product.shortDesc || ''} ${JSON.stringify(product.specs || {})}`.toLowerCase();
      let score = 0;
      for (const term of terms) if (hay.includes(term)) score += 1;
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function formatCatalogResults(results: Array<{ product: any; score: number }>) {
  return 'Mình tìm thấy các mục liên quan:\n\n' + results.map(({ product }) => `- ${product.name} | ${product.price.toLocaleString('vi-VN')} đ | Còn ${product.stock} | ${product.category}`).join('\n');
}

function buildAdvice(budget?: number, useCase = 'general', catalog: any[] = []) {
  const priceHint = budget ? `Ngân sách bạn nói là khoảng ${budget.toLocaleString('vi-VN')} đ.` : 'Bạn chưa ghi ngân sách cụ thể.';
  const base = useCase === 'gaming'
    ? 'Với build gaming, ưu tiên GPU trước, sau đó CPU tầm trung, RAM 16-32GB và SSD NVMe.'
    : useCase === 'creative'
      ? 'Với build creative, ưu tiên CPU nhiều nhân, RAM 32GB+, SSD nhanh và GPU phù hợp công việc.'
      : useCase === 'streaming'
        ? 'Với streaming, ưu tiên CPU/GPU cân bằng, capture/encoding tốt và tản nhiệt ổn định.'
        : 'Với build tổng quát, hãy chia ngân sách cho CPU, mainboard, RAM, SSD, GPU và PSU hợp lý.';

  const hits = catalog
    .filter((p) => useCase === 'general' || String(p.category || '').includes(useCase) || String(p.tags || '').toLowerCase().includes(useCase))
    .slice(0, 4);

  const suggested = hits.length > 0
    ? `Gợi ý tham khảo:\n${hits.map((p) => `- ${p.name} (${p.price.toLocaleString('vi-VN')} đ)`).join('\n')}`
    : 'Nếu bạn muốn, gửi thêm ngân sách và mục tiêu, tôi sẽ đề xuất 2-3 cấu hình cụ thể.';

  return `${priceHint}\n${base}\n${suggested}`;
}

function compareProducts(a: any, b: any) {
  const aPrice = a.price.toLocaleString('vi-VN');
  const bPrice = b.price.toLocaleString('vi-VN');
  return `So sánh nhanh:\n- ${a.name}: ${aPrice} đ, còn ${a.stock}, nhóm ${a.category}\n- ${b.name}: ${bPrice} đ, còn ${b.stock}, nhóm ${b.category}\nNếu bạn muốn, tôi có thể phân tích theo gaming / render / office / giá trị trên hiệu năng.`;
}
