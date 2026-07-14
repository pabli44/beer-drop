import type { Order } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import Link from "next/link";

interface OrderSummaryProps {
  order: Order;
  showLink?: boolean;
}

export function OrderSummary({ order, showLink = true }: OrderSummaryProps) {
  const total = Number(order.totalAmount);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-500">
            Pedido #{order.id.slice(-8)}
          </p>
          <p className="text-xs text-gray-400">
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
        <div className="border-t pt-3 mt-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm py-1"
            >
              <span className="text-gray-700">
                {item.beer?.name || "Cerveza"} - {item.quantity}L
              </span>
              <span className="text-gray-500">
                ${(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="border-t mt-3 pt-3 flex justify-between items-center">
        <span className="font-bold text-lg">Total</span>
        <span className="font-bold text-amber-700 text-lg">
          ${total.toFixed(2)}
        </span>
      </div>

      {showLink && (
        <Link
          href={`/order/${order.id}`}
          className="mt-3 block text-center text-amber-700 hover:text-amber-600 text-sm font-medium"
        >
          Ver detalles
        </Link>
      )}
    </div>
  );
}
