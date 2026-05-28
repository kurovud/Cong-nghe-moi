"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchChatAnalytics } from "@/services/chatbot.api";
import type { ChatAnalyticsResponse } from "@/types/chat.type";

interface StoreStats {
  products: number;
  prebuiltPCs: number;
  faq: number;
  assemblyGuides: number;
  compatibilityRules: number;
  categories: Record<string, number>;
  knowledgeItems: number;
}

const darkTooltipStyle = {
  backgroundColor: "rgba(5,13,26,0.95)",
  border: "1px solid rgba(0,212,255,0.2)",
  borderRadius: 10,
  color: "#f0f6ff",
  fontSize: 12,
};

const PIE_COLORS = ["#00d4ff", "#a855f7"];
const INTENT_COLORS = ["#00d4ff", "#a855f7", "#f97316", "#22d3ee", "#818cf8", "#34d399"];

const AdminPage = () => {
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [analytics, setAnalytics] = useState<ChatAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetchChatAnalytics().catch(() => null),
    ])
      .then(([storeStats, chatAnalytics]) => {
        setStats(storeStats?.data ?? null);
        setAnalytics(chatAnalytics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, flexDirection: "column", gap: "1rem" }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid rgba(0,212,255,0.15)",
          borderTop: "3px solid #00d4ff",
          animation: "spin 0.8s linear infinite"
        }} />
        <span style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>Đang tải dữ liệu...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = stats
    ? [
        { icon: "📦", value: stats.products, label: "Sản phẩm", href: "/admin/products", color: "#00d4ff" },
        { icon: "🖥️", value: stats.prebuiltPCs, label: "PC Build sẵn", href: "/admin/builds", color: "#a855f7" },
        { icon: "📚", value: stats.knowledgeItems, label: "Tri thức chatbot", href: "/admin/knowledge", color: "#f97316" },
        { icon: "❓", value: stats.faq, label: "FAQ", href: "/admin/faq", color: "#22d3ee" },
        { icon: "🛠️", value: stats.assemblyGuides, label: "Hướng dẫn lắp ráp", color: "#818cf8" },
        { icon: "🔗", value: stats.compatibilityRules, label: "Quy tắc tương thích", color: "#34d399" }
      ]
    : [];

  const categoryEntries = stats ? Object.entries(stats.categories).sort((a, b) => b[1] - a[1]) : [];

  const toChartRows = (data?: Record<string, string>) =>
    Object.entries(data || {}).map(([name, value]) => ({ name, value: Number(value || 0) }));

  const intentRows = toChartRows(analytics?.intents);
  const agentRows = toChartRows(analytics?.agents);
  const dailyRows = (analytics?.dailyQueries || []).map((d) => ({
    day: d.key,
    queries: d.value,
  }));

  const feedbackRows = [
    { name: "Like 👍", value: Number(analytics?.feedback?.like || 0) },
    { name: "Dislike 👎", value: Number(analytics?.feedback?.dislike || 0) },
  ];

  const topQuestionRows = analytics?.topQuestions || [];
  const topProductRows = analytics?.topProducts || [];

  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ display: "grid", gap: "1.75rem" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-section { animation: fadeInUp 0.4s ease both; }
        .stat-card-premium {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.4rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .stat-card-premium::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top left, var(--card-glow, rgba(0,212,255,0.08)) 0%, transparent 65%);
          pointer-events: none;
        }
        .stat-card-premium:hover {
          transform: translateY(-3px);
          border-color: var(--card-color, var(--cyan));
          box-shadow: 0 8px 32px var(--card-shadow, rgba(0,212,255,0.15));
        }
        .stat-card-premium__icon {
          font-size: 1.6rem;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .stat-card-premium__value {
          font-size: 2.2rem;
          font-weight: 900;
          background: var(--card-grad, var(--grad-brand));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .stat-card-premium__label {
          font-size: 0.78rem;
          color: var(--text-2);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .dashboard-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .dashboard-card__title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dashboard-card__title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
          margin-left: 0.5rem;
        }
        .stat-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .quick-action-btn:hover {
          border-color: var(--cyan);
          background: rgba(0,212,255,0.08);
          color: var(--cyan);
          transform: translateX(4px);
        }
        .quick-action-btn--primary {
          background: var(--grad-brand);
          border: none;
          color: #050d1a;
          font-weight: 700;
        }
        .quick-action-btn--primary:hover {
          opacity: 0.9;
          color: #050d1a;
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0,212,255,0.3);
        }
        .admin-table-dark {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }
        .admin-table-dark th {
          padding: 0.6rem 0.75rem;
          text-align: left;
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-2);
          border-bottom: 1px solid var(--border);
          background: rgba(0,212,255,0.04);
        }
        .admin-table-dark td {
          padding: 0.65rem 0.75rem;
          color: var(--text);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .admin-table-dark tr:last-child td { border-bottom: none; }
        .admin-table-dark tr:hover td { background: rgba(0,212,255,0.04); }
        .badge-cat {
          display: inline-flex;
          align-items: center;
          padding: 0.2rem 0.65rem;
          background: rgba(0,212,255,0.1);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 20px;
          color: var(--cyan);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ops-guide-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.65rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 0.85rem;
          color: var(--text-2);
        }
        .ops-guide-item:last-child { border-bottom: none; }
        .ops-guide-item__num {
          width: 22px;
          height: 22px;
          background: var(--grad-brand);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 800;
          color: #050d1a;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .page-header-premium {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 0.25rem 0 0.5rem;
        }
        .page-header-premium h1 {
          font-size: 1.6rem;
          font-weight: 900;
          background: var(--grad-brand);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .page-header-premium__sub {
          font-size: 0.82rem;
          color: var(--text-2);
          margin-top: 0.2rem;
        }
        .page-header-premium__date {
          font-size: 0.78rem;
          color: var(--text-2);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .ai-analytics-card {
          background: linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(0,212,255,0.04) 100%);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .ai-stat-item {
          background: rgba(168,85,247,0.07);
          border: 1px solid rgba(168,85,247,0.15);
          border-radius: 12px;
          padding: 1.2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: all 0.2s;
        }
        .ai-stat-item:hover {
          border-color: rgba(168,85,247,0.4);
          transform: translateY(-2px);
        }
        .ai-stat-item__icon { font-size: 1.4rem; }
        .ai-stat-item__value {
          font-size: 1.9rem;
          font-weight: 900;
          background: linear-gradient(135deg, #a855f7 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .ai-stat-item__label {
          font-size: 0.75rem;
          color: var(--text-2);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
      `}</style>

      {/* Page Header */}
      <div className="dash-section page-header-premium">
        <div>
          <h1>Dashboard</h1>
          <p className="page-header-premium__sub">Tổng quan dữ liệu sản phẩm và chatbot AI</p>
        </div>
        <div className="page-header-premium__date">
          📅 {dateStr}
        </div>
      </div>

      {/* Store Stats */}
      <div className="dash-section" style={{ animationDelay: "0.05s" }}>
        <div className="stat-grid-premium">
          {statCards.map((s) => (
            <Link
              key={s.label}
              href={s.href || "#"}
              className="stat-card-premium"
              style={{
                "--card-color": s.color,
                "--card-glow": `${s.color}14`,
                "--card-shadow": `${s.color}26`,
                "--card-grad": `linear-gradient(135deg, ${s.color} 0%, ${s.color}99 100%)`,
              } as React.CSSProperties}
            >
              <span className="stat-card-premium__icon">{s.icon}</span>
              <span className="stat-card-premium__value">{s.value ?? "—"}</span>
              <span className="stat-card-premium__label">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Analytics */}
      <div className="dash-section ai-analytics-card" style={{ animationDelay: "0.1s" }}>
        <h3 className="dashboard-card__title">🤖 AI Analytics</h3>
        <div className="stat-grid-premium">
          <div className="ai-stat-item">
            <span className="ai-stat-item__icon">💬</span>
            <span className="ai-stat-item__value">{analytics?.totalChats || 0}</span>
            <span className="ai-stat-item__label">Tổng hội thoại</span>
          </div>
          <div className="ai-stat-item">
            <span className="ai-stat-item__icon">👍</span>
            <span className="ai-stat-item__value">{analytics?.satisfactionRate || 0}%</span>
            <span className="ai-stat-item__label">Tỉ lệ hài lòng</span>
          </div>
          <div className="ai-stat-item">
            <span className="ai-stat-item__icon">🧠</span>
            <span className="ai-stat-item__value">{intentRows.length}</span>
            <span className="ai-stat-item__label">Loại intent</span>
          </div>
          <div className="ai-stat-item">
            <span className="ai-stat-item__icon">🤖</span>
            <span className="ai-stat-item__value">{agentRows.length}</span>
            <span className="ai-stat-item__label">Agent hoạt động</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="dash-section charts-grid" style={{ animationDelay: "0.15s" }}>
        <div className="dashboard-card">
          <h3 className="dashboard-card__title">📈 Truy vấn theo ngày</h3>
          <div style={{ width: "100%", height: 240 }}>
            {isClient ? (
              <ResponsiveContainer>
                <LineChart data={dailyRows}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={darkTooltipStyle} cursor={{ stroke: "rgba(0,212,255,0.2)", strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="queries" stroke="url(#lineGrad)" strokeWidth={2.5} dot={{ fill: "#00d4ff", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#00d4ff" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card__title">🎯 Tỉ lệ Feedback</h3>
          <div style={{ width: "100%", height: 240 }}>
            {isClient ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={feedbackRows} dataKey="value" nameKey="name" outerRadius={88} innerRadius={50} paddingAngle={4} label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {feedbackRows.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={darkTooltipStyle} />
                  <Legend formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="dash-section charts-grid" style={{ animationDelay: "0.2s" }}>
        <div className="dashboard-card">
          <h3 className="dashboard-card__title">🧠 Intent Distribution</h3>
          <div style={{ width: "100%", height: 240 }}>
            {isClient ? (
              <ResponsiveContainer>
                <BarChart data={intentRows} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={darkTooltipStyle} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {intentRows.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={INTENT_COLORS[index % INTENT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card__title">🤖 Agent Distribution</h3>
          <div style={{ width: "100%", height: 240 }}>
            {isClient ? (
              <ResponsiveContainer>
                <BarChart data={agentRows} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={darkTooltipStyle} />
                  <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]}>
                    {agentRows.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#a855f7" : "#f97316"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tables & Quick Actions */}
      <div className="dash-section charts-grid" style={{ animationDelay: "0.25s" }}>
        <div className="dashboard-card">
          <h3 className="dashboard-card__title">📊 Sản phẩm theo danh mục</h3>
          <table className="admin-table-dark">
            <thead>
              <tr>
                <th>Danh mục</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {categoryEntries.length === 0 && (
                <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--text-2)", padding: "1.5rem" }}>Chưa có dữ liệu</td></tr>
              )}
              {categoryEntries.map(([cat, count]) => (
                <tr key={cat}>
                  <td><span className="badge-cat">{cat.toUpperCase()}</span></td>
                  <td style={{ fontWeight: 700, color: "var(--cyan)" }}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card__title">⚡ Thao tác nhanh</h3>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <Link href="/admin/products" className="quick-action-btn quick-action-btn--primary">
              <span>➕</span> Thêm sản phẩm mới
            </Link>
            <Link href="/admin/builds" className="quick-action-btn">
              <span>🖥️</span> Thêm PC Build
            </Link>
            <Link href="/admin/services" className="quick-action-btn">
              <span>🛠️</span> Quản lý dịch vụ
            </Link>
            <Link href="/admin/knowledge" className="quick-action-btn">
              <span>📚</span> Bổ sung tri thức chatbot
            </Link>
            <Link href="/admin/faq" className="quick-action-btn">
              <span>❓</span> Quản lý FAQ
            </Link>
            <Link href="/chat" className="quick-action-btn" style={{ borderColor: "rgba(0,212,255,0.3)", color: "var(--cyan)" }}>
              <span>💬</span> Mở Chatbot thử nghiệm
            </Link>
          </div>
        </div>
      </div>

      {/* Top Questions & Products */}
      <div className="dash-section charts-grid" style={{ animationDelay: "0.3s" }}>
        <div className="dashboard-card">
          <h3 className="dashboard-card__title">🔥 Top câu hỏi</h3>
          <table className="admin-table-dark">
            <thead>
              <tr>
                <th>Câu hỏi</th>
                <th>Lượt hỏi</th>
              </tr>
            </thead>
            <tbody>
              {topQuestionRows.length === 0 && (
                <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--text-2)", padding: "1.5rem" }}>Chưa có dữ liệu</td></tr>
              )}
              {topQuestionRows.map((q) => (
                <tr key={q.key}>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.key}</td>
                  <td style={{ fontWeight: 700, color: "var(--purple)" }}>{q.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card__title">🛍️ Top sản phẩm được hỏi</h3>
          <table className="admin-table-dark">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Lượt nhắc</th>
              </tr>
            </thead>
            <tbody>
              {topProductRows.length === 0 && (
                <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--text-2)", padding: "1.5rem" }}>Chưa có dữ liệu</td></tr>
              )}
              {topProductRows.map((p) => (
                <tr key={p.key}>
                  <td style={{ fontFamily: "monospace", color: "var(--cyan)", fontSize: "0.78rem" }}>{p.key}</td>
                  <td style={{ fontWeight: 700, color: "var(--orange)" }}>{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ops Guide */}
      <div className="dash-section dashboard-card" style={{ animationDelay: "0.35s" }}>
        <h3 className="dashboard-card__title">📝 Hướng dẫn vận hành</h3>
        <div>
          {[
            { text: <><strong>Thêm sản phẩm:</strong> Vào mục Sản phẩm → Thêm từng sản phẩm hoặc import JSON hàng loạt.</> },
            { text: <><strong>Bổ sung dữ liệu chatbot:</strong> Vào Kho tri thức → Thêm bài viết mới hoặc tải JSON.</> },
            { text: <><strong>Quản lý FAQ:</strong> Cập nhật câu hỏi thường gặp để chatbot trả lời chính xác hơn.</> },
            { text: <><strong>Tạo PC Build:</strong> Phối hợp linh kiện có sẵn để tạo bộ PC gợi ý cho khách.</> },
            { text: <><strong>Thử chatbot:</strong> Luôn kiểm tra chatbot sau khi cập nhật dữ liệu.</> },
          ].map((item, i) => (
            <div key={i} className="ops-guide-item">
              <div className="ops-guide-item__num">{i + 1}</div>
              <div>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
