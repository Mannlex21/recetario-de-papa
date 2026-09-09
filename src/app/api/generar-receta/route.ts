import { groq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";

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
		const { prompt } = await req.json();

		if (!prompt) {
			return Response.json(
				{ error: "El prompt es requerido" },
				{ status: 400 },
			);
		}

		const { output } = await generateText({
			model: groq("openai/gpt-oss-20b"),
			output: Output.object({ schema: recetaSchema }),
			// En lugar de role: "system", se usa instructions para este modelo
			instructions: `Eres un chef experto. Tu tarea es analizar los ingredientes enviados y estructurar una receta perfecta. 
			Asegúrate de que 'instrucciones' sea una cadena HTML limpia compatible con un editor de texto enriquecido.`,
			prompt,
		});

		return Response.json(output);
	} catch (error) {
		console.error("=== ERROR DETALLADO GROQ ===", error);

		return Response.json(
			{ error: "Error al generar la receta estructurada" },
			{ status: 500 },
		);
	}
}
