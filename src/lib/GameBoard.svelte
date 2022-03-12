<script lang="ts">
	import CardComponent from './CardComponent.svelte';
	import { createDeckForPlayer } from './gameLogic';
	import type { Card } from './gameLogic';
	import { onMount } from 'svelte';
	import { getRandomizer } from './rand';

	export let seed: number;
	export let playerIndex: number;
	export let playerCount: number;

	const WILD_LOCATION: Card = {
		name: 'WILD LOCATION',
		state: 'hand',
		position: -1,
		color: 'white'
	};
	const WILD_INDUSTRY: Card = {
		name: 'WILD INDUSTRY',
		state: 'hand',
		position: -1,
		color: 'white'
	};
	let isCanalEra = true;
	const rand = getRandomizer(seed);
	let deck = createDeckForPlayer({ playerCount, playerIndex, rand });

	let lastPlayedIndex: null | number | 'WILD LOCATION' | 'WILD INDUSTRY' = null;
	let wildCards: Card[] = [];

	$: inDeck = deck.filter((c) => c.state === 'deck');
	$: inHand = deck.filter((c) => c.state === 'hand').concat(wildCards);
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
	}

	function unplayCard() {
		if (lastPlayedIndex === 'WILD INDUSTRY') {
			wildCards = [...wildCards, WILD_INDUSTRY];
		} else if (lastPlayedIndex === 'WILD LOCATION') {
			wildCards = [...wildCards, WILD_LOCATION];
		} else {
			mutateDeck(lastPlayedIndex, { state: 'hand' });
		}
		lastPlayedIndex = null;
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

	function drawToFullHandIfShould(lastPlayed: number) {
		setTimeout(() => {
			if (inDiscard.length % 2 === 0) {
				Array.from({ length: 8 - inHand.length }, () => 1).forEach(() => {
					setTimeout(drawTop, 0);
				});
				lastPlayedIndex = null;
			} else {
				lastPlayedIndex = lastPlayed;
			}
		}, 0);
	}

	let selectedForDiscard = [];
	let showingWildCardPicker = false;
</script>

<h1>
	{#if isCanalEra}
		Canal Era
	{:else}
		Rail Era
	{/if}
</h1>

CARDS LEFT IN DECK: {inDeck.length}
{#if lastPlayedIndex}
	<button on:click={unplayCard}>undo</button>
{/if}

{#if wildCards.length === 0 && inHand.length > 1}
	<button
		on:click={() => {
			showingWildCardPicker = true;
		}}>get wildcards</button
	>
{/if}

<div class="flex">
	{#each inHand as card}
		<button
			class="m-1 break-all"
			style={`background-color: ${card.color}; width: 100px; height: 100px;`}
			on:click={() => {
				if (showingWildCardPicker) {
					if (!selectedForDiscard.includes(card)) {
						selectedForDiscard = [...selectedForDiscard, card];
						if (selectedForDiscard.length === 2 && inHand.length === 2) {
							selectedForDiscard.forEach((c) => {
								mutateDeck(c.position, { state: 'discard' });
								wildCards = [WILD_LOCATION];
								selectedForDiscard = [];
								// Scout action not undoable -> pga pallar ej
								drawToFullHandIfShould(null);
								showingWildCardPicker = false;
							});
						} else if (selectedForDiscard.length === 3) {
							selectedForDiscard.forEach((c) => {
								mutateDeck(c.position, { state: 'discard' });
								wildCards = [WILD_LOCATION, WILD_INDUSTRY];
								selectedForDiscard = [];
								// Scout action not undoable -> pga pallar ej
								drawToFullHandIfShould(null);
								showingWildCardPicker = false;
							});
						}
					}
				} else {
					if (card.position === -1) {
						wildCards = wildCards.filter((wc) => wc.name !== card.name);
					} else {
						playCard(card.position);
					}
					drawToFullHandIfShould(card.position);
				}
			}}
		>
			<CardComponent {card} />
		</button>
	{/each}
</div>

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
