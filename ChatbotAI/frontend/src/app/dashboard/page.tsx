"use client";

import { useEffect, useMemo, useState } from "react";
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

const DashboardPage = () => {
  const [data, setData] = useState<ChatAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const run = async () => {
      try {
        const response = await fetchChatAnalytics();
        setData(response);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const intentDistribution = useMemo(() => {
    if (!data?.intents) return [];
    return Object.entries(data.intents).map(([intent, count]) => ({
      intent,
      count: Number(count || 0),
    }));
  }, [data]);

  const feedbackDistribution = useMemo(() => {
    if (!data?.feedback) return [];
    return Object.entries(data.feedback).map(([name, value]) => ({
      name,
      value: Number(value || 0),
    }));
  }, [data]);

  const agentDistribution = useMemo(() => {
    if (!data?.agents) return [];
    return Object.entries(data.agents).map(([agent, count]) => ({
      agent,
      count: Number(count || 0),
    }));
  }, [data]);

  return (
    <div className="section">
      <div className="container" style={{ display: "grid", gap: "1.5rem" }}>
        <div>
          <h1>AI Dashboard + Analytics</h1>
          <p className="muted">
            Theo dõi Top câu hỏi, Top sản phẩm được hỏi, tỉ lệ hài lòng và Intent distribution.
          </p>
        </div>

        <div className="grid grid-3">
          <div className="card">
            <h3>Tổng lượt chat</h3>
            <p className="muted" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {loading ? "..." : data?.totalChats ?? 0}
            </p>
          </div>
          <div className="card">
            <h3>Tỉ lệ hài lòng</h3>
            <p className="muted" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {loading ? "..." : `${(data?.satisfactionRate ?? 0).toFixed(2)}%`}
            </p>
          </div>
          <div className="card">
            <h3>Số intent</h3>
            <p className="muted" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
              {loading ? "..." : intentDistribution.length}
            </p>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Queries theo ngày</h3>
            <div style={{ width: "100%", height: 280 }}>
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                  <LineChart data={data?.dailyQueries ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>

          <div className="card">
            <h3>Intent distribution</h3>
            <div style={{ width: "100%", height: 280 }}>
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                  <BarChart data={intentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="intent" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f766e" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Feedback</h3>
            <div style={{ width: "100%", height: 260 }}>
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={200}>
                  <PieChart>
                    <Pie data={feedbackDistribution} dataKey="value" nameKey="name" outerRadius={90} fill="#14b8a6" />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>

          <div className="card">
            <h3>Agent distribution</h3>
            <div style={{ width: "100%", height: 260 }}>
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={200}>
                  <BarChart data={agentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0284c7" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Top câu hỏi</h3>
            <ul style={{ marginTop: "0.8rem", display: "grid", gap: "0.6rem" }}>
              {(data?.topQuestions ?? []).map((q) => (
                <li key={q.key}>
                  <strong>{q.value}</strong> - {q.key}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Top sản phẩm được hỏi</h3>
            <ul style={{ marginTop: "0.8rem", display: "grid", gap: "0.6rem" }}>
              {(data?.topProducts ?? []).map((p) => (
                <li key={p.key}>
                  <strong>{p.value}</strong> - {p.key}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
