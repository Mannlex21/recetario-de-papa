import { Prisma } from "@prisma/client";

// ==========================================
// 1. Tipos inferidos con relaciones completas
// ==========================================

/**
 * Receta completa con la lista de ingredientes incluidos.
 * Utilizado en la página principal (Home) y en las Server Actions de consulta.
 */
export type RecetaConIngredientes = Prisma.RecetaGetPayload<{
	include: {
		ingredientes: true;
		etiquetas: true;
		user: true;
	};
}>;

/**
 * Receta detallada con ingredientes y datos del usuario creador.
 * Utilizado en la página de detalle por slug (/recetas/[slug]).
 */
export type RecetaDetalle = Prisma.RecetaGetPayload<{
	include: {
		ingredientes: true;
		etiquetas: true;
		user: true;
	};
}>;

/**
 * Item del menú semanal con los datos completos de la receta asociada.
 */
export type ItemMenuConReceta = Prisma.ItemMenuSemanalGetPayload<{
	include: { receta: true };
}>;

/**
 * Menú semanal completo con todos sus items y recetas asociadas.
 */
export type MenuSemanalConItems = Prisma.MenuSemanalGetPayload<{
	include: {
		items: {
			include: {
				receta: true;
			};
		};
	};
}>;

// ==========================================
// 2. Interfaces para Inputs y Formularios
// ==========================================

export interface IngredienteInput {
	nombre: string;
	cantidad: string;
}

export interface CrearRecetaInput {
	titulo: string;
	descripcion: string;
	instrucciones: string;
	categoria: "Desayuno" | "Comida" | "Cena" | "Postre";
	tiempoPreparacionInt: number;
	porciones: number;
	ingredientes: IngredienteInput[];
}

export interface AsignarItemMenuInput {
	menuSemanalId: string;
	recetaId: string;
	diaSemana:
		| "Lunes"
		| "Martes"
		| "Miércoles"
		| "Jueves"
		| "Viernes"
		| "Sábado"
		| "Domingo";
	tipoComida: "Desayuno" | "Comida" | "Cena";
}

// ==========================================
// 3. Tipos para Respuestas de Server Actions
// ==========================================

export type ActionResponse<T> =
	| { success: true; data: T; error?: never }
	| { success: false; error: string; data?: never };

export interface Etiqueta {
	readonly id: string;
	readonly nombre: string;
}
