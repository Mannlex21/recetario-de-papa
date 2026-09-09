import { getFavoritoIds } from "@/app/actions/favoritos";
import { getRecetas } from "@/app/actions/recetas";
import FiltroRecetas from "@/components/FiltroRecetas";

export default async function DashboardRecetasView() {
	const { data: recetas, success } = await getRecetas();
	const { data: favoritoIds } = await getFavoritoIds();
	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased font-sans">
			<main className="max-w-6xl mx-auto px-8 py-16 space-y-12">
				<header className="border-b border-stone-200 pb-8 text-center max-w-2xl mx-auto space-y-3">
					<p className="text-xs font-mono tracking-widest text-amber-800 uppercase">
						Colección Privada
					</p>
					<h1 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-tight">
						Nuestras Recetas
					</h1>
					<p className="text-stone-500 text-xs sm:text-sm italic font-serif leading-relaxed">
						Un registro de preparaciones, ingredientes y notas
						culinarias para el día a día.
					</p>
				</header>

				{!success || !recetas || recetas.length === 0 ? (
					<div className="text-center py-20 border border-dashed border-stone-200 rounded-lg">
						<p className="font-serif italic text-stone-400">
							No hay recetas registradas en la colección.
						</p>
					</div>
				) : (
					<FiltroRecetas
						recetas={recetas}
						favoritoIds={favoritoIds || []}
					/>
				)}
			</main>
		</div>
	);
}
