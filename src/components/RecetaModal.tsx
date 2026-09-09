"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { createReceta, updateReceta } from "@/app/actions/recetas";
import { RecetaConIngredientes, IngredienteInput } from "@/types/receta";
import EditorInstrucciones from "@/components/EditorInstrucciones";

interface Props {
	readonly receta?: RecetaConIngredientes; // Si se pasa, funciona como Edición; si no, como Creación
}

export default function RecetaModal({ receta }: Props) {
	const isEditing = Boolean(receta);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [instrucciones, setInstrucciones] = useState(
		receta?.instrucciones || "",
	);
	const [ingredientes, setIngredientes] = useState<IngredienteInput[]>(
		receta?.ingredientes && receta.ingredientes.length > 0
			? receta.ingredientes.map((i) => ({
					nombre: i.nombre,
					cantidad: i.cantidad,
				}))
			: [{ nombre: "", cantidad: "" }],
	);

	const handleAddIngrediente = () => {
		setIngredientes((prev) => [...prev, { nombre: "", cantidad: "" }]);
	};

	const handleRemoveIngrediente = (index: number) => {
		setIngredientes((prev) => prev.filter((_, i) => i !== index));
	};

	const handleIngredienteChange = (
		index: number,
		field: keyof IngredienteInput,
		value: string,
	) => {
		setIngredientes((prev) =>
			prev.map((item, i) =>
				i === index ? { ...item, [field]: value } : item,
			),
		);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		formData.append("ingredientes", JSON.stringify(ingredientes));
		formData.set("instrucciones", instrucciones);

		const result = isEditing
			? await updateReceta(receta!.id, formData)
			: await createReceta(formData);

		setLoading(false);

		if (result.success) {
			setIsOpen(false);
			if (!isEditing) {
				setIngredientes([{ nombre: "", cantidad: "" }]);
				setInstrucciones("");
			}
		} else {
			setError(result.error || "Error al guardar la receta");
		}
	};

	return (
		<>
			{/* Botón dinámico según el modo */}
			{isEditing ? (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="p-2 rounded-full border border-stone-200 bg-white text-stone-400 hover:text-stone-700 hover:border-stone-300 transition-colors cursor-pointer"
					title="Editar receta"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-4 h-4"
					>
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
					</svg>
				</button>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="font-serif italic text-sm text-amber-800 border border-amber-800/30 px-5 py-2 hover:bg-amber-800 hover:text-white transition-all duration-200 cursor-pointer"
				>
					+ Nueva Receta
				</button>
			)}

			{isOpen &&
				typeof window !== "undefined" &&
				createPortal(
					<div className="fixed inset-0 z-[9999] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
						{/* Contenedor Principal del Modal: Flex vertical y altura máxima fija */}
						<div className="bg-[#faf8f5] border border-stone-200 w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col text-stone-800 overflow-hidden">
							{/* Cabecera (Fija arriba) con Icono X */}
							<div className="flex justify-between items-center px-6 sm:px-8 py-4 border-b border-stone-200 bg-[#faf8f5] shrink-0">
								<h2 className="font-serif text-2xl text-stone-900">
									{isEditing
										? "Editar Receta"
										: "Agregar Nueva Receta"}
								</h2>
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md hover:bg-stone-200/50 transition-colors cursor-pointer"
									title="Cerrar"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-5 h-5"
									>
										<line
											x1="18"
											y1="6"
											x2="6"
											y2="18"
										></line>
										<line
											x1="6"
											y1="6"
											x2="18"
											y2="18"
										></line>
									</svg>
								</button>
							</div>

							{/* Formulario envuelve el contenido scrolleable y el footer */}
							<form
								onSubmit={handleSubmit}
								className="flex flex-col flex-1 overflow-hidden"
							>
								{/* Cuerpo con Scroll Interno */}
								<div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-4 text-xs font-sans">
									{error && (
										<p className="text-xs text-red-600 font-mono">
											{error}
										</p>
									)}

									{/* Título */}
									<div className="space-y-1">
										<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
											Título de la Receta
										</label>
										<input
											type="text"
											name="titulo"
											defaultValue={receta?.titulo || ""}
											required
											placeholder="ej. Pasta Pesto Casera"
											className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800 font-serif"
										/>
									</div>

									{/* Categoría, Tiempo y Porciones */}
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<div className="space-y-1">
											<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
												Categoría
											</label>
											<select
												name="categoria"
												defaultValue={
													receta?.categoria ||
													"Desayuno"
												}
												className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800"
											>
												<option value="Desayuno">
													Desayuno
												</option>
												<option value="Comida">
													Comida
												</option>
												<option value="Cena">
													Cena
												</option>
												<option value="Postre">
													Postre
												</option>
											</select>
										</div>

										<div className="space-y-1">
											<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
												Tiempo (min)
											</label>
											<input
												type="number"
												name="tiempoPreparacionInt"
												defaultValue={
													receta?.tiempoPreparacionInt ||
													30
												}
												required
												min={1}
												className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800"
											/>
										</div>

										<div className="space-y-1">
											<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
												Porciones
											</label>
											<input
												type="number"
												name="porciones"
												defaultValue={
													receta?.porciones || 2
												}
												required
												min={1}
												className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800"
											/>
										</div>
									</div>

									{/* Etiquetas */}
									<div className="space-y-1">
										<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
											Etiquetas (separadas por coma)
										</label>
										<input
											type="text"
											name="etiquetas"
											defaultValue={
												receta?.etiquetas
													?.map((t) => t.nombre)
													.join(", ") || ""
											}
											placeholder="ej. Sin Gluten, Keto, Express"
											className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800 font-sans"
										/>
									</div>

									{/* Descripción */}
									<div className="space-y-1">
										<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
											Descripción Corta
										</label>
										<textarea
											name="descripcion"
											defaultValue={
												receta?.descripcion || ""
											}
											rows={2}
											required
											placeholder="Resumen del platillo..."
											className="w-full bg-white border border-stone-200 p-2.5 text-xs focus:outline-none focus:border-amber-800 font-sans"
										/>
									</div>

									{/* Ingredientes Dinámicos */}
									<div className="space-y-2 pt-2 border-t border-stone-200">
										<div className="flex justify-between items-center">
											<label className="font-mono text-amber-800 uppercase tracking-wider text-[10px]">
												Ingredientes
											</label>
											<button
												type="button"
												onClick={handleAddIngrediente}
												className="font-mono text-[10px] text-amber-800 hover:underline cursor-pointer"
											>
												+ Agregar
											</button>
										</div>

										{ingredientes.map((ing, index) => (
											<div
												key={`ing-${index}`}
												className="flex gap-2 items-center"
											>
												<input
													type="text"
													placeholder="Ingrediente (ej. Harina)"
													value={ing.nombre}
													onChange={(e) =>
														handleIngredienteChange(
															index,
															"nombre",
															e.target.value,
														)
													}
													className="flex-1 bg-white border border-stone-200 p-2 text-xs focus:outline-none focus:border-amber-800"
												/>
												<input
													type="text"
													placeholder="Cantidad (ej. 200g)"
													value={ing.cantidad}
													onChange={(e) =>
														handleIngredienteChange(
															index,
															"cantidad",
															e.target.value,
														)
													}
													className="w-28 bg-white border border-stone-200 p-2 text-xs focus:outline-none focus:border-amber-800 font-mono"
												/>
												{ingredientes.length > 1 && (
													<button
														type="button"
														onClick={() =>
															handleRemoveIngrediente(
																index,
															)
														}
														className="text-stone-400 hover:text-red-600 font-mono text-xs p-1 cursor-pointer"
													>
														×
													</button>
												)}
											</div>
										))}
									</div>

									{/* Instrucciones con TipTap */}
									<div className="space-y-1 pt-2 border-t border-stone-200 pb-2">
										<label className="font-mono text-stone-500 uppercase tracking-wider text-[10px]">
											Procedimiento / Instrucciones
										</label>
										<EditorInstrucciones
											value={instrucciones}
											onChange={setInstrucciones}
										/>
									</div>
								</div>

								{/* Botones de Acción (Fijos abajo / Footer) */}
								<div className="flex justify-end gap-3 px-6 sm:px-8 py-4 border-t border-stone-200 bg-[#faf8f5] shrink-0">
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										disabled={loading}
										className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-100 cursor-pointer text-xs"
									>
										Cancelar
									</button>
									<button
										type="submit"
										disabled={loading}
										className="px-4 py-2 bg-amber-800 text-white font-serif italic hover:bg-amber-900 disabled:opacity-50 cursor-pointer text-xs"
									>
										{loading
											? "Guardando..."
											: isEditing
												? "Guardar Cambios"
												: "Guardar Receta"}
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
