import { notFound } from "next/navigation";
import { getRecetaBySlug } from "@/app/actions/recetas";
import { getFavoritoIds } from "@/app/actions/favoritos";
import { getAuthenticatedUser } from "@/app/actions/auth";
import DetalleRecetaCliente from "@/components/DetalleRecetaCliente";

interface PageProps {
	readonly params: Promise<{ slug: string }>;
}

export default async function RecetaDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const { data: receta, success } = await getRecetaBySlug(slug);
	const { data: favoritoIds } = await getFavoritoIds();
	const currentUser = await getAuthenticatedUser();

	if (!success || !receta) {
		notFound();
	}

	const esFavorito = (favoritoIds || []).includes(receta.id);
	const esCreador = Boolean(currentUser && currentUser.id === receta.userId);

	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased font-sans py-12">
			<DetalleRecetaCliente
				receta={receta}
				esFavorito={esFavorito}
				esCreador={esCreador}
			/>
		</div>
	);
}
