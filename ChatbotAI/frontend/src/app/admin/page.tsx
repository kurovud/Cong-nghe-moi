"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  const statCards = stats
    ? [
        { icon: "📦", value: stats.products, label: "Sản phẩm", href: "/admin/products" },
        { icon: "🖥️", value: stats.prebuiltPCs, label: "PC Build sẵn", href: "/admin/builds" },
        { icon: "📚", value: stats.knowledgeItems, label: "Tri thức chatbot", href: "/admin/knowledge" },
        { icon: "❓", value: stats.faq, label: "FAQ", href: "/admin/faq" },
        { icon: "🛠️", value: stats.assemblyGuides, label: "Hướng dẫn lắp ráp" },
        { icon: "🔗", value: stats.compatibilityRules, label: "Quy tắc tương thích" }
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
    { name: "Like", value: Number(analytics?.feedback?.like || 0) },
    { name: "Dislike", value: Number(analytics?.feedback?.dislike || 0) },
  ];

  const topQuestionRows = analytics?.topQuestions || [];
  const topProductRows = analytics?.topProducts || [];

  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Tổng quan dữ liệu sản phẩm và chatbot</p>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href || "#"} style={{ textDecoration: "none" }}>
            <div className="stat-card">
              <span className="stat-card__icon">{s.icon}</span>
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label">{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ display: "grid", gap: "1rem" }}>
        <h3>AI Analytics</h3>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__icon">💬</span>
            <span className="stat-card__value">{analytics?.totalChats || 0}</span>
            <span className="stat-card__label">Tổng hội thoại</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">👍</span>
            <span className="stat-card__value">{analytics?.satisfactionRate || 0}%</span>
            <span className="stat-card__label">Tỉ lệ hài lòng</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">🧠</span>
            <span className="stat-card__value">{intentRows.length}</span>
            <span className="stat-card__label">Loại intent</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">🤖</span>
            <span className="stat-card__value">{agentRows.length}</span>
            <span className="stat-card__label">Agent hoạt động</span>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Truy vấn theo ngày</h3>
          <div style={{ width: "100%", height: 260, marginTop: "1rem" }}>
            {isClient ? (
              <ResponsiveContainer>
                <LineChart data={dailyRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="queries" stroke="#0f766e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="card">
          <h3>Tỉ lệ feedback</h3>
          <div style={{ width: "100%", height: 260, marginTop: "1rem" }}>
            {isClient ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={feedbackRows} dataKey="value" nameKey="name" outerRadius={88} fill="#0ea5e9" label />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Intent distribution</h3>
          <div style={{ width: "100%", height: 260, marginTop: "1rem" }}>
            {isClient ? (
              <ResponsiveContainer>
                <BarChart data={intentRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="card">
          <h3>Agent distribution</h3>
          <div style={{ width: "100%", height: 260, marginTop: "1rem" }}>
            {isClient ? (
              <ResponsiveContainer>
                <BarChart data={agentRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>📊 Sản phẩm theo danh mục</h3>
          <table className="table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Danh mục</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {categoryEntries.map(([cat, count]) => (
                <tr key={cat}>
                  <td>
                    <span className="badge badge--blue">{cat.toUpperCase()}</span>
                  </td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>⚡ Thao tác nhanh</h3>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            <Link href="/admin/products" className="btn btn--primary" style={{ justifyContent: "center" }}>
              ➕ Thêm sản phẩm mới
            </Link>
            <Link href="/admin/builds" className="btn" style={{ justifyContent: "center" }}>
              🖥️ Thêm PC Build
            </Link>
            <Link href="/admin/services" className="btn" style={{ justifyContent: "center" }}>
              🛠️ Quản lý dịch vụ
            </Link>
            <Link href="/admin/knowledge" className="btn" style={{ justifyContent: "center" }}>
              📚 Bổ sung tri thức chatbot
            </Link>
            <Link href="/admin/faq" className="btn" style={{ justifyContent: "center" }}>
              ❓ Quản lý FAQ
            </Link>
            <Link href="/chat" className="btn btn--ghost" style={{ justifyContent: "center" }}>
              💬 Mở Chatbot thử nghiệm
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Top câu hỏi</h3>
          <table className="table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Câu hỏi</th>
                <th>Lượt hỏi</th>
              </tr>
            </thead>
            <tbody>
              {topQuestionRows.length === 0 && (
                <tr>
                  <td colSpan={2}>Chưa có dữ liệu</td>
                </tr>
              )}
              {topQuestionRows.map((q) => (
                <tr key={q.key}>
                  <td>{q.key}</td>
                  <td>{q.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Top sản phẩm được hỏi</h3>
          <table className="table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Lượt nhắc</th>
              </tr>
            </thead>
            <tbody>
              {topProductRows.length === 0 && (
                <tr>
                  <td colSpan={2}>Chưa có dữ liệu</td>
                </tr>
              )}
              {topProductRows.map((p) => (
                <tr key={p.key}>
                  <td>{p.key}</td>
                  <td>{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>📝 Hướng dẫn vận hành</h3>
        <ol style={{ marginTop: "1rem", paddingLeft: "1.2rem", display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}>
          <li><strong>Thêm sản phẩm:</strong> Vào mục Sản phẩm → Thêm từng sản phẩm hoặc import JSON hàng loạt.</li>
          <li><strong>Bổ sung dữ liệu chatbot:</strong> Vào Kho tri thức → Thêm bài viết mới hoặc tải JSON.</li>
          <li><strong>Quản lý FAQ:</strong> Cập nhật câu hỏi thường gặp để chatbot trả lời chính xác hơn.</li>
          <li><strong>Tạo PC Build:</strong> Phối hợp linh kiện có sẵn để tạo bộ PC gợi ý cho khách.</li>
          <li><strong>Thử chatbot:</strong> Luôn kiểm tra chatbot sau khi cập nhật dữ liệu.</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminPage;
