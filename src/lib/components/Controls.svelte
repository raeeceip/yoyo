<script>
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Slider } from "$lib/components/ui/slider";
	import { Switch } from "$lib/components/ui/switch";

	export let controls = [];
	export let handleReset = () => {};

	function handleChange(control, value) {
		if (control.type === "range" || control.type === "number") {
			value = Math.min(Math.max(value, control.min), control.max);
		}
		control.value = value;
	}
</script>

<div class="space-y-6">
	{#each controls as control}
		<div class="space-y-2">
			<Label for={control.id} class="text-sm font-medium text-white">
				{control.label}
			</Label>
			{#if control.type === "range"}
				<Slider
					id={control.id}
					min={control.min}
					max={control.max}
					step={control.step}
					value={[control.value]}
					onValueChange={(values) => handleChange(control, values[0])}
					class="w-full"
					aria-valuemin={control.min}
					aria-valuemax={control.max}
					aria-valuenow={control.value}
				/>
				<div class="text-xs text-white/60" aria-live="polite">
					Value: {control.value.toFixed(2)}
				</div>
			{:else if control.type === "number"}
				<Input
					type="number"
					id={control.id}
					value={control.value}
					min={control.min}
					max={control.max}
					step={control.step}
					on:input={(e) => handleChange(control, parseFloat(e.target.value))}
					class="w-full bg-white/20 text-white"
				/>
			{:else if control.type === "switch"}
				<Switch
					id={control.id}
					checked={control.value}
					onCheckedChange={(checked) => handleChange(control, checked)}
					aria-checked={control.value}
				/>
			{/if}
		</div>
	{/each}
	<Button on:click={handleReset} variant="secondary" class="w-full"
		>Reset</Button
	>
</div>
