"use client";

import { useEffect, useState } from "react";
import type { Beer } from "@/types";

export default function NewOrderPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [selectedBeer, setSelectedBeer] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/beers")
      .then((res) => res.json())
      .then((data) => setBeers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBeer) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ beerId: selectedBeer, quantity }],
        }),
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
      setError("Error al crear el pedido");
    } finally {
      setSubmitting(false);
    }
  }

  const selected = beers.find((b) => b.id === selectedBeer);
  const total = selected ? Number(selected.pricePerLiter) * quantity : 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo Pedido</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona tu cerveza
          </label>
          <select
            value={selectedBeer}
            onChange={(e) => setSelectedBeer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">-- Elegir cerveza --</option>
            {beers
              .filter((b) => b.isActive && Number(b.stockInLiters) > 0)
              .map((beer) => (
                <option key={beer.id} value={beer.id}>
                  {beer.name} - ${Number(beer.pricePerLiter).toFixed(2)}/L (
                  {beer.stockInLiters}L disponible)
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de litros
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            max={selected ? Number(selected.stockInLiters) : 100}
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0.5)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {selected && (
          <div className="bg-amber-50 p-4 rounded-md">
            <div className="flex justify-between text-sm">
              <span>
                {quantity}L x ${Number(selected.pricePerLiter).toFixed(2)}/L
              </span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-amber-200">
              <span>Total</span>
              <span className="text-amber-700">${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedBeer || submitting}
          className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-gray-400 text-white py-3 rounded-md transition-colors font-bold text-lg"
        >
          {submitting ? "Procesando..." : "Ir a Pagar"}
        </button>
      </form>
    </div>
  );
}
