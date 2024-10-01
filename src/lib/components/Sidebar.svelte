<script>
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import Controls from "./Controls.svelte";

	export let title = "";
	export let description = "";
	export let controls = [];
	export let handleReset = () => {};

	let isOpen = false;
	let isMobile = false;

	function toggleSidebar() {
		isOpen = !isOpen;
	}

	function checkMobile() {
		isMobile = window.innerWidth < 768;
		isOpen = !isMobile;
	}

	onMount(() => {
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	});

	function handleKeydown(event) {
		if (event.key === "Escape") {
			isOpen = false;
		}
	}
</script>

<div
	class="fixed inset-y-0 left-0 z-30 w-72 overflow-y-auto transition duration-300 transform bg-slate-800 lg:translate-x-0 lg:static lg:inset-0"
	class:translate-x-0={isOpen}
	class:-translate-x-full={!isOpen && isMobile}
	role="dialog"
	aria-label="Fractal controls"
	tabindex="-1"
>
	<div class="px-6 py-8">
		<h2 class="text-2xl font-bold text-white mb-4">{title}</h2>
		<p class="text-gray-300 mb-6">{description}</p>
		<Controls {controls} {handleReset} />
	</div>
</div>

{#if isMobile}
	<div
		class="fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden"
		class:hidden={!isOpen}
		on:click={toggleSidebar}
		on:keydown={handleKeydown}
		role="button"
		tabindex="0"
		aria-label="Close sidebar"
	></div>

	<Button
		on:click={toggleSidebar}
		variant="secondary"
		class="fixed z-30 bottom-4 left-4 lg:hidden rounded-full w-12 h-12 flex items-center justify-center"
		aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16m-7 6h7"
			/>
		</svg>
	</Button>
{/if}
