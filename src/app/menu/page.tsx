import Link from "next/link";
import {
	getMenuSemanalActual,
	eliminarItemMenu,
	getRecetasParaMenu,
} from "@/app/actions/menu";
import AsignarRecetaModal from "@/components/AsignarRecetaModal";

const DIAS = [
	"Lunes",
	"Martes",
	"Miércoles",
	"Jueves",
	"Viernes",
	"Sábado",
	"Domingo",
];
const TIPOS_COMIDA = ["Desayuno", "Comida", "Cena"];

export default async function MenuPage() {
	const semanaActual = "2026-W37";
	const { data: menu } = await getMenuSemanalActual(semanaActual);

	// Obtenemos únicamente las recetas favoritas del usuario
	const { data: recetas } = await getRecetasParaMenu();

	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased font-sans">
			<nav className="border-b border-stone-200/60 bg-[#faf8f5]/80 backdrop-blur-md sticky top-0 z-20">
				<div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
					<Link
						href="/"
						className="font-serif italic text-amber-800 hover:text-amber-900 text-sm"
					>
						← Volver al recetario
					</Link>
					<span className="text-[11px] font-mono tracking-widest uppercase text-stone-400">
						Semana: {semanaActual}
					</span>
				</div>
			</nav>

			<main className="max-w-6xl mx-auto px-8 py-12 space-y-10">
				<header className="border-b border-stone-200 pb-6 text-center max-w-xl mx-auto">
					<p className="text-xs font-mono tracking-widest text-amber-700 uppercase">
						Planificación
					</p>
					<h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
						Menú Semanal
					</h1>
					<p className="text-stone-500 text-xs italic font-serif mt-2">
						Organiza tus comidas de la semana usando tus recetas
						favoritas.
					</p>
				</header>

				<section className="grid grid-cols-1 md:grid-cols-7 gap-4">
					{DIAS.map((dia) => (
						<div
							key={dia}
							className="bg-white border border-stone-200/80 p-4 space-y-4"
						>
							<h2 className="font-serif text-lg text-stone-900 border-b border-stone-100 pb-2 text-center">
								{dia}
							</h2>

							<div className="space-y-3">
								{TIPOS_COMIDA.map((tipo) => {
									const itemsEncontrados = menu?.items.filter(
										(i) =>
											i.diaSemana === dia &&
											i.tipoComida === tipo,
									);

									return (
										<div key={tipo} className="space-y-1">
											<span className="text-[9px] font-mono uppercase text-stone-400 tracking-wider">
												{tipo}
											</span>

											{itemsEncontrados &&
											itemsEncontrados.length > 0 ? (
												itemsEncontrados.map((item) => (
													<div
														key={item.id}
														className="bg-amber-50/60 border border-amber-200/50 p-2 text-xs flex justify-between items-start gap-1"
													>
														<span className="font-serif text-stone-800 leading-tight">
															{item.receta.titulo}
														</span>
														<form
															action={async () => {
																"use server";
																await eliminarItemMenu(
																	item.id,
																);
															}}
														>
															<button
																type="submit"
																className="text-stone-400 hover:text-red-600 font-mono text-[10px] cursor-pointer"
															>
																×
															</button>
														</form>
													</div>
												))
											) : (
												<div className="text-[10px] font-serif italic text-stone-300">
													Sin asignar
												</div>
											)}

											<AsignarRecetaModal
												menuSemanalId={menu?.id || ""}
												diaSemana={dia}
												tipoComida={tipo}
												recetas={recetas || []}
											/>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</section>
			</main>
		</div>
	);
}
