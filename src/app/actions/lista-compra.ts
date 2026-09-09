"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/types/receta";
import { getAuthenticatedUser } from "./auth";

export interface ItemConsolidado {
	id: string;
	nombre: string;
	cantidad: string;
	comprado: boolean;
}

/**
 * Obtiene o genera la lista de compras consolidada a partir del menú de la semana del usuario actual.
 */
export async function getGenerarListaCompra(
	semana: string,
): Promise<ActionResponse<ItemConsolidado[]>> {
	try {
		// 1. Validar que el usuario esté autenticado
		const user = await getAuthenticatedUser();

		// 2. Buscar el menú semanal del usuario con sus ítems y recetas asociadas
		const menu = await prisma.menuSemanal.findFirst({
			where: { semana, userId: user.id },
			include: {
				items: {
					include: {
						receta: {
							include: {
								ingredientes: true,
							},
						},
					},
				},
			},
		});

		if (!menu || menu.items.length === 0) {
			return { success: true, data: [] };
		}

		// 3. Extraer y agrupar todos los ingredientes de las recetas del menú
		const mapIngredientes = new Map<string, string[]>();

		for (const item of menu.items) {
			for (const ing of item.receta.ingredientes) {
				const key = ing.nombre.trim().toLowerCase();
				const listaExistente = mapIngredientes.get(key) || [];
				if (ing.cantidad) {
					listaExistente.push(ing.cantidad);
				}
				mapIngredientes.set(key, listaExistente);
			}
		}

		// 4. Mapear a una lista formateada
		const resultado: ItemConsolidado[] = Array.from(
			mapIngredientes.entries(),
		).map(([nombre, cantidades], index) => {
			const nombreFormateado =
				nombre.charAt(0).toUpperCase() + nombre.slice(1);
			const cantidadTexto =
				cantidades.length > 0 ? cantidades.join(" + ") : "Al gusto";

			return {
				id: `item-${index}-${nombre}`,
				nombre: nombreFormateado,
				cantidad: cantidadTexto,
				comprado: false,
			};
		});

		return { success: true, data: resultado };
	} catch {
		return {
			success: false,
			error: "Error al generar la lista de compras",
		};
	}
}
