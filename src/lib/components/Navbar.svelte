<!-- src/lib/components/Navbar.svelte -->
<script>
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";

	const routes = [
		{ path: "/", name: "Home" },
		{ path: "/mandelbrot", name: "Mandelbrot" },
		{ path: "/julia", name: "Julia" },
		{ path: "/burning-ship", name: "Burning Ship" },
	];
</script>

<nav class="bg-slate-800 p-4 sticky top-0 z-10">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-2xl font-bold text-white">yoyo</a>
		<div class="space-x-2">
			{#each routes as route}
				<Button
					href={route.path}
					variant={$page.url.pathname === route.path ? "secondary" : "ghost"}
				>
					{route.name}
				</Button>
			{/each}
		</div>
	</div>
</nav>
