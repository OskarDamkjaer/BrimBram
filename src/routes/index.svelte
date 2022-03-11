<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import PlayerButton from '$lib/PlayerButton.svelte';

	type PlayerCount = 2 | 3 | 4;

	let selectedPlayerCount: PlayerCount = 4;
	const playerCounts: PlayerCount[] = [2, 3, 4];
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>Set up game</h1>

	{#each playerCounts as num}
		<PlayerButton
			selectCount={() => {
				selectedPlayerCount = num;
			}}
			selected={num === selectedPlayerCount}
			count={num}
		/>
	{/each}

	<h2>
		try editing <strong>src/routes/index.svelte</strong>
	</h2>

	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
