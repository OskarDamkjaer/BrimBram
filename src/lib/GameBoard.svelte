<script lang="ts">
	import Card from './Card.svelte';

	export let seed: number;
	export let playerIndex: number;
	export let playerCount: number;
	export let isCanalEra;

	function createDeckForPlayer(seed, playerIndex) {}

	// allow undo of up to one move
</script>

<h1>
	{#if isCanalEra}
		Canal Era
	{:else}
		Rail Era
	{/if}
</h1>

opening hand: // SELECT TWO // TODO Handle wild cards
<div>
	<Card />

	<button> submit </button>
</div>
