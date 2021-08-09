<script>
	export let selectedFilters, tags;
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import capitalise from '$lib/helpers/capitaliseFirstLetter.js';
	import FilterModal from '$lib/FiltersModal.svelte';
	const dispatch = createEventDispatcher();

	import { slide, fly } from 'svelte/transition';

	const removeFilterTag = (filter) => {
		dispatch('removeFilter', filter);
	};

	let inputVal = '';

	let keysPressed = {};

	const handleKeydown = (e) => {
		keysPressed[e.key] = true;
		if (e.key === 'Enter') addFilterTag(e);

		if (keysPressed['Alt'] && e.key === 's') {
			filterActive = !filterActive;
		}

		if (e.key === 'Escape' && filterActive) {
			filterActive = !filterActive;
		}
	};

	const handleKeyup = (e) => {
		keysPressed[e.key] = false;
	};

	const addFilterTag = (passedEvent) => {
		const input = document.querySelector('input.filter-input');
		const inputHasFocus = input === document.activeElement;
		if (inputHasFocus && passedEvent.key === 'Enter') {
			dispatch('addFilterTag', capitalise(inputVal));
			inputVal = '';
		}
	};

	let filterActive = false;

	$: customTags = tags.filter((tag) => {
		if (selectedFilters.includes(tag)) {
			return false;
		}
		return true;
	});
</script>

<style lang="scss">
	@import '../styles/mixins';
	section.filter {
		width: 100%;
		background: white;
		grid-column: 2/3;
		grid-row: 2/4;
		min-height: 7.2rem;
		@include flex(row wrap, start, center);
		gap: 1.6rem;
		padding: 2rem 4rem;
		border-radius: 0.5rem;
		position: relative;
		max-width: 111rem;
		justify-self: center;
	}

	article.selected-tag {
		cursor: default;
	}

	article.selected-tag,
	article.addition-tag {
		@include flex(row nowrap, start, center);
		padding-left: 0.8rem;
		background: v(selected-tag);
		gap: 0.8rem;
		border-radius: 0.4rem;
		overflow: hidden;
		flex: 1 0 auto;
		justify-content: space-between;
	}

	button.tag-button {
		background: v(primary);
		position: relative;
		width: 1.344rem + 2rem;
		height: 1.344rem + 2rem;
		padding: 0.9rem 0.956rem 0.956rem 0.9rem;
		cursor: pointer;
		transition: background 250ms;

		&:hover {
			background: v(dark);
		}
	}

	p.selected-tag__title,
	p.addition-tag__title {
		font-style: normal;
		font-weight: bold;
		font-size: 1.3rem;
		line-height: 2.4rem;
		letter-spacing: -0.01rem;
		color: v(primary);
	}

	div.tag-button__line {
		position: absolute;
		height: 1.6rem;
		width: 0.3rem;
		background-color: v(white);
		left: 50%;
		top: 50%;
		transform-origin: center;
	}

	div.remove-button__line {
		&:nth-child(1) {
			transform: translate(-50%, -50%) rotate(-45deg);
		}
		&:nth-child(2) {
			transform: translate(-50%, -50%) rotate(45deg);
		}
	}

	div.add-button__line {
		&:nth-child(1) {
			transform: translate(-50%, -50%);
		}
		&:nth-child(2) {
			transform: translate(-50%, -50%) rotate(90deg);
		}
	}

	.addition-tag {
		cursor: pointer;
		&:hover {
			& .tag-button {
				background: v(dark);
			}
		}
	}

	button.filter-button {
		background: none;
		outline: none;
		border: none;
		font-size: 1.6rem;
		color: v(primary);
		line-height: 3.2rem;
		flex-grow: 1;
		width: auto;
		cursor: pointer;

		&:hover {
			& span {
				background: v(primary);
				color: white;
				border: 1px solid v(primary);
			}
		}

		span {
			height: auto;
			width: auto;
			padding: 1rem 1rem;
			// background: v(primary-light);
			border-radius: 1rem;
			font-weight: 500;
			// color: white;
			border: 1px solid v(primary-light);
			margin-left: 0.5rem;
			transition: color 250ms, background 250ms, border 250ms;
		}
	}

	section.filters-modal {
		position: absolute;
		top: 120%;
		width: 100%;
		background: white;
		left: 0;
		padding: 2rem;
		@include flex(column nowrap, start, start);
		gap: 0.6rem;
		border-radius: 0.5rem;
		z-index: 2;
	}

	.bg-overlay {
		position: fixed;
		@include ab-center;
		background: black;
		opacity: 0.5;
		z-index: 1;
	}

	.clear-button {
		width: min-content;
		font-style: normal;
		font-weight: bold;
		font-size: 1.3rem;
		line-height: 2.4rem;
		color: v(light-gray);
		border-bottom: 1px solid white;
		transition: color 250ms, border-bottom 250ms;
		padding: 0;
		cursor: pointer;

		&:hover {
			border-bottom: 1px solid v(primary);
			color: v(primary);
			// text-decoration: underline;
		}
	}
</style>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<!-- Add an event listener 
        when user is actively w ithin input and clicks enter -> dispatch an event
        with the input value attached to add to the 

-->

<section class="filter">

	{#each selectedFilters as filter}
		<article class="selected-tag" transition:slide={{ duration: 250 }}>
			<p class="selected-tag__title">{filter}</p>
			<button
				class="tag-button selected-tag__remove-button"
				on:click={() => removeFilterTag(filter)}>
				<div class="tag-button__line remove-button__line" />
				<div class="tag-button__line remove-button__line" />
			</button>
		</article>
	{/each}

	<button type="button" class="filter-button" on:click={() => (filterActive = !filterActive)}>
		Search for filters
		<span>Alt + S</span>
	</button>
	<button type="button" class="clear-button" on:click={() => dispatch('removeFilters')}>
		Clear
	</button>
	{#if filterActive}
		<FilterModal {customTags} on:addTag on:closeModal={() => (filterActive = !filterActive)} />
	{/if}
</section>
