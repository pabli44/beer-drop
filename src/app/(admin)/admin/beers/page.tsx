"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Beer } from "@/types";

export default function AdminBeersPage() {
  const router = useRouter();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [stockInLiters, setStockInLiters] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBeers();
  }, []);

  async function fetchBeers() {
    try {
      const res = await fetch("/api/beers");
      if (res.ok) {
        const data = await res.json();
        setBeers(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingBeer(null);
    setName("");
    setDescription("");
    setPricePerLiter("");
    setStockInLiters("");
    setImageUrl("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(beer: Beer) {
    setEditingBeer(beer);
    setName(beer.name);
    setDescription(beer.description || "");
    setPricePerLiter(beer.pricePerLiter.toString());
    setStockInLiters(beer.stockInLiters.toString());
    setImageUrl(beer.imageUrl || "");
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      name,
      description: description || undefined,
      pricePerLiter: parseFloat(pricePerLiter),
      stockInLiters: parseFloat(stockInLiters),
      imageUrl: imageUrl || undefined,
    };

    try {
      const url = editingBeer ? `/api/beers/${editingBeer.id}` : "/api/beers";
      const method = editingBeer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      setShowForm(false);
      fetchBeers();
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Desactivar esta cerveza?")) return;

    try {
      await fetch(`/api/beers/${id}`, { method: "DELETE" });
      fetchBeers();
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestionar Cervezas
          </h1>
          <p className="text-gray-500 mt-1">Administra el catlogo</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateForm}
            className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Nueva Cerveza
          </button>
          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
          >
            Pedidos
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBeer ? "Editar Cerveza" : "Nueva Cerveza"}
            </h2>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripcin
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio/L ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={pricePerLiter}
                    onChange={(e) => setPricePerLiter(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock (L)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={stockInLiters}
                    onChange={(e) => setStockInLiters(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL imagen (opcional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-700 hover:bg-amber-600 disabled:bg-gray-400 text-white py-2 rounded-md transition-colors font-medium"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div>
        </div>
      ) : beers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <span className="text-5xl">🍺</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Sin cervezas registradas
          </h2>
          <button
            onClick={openCreateForm}
            className="mt-4 bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-md"
          >
            Agregar primera cerveza
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beers.map((beer) => (
            <div
              key={beer.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                !beer.isActive ? "opacity-50" : ""
              }`}
            >
              <div className="h-32 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                {beer.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={beer.imageUrl}
                    alt={beer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🍺</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{beer.name}</h3>
                  {!beer.isActive && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ${Number(beer.pricePerLiter).toFixed(2)}/L
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {beer.stockInLiters}L
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEditForm(beer)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(beer.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-1.5 rounded text-sm"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
