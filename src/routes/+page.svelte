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
			image: "/images/mandelbrot-thumbnail.jpg",
		},
		{
			name: "Julia Set",
			path: "/julia",
			description: "Discover the mesmerizing patterns of the Julia Set",
			image: "/images/julia-thumbnail.jpg",
		},
		{
			name: "Burning Ship",
			path: "/burning-ship",
			description: "Venture into the fiery realm of the Burning Ship fractal",
			image: "/images/burning-ship-thumbnail.jpg",
		},
	];

	let showPrivacyPolicy = false;

	function togglePrivacyPolicy() {
		showPrivacyPolicy = !showPrivacyPolicy;
	}

	function shareProject() {
		if (navigator.share) {
			navigator
				.share({
					title: "Fractal Explorer",
					text: "Dive into the mesmerizing world of fractals with this interactive explorer!",
					url: window.location.href,
				})
				.catch((error) => console.log("Error sharing", error));
		} else {
			// Fallback for browsers that don't support Web Share API
			const shareUrl = encodeURIComponent(window.location.href);
			const shareText = encodeURIComponent(
				"Check out this amazing Fractal Explorer!",
			);
			window.open(
				`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
				"_blank",
			);
		}
	}
</script>

<svelte:head>
	<title>Fractal Explorer - Dive into Infinite Complexity</title>
	<meta
		name="description"
		content="Explore the fascinating world of fractals with our interactive Fractal Explorer. Discover Mandelbrot, Julia, and Burning Ship fractals."
	/>
	<meta
		property="og:title"
		content="Fractal Explorer - Dive into Infinite Complexity"
	/>
	<meta
		property="og:description"
		content="Interact with mesmerizing mathematical patterns. Explore Mandelbrot, Julia, and Burning Ship fractals in real-time."
	/>
	<meta property="og:image" content="/images/fractal-explorer-preview.jpg" />
	<meta property="og:url" content="https://fractal-explorer.example.com" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="py-8 px-4 max-w-6xl mx-auto">
	<h1 class="text-5xl font-bold mb-8 text-center text-white">
		Fractal Explorer
	</h1>

	<section class="mb-12">
		<h2 class="text-3xl font-semibold mb-4 text-white">
			Unveiling the Beauty of Mathematical Chaos
		</h2>
		<p class="text-gray-300 mb-4">
			Welcome to Fractal Explorer, an interactive journey into the mesmerizing
			world of mathematical patterns. Our project aims to showcase the intricate
			beauty of fractals, demonstrating how simple equations can create
			infinitely complex and visually stunning structures.
		</p>
		<p class="text-gray-300 mb-4">
			Fractals are more than just beautiful images; they're a gateway to
			understanding chaos theory, complex systems, and the hidden patterns in
			nature. Through this explorer, we invite you to interact with three iconic
			fractals, each offering a unique window into the world of mathematical
			art.
		</p>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
			<img
				src="/images/fractal-nature.jpg"
				alt="Fractals in nature"
				class="rounded-lg shadow-lg"
			/>
			<img
				src="/images/fractal-art.jpg"
				alt="Fractal art"
				class="rounded-lg shadow-lg"
			/>
			<img
				src="/images/fractal-geometry.jpg"
				alt="Fractal geometry"
				class="rounded-lg shadow-lg"
			/>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-semibold mb-4 text-white">Explore Fractals</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each fractals as fractal}
				<Card
					class="hover:shadow-lg transition-shadow duration-300 backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 border-none overflow-hidden relative"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 pointer-events-none"
					></div>
					<img
						src={fractal.image}
						alt={fractal.name}
						class="w-full h-48 object-cover"
					/>
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
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-semibold mb-4 text-white">
			Fractal Generator Playground
		</h2>
		<p class="text-gray-300 mb-4">
			Ready to create your own fractals? Visit our Fractal Generator Playground
			to experiment with custom parameters and create unique fractal patterns.
		</p>
		<Button
			on:click={() => goto("/playground")}
			variant="primary"
			class="w-full md:w-auto"
		>
			Go to Playground
		</Button>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-semibold mb-4 text-white">Dive Deeper</h2>
		<p class="text-gray-300 mb-4">
			Fascinated by fractals and want to learn more? Explore these carefully
			curated resources:
		</p>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<a
				href="https://en.wikipedia.org/wiki/Fractal"
				class="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
				target="_blank"
				rel="noopener noreferrer"
			>
				<h3 class="text-lg font-semibold text-white mb-2">
					Wikipedia: Fractals
				</h3>
				<p class="text-sm text-gray-300">
					A comprehensive overview of fractals and their properties.
				</p>
			</a>
			<a
				href="https://fractalfoundation.org/resources/what-are-fractals/"
				class="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
				target="_blank"
				rel="noopener noreferrer"
			>
				<h3 class="text-lg font-semibold text-white mb-2">
					Fractal Foundation
				</h3>
				<p class="text-sm text-gray-300">
					Explore the basics of fractals and their applications in nature and
					science.
				</p>
			</a>
			<a
				href="https://www.youtube.com/watch?v=WFtTdf3I6Ug"
				class="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
				target="_blank"
				rel="noopener noreferrer"
			>
				<h3 class="text-lg font-semibold text-white mb-2">
					The Mandelbrot Set - Numberphile
				</h3>
				<p class="text-sm text-gray-300">
					A fascinating video explanation of the Mandelbrot Set.
				</p>
			</a>
		</div>
	</section>

	<footer class="text-center text-gray-400">
		<div class="flex justify-center space-x-4 mb-4">
			<Button variant="link" on:click={togglePrivacyPolicy}
				>Privacy Policy</Button
			>
			<Button variant="link" on:click={shareProject}>Share Project</Button>
		</div>
		<p>&copy; 2024 Fractal Explorer. All rights reserved.</p>
	</footer>

	{#if showPrivacyPolicy}
		<div
			class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		>
			<Card
				class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-gray-700"
			>
				<CardHeader>
					<CardTitle class="text-2xl font-bold text-white"
						>Privacy Policy</CardTitle
					>
				</CardHeader>
				<CardContent>
					<p class="text-gray-300 mb-4">
						At Fractal Explorer, we respect your privacy and are committed to
						protecting it. This policy outlines our practices concerning the
						collection and use of information.
					</p>
					<h3 class="text-xl font-semibold text-white mb-2">
						Information Collection and Use
					</h3>
					<p class="text-gray-300 mb-4">
						We do not collect any personal information from our users. Our
						fractal explorer runs entirely in your browser, and we do not track
						or store any data about your interactions with the fractals.
					</p>
					<h3 class="text-xl font-semibold text-white mb-2">Cookies</h3>
					<p class="text-gray-300 mb-4">
						We do not use cookies or any other tracking technologies on our
						website.
					</p>
					<h3 class="text-xl font-semibold text-white mb-2">
						Third-party Links
					</h3>
					<p class="text-gray-300 mb-4">
						Our website may contain links to external sites that are not
						operated by us. Please be aware that we have no control over the
						content and practices of these sites and cannot accept
						responsibility for their respective privacy policies.
					</p>
					<h3 class="text-xl font-semibold text-white mb-2">
						Changes to This Policy
					</h3>
					<p class="text-gray-300 mb-4">
						We may update our Privacy Policy from time to time. We will notify
						you of any changes by posting the new Privacy Policy on this page.
					</p>
				</CardContent>
				<CardFooter>
					<Button on:click={togglePrivacyPolicy} variant="outline">Close</Button
					>
				</CardFooter>
			</Card>
		</div>
	{/if}
</div>
