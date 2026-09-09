"use server";

import { prisma } from "@/lib/prisma";
import {
	ActionResponse,
	IngredienteInput,
	RecetaConIngredientes,
} from "@/types/receta";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "./auth";

export async function getRecetas(): Promise<
	ActionResponse<RecetaConIngredientes[]>
> {
	try {
		const recetas = await prisma.receta.findMany({
			include: {
				ingredientes: true,
				etiquetas: true,
				user: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return { success: true, data: recetas };
	} catch {
		return { success: false, error: "Error al obtener las recetas" };
	}
}

export async function getRecetaBySlug(
	slug: string,
): Promise<ActionResponse<RecetaConIngredientes>> {
	try {
		const receta = await prisma.receta.findUnique({
			where: { slug },
			include: {
				ingredientes: true,
				etiquetas: true,
				user: true,
			},
		});

		if (!receta) {
			return { success: false, error: "Receta no encontrada" };
		}

		return { success: true, data: receta };
	} catch {
		return { success: false, error: "Error al buscar la receta" };
	}
}

export async function createReceta(formData: FormData) {
	try {
		const user = await getAuthenticatedUser();
		const titulo = formData.get("titulo") as string;
		const descripcion = formData.get("descripcion") as string;
		const instrucciones = formData.get("instrucciones") as string;
		const categoria = formData.get("categoria") as string;
		const tiempoPreparacionInt = Number.parseInt(
			formData.get("tiempoPreparacionInt") as string,
			10,
		);
		const porciones = Number.parseInt(
			formData.get("porciones") as string,
			10,
		);
		const ingredientesRaw = formData.get("ingredientes") as string;
		const etiquetasRaw = (formData.get("etiquetas") as string) || "";

		if (!titulo || !descripcion || !instrucciones || !categoria) {
			return {
				success: false,
				error: "Por favor completa todos los campos requeridos.",
			};
		}

		// Generar slug básico a partir del título
		const slug = titulo
			.toLowerCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "");

		// Parsear la lista de ingredientes enviada como JSON
		const ingredientesList: { nombre: string; cantidad: string }[] =
			JSON.parse(ingredientesRaw || "[]");

		// Parsear la lista de etiquetas separadas por comas
		const etiquetasList = etiquetasRaw
			.split(",")
			.map((e) => e.trim())
			.filter((e) => e !== "");

		await prisma.receta.create({
			data: {
				titulo,
				slug: `${slug}-${Date.now().toString().slice(-4)}`,
				descripcion,
				instrucciones,
				categoria,
				tiempoPreparacionInt,
				porciones,
				userId: user.id, // <-- Vinculamos la receta al usuario logueado
				ingredientes: {
					create: ingredientesList.filter(
						(i) => i.nombre.trim() !== "",
					),
				},
				etiquetas: {
					connectOrCreate: etiquetasList.map((tag) => ({
						where: { nombre: tag },
						create: { nombre: tag },
					})),
				},
			},
		});

		revalidatePath("/");
		return { success: true };
	} catch {
		return {
			success: false,
			error: "Ocurrió un error al guardar la receta.",
		};
	}
}

export async function updateReceta(
	id: string,
	formData: FormData,
): Promise<ActionResponse<void>> {
	try {
		// 1. Validar que el usuario esté autenticado
		const user = await getAuthenticatedUser();

		// 2. Verificar que la receta pertenezca al usuario antes de modificarla
		const recetaExistente = await prisma.receta.findUnique({
			where: { id },
			select: { userId: true },
		});

		if (!recetaExistente || recetaExistente.userId !== user.id) {
			return {
				success: false,
				error: "No tienes permiso para editar esta receta.",
			};
		}

		const titulo = formData.get("titulo") as string;
		const descripcion = formData.get("descripcion") as string;
		const instrucciones = formData.get("instrucciones") as string;
		const categoria = formData.get("categoria") as string;
		const tiempoPreparacionInt = Number.parseInt(
			formData.get("tiempoPreparacionInt") as string,
			10,
		);
		const porciones = Number.parseInt(
			formData.get("porciones") as string,
			10,
		);
		const ingredientesRaw = formData.get("ingredientes") as string;
		const etiquetasRaw = (formData.get("etiquetas") as string) || "";

		const ingredientesList: IngredienteInput[] = JSON.parse(
			ingredientesRaw || "[]",
		);

		const etiquetasList = etiquetasRaw
			.split(",")
			.map((e) => e.trim())
			.filter((e) => e !== "");

		// Transacción para limpiar ingredientes anteriores y actualizar campos junto a etiquetas
		await prisma.$transaction([
			prisma.ingredienteReceta.deleteMany({ where: { recetaId: id } }),
			prisma.receta.update({
				where: { id },
				data: {
					titulo,
					descripcion,
					instrucciones,
					categoria,
					tiempoPreparacionInt,
					porciones,
					ingredientes: {
						create: ingredientesList
							.filter((i) => i.nombre.trim() !== "")
							.map((i) => ({
								nombre: i.nombre,
								cantidad: i.cantidad,
							})),
					},
					etiquetas: {
						set: [], // Limpia las etiquetas anteriores
						connectOrCreate: etiquetasList.map((tag) => ({
							where: { nombre: tag },
							create: { nombre: tag },
						})),
					},
				},
			}),
		]);

		revalidatePath("/");
		revalidatePath(`/recetas`);
		return { success: true, data: undefined };
	} catch {
		return { success: false, error: "No se pudo actualizar la receta." };
	}
}

export async function deleteReceta(id: string): Promise<ActionResponse<void>> {
	try {
		// 1. Validar autenticación
		const user = await getAuthenticatedUser();

		// 2. Verificar propiedad de la receta
		const recetaExistente = await prisma.receta.findUnique({
			where: { id },
			select: { userId: true },
		});

		if (!recetaExistente || recetaExistente.userId !== user.id) {
			return {
				success: false,
				error: "No tienes permiso para eliminar esta receta.",
			};
		}

		await prisma.receta.delete({ where: { id } });
		revalidatePath("/");
		return { success: true, data: undefined };
	} catch {
		return { success: false, error: "No se pudo eliminar la receta." };
	}
}
