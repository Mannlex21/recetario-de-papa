"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { agregarItemAMenu } from "@/app/actions/menu";
import { RecetaConIngredientes } from "@/types/receta";

type RecetaConFavoritos = RecetaConIngredientes & {
	readonly favoritos?: { id: string; userId: string; recetaId: string }[];
};

interface Props {
	readonly menuSemanalId: string;
	readonly diaSemana: string;
	readonly tipoComida: string;
	readonly recetas: RecetaConFavoritos[];
}

export default function AsignarRecetaModal({
	menuSemanalId,
	diaSemana,
	tipoComida,
	recetas,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [busqueda, setBusqueda] = useState("");
	const [recetaSeleccionada, setRecetaSeleccionada] = useState("");

	// Filtramos las recetas según lo que el usuario escriba en el buscador
	const recetasFiltradas = useMemo(() => {
		if (!busqueda.trim()) return recetas;
		const query = busqueda.toLowerCase();
		return recetas.filter(
			(r) =>
				r.titulo.toLowerCase().includes(query) ||
				r.categoria.toLowerCase().includes(query),
		);
	}, [busqueda, recetas]);

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setIsOpen(true);
					setBusqueda("");
					setRecetaSeleccionada("");
				}}
				className="text-[9px] font-mono text-amber-800 hover:underline cursor-pointer block mt-1"
			>
				+ Asignar
			</button>

			{isOpen &&
				typeof window !== "undefined" &&
				createPortal(
					<div className="fixed inset-0 z-[9999] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
						<div className="bg-[#faf8f5] border border-stone-200 w-full max-w-md p-6 shadow-2xl space-y-4 text-stone-800">
							<div className="flex justify-between items-baseline border-b border-stone-200 pb-2">
								<h3 className="font-serif text-lg text-stone-900">
									{diaSemana} - {tipoComida}
								</h3>
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									className="text-stone-400 hover:text-stone-700 text-xs font-mono cursor-pointer"
								>
									[cerrar]
								</button>
							</div>

							<form
								action={async (formData) => {
									if (!recetaSeleccionada) return;
									await agregarItemAMenu(formData);
									setIsOpen(false);
								}}
								className="space-y-4"
							>
								<input
									type="hidden"
									name="menuSemanalId"
									value={menuSemanalId}
								/>
								<input
									type="hidden"
									name="diaSemana"
									value={diaSemana}
								/>
								<input
									type="hidden"
									name="tipoComida"
									value={tipoComida}
								/>
								<input
									type="hidden"
									name="recetaId"
									value={recetaSeleccionada}
								/>

								<div className="space-y-2">
									<label
										htmlFor="buscador"
										className="font-mono text-stone-500 uppercase tracking-wider text-[10px] block"
									>
										Buscar Receta
									</label>
									<input
										id="buscador"
										type="text"
										value={busqueda}
										onChange={(e) =>
											setBusqueda(e.target.value)
										}
										placeholder="Escribe para filtrar por título o categoría..."
										className="w-full bg-white border border-stone-200 p-2 text-xs focus:outline-none focus:border-amber-700 text-stone-800"
									/>
								</div>

								{/* Lista desplazable con las recetas filtradas */}
								<div className="space-y-1">
									<span className="font-mono text-stone-400 uppercase tracking-wider text-[9px] block">
										Resultados ({recetasFiltradas.length})
									</span>
									<div className="max-h-48 overflow-y-auto border border-stone-200 bg-white divide-y divide-stone-100">
										{recetasFiltradas.length > 0 ? (
											recetasFiltradas.map((r) => {
												const esFavorita =
													r.favoritos &&
													r.favoritos.length > 0;
												const isSelected =
													recetaSeleccionada === r.id;

												return (
													<div
														key={r.id}
														onClick={() =>
															setRecetaSeleccionada(
																r.id,
															)
														}
														className={`p-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
															isSelected
																? "bg-amber-100/70 border-l-2 border-amber-800 font-semibold"
																: "hover:bg-stone-50"
														}`}
													>
														<span className="font-serif text-stone-800">
															{esFavorita
																? "★ "
																: ""}
															{r.titulo}
														</span>
														<span className="text-[10px] font-mono text-stone-400">
															{r.categoria}
														</span>
													</div>
												);
											})
										) : (
											<div className="p-4 text-center text-xs font-serif italic text-stone-400">
												No se encontraron recetas
											</div>
										)}
									</div>
								</div>

								<div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="px-3 py-1.5 border border-stone-300 text-stone-600 text-xs cursor-pointer"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={!recetaSeleccionada}
										className="px-3 py-1.5 bg-amber-800 text-white font-serif italic text-xs hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										Guardar
									</button>
								</div>
							</form>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
