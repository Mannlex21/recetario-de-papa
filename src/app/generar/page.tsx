"use client";

import { useState, useRef } from "react";
import RecetaModal, { RecetaIAData } from "@/components/RecetaModal";
import BotonCompartirMenu from "@/components/BotonCompartirMenu";

export default function ChefIAPage() {
	const [ingredientesInput, setIngredientesInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [recetaGenerada, setRecetaGenerada] = useState<RecetaIAData | null>(
		null,
	);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [mensajeError, setMensajeError] = useState("");
	const [limiteAlcanzado, setLimiteAlcanzado] = useState(false);
	const recetaRef = useRef<HTMLDivElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!ingredientesInput.trim() || loading || limiteAlcanzado) return;

		setLoading(true);
		setRecetaGenerada(null);

		try {
			const res = await fetch("/api/generar-receta", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: ingredientesInput }),
			});

			const data = await res.json().catch(() => null);

			if (!res.ok) {
				const msg =
					data?.error || "No pudimos conectar con el Chef IA.";
				setMensajeError(msg);

				// Si el status es 429 (Too Many Requests), activamos la alerta fija
				if (res.status === 429) {
					setLimiteAlcanzado(true);
				}
				setErrorModalOpen(true);
				return;
			}

			setRecetaGenerada(data);
		} catch (err: unknown) {
			console.error("Error de red/servidor:", err);
			setMensajeError("Ocurrió un error inesperado de conexión.");
			setErrorModalOpen(true);
		} finally {
			setLoading(false);
		}
	};

	const ejemplosRapidos = [
		"Jitomate, cebolla, huevo y tortilla",
		"Pechuga de pollo, crema y champiñones",
		"Atún en lata, aguacate y galletas saladas",
		"Plátano, harina, leche y huevo",
	];

	return (
		<main className="min-h-[calc(100vh-80px)] bg-[#faf8f5] py-10 px-4 sm:px-8">
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Encabezado Principal */}
				<div className="text-center space-y-2">
					<span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-serif italic text-xs rounded-full border border-amber-200">
						✨ Asistente Culinario Inteligente
					</span>
					<h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
						Chef IA
					</h1>
					<p className="text-stone-600 font-serif italic text-sm sm:text-base max-w-lg mx-auto">
						¿No sabes qué cocinar hoy? Escribe los ingredientes que
						tienes a la mano y deja que el Chef cree una receta al
						instante.
					</p>
				</div>

				{/* Formulario */}
				<form
					onSubmit={handleSubmit}
					className="bg-white border border-stone-200/80 p-6 shadow-sm space-y-4 rounded-sm"
				>
					{/* Mensaje visual de Límite Alcanzado */}
					{limiteAlcanzado && (
						<div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-sm flex items-start gap-2.5 text-amber-900 animate-in fade-in duration-200">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-4 h-4 shrink-0 mt-0.5 text-amber-800"
							>
								<path
									fillRule="evenodd"
									d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-xs font-serif italic leading-relaxed">
								{mensajeError ||
									"Has alcanzado tu límite diario de generaciones. Vuelve mañana para crear más recetas."}
							</p>
						</div>
					)}
					<label
						htmlFor="ingredientes"
						className="block font-serif text-xs uppercase tracking-wider text-stone-700 font-semibold"
					>
						¿Qué ingredientes tienes en tu cocina?
					</label>

					<textarea
						id="ingredientes"
						rows={3}
						value={ingredientesInput}
						onChange={(e) => setIngredientesInput(e.target.value)}
						placeholder="Ejemplo: Tengo 2 jitomates, media cebolla, 3 huevos y unas tortillas de ayer..."
						className="w-full p-3 bg-[#faf8f5] border border-stone-300 text-stone-900 font-sans text-sm focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all resize-none"
					/>

					<div className="space-y-2">
						<span className="text-[11px] font-serif italic text-stone-500 block">
							Sugerencias rápidas para probar:
						</span>
						<div className="flex flex-wrap gap-2">
							{ejemplosRapidos.map((ejemplo, index) => (
								<button
									key={index}
									type="button"
									onClick={() =>
										setIngredientesInput(ejemplo)
									}
									className="text-xs bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 px-2.5 py-1 transition-colors cursor-pointer"
								>
									+ {ejemplo}
								</button>
							))}
						</div>
					</div>

					<div className="pt-2 flex items-center justify-end">
						<button
							type="submit"
							disabled={
								!ingredientesInput.trim() ||
								loading ||
								limiteAlcanzado
							}
							className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-serif italic text-xs tracking-wide transition-colors shadow-sm"
						>
							{loading
								? "El Chef está pensando..."
								: limiteAlcanzado
									? "Límite Diario Alcanzado"
									: "Crear Receta Ahora"}
						</button>
					</div>
				</form>

				{/* Tarjeta de Receta Generada */}
				{recetaGenerada && (
					<div className="space-y-4 animate-in fade-in duration-300">
						<div
							ref={recetaRef}
							className="bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6"
						>
							<div className="flex flex-wrap justify-between items-start gap-4 border-b border-stone-200 pb-4">
								<div className="space-y-1">
									<span className="text-[10px] font-mono tracking-widest uppercase text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded">
										{recetaGenerada.categoria}
									</span>
									<h2 className="font-serif text-2xl text-stone-900 pt-1">
										{recetaGenerada.titulo}
									</h2>
								</div>

								{/* Botones de acción */}
								<div className="flex items-center gap-2 no-export">
									<BotonCompartirMenu
										receta={recetaGenerada}
										targetRef={recetaRef}
									/>

									<RecetaModal
										key={recetaGenerada.titulo}
										initialData={recetaGenerada}
										triggerButton={
											<button
												type="button"
												className="w-9 h-9 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:text-amber-800 hover:border-amber-300 transition-colors cursor-pointer shadow-sm"
												title="Personalizar y Guardar Receta"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.8"
													className="w-4 h-4"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
													/>
												</svg>
											</button>
										}
									/>
								</div>
							</div>

							<p className="text-stone-600 font-serif italic text-sm">
								{recetaGenerada.descripcion}
							</p>

							<div className="flex gap-6 font-mono text-xs text-stone-500 border-y border-stone-100 py-3">
								<div>
									<span className="text-[9px] uppercase tracking-wider text-stone-400 block">
										Tiempo
									</span>
									{recetaGenerada.tiempoPreparacionInt} min
								</div>
								<div>
									<span className="text-[9px] uppercase tracking-wider text-stone-400 block">
										Porciones
									</span>
									{recetaGenerada.porciones}
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="font-mono text-xs tracking-widest uppercase text-amber-800">
									Ingredientes
								</h3>
								<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
									{(recetaGenerada.ingredientes || []).map(
										(ing, i) => (
											<li
												key={i}
												className="flex justify-between border-b border-stone-100 pb-1"
											>
												<span>{ing.nombre}</span>
												<span className="font-mono text-amber-800/80">
													{ing.cantidad}
												</span>
											</li>
										),
									)}
								</ul>
							</div>

							<div className="space-y-2 pt-2">
								<h3 className="font-mono text-xs tracking-widest uppercase text-amber-800">
									Instrucciones
								</h3>
								<div
									className="prose prose-stone max-w-none text-xs font-serif text-stone-800 
									[&_strong]:font-bold [&_strong]:text-stone-900 
									[&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
									dangerouslySetInnerHTML={{
										__html:
											recetaGenerada.instrucciones || "",
									}}
								/>
							</div>

							<div className="pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center text-[11px] text-stone-400 font-mono gap-2">
								<span>✨ Creado con Chef IA</span>
								<span>
									Crea la tuya en{" "}
									{typeof window !== "undefined"
										? window.location.host
										: "tuweb.com"}
								</span>
							</div>
						</div>
					</div>
				)}

				{/* Modal de Error */}
				{errorModalOpen && (
					<div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
						<div className="bg-white border border-stone-200 p-6 sm:p-8 max-w-md w-full shadow-lg space-y-5 rounded-sm">
							<div className="flex items-center gap-3 border-b border-stone-100 pb-3">
								<div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										className="w-4 h-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
										/>
									</svg>
								</div>
								<h3 className="font-serif text-lg text-stone-900">
									Aviso
								</h3>
							</div>

							<p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
								{mensajeError ||
									"No pudimos conectar con el Chef IA en este momento. Por favor, intenta enviar tu petición nuevamente."}
							</p>

							<div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
								<button
									type="button"
									onClick={() => setErrorModalOpen(false)}
									className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-serif italic transition-colors cursor-pointer"
								>
									Entendido
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
