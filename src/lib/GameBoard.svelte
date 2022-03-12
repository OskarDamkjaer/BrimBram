<script lang="ts">
	import CardComponent from './CardComponent.svelte';
	import { createDeckForPlayer } from './gameLogic';
	import type { Card } from './gameLogic';
	import { onMount } from 'svelte';
	import { getRandomizer } from './rand';

	export let seed: number;
	export let playerIndex: number;
	export let playerCount: number;

	let isCanalEra = true;
	const rand = getRandomizer(seed);
	let deck = createDeckForPlayer({ playerCount, playerIndex, rand });
	// Todo kan spara alla states bara
	let changes = [];

	$: inDeck = deck.filter((c) => c.state === 'deck');
	$: inHand = deck.filter((c) => c.state === 'hand');
	$: inDiscard = deck.filter((c) => c.state === 'discard');
	$: topCardIndex = deck.findIndex((c) => c.state === 'deck');
	// allow undo of up to one move
	// implement undo
	// event log

	function mutateDeck(index: number, changes: Pick<Card, 'state'>) {
		const deckCopy = [...deck];
		deckCopy[index] = { ...deckCopy[index], ...changes };
		deck = deckCopy;
	}

	function discardTop() {
		mutateDeck(topCardIndex, { state: 'discard' });
	}
	function drawTop() {
		mutateDeck(topCardIndex, { state: 'hand' });
	}

	function playCard(index: number) {
		const card = deck[index];
		if (!card || card.state !== 'hand') {
			throw new Error("Can't play card not in hand, tried to play: " + JSON.stringify(card));
		}

		mutateDeck(index, { state: 'discard' });
		setTimeout(drawTop, 0);
	}

	function drawOpeningHand() {
		if (isCanalEra) {
			discardTop();
		}

		Array.from({ length: 8 }, () => 1).forEach(() => {
			// TODO lära mig varför man behöver göra såhär
			// antar allt borde göras i samma svep
			setTimeout(drawTop, 0);
		});
	}

	onMount(() => {
		drawOpeningHand();
	});

	// TODO Handle wild cards
</script>

<h1>
	{#if isCanalEra}
		Canal Era
	{:else}
		Rail Era
	{/if}
</h1>

{#each inDeck as card}
	<CardComponent {card} />
{/each}

{#each inHand as card}
	<span on:click={() => playCard(card.position)}>
		<CardComponent {card} />
	</span>
{/each}

DISCARD:
{#each inDiscard as card, i}
	<CardComponent {card} hidden={isCanalEra && i === 0} />
{/each}

{#if inHand.length === 0}
	{#if isCanalEra}
		<button
			on:click={() => {
				deck = createDeckForPlayer({ playerCount, playerIndex, rand });
				isCanalEra = false;
				drawOpeningHand();
			}}
		>
			goto rail era
		</button>
	{:else}
		<h1>game over, good luck in the scoring</h1>
	{/if}
{/if}
