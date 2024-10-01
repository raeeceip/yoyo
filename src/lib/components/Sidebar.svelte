<!-- src/lib/components/Sidebar.svelte -->
<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	export let title = "";
	export let description = "";
	export let controls = [];
	export let onReset = () => {};

	let isOpen = true;

	function toggleSidebar() {
		isOpen = !isOpen;
	}
</script>

<div
	class="fixed left-0 top-16 bottom-0 z-10 transition-all duration-300 ease-in-out"
	class:translate-x-0={isOpen}
	class:-translate-x-full={!isOpen}
>
	<div class="bg-slate-800 h-full w-64 p-4 overflow-y-auto">
		<h2 class="text-xl font-bold text-white mb-2">{title}</h2>
		<p class="text-gray-300 mb-4">{description}</p>
		{#each controls as control}
			<div class="mb-4">
				<Label for={control.id} class="text-white">{control.label}</Label>
				<Input
					type={control.type}
					id={control.id}
					bind:value={control.value}
					min={control.min}
					max={control.max}
					step={control.step}
					class="w-full bg-white/20 text-white"
				/>
			</div>
		{/each}
		<Button on:click={onReset} variant="secondary" class="w-full mb-4"
			>Reset</Button
		>
	</div>
	<Button
		class="absolute top-2 -right-10 bg-slate-800 text-white"
		on:click={toggleSidebar}
	>
		{isOpen ? "←" : "→"}
	</Button>
</div>
