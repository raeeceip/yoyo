<script>
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import { Menu } from "lucide-svelte";
	import { onMount } from "svelte";

	let isMenuOpen = false;
	let isMobile = false;

	const routes = [
		{ path: "/", name: "Home" },
		{ path: "/mandelbrot", name: "Mandelbrot" },
		{ path: "/julia", name: "Julia" },
		{ path: "/burning-ship", name: "Burning Ship" },
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

	onMount(() => {
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	});
</script>

<nav class="bg-slate-800 sticky top-0 z-10">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center h-16">
			<a href="/" class="text-2xl font-bold text-white">yoyo</a>

			{#if isMobile}
				<button
					on:click={toggleMenu}
					class="md:hidden text-white p-2"
					aria-label="Toggle menu"
				>
					<Menu size={24} />
				</button>
			{:else}
				<div class="hidden md:flex space-x-2">
					{#each routes as route}
						<a
							href={route.path}
							class="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700"
							class:bg-slate-700={$page.url.pathname === route.path}
						>
							{route.name}
						</a>
					{/each}
				</div>
			{/if}
		</div>

		{#if isMobile && isMenuOpen}
			<div class="md:hidden">
				<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
					{#each routes as route}
						<a
							href={route.path}
							class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700"
							class:bg-slate-700={$page.url.pathname === route.path}
							on:click={closeMenu}
						>
							{route.name}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</nav>
