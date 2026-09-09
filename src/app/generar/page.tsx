"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import RecetaModal, { RecetaIAData } from "@/components/RecetaModal";

export default function ChefIAPage() {
	const [ingredientesInput, setIngredientesInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [recetaGenerada, setRecetaGenerada] = useState<RecetaIAData | null>(
		null,
	);
	const [downloadingImg, setDownloadingImg] = useState(false);
	const [menuShareOpen, setMenuShareOpen] = useState(false);
	const [copiado, setCopiado] = useState(false);

	const recetaRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	// Cierra el menú al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setMenuShareOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!ingredientesInput.trim() || loading) return;

		setLoading(true);
		setRecetaGenerada(null);

		try {
			const res = await fetch("/api/generar-receta", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: ingredientesInput }),
			});

			if (!res.ok)
				throw new Error("Error al obtener respuesta de la API");

			const data = await res.json();
			setRecetaGenerada(data);
		} catch (err) {
			console.error("Error al generar la receta:", err);
		} finally {
			setLoading(false);
		}
	};

	// 1. Descargar Imagen PNG (Incluye el pie de página con Branding)
	const handleDescargarImagen = async () => {
		if (!recetaRef.current) return;
		setDownloadingImg(true);
		setMenuShareOpen(false);

		try {
			const dataUrl = await toPng(recetaRef.current, {
				cacheBust: true,
				backgroundColor: "#ffffff",
				filter: (node) => {
					if (node instanceof HTMLElement) {
						return !node.classList.contains("no-export");
					}
					return true;
				},
			});

			const slugTitulo = recetaGenerada?.titulo
				? recetaGenerada.titulo.toLowerCase().replace(/\s+/g, "-")
				: "receta";

			const link = document.createElement("a");
			link.download = `${slugTitulo}.png`;
			link.href = dataUrl;
			link.click();
		} catch (err) {
			console.error("Error al exportar la imagen:", err);
		} finally {
			setDownloadingImg(false);
		}
	};

	// 2. Descargar Archivo de Texto (.txt)
	const handleDescargarTexto = () => {
		if (!recetaGenerada) return;
		setMenuShareOpen(false);

		const tituloTxt = (recetaGenerada.titulo ?? "Receta").toUpperCase();
		const ingredientesTxt = (recetaGenerada.ingredientes || [])
			.map((ing) => `- ${ing.nombre}: ${ing.cantidad}`)
			.join("\n");

		const instruccionesTexto = (recetaGenerada.instrucciones || "")
			.replace(/<li>/g, "- ")
			.replace(/<\/li>/g, "\n")
			.replace(/<[^>]+>/g, "");

		const contenidoTxt = `RECETA: ${tituloTxt}
Categoría: ${recetaGenerada.categoria ?? "General"}
Tiempo: ${recetaGenerada.tiempoPreparacionInt ?? 0} min | Porciones: ${recetaGenerada.porciones ?? 1}

DESCRIPCIÓN:
${recetaGenerada.descripcion ?? ""}

INGREDIENTES:
${ingredientesTxt}

INSTRUCCIONES DE PREPARACIÓN:
${instruccionesTexto}

---
Creado con Chef IA. Genera tus recetas en: ${window.location.origin}/generar
`;

		const blob = new Blob([contenidoTxt], {
			type: "text/plain;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const slugTitulo = recetaGenerada.titulo
			? recetaGenerada.titulo.toLowerCase().replace(/\s+/g, "-")
			: "receta";

		link.href = url;
		link.download = `${slugTitulo}.txt`;
		link.click();
		URL.revokeObjectURL(url);
	};

	// 3. Copiar para WhatsApp / Redes Sociales con Call to Action
	// Copiar para WhatsApp / Redes Sociales (con Ingredientes e Instrucciones)
	const handleCopiarTextoWA = () => {
		if (!recetaGenerada) return;

		const ingredientesTxt = (recetaGenerada.ingredientes || [])
			.map((ing) => `• *${ing.nombre}:* ${ing.cantidad}`)
			.join("\n");

		// Convierte el HTML de las instrucciones a texto plano formateado con viñetas o números
		const instruccionesTexto = (recetaGenerada.instrucciones || "")
			.replace(/<li>/g, "• ")
			.replace(/<\/li>/g, "\n")
			.replace(/<[^>]+>/g, "")
			.trim();

		const textoCompartir = `🍳 *${recetaGenerada.titulo ?? "Receta"}*
⏱️ *Tiempo:* ${recetaGenerada.tiempoPreparacionInt ?? 0} min | 🍽️ *Porciones:* ${recetaGenerada.porciones ?? 1}

*Ingredientes:*
${ingredientesTxt}

*Preparación:*
${instruccionesTexto}

✨ _Receta creada con Chef IA. Genera tus propias ideas con lo que tienes en casa aquí:_
${window.location.origin}/generar`;

		navigator.clipboard.writeText(textoCompartir);
		setCopiado(true);
		setTimeout(() => {
			setCopiado(false);
			setMenuShareOpen(false);
		}, 1500);
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
							disabled={!ingredientesInput.trim() || loading}
							className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-serif italic text-xs tracking-wide transition-colors cursor-pointer shadow-sm"
						>
							{loading
								? "El Chef está pensando..."
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

								{/* Botones de acción excluidos de la imagen con la clase no-export */}
								<div className="flex items-center gap-2 no-export">
									{/* Botón Compartir */}
									<div className="relative" ref={menuRef}>
										<button
											type="button"
											onClick={() =>
												setMenuShareOpen(!menuShareOpen)
											}
											disabled={downloadingImg}
											className="w-9 h-9 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:text-stone-800 hover:border-stone-300 transition-colors cursor-pointer shadow-sm"
											title="Compartir o descargar receta"
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
													d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
												/>
											</svg>
										</button>

										{/* Menú Desplegable Minimalista */}
										{menuShareOpen && (
											<div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200/80 rounded-sm shadow-md z-10 py-1 text-xs font-sans text-stone-700">
												<button
													type="button"
													onClick={
														handleDescargarImagen
													}
													className="w-full text-left px-3.5 py-2 hover:bg-[#faf8f5] hover:text-stone-900 transition-colors cursor-pointer"
												>
													Guardar como Imagen (.png)
												</button>
												<button
													type="button"
													onClick={
														handleDescargarTexto
													}
													className="w-full text-left px-3.5 py-2 hover:bg-[#faf8f5] hover:text-stone-900 transition-colors cursor-pointer border-t border-stone-100"
												>
													Descargar Texto (.txt)
												</button>
												<button
													type="button"
													onClick={
														handleCopiarTextoWA
													}
													className="w-full text-left px-3.5 py-2 hover:bg-[#faf8f5] hover:text-stone-900 transition-colors cursor-pointer border-t border-stone-100 font-medium text-amber-900"
												>
													{copiado
														? "¡Copiado al portapapeles!"
														: "Copiar para WhatsApp / Redes"}
												</button>
											</div>
										)}
									</div>

									{/* Botón Editar / Personalizar */}
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

							{/* Pie de página con Branding (Se incluye en la captura de imagen) */}
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
			</div>
		</main>
	);
}
