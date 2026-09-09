import { getGenerarListaCompra } from "@/app/actions/lista-compra";
import ListaCompraCliente from "@/components/ListaCompraCliente";

export default async function ListaCompraPage() {
	const semanaActual = "2026-W37";
	const { data: items } = await getGenerarListaCompra(semanaActual);

	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased font-sans">
			<main className="max-w-4xl mx-auto px-8 py-12 space-y-10">
				<header className="border-b border-stone-200 pb-6 text-center max-w-xl mx-auto">
					<p className="text-xs font-mono tracking-widest text-amber-800 uppercase">
						Semana: {semanaActual}
					</p>
					<h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
						Lista de Compras
					</h1>
					<p className="text-stone-500 text-xs italic font-serif mt-2">
						Ingredientes consolidados a partir del menú semanal
						planificado.
					</p>
				</header>

				<ListaCompraCliente
					itemsIniciales={items || []}
					semana={semanaActual}
				/>
			</main>
		</div>
	);
}
