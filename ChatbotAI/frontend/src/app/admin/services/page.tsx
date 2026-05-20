"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceCatalogItem } from "@/lib/serviceCatalog";
import { DEFAULT_SERVICES, loadServiceCatalog, saveServiceCatalog } from "@/lib/serviceCatalog";

const CATEGORY_LABELS: Record<ServiceCatalogItem["category"], string> = {
  assembly: "Lắp Ráp",
  delivery: "Vận Chuyển",
  support: "Hỗ Trợ",
  consultation: "Tư Vấn",
};

const EMPTY_SERVICE: ServiceCatalogItem = {
  id: "",
  name: "",
  category: "support",
  price: 0,
  description: "",
  features: [],
  icon: "🔧",
  duration: "",
  inStock: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceCatalogItem[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceCatalogItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceCatalogItem | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/services");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setServices(data);
            setLoading(false);
            return;
          }
          if (Array.isArray((data as any).services)) {
            setServices((data as any).services);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // ignore and fall back
      }
      setServices(loadServiceCatalog());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) saveServiceCatalog(services);
  }, [services, loading]);

  const stats = useMemo(
    () => ({
      total: services.length,
      assembly: services.filter((s) => s.category === "assembly").length,
      delivery: services.filter((s) => s.category === "delivery").length,
      support: services.filter((s) => s.category === "support").length,
      consultation: services.filter((s) => s.category === "consultation").length,
    }),
    [services]
  );

  const openAdd = () => {
    setEditing({ ...EMPTY_SERVICE, id: `service-${Date.now()}` });
    setFeatureInput("");
    setShowForm(true);
  };

  const openEdit = (s: ServiceCatalogItem) => {
    setEditing(s);
    setFeatureInput(s.features.join(", "));
    setShowForm(true);
  };

  const save = async () => {
    if (!editing) return;
    const features = featureInput.split(",").map((f) => f.trim()).filter(Boolean);
    const updated = { ...editing, features };

    let next: ServiceCatalogItem[];
    if (services.find((s) => s.id === updated.id)) {
      next = services.map((s) => (s.id === updated.id ? updated : s));
      setServices(next);
    } else {
      next = [...services, updated];
      setServices(next);
    }
    setShowForm(false);
    setEditing(null);

    try {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: next }),
      });
    } catch {
      // ignore persistence errors
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const next = services.filter((s) => s.id !== deleteTarget.id);
    setServices(next);
    setDeleteTarget(null);
    try {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: next }),
      });
    } catch {
      // ignore
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Dịch vụ</h1>
        <button type="button"
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thêm dịch vụ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Tổng số", val: stats.total, color: "bg-blue-50 text-blue-700" },
          { label: "Lắp ráp", val: stats.assembly, color: "bg-green-50 text-green-700" },
          { label: "Vận chuyển", val: stats.delivery, color: "bg-orange-50 text-orange-700" },
          { label: "Hỗ trợ", val: stats.support, color: "bg-purple-50 text-purple-700" },
          { label: "Tư vấn", val: stats.consultation, color: "bg-indigo-50 text-indigo-700" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-lg ${s.color} border border-current opacity-80`}>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-2xl font-bold">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Dịch vụ</th>
              <th className="p-4 font-semibold text-center">Danh mục</th>
              <th className="p-4 font-semibold text-right">Giá</th>
              <th className="p-4 font-semibold text-center">Trạng thái</th>
              <th className="p-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {CATEGORY_LABELS[s.category]}
                  </span>
                </td>
                <td className="p-4 text-right font-medium">
                  {s.price.toLocaleString()}đ
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {s.inStock ? "Hoạt động" : "Tạm ngưng" }
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button type="button" onClick={() => openEdit(s)} className="text-blue-600 hover:underline mr-4 px-2">Sửa</button>
                  <button type="button" onClick={() => setDeleteTarget(s)} className="text-red-600 hover:underline px-2">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">{editing.id.startsWith("service-") && !services.find(s=>s.id===editing.id) ? "Thêm dịch vụ mới" : "Chỉnh sửa dịch vụ"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Tên dịch vụ</label>
                <input
                  className="w-full border rounded p-2"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <select
                  className="w-full border rounded p-2"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                <input
                  className="w-full border rounded p-2"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Đặc điểm (cách nhau bởi dấu phẩy)</label>
                <textarea
                  className="w-full border rounded p-2 h-20"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Biểu tượng (Emoji)</label>
                <input
                  className="w-full border rounded p-2"
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thời gian hoàn thành</label>
                <input
                  className="w-full border rounded p-2"
                  placeholder="Ví dụ: 2-4 giờ"
                  value={editing.duration}
                  onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={editing.inStock}
                  onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })}
                />
                <label htmlFor="inStock">Sẵn sàng cung cấp</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Hủy</button>
              <button type="button" onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">Bạn có chắc muốn xóa dịch vụ "{deleteTarget.name}"? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 border rounded">Hủy</button>
              <button type="button" onClick={remove} className="px-4 py-2 bg-red-600 text-white rounded">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
