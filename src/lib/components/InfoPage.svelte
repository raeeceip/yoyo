<script>
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter,
	} from "$lib/components/ui/card";

	export let title;
	export let description;
	export let formula;
	export let history;
	export let interestingFacts;
	export let onClose;

	let currentSection = "formula";

	function setSection(section) {
		currentSection = section;
	}
</script>

<div
	class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
>
	<Card
		class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-gray-700"
	>
		<CardHeader class="border-b border-gray-700">
			<CardTitle class="text-2xl font-bold text-white">{title}</CardTitle>
			<CardDescription class="text-gray-400">{description}</CardDescription>
		</CardHeader>
		<CardContent class="p-6">
			<div class="flex space-x-2 mb-4">
				<Button
					variant={currentSection === "formula" ? "default" : "outline"}
					on:click={() => setSection("formula")}>Formula</Button
				>
				<Button
					variant={currentSection === "history" ? "default" : "outline"}
					on:click={() => setSection("history")}>History</Button
				>
				<Button
					variant={currentSection === "facts" ? "default" : "outline"}
					on:click={() => setSection("facts")}>Interesting Facts</Button
				>
			</div>

			{#if currentSection === "formula"}
				<div class="text-white">
					<h3 class="text-lg font-semibold mb-2">Mathematical Formula</h3>
					<p class="mb-2 text-gray-300">{formula.explanation}</p>
					<pre
						class="bg-gray-800 p-4 rounded-md overflow-x-auto">{@html formula.renderedEquation}</pre>
				</div>
			{:else if currentSection === "history"}
				<div class="text-gray-300">
					<h3 class="text-lg font-semibold mb-2 text-white">
						Historical Background
					</h3>
					<p>{history}</p>
				</div>
			{:else if currentSection === "facts"}
				<div class="text-gray-300">
					<h3 class="text-lg font-semibold mb-2 text-white">
						Interesting Facts
					</h3>
					<ul class="list-disc pl-5 space-y-2">
						{#each interestingFacts as fact}
							<li>{fact}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</CardContent>
		<CardFooter class="border-t border-gray-700 flex justify-end">
			<Button on:click={onClose} variant="outline">Close</Button>
		</CardFooter>
	</Card>
</div>
