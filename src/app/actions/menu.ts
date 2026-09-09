"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./auth";

export async function getMenuSemanalActual(semana: string) {
	try {
		// Obtenemos el usuario autenticado actual
		const user = await getAuthenticatedUser();

		let menu = await prisma.menuSemanal.findFirst({
			where: { semana, userId: user.id },
			include: {
				items: {
					include: {
						receta: true,
					},
				},
			},
		});

		if (!menu) {
			menu = await prisma.menuSemanal.create({
				data: {
					semana,
					userId: user.id, // Se asocia directamente al usuario logueado
				},
				include: {
					items: {
						include: {
							receta: true,
						},
					},
				},
			});
		}

		return { success: true, data: menu };
	} catch (error) {
		console.error("Error al obtener menú semanal:", error);
		return { success: false, error: "No se pudo cargar el menú" };
	}
}

export async function agregarItemAMenu(formData: FormData) {
	try {
		// Validamos autenticación para asegurar permisos
		await getAuthenticatedUser();

		const menuSemanalId = formData.get("menuSemanalId") as string;
		const recetaId = formData.get("recetaId") as string;
		const diaSemana = formData.get("diaSemana") as string;
		const tipoComida = formData.get("tipoComida") as string;

		if (!menuSemanalId || !recetaId || !diaSemana || !tipoComida) {
			return { success: false, error: "Faltan datos requeridos." };
		}

		await prisma.itemMenuSemanal.create({
			data: {
				menuSemanalId,
				recetaId,
				diaSemana,
				tipoComida,
			},
		});

		revalidatePath("/menu");
		return { success: true };
	} catch (error) {
		console.error("Error al agregar receta al menú:", error);
		return { success: false, error: "No se pudo guardar el elemento" };
	}
}

export async function getRecetasParaMenu() {
	try {
		const user = await getAuthenticatedUser();

		const recetas = await prisma.receta.findMany({
			where: {
				OR: [
					{ userId: user.id }, // Recetas creadas por ti
					{
						favoritos: {
							some: {
								userId: user.id, // Recetas marcadas como favoritas
							},
						},
					},
				],
			},
			include: {
				ingredientes: true,
				etiquetas: true,
				user: true,
				favoritos: {
					where: {
						userId: user.id,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return { success: true, data: recetas };
	} catch (error) {
		console.error("Error al obtener recetas para el menú:", error);
		return { success: false, error: "No se pudieron cargar las recetas" };
	}
}

export async function eliminarItemMenu(itemId: string) {
	try {
		// Validamos autenticación
		await getAuthenticatedUser();

		await prisma.itemMenuSemanal.delete({
			where: { id: itemId },
		});
		revalidatePath("/menu");
		return { success: true };
	} catch (error) {
		console.error("Error al eliminar elemento:", error);
		return { success: false, error: "No se pudo eliminar" };
	}
}
