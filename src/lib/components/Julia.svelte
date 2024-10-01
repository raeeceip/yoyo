<script>
	import { onMount, onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { Card, CardContent } from "$lib/components/ui/card";
	import Sidebar from "./Sidebar.svelte";

	export let cReal = -0.7;
	export let cImag = 0.27015;
	export let maxIterations = 100;
	export let quality = 1;
	let animationFrame;
	let canvas;
	let ctx;
	let hue = 0;
	let worker;

	const baseWidth = 800;
	const baseHeight = 600;

	let containerWidth;
	let containerHeight;
	let width = baseWidth;
	let height = baseHeight;

	$: aspectRatio = baseHeight / baseWidth;
	$: {
		if (containerWidth && containerHeight) {
			const containerAspectRatio = containerHeight / containerWidth;
			if (containerAspectRatio > aspectRatio) {
				width = containerWidth * quality;
				height = containerWidth * aspectRatio * quality;
			} else {
				height = containerHeight * quality;
				width = (containerHeight / aspectRatio) * quality;
			}
		} else {
			width = baseWidth * quality;
			height = baseHeight * quality;
		}
	}

	const workerCode = `
    function julia(x, y, maxIterations, cReal, cImag) {
      let zx = (x - ${baseWidth} / 2) / (${baseWidth} / 4);
      let zy = (y - ${baseHeight} / 2) / (${baseHeight} / 4);

      for (let i = 0; i < maxIterations; i++) {
        const xtemp = zx * zx - zy * zy + cReal;
        zy = 2 * zx * zy + cImag;
        zx = xtemp;
        if (zx * zx + zy * zy > 4) return i;
      }
      return maxIterations;
    }

    self.onmessage = function(e) {
      const { width, height, maxIterations, cReal, cImag, quality } = e.data;
      const result = new Uint32Array(width * height);

      for (let y = 0; y < height; y += quality) {
        for (let x = 0; x < width; x += quality) {
          const i = julia(x / quality, y / quality, maxIterations, cReal, cImag);
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

	function generateJulia() {
		if (!ctx || !worker) return;

		worker.postMessage({ width, height, maxIterations, cReal, cImag, quality });

		worker.onmessage = function (e) {
			const imageData = ctx.createImageData(width, height);
			const result = e.data.result;

			for (let i = 0; i < result.length; i++) {
				const [r, g, b] = hslToRgb(
					((result[i] / maxIterations) * 360 + hue) % 360,
					100,
					50,
				);
				imageData.data[i * 4] = r;
				imageData.data[i * 4 + 1] = g;
				imageData.data[i * 4 + 2] = b;
				imageData.data[i * 4 + 3] = 255;
			}

			ctx.putImageData(imageData, 0, 0);
			hue = (hue + 1) % 360;
			animationFrame = requestAnimationFrame(generateJulia);
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

	function handleResize() {
		const container = document.querySelector(".julia-container");
		if (container) {
			containerWidth = container.clientWidth;
			containerHeight = container.clientHeight;
		}
	}

	onMount(() => {
		if (browser) {
			ctx = canvas.getContext("2d");
			initWorker();
			handleResize();
			window.addEventListener("resize", handleResize);
			generateJulia();
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
		if (browser) {
			window.removeEventListener("resize", handleResize);
		}
	});

	$: if (
		browser &&
		(cReal || cImag || maxIterations || quality || width || height)
	) {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		generateJulia();
	}

	function handleReset() {
		cReal = -0.7;
		cImag = 0.27015;
		maxIterations = 100;
		quality = 1;
		toast({
			title: "Reset",
			description: "Julia set has been reset to default values.",
		});
	}

	const controls = [
		{
			id: "cReal",
			label: "Real Part",
			type: "number",
			value: cReal,
			step: 0.01,
		},
		{
			id: "cImag",
			label: "Imaginary Part",
			type: "number",
			value: cImag,
			step: 0.01,
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

<div class="flex flex-col md:flex-row gap-4">
	<Sidebar
		title="Julia Set"
		description="Explore the mesmerizing Julia Set"
		{controls}
		{handleReset}
	/>

	<div class="julia-container w-full max-w-3xl mx-auto">
		<Card
			class="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 border-none overflow-hidden relative"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 pointer-events-none"
			></div>
			<CardContent class="p-4">
				<canvas
					bind:this={canvas}
					{width}
					{height}
					style="width: 100%; height: 100%; object-fit: contain;"
					class="rounded-lg shadow-inner border-4 border-white/20"
				/>
			</CardContent>
		</Card>
	</div>
</div>
