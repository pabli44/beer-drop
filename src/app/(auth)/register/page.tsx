import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-500 mt-2">
            Regístrate para pedir tu cerveza artesanal
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <RegisterForm />

          <div className="mt-4 text-center text-sm text-gray-500">
            Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-amber-700 hover:text-amber-600 font-medium"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
