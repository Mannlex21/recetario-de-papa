"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		router.push("/");
		router.refresh();
	};

	return (
		<div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 font-sans text-stone-800">
			<div className="max-w-md w-full bg-white border border-stone-200/80 p-8 rounded-xl shadow-sm space-y-6">
				<div className="text-center space-y-2">
					<h1 className="font-serif text-3xl italic text-stone-900">
						Iniciar Sesión
					</h1>
					<p className="text-stone-500 font-serif text-xs">
						Ingresa a tu recetario y menú personal
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-4">
					<div className="space-y-1">
						<label className="text-xs font-serif text-stone-700">
							Correo electrónico
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-800"
							placeholder="chef@ejemplo.com"
						/>
					</div>

					<div className="space-y-1">
						<label className="text-xs font-serif text-stone-700">
							Contraseña
						</label>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-800"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-amber-800 text-white font-serif italic text-sm py-2.5 rounded hover:bg-amber-900 transition-colors disabled:opacity-50"
					>
						{loading ? "Entrando..." : "Entrar"}
					</button>
				</form>

				<p className="text-center text-xs text-stone-500 font-serif">
					¿Aún no tienes cuenta?{" "}
					<Link
						href="/signup"
						className="text-amber-800 underline underline-offset-2 hover:text-amber-900"
					>
						Regístrate aquí
					</Link>
				</p>
			</div>
		</div>
	);
}
