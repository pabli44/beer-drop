"use client";

import { useEffect, useState } from "react";
import type { Beer, CartItem } from "@/types";
import { BeerCard } from "@/components/beer/BeerCard";

export default function MenuPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/beers");
        if (res.ok && !cancelled) {
          setBeers(await res.json());
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

  function handleSelect(beer: Beer) {
    const newCart = new Map(cart);
    newCart.set(beer.id, { beerId: beer.id, beer, quantity: 0.5 });
    setCart(newCart);
  }

  function handleQuantityChange(beerId: string, quantity: number) {
    if (quantity <= 0) {
      const newCart = new Map(cart);
      newCart.delete(beerId);
      setCart(newCart);
    } else {
      const newCart = new Map(cart);
      const item = newCart.get(beerId);
      if (item) {
        newCart.set(beerId, { ...item, quantity });
        setCart(newCart);
      }
    }
  }

  function getTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += Number(item.beer.pricePerLiter) * item.quantity;
    });
    return total;
  }

  async function handleOrder() {
    if (cart.size === 0) return;

    setOrdering(true);
    setError("");

    try {
      const items = Array.from(cart.values()).map((item) => ({
        beerId: item.beerId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
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
      setOrdering(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuestra Carta</h1>
        <p className="text-gray-500 mt-1">
          Selecciona tu cerveza y la cantidad de litros
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando carta...</p>
        </div>
      ) : beers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <span className="text-5xl">🍺</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Sin cervezas disponibles
          </h2>
          <p className="text-gray-500 mt-2">
            Vuelve pronto, estamos preparando algo especial
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beers.map((beer) => {
              const cartItem = cart.get(beer.id);
              return (
                <BeerCard
                  key={beer.id}
                  beer={beer}
                  showStock
                  onSelect={() => handleSelect(beer)}
                  selected={!!cartItem}
                  quantity={cartItem?.quantity || 0}
                  onQuantityChange={(q) => handleQuantityChange(beer.id, q)}
                />
              );
            })}
          </div>

          {cart.size > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {cart.size} producto{cart.size !== 1 ? "s" : ""} seleccionado
                    {cart.size !== 1 ? "s" : ""}
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    ${getTotal().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={ordering}
                  className="bg-amber-700 hover:bg-amber-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  {ordering ? "Procesando..." : "Ir a Pagar"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
