<!-- src/lib/components/Mandelbrot.svelte -->
<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { Card, CardContent } from "$lib/components/ui/card";
	import Sidebar from "./Sidebar.svelte";

	export let zoom = 1;
	export let maxIterations = 100;
	export let quality = 1;
	let animationFrame;
	let canvas;
	let ctx;
	let hue = 0;
	let worker;

	const baseWidth = 800;
	const baseHeight = 600;

	$: width = baseWidth * quality;
	$: height = baseHeight * quality;

	const workerCode = `
	  function mandelbrot(x, y, maxIterations, zoom) {
		let zx = 0;
		let zy = 0;
		const cx = (x - ${baseWidth} / 2) / (${baseWidth} / 4) / zoom;
		const cy = (y - ${baseHeight} / 2) / (${baseHeight} / 4) / zoom;
  
		for (let i = 0; i < maxIterations; i++) {
		  const xtemp = zx * zx - zy * zy + cx;
		  zy = 2 * zx * zy + cy;
		  zx = xtemp;
		  if (zx * zx + zy * zy > 4) return i;
		}
		return maxIterations;
	  }
  
	  self.onmessage = function(e) {
		const { width, height, maxIterations, zoom, quality } = e.data;
		const result = new Uint32Array(width * height);
  
		for (let y = 0; y < height; y += quality) {
		  for (let x = 0; x < width; x += quality) {
			const i = mandelbrot(x / quality, y / quality, maxIterations, zoom);
			const index = y * width + x;
			result[index] = i;
			if (quality > 1) {
			  for (let dy = 0; dy < quality && y + dy < height; dy++) {
				for (let dx = 0; dx < quality && x + dx < width; dx++) {
				  result[(y + dy) * width + (x + dx)] = i;
				}
			  }
			}
		  }
		}
  
		self.postMessage({ result }, [result.buffer]);
	  };
	`;

	function initWorker() {
		const blob = new Blob([workerCode], { type: "application/javascript" });
		worker = new Worker(URL.createObjectURL(blob));
	}

	function generateMandelbrot() {
		if (!ctx || !worker) return;

		worker.postMessage({ width, height, maxIterations, zoom, quality });

		worker.onmessage = function (e) {
			const imageData = ctx.createImageData(width, height);
			const result = e.data.result;

			for (let i = 0; i < result.length; i++) {
				const [r, g, b] = hslToRgb(
					((result[i] / maxIterations) * 360 + hue) % 360,
					80,
					30,
				);
				imageData.data[i * 4] = r;
				imageData.data[i * 4 + 1] = g;
				imageData.data[i * 4 + 2] = b;
				imageData.data[i * 4 + 3] = 255;
			}

			ctx.putImageData(imageData, 0, 0);
			hue = (hue + 1) % 360;
			animationFrame = requestAnimationFrame(generateMandelbrot);
		};
	}

	function hslToRgb(h, s, l) {
		h /= 360;
		s /= 100;
		l /= 100;
		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	onMount(() => {
		if (browser) {
			ctx = canvas.getContext("2d");
			initWorker();
			generateMandelbrot();
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

	$: if (browser && (zoom || maxIterations || quality)) {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		generateMandelbrot();
	}

	function handleReset() {
		zoom = 1;
		maxIterations = 100;
		quality = 1;
		toast({
			title: "Reset",
			description: "Mandelbrot set has been reset to default values.",
		});
	}

	const controls = [
		{
			id: "zoom",
			label: "Zoom",
			type: "range",
			value: zoom,
			min: 0.1,
			max: 2,
			step: 0.1,
		},
		{
			id: "maxIterations",
			label: "Max Iterations",
			type: "range",
			value: maxIterations,
			min: 10,
			max: 500,
			step: 10,
		},
		{
			id: "quality",
			label: "Quality",
			type: "range",
			value: quality,
			min: 1,
			max: 4,
			step: 1,
		},
	];
</script>

<Sidebar
	title="Mandelbrot Set"
	description="Explore the fascinating world of the Mandelbrot Set"
	{controls}
	onReset={handleReset}
/>

<Card
	class="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 border-none overflow-hidden relative max-w-3xl mx-auto"
>
	<div
		class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 pointer-events-none"
	></div>
	<CardContent class="p-4">
		<canvas
			bind:this={canvas}
			width={baseWidth}
			height={baseHeight}
			style="width: {baseWidth}px; height: {baseHeight}px;"
			class="rounded-lg shadow-inner border-4 border-white/20"
		/>
	</CardContent>
</Card>
