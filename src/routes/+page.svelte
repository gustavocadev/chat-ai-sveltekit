<script lang="ts">
	import { createTypedAI } from '@typedai/svelte';

	const { realTimeTypedAI, startTypedAI, setUserInput } = createTypedAI<string>('/api/explain');
	let msg = '';

	// realTimeTypeAI.subscribe((value) => {
	// 	console.log(value);
	// });

	// console.log($realTimeTypedAI);

	const handleSubmit = () => {
		console.log(msg);
		// Set the user input
		setUserInput(msg);

		// Start the TypeAI
		startTypedAI();
	};
</script>

<main class="max-w-md mx-auto py-4">
	<h1 class="text-4xl">Explain It Like I'm Five</h1>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
		<label for="context">Enter the text you want summarized/explained</label>
		<textarea rows="5" bind:value={msg} class="border px-4 py-2" />
		<button
			class="bg-blue-500 hover:bg-blue-600 rounded px-4 py-2 text-white transition"
			type="submit">Explain it</button
		>
	</form>
	<div class="pt-4">
		<h2 class="text-2xl">Explanation:</h2>
		{#if $realTimeTypedAI}
			<p>{$realTimeTypedAI}</p>
		{/if}
	</div>
</main>
