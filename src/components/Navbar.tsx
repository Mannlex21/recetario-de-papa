"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	// Detectar scroll para animación
	useEffect(() => {
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

	// Cerrar menú al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const checkUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user ?? null);
			setLoading(false);
		};

		checkUser();

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

	if (pathname === "/login" || pathname === "/signup") {
		return null;
	}

	const opcionesCocina = [
		{ name: "Mis Recetas", href: "/mis-recetas" },
		{ name: "Favoritos", href: "/favoritos" },
		{ name: "Menú Semanal", href: "/menu" },
		{ name: "Lista de Compras", href: "/lista-compra" },
	];

	return (
		<>
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
				<div
					className={`max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
						scrolled ? "h-14" : "h-18 sm:h-20"
					}`}
				>
					{/* Logo */}
					<Link
						href="/"
						className="group flex items-center text-stone-900 transition-colors py-0"
					>
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
							<text
								x="12"
								y="44"
								className="font-fluid-script"
								fontSize="42"
								fill="currentColor"
							>
								El Recetario
							</text>
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

					{/* Hamburguesa Móvil */}
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

					{/* NAVEGACIÓN ESCRITORIO */}
					<div className="hidden md:flex items-center gap-5">
						{!loading && user ? (
							<>
								{/* Chef IA */}
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

								{/* Mi Cocina Dropdown */}
								<div className="relative" ref={dropdownRef}>
									<button
										type="button"
										onClick={() =>
											setDropdownOpen(!dropdownOpen)
										}
										className={`font-serif italic text-xs flex items-center gap-1 transition-colors cursor-pointer ${
											opcionesCocina.some(
												(item) =>
													item.href === pathname,
											)
												? "text-stone-900 font-semibold underline underline-offset-4"
												: "text-stone-600 hover:text-stone-900"
										}`}
									>
										<span>Mi Cocina</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className={`w-3.5 h-3.5 transition-transform duration-200 ${
												dropdownOpen ? "rotate-180" : ""
											}`}
										>
											<path
												fillRule="evenodd"
												d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
												clipRule="evenodd"
											/>
										</svg>
									</button>

									{dropdownOpen && (
										<div className="absolute left-0 mt-2 w-44 bg-white border border-stone-200/80 rounded-sm shadow-md py-1 z-50 animate-in fade-in duration-150">
											{opcionesCocina.map((item) => (
												<Link
													key={item.href}
													href={item.href}
													onClick={() =>
														setDropdownOpen(false)
													}
													className={`block px-4 py-2 font-serif text-xs transition-colors ${
														pathname === item.href
															? "bg-amber-50 text-amber-900 font-medium"
															: "text-stone-700 hover:bg-[#faf8f5] hover:text-stone-900"
													}`}
												>
													{item.name}
												</Link>
											))}
										</div>
									)}
								</div>

								{/* Botón Compacto para Crear Receta */}
								<div className="flex items-center">
									<RecetaModal customButtonClass="text-xs font-serif italic text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-800/30 px-3 py-1 rounded transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95" />
								</div>

								{/* Cerrar Sesión */}
								<div className="flex items-center pl-2 border-l border-stone-300">
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

				{/* NAVEGACIÓN MÓVIL */}
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

								{opcionesCocina.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMenuOpen(false)}
										className={`font-serif italic text-sm transition-colors ${
											pathname === item.href
												? "text-stone-900 font-semibold underline underline-offset-4"
												: "text-stone-600 hover:text-stone-900"
										}`}
									>
										{item.name}
									</Link>
								))}

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
