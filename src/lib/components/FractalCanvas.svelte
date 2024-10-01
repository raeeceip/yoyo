<script>
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Info } from "lucide-svelte";

	export let generateFractal;
	export let width = 800;
	export let height = 600;
	export let quality = 1;
	export let fractalName = "";
	export let fractalDescription = "";
	export let onInfoClick;

	let canvas;
	let ctx;
	let animationFrame;
	let worker;

	$: canvasWidth = width * quality;
	$: canvasHeight = height * quality;

	function initWorker(workerCode) {
		const blob = new Blob([workerCode], { type: "application/javascript" });
		worker = new Worker(URL.createObjectURL(blob));
	}

	onMount(() => {
		if (browser) {
			ctx = canvas.getContext("2d");
			initWorker(generateFractal.workerCode);
			generateFractal.generate(worker, ctx, canvasWidth, canvasHeight);
		}
		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
			if (worker) {
				worker.terminate();
			}
		};
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		if (worker) {
			worker.terminate();
		}
	});

	$: if (browser && (width || height || quality)) {
		if (ctx && worker) {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
			generateFractal.generate(worker, ctx, canvasWidth, canvasHeight);
		}
	}
</script>

<div class="w-full h-full">
	<Card
		class="overflow-hidden relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl shadow-xl"
	>
		<div
			class="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm"
		></div>
		<CardContent class="p-6 relative z-10">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-3xl font-bold text-white drop-shadow-glow">
					{fractalName}
				</h3>
				<Button
					variant="ghost"
					size="icon"
					class="text-white hover:text-gray-300"
					on:click={onInfoClick}
				>
					<Info size={24} />
				</Button>
			</div>
			<div
				class="bg-white/10 rounded-xl overflow-hidden mb-4 shadow-inner backdrop-blur-md"
			>
				<canvas
					bind:this={canvas}
					width={canvasWidth}
					height={canvasHeight}
					style="width: 100%; height: 100%; object-fit: contain;"
				/>
			</div>
			<p class="text-sm text-center text-gray-300 font-medium">
				{fractalDescription}
			</p>
		</CardContent>
	</Card>
</div>

<style>
	.drop-shadow-glow {
		filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
	}
</style>
