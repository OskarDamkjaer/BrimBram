<script lang="ts">
	import type { Card } from './gameLogic';

	export let hidden: boolean = false;
	export let card: Card;
</script>

<div>
	{#if hidden}
		HIDDEN
	{:else if card.state === 'deck'}
		backside
	{:else}
		{card.name}
	{/if}
</div>
