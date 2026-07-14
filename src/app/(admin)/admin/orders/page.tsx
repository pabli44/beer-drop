"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";

const STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok && !cancelled) {
          setOrders(await res.json());
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const listRes = await fetch("/api/orders");
        if (listRes.ok) setOrders(await listRes.json());
      }
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestionar Pedidos
          </h1>
          <p className="text-gray-500 mt-1">Administra los pedidos recibidos</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/beers"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
          >
            Cervezas
          </a>
          <a
            href="/admin/users"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
          >
            Usuarios
          </a>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <span className="text-5xl">📋</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Sin pedidos an
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pedido
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Accin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm">
                      #{order.id.slice(-8)}
                    </span>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {order.user?.name || "N/A"}
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {order.items?.map((item) => (
                      <div key={item.id}>
                        {item.beer?.name} - {item.quantity}L
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-medium text-amber-700">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
