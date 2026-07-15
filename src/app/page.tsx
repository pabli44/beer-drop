import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="bg-gradient-to-br from-amber-800 to-amber-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight">
            Beer Drop
          </h1>
          <p className="text-xl sm:text-2xl text-amber-200 mb-8 max-w-2xl mx-auto">
            Cerveza artesanal de calidad, pedida por litros. Recíbela fresca
            directamente en tu zona.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Ver Carta
            </Link>
            <Link
              href="/register"
              className="border-2 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Como funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🍺</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Elige tu cerveza
            </h3>
            <p className="text-gray-600">
              Selecciona de nuestra carta de cervezas artesanales la que más te
              guste.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pide por litros
            </h3>
            <p className="text-gray-600">
              Cantidad exacta de litros que necesitas. Sin desperdicios.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Recibe tu pedido
            </h3>
            <p className="text-gray-600">
              Preparamos tu pedido y lo tenemos listo para que lo recojas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
