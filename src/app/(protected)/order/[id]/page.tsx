"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = params.id as string;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setOrder(data);

          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("success") === "true") {
            const retryRes = await fetch(`/api/orders/${id}`);
            if (retryRes.ok) {
              setOrder(await retryRes.json());
            }
          }
        } else if (res.status === 404 && !cancelled) {
          setError("Pedido no encontrado");
        }
      } catch {
        if (!cancelled) setError("Error al cargar el pedido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handlePay() {
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Error al procesar el pago");
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido #{order.id.slice(-8)}
            </h1>
            <p className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {order.items && order.items.length > 0 && (
          <div className="border-t pt-4">
            <h2 className="font-bold text-gray-900 mb-3">Items</h2>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2 border-b last:border-b-0"
              >
                <div>
                  <span className="font-medium">
                    {item.beer?.name || "Cerveza"}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {item.quantity}L x ${Number(item.unitPrice).toFixed(2)}/L
                  </span>
                </div>
                <span className="font-medium">
                  ${(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-amber-700">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {order.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Notas:</strong> {order.notes}
            </p>
          </div>
        )}

        {order.status === "PENDING" && (
          <div className="mt-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">
                {error}
              </div>
            )}
            <button
              onClick={handlePay}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-md transition-colors font-bold text-lg"
            >
              Pagar Ahora
            </button>
          </div>
        )}

        {order.status === "PAID" && (
          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <p className="text-blue-800 text-sm">
              Tu pago ha sido confirmado. Tu pedido est en preparacin.
            </p>
          </div>
        )}

        {order.status === "PREPARING" && (
          <div className="mt-6 bg-orange-50 p-4 rounded-md">
            <p className="text-orange-800 text-sm">
              Tu pedido se est preparando. Te notificaremos cuando est listo.
            </p>
          </div>
        )}

        {order.status === "READY" && (
          <div className="mt-6 bg-green-50 p-4 rounded-md">
            <p className="text-green-800 text-sm font-medium">
              Tu pedido est listo para recoger!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
