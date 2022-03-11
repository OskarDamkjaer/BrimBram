<script lang="ts">
	export let count;
	export let selected: boolean = false;
	export let selectCount: () => void;
</script>

<button
	on:click={selectCount}
	class={`hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded active:bg-blue-800 ${
		selected ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-700'
	} `}
>
	{count}
</button>

<style>
</style>
