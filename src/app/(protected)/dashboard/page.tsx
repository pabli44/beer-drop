"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import { OrderSummary } from "@/components/order/OrderSummary";

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok && !cancelled) {
          setOrders(await res.json());
        } else if (res.status === 401 && !cancelled) {
          router.push("/login");
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-500 mt-1">Historial de tus pedidos</p>
        </div>
        <button
          onClick={() => router.push("/menu")}
          className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
        >
          Nuevo Pedido
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <span className="text-5xl">🍺</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Sin pedidos an
          </h2>
          <p className="text-gray-500 mt-2">
            Hace tu primer pedido de cerveza artesanal
          </p>
          <button
            onClick={() => router.push("/menu")}
            className="mt-4 bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Ver Carta
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderSummary key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
