import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
	title: "Recetario",
	description: "Catálogo de recetas y planificador de menú semanal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="bg-[#faf8f5]">
			<body className="bg-[#faf8f5] text-stone-800 antialiased font-sans min-h-screen">
				<Navbar />
				{children}
			</body>
		</html>
	);
}
