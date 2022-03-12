<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { copyToClipboard } from '$lib/clipboard';
	import PlayerButton from '$lib/PlayerButton.svelte';
	import GameBoard from '$lib/GameBoard.svelte';

	// TODO parse
	// shuffle link
	const params = new URL($page.url).searchParams;
	const p1 = params.get('p1');
	const p2 = params.get('p2');
	const p3 = params.get('p3');
	const p4 = params.get('p4');
	$: players = [p1, p2, p3, p4].filter((a) => a);
	$: currentPlayerIndex = params.get('you') === null ? null : parseInt(params.get('you')) - 1;
	$: currentPlayer = players[currentPlayerIndex];
	$: isHost = currentPlayerIndex === 0;

	// TODO implement undo och dra efter två kort.
	// TODO allow custom sorting in hand
	// TODO sort by time in hand
	// TODO moneytarcker?

	let showButton;
	$: showButton = isHost;
	let onCopyButtonClick = () => {
		copyToClipboard('bla');
		showButton = false;
	};

	const seed = parseInt(params.get('seed'));
</script>

<svelte:head>
	<title>Game</title>
</svelte:head>

<section>
	{#if currentPlayerIndex === null}
		<h2>Who are you?</h2>
		{#each players.slice(1) as p, i}
			<PlayerButton
				selectCount={() => {
					currentPlayerIndex = i + 1;
				}}
				selected={i + 1 === currentPlayerIndex}
				count={i + 2}
			/>
		{/each}
	{:else}
		welcome {currentPlayer}.
		{#if showButton}
			<button on:click={onCopyButtonClick} class="bg-slate-50">copy join link to clipboard </button>
		{:else}
			<GameBoard {seed} playerCount={players.length} playerIndex={currentPlayerIndex} />
		{/if}
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
