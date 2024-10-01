<script>
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { Card, CardContent } from "$lib/components/ui/card";

	export let generateFractal;
	export let width = 800;
	export let height = 600;
	export let quality = 1;
	export let gradientColors = ["from-purple-500/20", "to-pink-500/20"];
	export let fractalName = "";
	export let fractalDescription = "";

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
		class="overflow-hidden relative bg-gradient-to-br from-yellow-200 to-yellow-400 border-8 border-yellow-600 rounded-3xl shadow-xl"
	>
		<div
			class="absolute inset-0 bg-gradient-to-br {gradientColors[0]} {gradientColors[1]} opacity-50"
		></div>
		<CardContent class="p-6">
			<h3
				class="text-3xl font-bold text-center mb-4 text-blue-800 drop-shadow-md"
			>
				{fractalName}
			</h3>
			<div class="bg-white rounded-xl overflow-hidden mb-4 shadow-inner">
				<canvas
					bind:this={canvas}
					width={canvasWidth}
					height={canvasHeight}
					style="width: 100%; height: 100%; object-fit: contain;"
				/>
			</div>
			<p class="text-sm text-center text-blue-900 font-medium">
				{fractalDescription}
			</p>
		</CardContent>
	</Card>
</div>
