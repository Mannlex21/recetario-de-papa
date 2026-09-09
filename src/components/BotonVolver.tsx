"use client";

import { useRouter } from "next/navigation";

export default function BotonVolver() {
	const router = useRouter();

	return (
		<button
			type="button"
			onClick={() => router.back()}
			className="font-serif italic text-amber-800 hover:text-amber-900 transition-colors text-xs"
		>
			← Volver
		</button>
	);
}
