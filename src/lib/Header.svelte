<script>
	import Filter from '$lib/Filter.svelte';
	export let selectedFilters, tags;
	import { getContext } from 'svelte';

	let size = getContext('size');

	let headerSize;
	$: if ($size == 'mobile') {
		headerSize = 'mobile';
	} else {
		headerSize = 'desktop';
	}

	$: console.log(headerSize)
</script>

<style lang="scss">
	@import '../styles/mixins';

	header {
		width: 100%;
		height: auto;
		display: grid;
		grid: 12rem 3.6rem min-content / 2.4rem 1fr 2.4rem;
	}
	.top-bg {
		grid-column: 1/4;
		grid-row: 1/3;
		background: v(primary);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>

<header>
	<div class="top-bg">
		<img
			src="/assets/images/bg-header-{headerSize}.svg"
			alt="transparent-background overlay"
			class="top-bg__overlay-img" />
	</div>
	<Filter {selectedFilters} on:removeFilter on:addFilterTag {tags} on:addTag on:removeFilters />
</header>
