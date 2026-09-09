import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RecetaCard from "@/components/RecetaCard";
import { getFavoritoIds } from "../actions/favoritos";

export default async function MisRecetasPage() {
	const userId = "24dbf16e-a6b0-4ad6-8df3-da766a04d7e1";

	const recetas = await prisma.receta.findMany({
		where: { userId },
		include: {
			ingredientes: true,
			etiquetas: true,
			user: true,
			favoritos: {
				where: { userId },
			},
		},
		orderBy: { createdAt: "desc" },
	});
	const { data: idsFavoritos } = await getFavoritoIds();
	const setFavoritos = new Set(idsFavoritos || []);

	const recetasConFavoritos = (recetas || []).map((receta) => ({
		...receta,
		favoritos: setFavoritos.has(receta.id)
			? [{ id: "fav", userId: "", recetaId: receta.id }]
			: [],
	}));

	return (
		<main className="min-h-screen bg-[#faf8f5] text-stone-800 p-6 md:p-12">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Cabecera */}
				<div className="flex justify-between items-baseline border-b border-stone-200 pb-4">
					<div>
						<h1 className="font-serif text-3xl text-stone-900">
							Mis Recetas
						</h1>
						<p className="text-xs font-mono text-stone-500 mt-1">
							Administra tu recetario personal ({recetas.length}{" "}
							recetas registradas)
						</p>
					</div>
					<Link
						href="/mis-recetas/nueva"
						className="px-4 py-2 bg-amber-800 text-white font-serif italic text-xs hover:bg-amber-900 transition-colors cursor-pointer"
					>
						+ Nueva Receta
					</Link>
				</div>

				{/* Listado de Recetas */}
				{recetas.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{recetasConFavoritos.map((receta) => (
							<RecetaCard key={receta.id} receta={receta} />
						))}
					</div>
				) : (
					<div className="text-center py-16 bg-white border border-stone-200 space-y-3">
						<p className="font-serif italic text-stone-500 text-sm">
							Aún no tienes recetas registradas en tu recetario.
						</p>
						<p className="text-xs font-mono text-stone-400">
							Ejecuta el seed o añade una nueva para empezar.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
