<script>
  import Julia from "$lib/components/Julia.svelte";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
</script>

<div class="container mx-auto p-4">
  <Button on:click={() => goto("/")} class="mb-4">Back to Dashboard</Button>
  <Julia />
</div>
