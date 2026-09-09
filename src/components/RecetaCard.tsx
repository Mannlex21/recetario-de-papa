import Link from "next/link";
import { RecetaConIngredientes } from "@/types/receta";

type RecetaConFavoritos = RecetaConIngredientes & {
	readonly favoritos?: { id: string; userId: string; recetaId: string }[];
};

interface Props {
	readonly receta: RecetaConFavoritos;
}

export default function RecetaCard({ receta }: Props) {
	const esFavorita = receta.favoritos && receta.favoritos.length > 0;

	return (
		<Link
			href={`/recetas/${receta.slug}`}
			className="bg-white border border-stone-200 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-amber-800 transition-colors group cursor-pointer"
		>
			<div className="space-y-2">
				<div className="flex justify-between items-start">
					<span className="text-[10px] font-mono uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5">
						{receta.categoria}
					</span>
					{esFavorita && (
						<span className="text-amber-600 text-sm">★</span>
					)}
				</div>

				<h2 className="font-serif text-lg text-stone-900 leading-snug group-hover:text-amber-900 transition-colors">
					{receta.titulo}
				</h2>

				<p className="text-xs text-stone-600 line-clamp-2 font-serif italic">
					{receta.descripcion || "Sin descripción proporcionada."}
				</p>
			</div>

			<div className="pt-4 border-t border-stone-100 flex justify-between items-center text-[11px] font-mono text-stone-500">
				<span>⏱ {receta.tiempoPreparacionInt} min</span>
				<span>🍽 {receta.porciones} porciones</span>
			</div>
		</Link>
	);
}
