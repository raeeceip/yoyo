<!-- src/routes/+layout.svelte -->
<script>
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<div
	class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white"
>
	<Navbar />
	<main class="pt-16 pl-0 md:pl-64">
		<div class="container mx-auto p-4">
			<slot />
		</div>
	</main>
</div>

<Toaster />
