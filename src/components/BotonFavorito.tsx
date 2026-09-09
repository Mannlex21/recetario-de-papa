"use client";

import { useState } from "react";
import { toggleFavorito } from "@/app/actions/favoritos";

interface BotonFavoritoProps {
	readonly recetaId: string;
	readonly esFavoritoInicial: boolean;
}

export default function BotonFavorito({
	recetaId,
	esFavoritoInicial,
}: BotonFavoritoProps) {
	const [esFavorito, setEsFavorito] = useState(esFavoritoInicial);
	const [loading, setLoading] = useState(false);

	const handleToggle = async () => {
		if (loading) return;
		setLoading(true);

		// Cambio optimista
		setEsFavorito(!esFavorito);

		const res = await toggleFavorito(recetaId);
		if (!res.success) {
			setEsFavorito((favoritoActual) => !favoritoActual); // Revertir si hay error
		}
		setLoading(false);
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			disabled={loading}
			className={`p-2 rounded-full border transition-colors cursor-pointer ${
				esFavorito
					? "bg-amber-50 border-amber-300 text-amber-800"
					: "bg-white border-stone-200 text-stone-400 hover:text-stone-700"
			}`}
			title={esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill={esFavorito ? "currentColor" : "none"}
				stroke="currentColor"
				strokeWidth="2"
				className="w-5 h-5"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
				/>
			</svg>
		</button>
	);
}
