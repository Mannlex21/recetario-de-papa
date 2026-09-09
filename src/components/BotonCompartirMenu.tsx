"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import { toPng } from "html-to-image";
import { RecetaConIngredientes } from "@/types/receta";

interface Props {
	readonly receta:
		| RecetaConIngredientes
		| {
				titulo?: string;
				categoria?: string;
				tiempoPreparacionInt?: number;
				porciones?: number;
				descripcion?: string;
				ingredientes?: Array<{ nombre: string; cantidad: string }>;
				instrucciones?: string;
		  };
	readonly targetRef?: RefObject<HTMLDivElement | null>;
}

export default function BotonCompartirMenu({ receta, targetRef }: Props) {
	const [menuShareOpen, setMenuShareOpen] = useState(false);
	const [downloadingImg, setDownloadingImg] = useState(false);
	const [copiado, setCopiado] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	// Cierra el menú desplegable si se hace clic fuera del componente[cite: 5]
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

	// 1. Guardar como Imagen PNG[cite: 5]
	const handleDescargarImagen = async () => {
		if (!targetRef?.current) return;
		setDownloadingImg(true);
		setMenuShareOpen(false);

		try {
			const dataUrl = await toPng(targetRef.current, {
				cacheBust: true,
				backgroundColor: "#ffffff",
				filter: (node) => {
					if (node instanceof HTMLElement) {
						return !node.classList.contains("no-export");
					}
					return true;
				},
			});

			const slugTitulo = receta?.titulo
				? receta.titulo.toLowerCase().replace(/\s+/g, "-")
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

	// 2. Descargar Archivo de Texto (.txt)[cite: 5]
	const handleDescargarTexto = () => {
		if (!receta) return;
		setMenuShareOpen(false);

		const tituloTxt = (receta.titulo ?? "Receta").toUpperCase();
		const ingredientesTxt = (receta.ingredientes || [])
			.map((ing) => `- ${ing.nombre}: ${ing.cantidad}`)
			.join("\n");

		const instruccionesTexto = (receta.instrucciones || "")
			.replace(/<li>/g, "- ")
			.replace(/<\/li>/g, "\n")
			.replace(/<[^>]+>/g, "");

		const contenidoTxt = `RECETA: ${tituloTxt}
Categoría: ${receta.categoria ?? "General"}
Tiempo: ${receta.tiempoPreparacionInt ?? 0} min | Porciones: ${receta.porciones ?? 1}

DESCRIPCIÓN:
${receta.descripcion ?? ""}

INGREDIENTES:
${ingredientesTxt}

INSTRUCCIONES DE PREPARACIÓN:
${instruccionesTexto}

---
Descubre más recetas en: ${window.location.origin}
`;

		const blob = new Blob([contenidoTxt], {
			type: "text/plain;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const slugTitulo = receta.titulo
			? receta.titulo.toLowerCase().replace(/\s+/g, "-")
			: "receta";

		link.href = url;
		link.download = `${slugTitulo}.txt`;
		link.click();
		URL.revokeObjectURL(url);
	};

	// 3. Copiar formateado para WhatsApp / Redes Sociales[cite: 5]
	const handleCopiarTextoWA = () => {
		if (!receta) return;

		const ingredientesTxt = (receta.ingredientes || [])
			.map((ing) => `• *${ing.nombre}:* ${ing.cantidad}`)
			.join("\n");

		const instruccionesTexto = (receta.instrucciones || "")
			.replace(/<li>/g, "• ")
			.replace(/<\/li>/g, "\n")
			.replace(/<[^>]+>/g, "")
			.trim();

		const textoCompartir = `🍳 *${receta.titulo ?? "Receta"}*
⏱️ *Tiempo:* ${receta.tiempoPreparacionInt ?? 0} min | 🍽️ *Porciones:* ${receta.porciones ?? 1}

*Ingredientes:*
${ingredientesTxt}

*Preparación:*
${instruccionesTexto}

✨ _Mira esta receta y más aquí:_
${window.location.href}`;

		navigator.clipboard.writeText(textoCompartir);
		setCopiado(true);
		setTimeout(() => {
			setCopiado(false);
			setMenuShareOpen(false);
		}, 1500);
	};

	return (
		<div className="relative no-export" ref={menuRef}>
			<button
				type="button"
				onClick={() => setMenuShareOpen(!menuShareOpen)}
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

			{/* Menú Desplegable[cite: 5] */}
			{menuShareOpen && (
				<div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200/80 rounded-sm shadow-md z-50 py-1 text-xs font-sans text-stone-700">
					{targetRef && (
						<button
							type="button"
							onClick={handleDescargarImagen}
							className="w-full text-left px-3.5 py-2 hover:bg-[#faf8f5] hover:text-stone-900 transition-colors cursor-pointer"
						>
							Guardar como Imagen (.png)
						</button>
					)}
					<button
						type="button"
						onClick={handleDescargarTexto}
						className={`w-full text-left px-3.5 py-2 hover:bg-[#faf8f5] hover:text-stone-900 transition-colors cursor-pointer ${
							targetRef ? "border-t border-stone-100" : ""
						}`}
					>
						Descargar Texto (.txt)
					</button>
					<button
						type="button"
						onClick={handleCopiarTextoWA}
						className="w-full text-left px-3.5 py-2 hover:bg-[#faf8f5] hover:text-stone-900 transition-colors cursor-pointer border-t border-stone-100 font-medium text-amber-900"
					>
						{copiado
							? "¡Copiado al portapapeles!"
							: "Copiar para WhatsApp / Redes"}
					</button>
				</div>
			)}
		</div>
	);
}
