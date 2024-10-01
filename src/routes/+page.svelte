<!-- src/routes/+page.svelte -->
<script>
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { goto } from "$app/navigation";

	const fractals = [
		{
			name: "Mandelbrot Set",
			path: "/mandelbrot",
			description: "Explore the fascinating world of the Mandelbrot Set",
		},
		{
			name: "Julia Set",
			path: "/julia",
			description: "Discover the mesmerizing patterns of the Julia Set",
		},
		{
			name: "Burning Ship",
			path: "/burning-ship",
			description: "Venture into the fiery realm of the Burning Ship fractal",
		},
	];
</script>

<div class="py-8">
	<h1 class="text-4xl font-bold mb-8 text-center text-white">
		Fractal Explorer
	</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each fractals as fractal}
			<Card
				class="hover:shadow-lg transition-shadow duration-300 backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 border-none overflow-hidden relative"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 pointer-events-none"
				></div>
				<CardHeader>
					<CardTitle class="text-xl font-bold text-white"
						>{fractal.name}</CardTitle
					>
					<CardDescription class="text-gray-300 text-sm"
						>{fractal.description}</CardDescription
					>
				</CardHeader>
				<CardFooter>
					<Button
						on:click={() => goto(fractal.path)}
						variant="secondary"
						class="w-full">Explore</Button
					>
				</CardFooter>
			</Card>
		{/each}
	</div>
</div>
