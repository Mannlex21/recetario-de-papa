"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionResponse, RecetaConIngredientes } from "@/types/receta";
import { getAuthenticatedUser } from "./auth";

/**
 * Alterna el estado de favorito de una receta (lo crea si no existe, lo elimina si existe).
 */
export async function toggleFavorito(
	recetaId: string,
): Promise<ActionResponse<boolean>> {
	try {
		// Obtenemos el usuario autenticado actual mediante Supabase
		const user = await getAuthenticatedUser();

		const favoritoExistente = await prisma.favorito.findUnique({
			where: {
				userId_recetaId: {
					userId: user.id,
					recetaId,
				},
			},
		});

		if (favoritoExistente) {
			await prisma.favorito.delete({
				where: { id: favoritoExistente.id },
			});
			revalidatePath("/");
			revalidatePath("/favoritos");
			return { success: true, data: false };
		}

		await prisma.favorito.create({
			data: {
				userId: user.id,
				recetaId,
			},
		});

		revalidatePath("/");
		revalidatePath("/favoritos");
		return { success: true, data: true };
	} catch (error) {
		console.error("Error al cambiar favorito:", error);
		return {
			success: false,
			error: "No se pudo actualizar el estado de favorito",
		};
	}
}

/**
 * Obtiene todas las recetas marcadas como favoritas del usuario autenticado.
 */
export async function getRecetasFavoritas(): Promise<
	ActionResponse<RecetaConIngredientes[]>
> {
	try {
		const user = await getAuthenticatedUser();

		const favoritos = await prisma.favorito.findMany({
			where: { userId: user.id },
			include: {
				receta: {
					include: {
						ingredientes: true,
						etiquetas: true,
						user: true, // <-- Requerido para satisfacer RecetaConIngredientes
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		const recetas = favoritos.map((f) => f.receta);
		return { success: true, data: recetas };
	} catch (error) {
		console.error("Error al obtener favoritos:", error);
		return { success: false, error: "No se pudieron cargar los favoritos" };
	}
}
/**
 * Obtiene una lista de IDs de recetas favoritas del usuario actual para consultar estado rápido.
 */
export async function getFavoritoIds(): Promise<ActionResponse<string[]>> {
	try {
		const user = await getAuthenticatedUser();

		const favoritos = await prisma.favorito.findMany({
			where: { userId: user.id },
			select: { recetaId: true },
		});

		return { success: true, data: favoritos.map((f) => f.recetaId) };
	} catch (error) {
		console.error("Error al obtener los IDs de favoritos:", error);
		return {
			success: false,
			error: "Error al obtener los IDs de favoritos",
		};
	}
}
