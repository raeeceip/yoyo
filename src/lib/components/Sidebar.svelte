<!-- src/lib/components/Sidebar.svelte -->
<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
  
	export let title = "";
	export let description = "";
	export let controls = [];
	export let onReset = () => {};
  
	let isOpen = false;
  
	function toggleSidebar() {
	  isOpen = !isOpen;
	}
  </script>
  
  <div class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-slate-800 lg:translate-x-0 lg:static lg:inset-0"
	   class:translate-x-0={isOpen}
	   class:-translate-x-full={!isOpen}>
	<div class="px-4 py-6">
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
	  <Button on:click={onReset} variant="secondary" class="w-full mb-4">Reset</Button>
	</div>
  </div>
  
  <div class="fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden"
	   class:hidden={!isOpen}
	   on:click={toggleSidebar}></div>
  
  <div class="fixed z-30 bottom-4 left-4 lg:hidden">
	<Button on:click={toggleSidebar} variant="secondary" class="rounded-full w-12 h-12 flex items-center justify-center">
	  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
	  </svg>
	</Button>
  </div>