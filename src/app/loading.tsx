export default function Loading() {
	return (
		<div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col items-center justify-center space-y-4 antialiased">
			<div className="w-8 h-8 border-2 border-stone-300 border-t-amber-800 rounded-full animate-spin" />
			<p className="font-serif italic text-sm text-stone-500 tracking-wide">
				Cargando recetario...
			</p>
		</div>
	);
}
