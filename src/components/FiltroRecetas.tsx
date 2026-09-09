"use client";

import { useState } from "react";
import { RecetaConIngredientes } from "@/types/receta";
import RecetaCard from "@/components/RecetaCard";

// 1. Extendemos el tipo para incluir opcionalmente los favoritos en la receta
type RecetaConFavoritos = RecetaConIngredientes & {
	readonly favoritos?: { id: string; userId: string; recetaId: string }[];
};

interface Props {
	readonly recetas: RecetaConIngredientes[];
	readonly favoritoIds?: string[]; // Recibimos los IDs favoritos desde el Server Component
}

const CATEGORIAS = ["Todas", "Desayuno", "Comida", "Cena", "Postre"];
const ETIQUETAS_POPULARES = [
	"Sin Gluten",
	"Keto",
	"Express",
	"Económica",
	"Vegetariana",
];

export default function FiltroRecetas({ recetas, favoritoIds = [] }: Props) {
	const [busqueda, setBusqueda] = useState("");
	const [categoria, setCategoria] = useState("Todas");
	const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<
		string | null
	>(null);
	const [tiempoMax, setTiempoMax] = useState<number>(120);

	// 2. Aplicamos la lógica que pediste usando un Set para optimizar la búsqueda
	const setFavoritos = new Set(favoritoIds);
	const recetasConFavoritos: RecetaConFavoritos[] = recetas.map((receta) => ({
		...receta,
		favoritos: setFavoritos.has(receta.id)
			? [{ id: "fav", userId: "", recetaId: receta.id }]
			: [],
	}));

	// 3. Filtramos sobre el arreglo que ya contiene la propiedad de favoritos
	const recetasFiltradas = recetasConFavoritos.filter((receta) => {
		const coincideCategoria =
			categoria === "Todas" || receta.categoria === categoria;

		const query = busqueda.toLowerCase().trim();
		const coincideTexto =
			receta.titulo.toLowerCase().includes(query) ||
			receta.ingredientes.some((i) =>
				i.nombre.toLowerCase().includes(query),
			);

		const coincideTiempo = receta.tiempoPreparacionInt <= tiempoMax;

		const coincideEtiqueta =
			!etiquetaSeleccionada ||
			receta.etiquetas?.some((t) => t.nombre === etiquetaSeleccionada);

		return (
			coincideCategoria &&
			coincideTexto &&
			coincideTiempo &&
			coincideEtiqueta
		);
	});

	return (
		<div className="space-y-8">
			{/* Panel Superior de Controles */}
			<div className="bg-white border border-stone-200/80 p-6 shadow-sm space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<input
						type="text"
						placeholder="Buscar por título o ingrediente..."
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						className="w-full sm:w-80 bg-[#faf8f5] border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800 text-stone-800 font-sans"
					/>

					{/* Slider de Tiempo Máximo */}
					<div className="w-full sm:w-60 space-y-1">
						<div className="flex justify-between text-[11px] font-mono text-stone-500">
							<span>Tiempo máx:</span>
							<strong className="text-amber-800">
								{tiempoMax} min
							</strong>
						</div>
						<input
							type="range"
							min={10}
							max={120}
							step={5}
							value={tiempoMax}
							onChange={(e) =>
								setTiempoMax(Number(e.target.value))
							}
							className="w-full accent-amber-800 cursor-pointer"
						/>
					</div>
				</div>

				{/* Filtros de Categorías */}
				<div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
					<div className="flex flex-wrap gap-2 text-xs font-mono">
						{CATEGORIAS.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setCategoria(cat)}
								className={`px-3 py-1.5 transition-colors cursor-pointer ${
									categoria === cat
										? "bg-amber-800 text-white"
										: "bg-[#faf8f5] border border-stone-200 text-stone-600 hover:border-amber-800/40"
								}`}
							>
								{cat}
							</button>
						))}
					</div>

					{/* Filtro por Etiquetas/Tags */}
					<div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
						{ETIQUETAS_POPULARES.map((tag) => {
							const activa = etiquetaSeleccionada === tag;
							return (
								<button
									key={tag}
									type="button"
									onClick={() =>
										setEtiquetaSeleccionada(
											activa ? null : tag,
										)
									}
									className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
										activa
											? "bg-stone-800 text-stone-100"
											: "bg-stone-100 text-stone-500 hover:bg-stone-200"
									}`}
								>
									#{tag}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Grid de Recetas */}
			{recetasFiltradas.length === 0 ? (
				<div className="text-center py-20 border border-dashed border-stone-200 rounded-lg">
					<p className="font-serif italic text-stone-400">
						No hay recetas que cumplan con los criterios
						seleccionados.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{recetasFiltradas.map((receta) => (
						<RecetaCard key={receta.id} receta={receta} />
					))}
				</div>
			)}
		</div>
	);
}
