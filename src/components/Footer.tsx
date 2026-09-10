import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-[#E5E0D8] bg-[#FAF8F5] py-8 text-xs text-[#6B655B]">
			<div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
				{/* Marca y Serif Style */}
				<div className="flex items-center gap-2">
					<span className="font-serif text-sm font-semibold text-[#2C2825] italic">
						El Recetario de Papá
					</span>
					<span>•</span>
					<span>© {new Date().getFullYear()} Mannlex21</span>
				</div>

				{/* Leyenda central con toque IA */}
				<div className="text-center text-[#8C857B]">
					Creado con Next.js, Tailwind CSS &amp; Vercel AI SDK
				</div>

				{/* Enlaces minimalistas */}
				<div className="flex items-center gap-6 font-medium text-[#4A453E]">
					<Link
						href="https://github.com/mannlex21"
						target="_blank"
						className="transition-colors hover:text-[#2C2825] hover:underline"
					>
						GitHub
					</Link>
					<Link
						href="https://linkedin.com/in/mannlex21"
						target="_blank"
						className="transition-colors hover:text-[#2C2825] hover:underline"
					>
						LinkedIn
					</Link>
				</div>
			</div>
		</footer>
	);
}
