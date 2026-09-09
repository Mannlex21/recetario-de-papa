"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { deleteReceta } from "@/app/actions/recetas";
import { RecetaDetalle } from "@/types/receta";
import RecetaModal from "./RecetaModal";

interface Props {
	readonly receta: RecetaDetalle;
}

export default function AccionesReceta({ receta }: Props) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		setLoading(true);
		const res = await deleteReceta(receta.id);
		if (res.success) {
			router.push("/");
			router.refresh();
		} else {
			alert(res.error);
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<RecetaModal receta={receta} />

			<button
				type="button"
				onClick={() => setIsDeleting(true)}
				className="p-2 rounded-full border border-stone-200 bg-white text-stone-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
				title="Eliminar receta"
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
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
					<line x1="10" y1="11" x2="10" y2="17" />
					<line x1="14" y1="11" x2="14" y2="17" />
				</svg>
			</button>

			{isDeleting &&
				typeof window !== "undefined" &&
				createPortal(
					<div className="fixed inset-0 z-[9999] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
						<div className="bg-[#faf8f5] border border-stone-200 w-full max-w-md p-6 shadow-2xl space-y-4 text-stone-800">
							<h3 className="font-serif text-lg text-stone-900">
								¿Eliminar receta?
							</h3>
							<p className="xs text-stone-600 font-sans">
								Esta acción eliminará permanentemente la receta{" "}
								<strong>{receta.titulo}</strong> y no se podrá
								deshacer.
							</p>

							<div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
								<button
									type="button"
									onClick={() => setIsDeleting(false)}
									disabled={loading}
									className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-100 cursor-pointer text-xs"
								>
									Cancelar
								</button>
								<button
									type="button"
									onClick={handleDelete}
									disabled={loading}
									className="px-4 py-2 bg-red-700 text-white font-serif italic hover:bg-red-800 disabled:opacity-50 cursor-pointer text-xs"
								>
									{loading
										? "Eliminando..."
										: "Confirmar Eliminación"}
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
