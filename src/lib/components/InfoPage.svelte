<script>
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
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
	class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
>
	<Card
		class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800"
	>
		<CardHeader>
			<CardTitle>{title}</CardTitle>
			<CardDescription>{description}</CardDescription>
		</CardHeader>
		<CardContent>
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
				<div>
					<h3 class="text-lg font-semibold mb-2">Mathematical Formula</h3>
					<p class="mb-2">{formula.explanation}</p>
					<pre
						class="bg-gray-100 dark:bg-gray-700 p-2 rounded">{formula.equation}</pre>
				</div>
			{:else if currentSection === "history"}
				<div>
					<h3 class="text-lg font-semibold mb-2">Historical Background</h3>
					<p>{history}</p>
				</div>
			{:else if currentSection === "facts"}
				<div>
					<h3 class="text-lg font-semibold mb-2">Interesting Facts</h3>
					<ul class="list-disc pl-5">
						{#each interestingFacts as fact}
							<li class="mb-2">{fact}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</CardContent>
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<Button on:click={onClose}>Close</Button>
		</div>
	</Card>
</div>
