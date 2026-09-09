import { prisma } from "@/lib/prisma";

export async function checkAndIncrementUsage(
	identifier: string,
	userId?: string,
) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// 1. Consultar el límite desde AppConfig (o usar 5 si no se encuentra registrado)
	const config = await prisma.appConfig.findUnique({
		where: { key: "daily_recipe_limit" },
	});
	const dailyLimit = config?.value ?? 5;

	// 2. Buscar uso del usuario / IP
	const record = await prisma.userUsage.findUnique({
		where: { identifier },
	});

	// Registro nuevo
	if (!record) {
		await prisma.userUsage.create({
			data: {
				identifier,
				userId: userId ?? null,
				dailyCount: 1,
				lastRequestDate: new Date(),
			},
		});

		return { allowed: true, remaining: dailyLimit - 1, limit: dailyLimit };
	}

	const lastDate = new Date(record.lastRequestDate);
	lastDate.setHours(0, 0, 0, 0);

	// Reinicio de contador por nuevo día
	let currentCount = record.dailyCount;
	if (lastDate < today) {
		currentCount = 0;
	}

	// Límite alcanzado
	if (currentCount >= dailyLimit) {
		return { allowed: false, remaining: 0, limit: dailyLimit };
	}

	// Incrementar contador
	await prisma.userUsage.update({
		where: { identifier },
		data: {
			dailyCount: currentCount + 1,
			lastRequestDate: new Date(),
			userId: userId ?? record.userId,
		},
	});

	return {
		allowed: true,
		remaining: dailyLimit - (currentCount + 1),
		limit: dailyLimit,
	};
}
