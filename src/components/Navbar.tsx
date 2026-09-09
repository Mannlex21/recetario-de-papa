"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import RecetaModal from "./RecetaModal";

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = createClient();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		// Detectar scroll para activar la animación de contracción
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		// Obtener la sesión actual al cargar
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user ?? null);
			setLoading(false);
		};

		checkUser();

		// Escuchar cambios de autenticación (login/logout)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase]);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		router.push("/");
		router.refresh();
	};

	// Si estamos en la página de login o signup, no mostramos el navbar
	if (pathname === "/login" || pathname === "/signup") {
		return null;
	}

	return (
		<>
			{/* Importamos la fuente Great Vibes para mantener el estilo caligráfico fluido */}
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap");
				.font-fluid-script {
					font-family: "Great Vibes", cursive;
				}
			`}</style>

			<nav
				className={`border-b border-stone-200/80 bg-[#faf8f5]/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
					scrolled ? "py-1.5 shadow-sm" : "py-0"
				}`}
			>
				{/* Contenedor optimizado sin espacios muertos */}
				<div
					className={`max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
						scrolled ? "h-14" : "h-18 sm:h-20"
					}`}
				>
					<Link
						href="/"
						className="group flex items-center text-stone-900 transition-colors py-0"
					>
						{/* SVG ajustado exactamente a las nuevas coordenadas y dimensiones exactas */}
						<svg
							className={`h-auto text-stone-900 group-hover:text-amber-800 transition-all duration-300 overflow-visible ${
								scrolled
									? "w-36 sm:w-42 md:w-48 scale-90 origin-left"
									: "w-48 sm:w-56 md:w-64"
							}`}
							viewBox="8 8 285 70"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* Nivel superior: El Recetario */}
							<text
								x="12"
								y="44"
								className="font-fluid-script"
								fontSize="42"
								fill="currentColor"
							>
								El Recetario
							</text>
							{/* Nivel inferior: de Papá (con x="155" y y="72") */}
							<text
								x="155"
								y="72"
								className="font-fluid-script"
								fontSize="42"
								fill="currentColor"
							>
								de Papá
							</text>
						</svg>
					</Link>

					{/* BOTÓN MENÚ HAMBURGUESA (MÓVIL) */}
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="md:hidden p-2 text-stone-700 hover:text-amber-900 focus:outline-none cursor-pointer"
						aria-label="Abrir menú"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-6 h-6"
						>
							{menuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							)}
						</svg>
					</button>

					{/* NAVEGACIÓN ESCRITORIO (Oculta en móvil) */}
					<div className="hidden md:flex items-center gap-6">
						{!loading && user ? (
							<>
								<Link
									href="/generar"
									className={`font-serif italic text-xs transition-colors flex items-center gap-1 ${
										pathname === "/generar"
											? "text-amber-800 font-semibold underline underline-offset-4"
											: "text-amber-900/80 hover:text-amber-800 font-medium"
									}`}
								>
									<span>✨</span> Chef IA
								</Link>

								<Link
									href="/favoritos"
									className={`font-serif italic text-xs transition-colors ${
										pathname === "/favoritos"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Favoritos
								</Link>

								<Link
									href="/menu"
									className={`font-serif italic text-xs transition-colors ${
										pathname === "/menu"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Menú Semanal
								</Link>

								<Link
									href="/lista-compra"
									className={`font-serif italic text-xs transition-colors ${
										pathname === "/lista-compra"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Lista de Compras
								</Link>
								<Link
									href="/mis-recetas"
									className={`font-serif italic text-xs transition-colors ${
										pathname === "/mis-recetas"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Mis Recetas
								</Link>
								<RecetaModal />

								<div className="flex items-center gap-3 pl-4 border-l border-stone-300">
									<button
										onClick={handleSignOut}
										className="text-xs font-serif text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
									>
										Cerrar sesión
									</button>
								</div>
							</>
						) : (
							<div className="flex items-center gap-3 pl-4">
								<Link
									href="/login"
									className="font-serif text-xs text-stone-700 hover:text-amber-900 px-3 py-1.5 transition-colors"
								>
									Sign In
								</Link>
								<Link
									href="/signup"
									className="bg-stone-900 text-white font-serif italic text-xs px-4 py-2 hover:bg-stone-800 transition-colors"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* NAVEGACIÓN MÓVIL DESPLEGABLE */}
				{menuOpen && (
					<div
						className={`md:hidden absolute left-0 w-full bg-[#faf8f5] border-b border-stone-200 shadow-lg px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200 ${
							scrolled ? "top-14" : "top-18 sm:top-20"
						}`}
					>
						{!loading && user ? (
							<div className="flex flex-col space-y-4">
								<Link
									href="/generar"
									onClick={() => setMenuOpen(false)}
									className={`font-serif italic text-sm transition-colors flex items-center gap-1.5 ${
										pathname === "/generar"
											? "text-amber-800 font-semibold underline underline-offset-4"
											: "text-amber-900/90 hover:text-amber-800 font-medium"
									}`}
								>
									<span>✨</span> Chef IA
								</Link>

								<Link
									href="/favoritos"
									onClick={() => setMenuOpen(false)}
									className={`font-serif italic text-sm transition-colors ${
										pathname === "/favoritos"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Favoritos
								</Link>

								<Link
									href="/menu"
									onClick={() => setMenuOpen(false)}
									className={`font-serif italic text-sm transition-colors ${
										pathname === "/menu"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Menú Semanal
								</Link>

								<Link
									href="/lista-compra"
									onClick={() => setMenuOpen(false)}
									className={`font-serif italic text-sm transition-colors ${
										pathname === "/lista-compra"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Lista de Compras
								</Link>

								<Link
									href="/mis-recetas"
									onClick={() => setMenuOpen(false)}
									className={`font-serif italic text-sm transition-colors ${
										pathname === "/mis-recetas"
											? "text-stone-900 font-semibold underline underline-offset-4"
											: "text-stone-600 hover:text-stone-900"
									}`}
								>
									Mis Recetas
								</Link>

								<div className="pt-2 flex justify-start">
									<RecetaModal />
								</div>

								<div className="pt-4 border-t border-stone-200 flex justify-between items-center">
									<button
										onClick={handleSignOut}
										className="text-xs font-serif text-stone-700 hover:underline cursor-pointer"
									>
										Cerrar sesión
									</button>
								</div>
							</div>
						) : (
							<div className="flex flex-col space-y-3 pt-2">
								<Link
									href="/login"
									onClick={() => setMenuOpen(false)}
									className="font-serif text-sm text-stone-700 hover:text-amber-900 py-1 transition-colors text-center border border-stone-300 rounded"
								>
									Sign In
								</Link>
								<Link
									href="/signup"
									onClick={() => setMenuOpen(false)}
									className="bg-stone-900 text-white font-serif italic text-xs py-2.5 text-center hover:bg-stone-800 transition-colors rounded"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>
				)}
			</nav>
		</>
	);
}
