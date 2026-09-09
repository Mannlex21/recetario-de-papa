import Link from "next/link";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 antialiased font-sans">
			<main className="max-w-6xl mx-auto px-8 py-20 space-y-16">
				<div className="max-w-3xl mx-auto text-center space-y-6">
					<span className="font-serif italic text-xs tracking-widest text-amber-800 uppercase bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/60">
						Colección Privada e Inteligente
					</span>
					<h1 className="font-serif text-5xl sm:text-6xl text-stone-900 tracking-tight leading-tight">
						Organiza tus recetas y planifica tu semana sin
						complicaciones.
					</h1>
					<p className="text-stone-600 font-serif text-base leading-relaxed max-w-xl mx-auto">
						Guarda tus preparaciones favoritas, diseña menús
						semanales y genera tu lista de compras automáticamente
						en un entorno privado y seguro.
					</p>

					<div className="flex items-center justify-center gap-4 pt-4">
						<Link
							href="/login"
							className="bg-amber-800 text-white font-serif italic text-sm px-6 py-3 hover:bg-amber-900 transition-colors shadow-sm"
						>
							Comenzar ahora
						</Link>
						<Link
							href="/login"
							className="border border-stone-300 text-stone-700 font-serif italic text-sm px-6 py-3 hover:bg-stone-100 transition-colors"
						>
							Iniciar Sesión
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-200 pt-16">
					<div className="space-y-2 p-6 bg-white/50 border border-stone-200/60 rounded-lg">
						<h3 className="font-serif italic text-lg text-stone-900">
							1. Recetario Privado
						</h3>
						<p className="text-stone-600 text-sm leading-relaxed">
							Almacena todos tus ingredientes, pasos y notas
							culinarias con total seguridad y acceso exclusivo.
						</p>
					</div>
					<div className="space-y-2 p-6 bg-white/50 border border-stone-200/60 rounded-lg">
						<h3 className="font-serif italic text-lg text-stone-900">
							2. Menú Semanal
						</h3>
						<p className="text-stone-600 text-sm leading-relaxed">
							Organiza qué desayunar, comer o cenar cada día de la
							semana estructurando tus platos preferidos.
						</p>
					</div>
					<div className="space-y-2 p-6 bg-white/50 border border-stone-200/60 rounded-lg">
						<h3 className="font-serif italic text-lg text-stone-900">
							3. Lista de Compras
						</h3>
						<p className="text-stone-600 text-sm leading-relaxed">
							El sistema consolida los ingredientes de tu menú
							activo para generar tu lista de compras al instante.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
