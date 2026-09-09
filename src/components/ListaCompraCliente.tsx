"use client";

import { useState } from "react";
import { ItemConsolidado } from "@/app/actions/lista-compra";

interface Props {
	readonly itemsIniciales: ItemConsolidado[];
	readonly semana: string;
}

export default function ListaCompraCliente({ itemsIniciales, semana }: Props) {
	const [items, setItems] = useState<ItemConsolidado[]>(itemsIniciales);

	const toggleItem = (id: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, comprado: !item.comprado } : item,
			),
		);
	};

	const compradosCount = items.filter((i) => i.comprado).length;
	const totalCount = items.length;

	if (totalCount === 0) {
		return (
			<div className="text-center py-16 border border-dashed border-stone-200 rounded-lg space-y-3">
				<p className="font-serif italic text-stone-400">
					No hay ingredientes registrados en el menú semanal de la
					semana {semana}.
				</p>
				<p className="text-xs text-stone-500 font-sans">
					Agrega recetas a tu menú semanal para generar
					automáticamente la lista de compras.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-2xl mx-auto">
			{/* Barra de Progreso */}
			<div className="bg-white border border-stone-200/80 p-4 rounded-sm flex items-center justify-between text-xs font-mono">
				<span className="text-stone-500">
					Progreso:{" "}
					<strong className="text-stone-900">{compradosCount}</strong>{" "}
					de <strong className="text-stone-900">{totalCount}</strong>{" "}
					comprados
				</span>
				<div className="w-32 bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
					<div
						className="bg-amber-800 h-full transition-all duration-300"
						style={{
							width: `${totalCount > 0 ? (compradosCount / totalCount) * 100 : 0}%`,
						}}
					/>
				</div>
			</div>

			{/* Lista de Items */}
			<div className="bg-white border border-stone-200/80 divide-y divide-stone-100 shadow-sm">
				{items.map((item) => (
					<label
						key={item.id}
						className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-stone-50/60 ${
							item.comprado ? "bg-stone-50/80" : ""
						}`}
					>
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								checked={item.comprado}
								onChange={() => toggleItem(item.id)}
								className="w-4 h-4 accent-amber-800 rounded cursor-pointer"
							/>
							<span
								className={`text-sm ${
									item.comprado
										? "line-through text-stone-400 font-sans"
										: "text-stone-800 font-serif"
								}`}
							>
								{item.nombre}
							</span>
						</div>
						<span
							className={`font-mono text-xs ${
								item.comprado
									? "text-stone-300"
									: "text-amber-800"
							}`}
						>
							{item.cantidad}
						</span>
					</label>
				))}
			</div>
		</div>
	);
}
