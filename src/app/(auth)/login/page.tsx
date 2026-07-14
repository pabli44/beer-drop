import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesin</h1>
          <p className="text-gray-500 mt-2">
            Ingresa a tu cuenta de Beer Drop
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <LoginForm />

          <div className="mt-4 text-center text-sm text-gray-500">
            No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-amber-700 hover:text-amber-600 font-medium"
            >
              Registrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
