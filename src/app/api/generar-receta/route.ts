import { groq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkAndIncrementUsage } from "@/lib/usage-limit";

export const maxDuration = 30;

const recetaSchema = z.object({
	titulo: z.string(),
	descripcion: z.string(),
	categoria: z.enum(["Desayuno", "Comida", "Cena", "Postre"]),
	tiempoPreparacionInt: z.number(),
	porciones: z.number(),
	etiquetas: z.array(z.string()),
	ingredientes: z.array(
		z.object({
			nombre: z.string(),
			cantidad: z.string(),
		}),
	),
	instrucciones: z.string(),
});

export async function POST(req: Request) {
	try {
		const cookieStore = await cookies();

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll: () => cookieStore.getAll(),
					setAll: (cookiesToSet) => {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						);
					},
				},
			},
		);

		// 1. Obtener usuario autenticado
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "Debes iniciar sesión para generar recetas." },
				{ status: 401 },
			);
		}

		// 2. Verificar e incrementar límite de uso mediante Prisma + AppConfig
		const usageCheck = await checkAndIncrementUsage(user.id, user.id);
		// 3. Respuesta devuelta si superó el límite diario
		if (!usageCheck.allowed) {
			return NextResponse.json(
				{
					error: `Has alcanzado tu límite máximo de ${usageCheck.limit} recetas por día. Inténtalo de nuevo mañana.`,
				},
				{ status: 429 },
			);
		}

		// 4. Procesar petición con la IA si dio luz verde
		const { prompt } = await req.json();

		if (!prompt) {
			return NextResponse.json(
				{ error: "El prompt es requerido" },
				{ status: 400 },
			);
		}

		const { output } = await generateText({
			model: groq("openai/gpt-oss-20b"),
			output: Output.object({ schema: recetaSchema }),
			instructions: `Eres un chef experto. Tu tarea es analizar los ingredientes enviados y estructurar una receta perfecta. 
			Asegúrate de que 'instrucciones' sea una cadena HTML limpia compatible con un editor de texto enriquecido.`,
			prompt,
		});

		return NextResponse.json(output);
	} catch (error) {
		console.error("=== ERROR DETALLADO GENERACIÓN ===", error);

		return NextResponse.json(
			{ error: "Error al generar la receta estructurada" },
			{ status: 500 },
		);
	}
}
