"use client";

import { useRef } from "react";
import BotonVolver from "@/components/BotonVolver";
import BotonFavorito from "@/components/BotonFavorito";
import BotonCompartirMenu from "@/components/BotonCompartirMenu";
import AccionesReceta from "@/components/AccionesReceta";
import { RecetaConIngredientes } from "@/types/receta";

interface Props {
	readonly receta: RecetaConIngredientes;
	readonly esFavorito: boolean;
	readonly esCreador: boolean;
}

export default function DetalleRecetaCliente({
	receta,
	esFavorito,
	esCreador,
}: Props) {
	const recetaRef = useRef<HTMLDivElement>(null);

	return (
		<main className="max-w-3xl mx-auto px-8 space-y-12">
			{/* Barra superior de navegación y acciones */}
			<div className="flex items-center justify-between border-b border-stone-200 pb-4">
				<BotonVolver />

				<div className="flex items-center gap-2">
					<BotonFavorito
						recetaId={receta.id}
						esFavoritoInicial={esFavorito}
					/>

					{/* Pasa la referencia del DOM para habilitar la descarga en PNG */}
					<BotonCompartirMenu receta={receta} targetRef={recetaRef} />

					{esCreador && <AccionesReceta receta={receta} />}
				</div>
			</div>

			{/* Contenedor capturable como PNG */}
			<div
				ref={recetaRef}
				className="bg-[#faf8f5] sm:p-4 space-y-12 rounded-sm"
			>
				<header className="text-center space-y-4 border-b border-stone-200 pb-10">
					{/* Categoría y Etiquetas */}
					<div className="flex flex-wrap justify-center items-center gap-2 pt-1">
						<span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded">
							{receta.categoria}
						</span>
						{receta.etiquetas?.map((t) => (
							<span
								key={t.id}
								className="text-[10px] font-mono text-stone-600 bg-stone-100 border border-stone-200/60 px-2 py-0.5 rounded"
							>
								#{t.nombre}
							</span>
						))}
					</div>

					<h1 className="font-serif text-4xl sm:text-5xl text-stone-900">
						{receta.titulo}
					</h1>
					<p className="text-stone-500 italic font-serif leading-relaxed max-w-xl mx-auto text-base">
						{receta.descripcion}
					</p>

					<div className="flex justify-center items-center gap-8 pt-4 font-mono text-xs text-stone-500">
						<div>
							<span className="block text-[9px] uppercase tracking-widest text-stone-400">
								Tiempo
							</span>
							{receta.tiempoPreparacionInt} minutos
						</div>
						<div className="w-px h-6 bg-stone-200" />
						<div>
							<span className="block text-[9px] uppercase tracking-widest text-stone-400">
								Porciones
							</span>
							{receta.porciones}{" "}
							{receta.porciones === 1 ? "persona" : "personas"}
						</div>
					</div>
				</header>

				<section className="space-y-4">
					<h2 className="font-mono text-xs tracking-widest uppercase text-amber-800 border-b border-amber-800/20 pb-2">
						Ingredientes Necesarios
					</h2>
					<ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2 text-sm text-stone-700">
						{receta.ingredientes.map((ing) => (
							<li
								key={ing.id}
								className="flex justify-between border-b border-stone-100 pb-2"
							>
								<span className="text-stone-800">
									{ing.nombre}
								</span>
								<span className="font-mono text-xs text-amber-800/80">
									{ing.cantidad}
								</span>
							</li>
						))}
					</ul>
				</section>

				<section className="space-y-4 pt-4">
					<h2 className="font-mono text-xs tracking-widest uppercase text-amber-800 border-b border-amber-800/20 pb-2">
						Instrucciones de Preparación
					</h2>
					<div
						className="prose prose-stone max-w-none text-xs font-serif text-stone-800 
    [&_strong]:font-bold [&_strong]:text-stone-900 
    [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
						dangerouslySetInnerHTML={{
							__html: receta.instrucciones,
						}}
					/>
				</section>

				{/* Pie de página para la captura de imagen */}
				<div className="pt-6 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-400 font-mono">
					<span>✨ Recetario</span>
					<span>
						{typeof window !== "undefined"
							? window.location.host
							: ""}
					</span>
				</div>
			</div>
		</main>
	);
}
