type InvoiceInput = {
  id: string;
  paymentId?: string;
  to?: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
};

export function createInvoiceHtml(input: InvoiceInput) {
  const { id, paymentId, to, items, total } = input;
  const rows = items.map(it => `<tr><td>${escapeHtml(it.name)}</td><td style="text-align:center">${it.qty}</td><td style="text-align:right">${formatVnd(it.price)}</td></tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>Số hóa đơn ${id}</title><style>body{font-family:Arial,sans-serif;color:#162033;padding:24px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #eee}.meta{display:flex;gap:16px;flex-wrap:wrap;margin:12px 0 18px}.pill{padding:6px 10px;border-radius:999px;background:#eef7ff;font-size:12px;font-weight:700;color:#0f172a}</style></head><body><h2>Số hóa đơn ${id}</h2><div class="meta"><span class="pill">Khách hàng: ${escapeHtml(to || 'Khách hàng')}</span><span class="pill">Thanh toán: ${escapeHtml(String(paymentId || '—'))}</span></div><table><thead><tr><th>Sản phẩm</th><th style="text-align:center">SL</th><th style="text-align:right">Giá</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td></td><td style="text-align:right"><strong>Tổng</strong></td><td style="text-align:right"><strong>${formatVnd(total)}</strong></td></tr></tfoot></table></body></html>`;
}

function escapeHtml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatVnd(n: number) {
  return n.toLocaleString('vi-VN') + ' đ';
}
