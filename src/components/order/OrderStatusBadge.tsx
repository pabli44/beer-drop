import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Pagado", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Preparando", color: "bg-orange-100 text-orange-800" },
  READY: { label: "Listo", color: "bg-green-100 text-green-800" },
  DELIVERED: { label: "Entregado", color: "bg-gray-100 text-gray-800" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
