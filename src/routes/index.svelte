<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import PlayerButton from '$lib/PlayerButton.svelte';
	import { page } from '$app/stores';
	import { replaceStateWithQuery } from '../lib/url';
	import { createSemiRandomSeed, getRandomizer } from '../lib/rand';
	import { goto } from '$app/navigation';

	type PlayerCount = 2 | 3 | 4;

	const urlCount = parseInt($page.url.searchParams.get('pcount'));
	const isLegalCount = (num: number): num is PlayerCount => [2, 3, 4].includes(num);
	const playerCounts: PlayerCount[] = [2, 3, 4];
	let firstPlayerInputField;

	let selectedPlayerCount: PlayerCount = isLegalCount(urlCount) ? urlCount : 4;
	let yourNumber: 1 | PlayerCount = 1;
	let players = [
		{ name: 'player 1' },
		{ name: 'player 2' },
		{ name: 'player 3' },
		{ name: 'player 4' }
	];
	const seed = createSemiRandomSeed();

	const selectPlayerCount = (num: PlayerCount) => {
		selectedPlayerCount = num;
		replaceStateWithQuery({ pcount: num.toString() });
		firstPlayerInputField?.select();
	};

	// todo. some time in future -> allow for game nbr2
	// todo. encode url?
	function onSubmit(e) {
		e.preventDefault();
		goto(
			`/game?seed=${seed}${players
				.slice(0, selectedPlayerCount)
				.map((p, i) => `&p${i + 1}=${p.name}`)}&you=1`
		);
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>Set up game</h1>
	<form class="flex flex-col items-center" on:submit={onSubmit}>
		<h2>Select player count</h2>
		<span class="flex space-x-2">
			{#each playerCounts as num}
				<PlayerButton
					selectCount={() => selectPlayerCount(num)}
					selected={num === selectedPlayerCount}
					count={num}
				/>
			{/each}
		</span>
		<h2>Name players</h2>
		<span class="flex flex-col">
			<span>
				<input
					bind:value={players[0].name}
					bind:this={firstPlayerInputField}
					class={`m-1 p-1 rounded ${yourNumber === 1 ? 'bg-slate-500' : 'bg-white'}`}
				/>
				{#if yourNumber === 1}
					{'<---- YOU'}
				{/if}
			</span>
			{#each players.slice(1, selectedPlayerCount) as p, i}
				<span>
					<input
						bind:value={p.name}
						class={`m-1 p-1 rounded ${yourNumber === i + 2 ? 'bg-slate-500' : 'bg-white'}`}
					/>
					{#if yourNumber === i + 2}
						{'<---- YOU'}
					{/if}
				</span>
			{/each}
		</span>

		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
			type="submit"
		>
			Let's go
		</button>
	</form>
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
