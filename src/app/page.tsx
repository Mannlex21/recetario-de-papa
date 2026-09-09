// src/app/page.tsx
import { createClient } from "@/utils/supabase/server";
import DashboardRecetasView from "@/components/DashboardRecetasView";
import LandingPage from "@/components/LandingPage";

export default async function HomePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return <LandingPage />;
	}

	return <DashboardRecetasView />;
}
