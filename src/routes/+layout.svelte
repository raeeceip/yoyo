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
	<main class="pt-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<slot />
		</div>
	</main>
</div>

<Toaster />

<style>
	:global(body) {
		@apply overflow-x-hidden;
	}
</style>
