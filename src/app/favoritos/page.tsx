import Link from "next/link";
import { getRecetasFavoritas, getFavoritoIds } from "@/app/actions/favoritos";
import RecetaCard from "@/components/RecetaCard";

export default async function FavoritosPage() {
	const { data: recetas } = await getRecetasFavoritas();
	const { data: idsFavoritos } = await getFavoritoIds();
	const setFavoritos = new Set(idsFavoritos || []);

	// Mapeamos las recetas para inyectarles la propiedad de favoritos que espera RecetaCard
	const recetasConFavoritos = (recetas || []).map((receta) => ({
		...receta,
		favoritos: setFavoritos.has(receta.id)
			? [{ id: "fav", userId: "", recetaId: receta.id }]
			: [],
	}));

	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased font-sans">
			<main className="max-w-6xl mx-auto px-8 py-16 space-y-12">
				<header className="border-b border-stone-200 pb-8 text-center max-w-2xl mx-auto space-y-3">
					<p className="text-xs font-mono tracking-widest text-amber-800 uppercase">
						Selección Especial
					</p>
					<h1 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-tight">
						Recetas Favoritas
					</h1>
					<p className="text-stone-500 text-xs sm:text-sm italic font-serif leading-relaxed">
						Tu colección personal de platillos guardados para acceso
						rápido.
					</p>
				</header>

				{!recetasConFavoritos || recetasConFavoritos.length === 0 ? (
					<div className="text-center py-20 border border-dashed border-stone-200 rounded-lg space-y-3">
						<p className="font-serif italic text-stone-400">
							Aún no has guardado recetas en tus favoritos.
						</p>
						<Link
							href="/"
							className="inline-block font-mono text-xs text-amber-800 hover:underline"
						>
							Explorar catálogo completo →
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{recetasConFavoritos.map((receta) => (
							<RecetaCard key={receta.id} receta={receta} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}
