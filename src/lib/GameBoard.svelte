<script lang="ts">
	import Card from './Card.svelte';
	import { createDeckForPlayer } from './gameLogic';

	export let seed: number;
	export let playerIndex: number;
	export let playerCount: number;

	let isCanalEra = true;

	// allow undo of up to one move
</script>

<h1>
	{#if isCanalEra}
		Canal Era
		{#each createDeckForPlayer({ playerCount, playerIndex, seed }) as card}
			<div>
				{card}
			</div>
		{/each}
	{:else}
		Rail Era
	{/if}
</h1>

opening hand: // SELECT TWO // TODO Handle wild cards
<div>
	<Card />

	<button> submit </button>
</div>
