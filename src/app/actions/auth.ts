import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma"; // Asegúrate de que esta sea tu ruta de prisma

export async function getAuthenticatedUser() {
	const supabase = await createClient();
	const {
		data: { user: authUser },
		error,
	} = await supabase.auth.getUser();
	console.log("Usuario autenticado desde Supabase:", authUser, error);
	if (error || !authUser) {
		throw new Error("No autorizado");
	}

	// Sincronizar o buscar el usuario en Prisma usando el ID de Supabase
	let dbUser = await prisma.user.findUnique({
		where: { id: authUser.id },
	});

	if (!dbUser) {
		dbUser = await prisma.user.create({
			data: {
				id: authUser.id, // Usamos el UUID de Supabase
				email: authUser.email!,
				nombre: authUser.user_metadata?.nombre || "Chef",
			},
		});
	}

	return dbUser;
}
