import { prisma } from "@/lib/prisma";

export async function checkAndIncrementUsage(
	identifier: string,
	userId?: string,
) {
	// Normalizar la fecha actual en formato ISO corto (YYYY-MM-DD)
	const todayStr = new Date().toISOString().split("T")[0];
	const todayDate = new Date(todayStr);

	// 1. Obtener límite global de AppConfig (por defecto 5)
	const config = await prisma.appConfig.findUnique({
		where: { key: "daily_recipe_limit" },
	});
	const dailyLimit = config?.value ?? 5;

	// 2. Buscar si ya existe el registro de uso
	const record = await prisma.userUsage.findUnique({
		where: { identifier },
	});

	// Caso 1: Registro completamente nuevo
	if (!record) {
		const newRecord = await prisma.userUsage.create({
			data: {
				identifier,
				userId: userId ?? null,
				dailyCount: 1,
				lastRequestDate: todayDate,
			},
		});

		return {
			allowed: true,
			remaining: dailyLimit - 1,
			limit: dailyLimit,
			currentCount: newRecord.dailyCount,
		};
	}

	const lastDateStr = new Date(record.lastRequestDate)
		.toISOString()
		.split("T")[0];

	// Caso 2: Es un nuevo día -> Reiniciar conteo a 1
	if (lastDateStr < todayStr) {
		const updated = await prisma.userUsage.update({
			where: { identifier },
			data: {
				dailyCount: 1,
				lastRequestDate: todayDate,
				userId: userId ?? record.userId,
			},
		});

		return {
			allowed: true,
			remaining: dailyLimit - 1,
			limit: dailyLimit,
			currentCount: updated.dailyCount,
		};
	}

	// Caso 3: Mismo día y ya alcanzó o superó el límite
	if (record.dailyCount >= dailyLimit) {
		return {
			allowed: false,
			remaining: 0,
			limit: dailyLimit,
			currentCount: record.dailyCount,
		};
	}

	// Caso 4: Mismo día y dentro del límite -> Incrementar 1 atómicamente
	const updated = await prisma.userUsage.update({
		where: { identifier },
		data: {
			dailyCount: { increment: 1 },
			lastRequestDate: todayDate,
			userId: userId ?? record.userId,
		},
	});

	return {
		allowed: true,
		remaining: dailyLimit - updated.dailyCount,
		limit: dailyLimit,
		currentCount: updated.dailyCount,
	};
}
