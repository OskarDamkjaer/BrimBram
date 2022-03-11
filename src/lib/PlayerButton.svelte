<script lang="ts">
	export let count;
	export let selected: boolean = false;
	export let selectCount: () => void;
</script>

<button on:click={selectCount} class="">
	{count}
</button>

<style>
</style>
