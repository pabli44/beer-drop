import type { Beer } from "@/types";

interface BeerCardProps {
  beer: Beer;
  showStock?: boolean;
  onSelect?: (beer: Beer) => void;
  selected?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export function BeerCard({
  beer,
  showStock = false,
  onSelect,
  selected = false,
  quantity = 0,
  onQuantityChange,
}: BeerCardProps) {
  const stock = Number(beer.stockInLiters);
  const price = Number(beer.pricePerLiter);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
        selected ? "ring-2 ring-amber-500 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
        {beer.imageUrl ? (
          <img
            src={beer.imageUrl}
            alt={beer.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-6xl">🍺</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{beer.name}</h3>
        {beer.description && (
          <p className="text-gray-500 text-sm mt-1">{beer.description}</p>
        )}

        <div className="mt-3 flex justify-between items-center">
          <span className="text-amber-700 font-bold text-xl">
            ${price.toFixed(2)} <span className="text-sm font-normal">/litro</span>
          </span>
          {showStock && (
            <span
              className={`text-sm ${
                stock > 10
                  ? "text-green-600"
                  : stock > 0
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {stock > 0 ? `${stock}L disponible${stock !== 1 ? "s" : ""}` : "Sin stock"}
            </span>
          )}
        </div>

        {onSelect && (
          <div className="mt-4">
            {selected ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onQuantityChange?.(Math.max(0.5, quantity - 0.5))}
                  className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-medium min-w-[3rem] text-center">
                  {quantity}L
                </span>
                <button
                  onClick={() =>
                    onQuantityChange?.(Math.min(stock, quantity + 0.5))
                  }
                  disabled={quantity >= stock}
                  className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelect(beer)}
                disabled={stock <= 0}
                className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-gray-300 text-white py-2 rounded-md transition-colors"
              >
                {stock > 0 ? "Agregar" : "Sin stock"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
