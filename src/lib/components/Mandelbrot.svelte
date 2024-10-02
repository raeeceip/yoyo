<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import Sidebar from "./Sidebar.svelte";
	import FractalCanvas from "./FractalCanvas.svelte";
	import InfoPage from "./InfoPage.svelte";
	import katex from "katex";

	export let zoom = 1;
	export let maxIterations = 100;
	export let quality = 1;
	let hue = 0;
	let showInfo = false;
	let mandelbrotInfo;

	const width = 800;
	const height = 600;

	const workerCode = `
  function mandelbrot(x, y, maxIterations, zoom, time) {
    let zx = 0;
    let zy = 0;
    const cx = (x - ${width} / 2) / (${width} / 4) / zoom;
    const cy = (y - ${height} / 2) / (${height} / 4) / zoom;

    // Simplified pulsing effect
    const pulse = Math.sin(time * 0.001) * 0.02;
    const pulseFactor = 1 + pulse;

    for (let i = 0; i < maxIterations; i++) {
      const xtemp = zx * zx - zy * zy + cx * pulseFactor;
      zy = 2 * zx * zy + cy * pulseFactor;
      zx = xtemp;

      if (zx * zx + zy * zy > 4) return i;
    }
    return maxIterations;
  }

  self.onmessage = function(e) {
    const { width, height, maxIterations, zoom, quality, time } = e.data;
    const result = new Uint32Array(width * height);

    for (let y = 0; y < height; y += quality) {
      for (let x = 0; x < width; x += quality) {
        const i = mandelbrot(x / quality, y / quality, maxIterations, zoom, time);
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

	// Optimized generate function for Mandelbrot.svelte
	function generate(worker, ctx, width, height) {
		const startTime = Date.now();

		function animationLoop() {
			const time = Date.now() - startTime;
			worker.postMessage({ width, height, maxIterations, zoom, quality, time });

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
				hue = (hue + 0.5) % 360; // Slow down hue change
				setTimeout(() => requestAnimationFrame(animationLoop), 50); // Limit to ~20 FPS
			};
		}

		animationLoop();
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

	function handleReset() {
		zoom = 1;
		maxIterations = 100;
		quality = 1;
	}

	const controls = [
		{
			id: "zoom",
			label: "Zoom",
			type: "range",
			value: zoom,
			min: 0.1,
			max: 10,
			step: 0.1,
		},
		{
			id: "maxIterations",
			label: "Max Iterations",
			type: "range",
			value: maxIterations,
			min: 10,
			max: 1000,
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

	const generateFractal = { workerCode, generate };

	const fractalName = "Mandelbrot's Infinite Abyss";
	const fractalDescription =
		"Dive into the mesmerizing depths of the Mandelbrot set, where intricate patterns emerge from simple mathematical rules.";

	function toggleInfo() {
		showInfo = !showInfo;
	}

	onMount(async () => {
		const response = await fetch("/data/mandelbrot-info.json");
		mandelbrotInfo = await response.json();
		if (mandelbrotInfo && mandelbrotInfo.formula) {
			mandelbrotInfo.formula.renderedEquation = katex.renderToString(
				mandelbrotInfo.formula.equation,
				{
					throwOnError: false,
					displayMode: true,
				},
			);
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css"
		integrity="sha384-3UiQGuEI4TTMaFmGIZumfRPtfKQ3trwQE2JgosJxCnGmQpL/lJdjpcHkaaFwHlcI"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="flex flex-col md:flex-row gap-4">
	<Sidebar
		title="Mandelbrot Explorer"
		description="Uncover the secrets of the Mandelbrot set by adjusting these parameters"
		{controls}
		{handleReset}
	/>

	<div class="w-full max-w-3xl mx-auto">
		<FractalCanvas
			{generateFractal}
			{width}
			{height}
			{quality}
			{fractalName}
			{fractalDescription}
			onInfoClick={toggleInfo}
		/>
	</div>
</div>

{#if showInfo && mandelbrotInfo}
	<InfoPage
		title={mandelbrotInfo.title}
		description={mandelbrotInfo.description}
		formula={mandelbrotInfo.formula}
		history={mandelbrotInfo.history}
		interestingFacts={mandelbrotInfo.interestingFacts}
		onClose={toggleInfo}
	/>
{/if}
