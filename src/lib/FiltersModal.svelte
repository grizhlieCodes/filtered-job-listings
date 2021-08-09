<script>
	import { fly, slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher, onMount, getContext } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Filter from './Filter.svelte';
	import opSystem from '$lib/stores/opSystem.js';
	const dispatch = createEventDispatcher();

	$: opSystemText = $opSystem === 'windows' ? 'Ctrl' : 'Cmd';

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	export let customTags;

	let selectedTagPosition = 0;

	let keysPressed = {};

	const handleKeydown = (e) => {
		keysPressed[e.key] = true;
		let key = e.key;
		let filters = document.querySelectorAll('.addition-tag');
		let next = key === 'ArrowRight' || key === 'ArrowDown';
		let previous = key === 'ArrowLeft' || key === 'ArrowUp';

		if (next) {
			selectedTagPosition++;
			if (selectedTagPosition === filters.length) {
				selectedTagPosition = filters.length - 1;
			}
			filters[selectedTagPosition].focus();
		}

		if (previous) {
			selectedTagPosition--;
			if (selectedTagPosition <= -1) {
				selectedTagPosition = 0;
			}
			filters[selectedTagPosition].focus();
		}
		if (key === 'Enter') {
			let selectedElement = document.activeElement;
			dispatch('addTag', selectedElement.dataset.tag);
		}

		//if Alt: true && e.key === 'a'
		const controlOrCommand = keysPressed['Control'] || keysPressed['Meta'];
		if (controlOrCommand && e.key == 'f') {
			e.preventDefault();
			selectedTagPosition = -1;
			const filterSearchInput = document.querySelector('.search-container__input');
			filterSearchInput.focus();
		}
	};

	const handleKeyup = (e) => {
		keysPressed[e.key] = false;
	};

	let filterSearch = '';

	$: filteredTags = customTags.filter((tag) => {
		return tag.toLowerCase().includes(filterSearch.toLowerCase());
	});

	onMount(() => {
		let firstFilterOption = document.querySelector('.addition-tag');
		firstFilterOption.focus();
	});
</script>

<style lang="scss">
	@import '../styles/mixins';

	section.filters-modal {
		position: fixed;
		top: 7.5rem;
		left: 50%;
		transform: translate(-50%, 0);
		max-height: 80vh;
		max-width: 90%;
		width: 100%;
		background: rgb(255, 255, 255);
		padding: 3rem;
		@include flex(column nowrap, start, start);
		gap: 3rem;
		border-radius: 0.5rem;
		z-index: 2;
		overflow-y: scroll;

		@include mq(tablet){
			top: 15rem;
		}

		@include mq(sdesktop){
			max-width: 100rem;
		}
	}

	button.addition-tag {
		width: 100%;
		height: auto;
		padding: 2rem 2rem;
		text-align: left;
		background: v(bg);
		border-radius: 1rem;
		color: #007e7e;
		font-size: 1.5rem;
		font-weight: 700;
		cursor: pointer;

		&:hover,
		&:active,
		&:focus {
			background: v(primary);
			color: white;
		}
	}

	.left {
		@include flex(row wrap, start, start);
		gap: 1.5rem;
		width: 100%;
	}

	.bg-overlay {
		position: fixed;
		@include ab-center;
		background: black;
		opacity: 0.5;
		z-index: 1;
	}

	.instructions {
		@include flex(column nowrap, start, start);
		width: 100%;
		gap: 0.5rem;

		h3 {
			margin-bottom: 1rem;
			font-size: 1.7rem;
			color: v(primary);
		}

		p {
			font-size: 1.3rem;
			padding: 0.5rem 0;
			line-height: 3rem;

			span {
				background: v(light-gray);
				color: white;
				padding: 0.5rem 0.5rem;
				border-radius: 0.4rem;
			}
		}
	}

	.search-container {
		width: 100%;
		border-bottom: solid 1px v(primary-light);
		@include flex(row nowrap, space-between, center);

	}

	.search-container__input {
		width: 100%;
		height: auto;
		padding: 3rem 2rem;
		outline: none;
		border: none;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.search-container button.badge {
		padding: 0.8rem 1.2rem;
		background: rgb(243, 243, 243);
		font-size: 1.4rem;
		border-radius: 1.5rem;
		cursor: pointer;
		font-weight: 600;
		color: rgb(170, 170, 170);
		border: 1px solid rgb(221, 221, 221);
		transition: border 250ms, color 250ms, background 250ms;


		&:hover {
			background: v(primary);
			color: white;
			border: 1px solid primary;
		}
	}
</style>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<!-- REFACTOR TO MAKE COMPONENTS -->

<section class="filters-modal" transition:fly={{ duration: 250, y: -100 }}>
	<div class="left">

		<div class="search-container">
			<input
				type="text"
				class="search-container__input"
				placeholder="🔍 Search Filters ({opSystemText} + F)"
				bind:value={filterSearch} />
			<button class="badge" on:click={() => dispatch('closeModal')}>Esc</button>
		</div>

		{#each filteredTags as tag, index (tag)}
			<button
				type="button"
				class="addition-tag"
				animate:flip={{ duration: 200 }}
				in:receive={{ key: index }}
				out:send={{ key: index }}
				data-index={index}
				data-tag={tag}
				on:click={() => dispatch('addTag', tag)}>
				{tag}
			</button>
		{/each}
	</div>
	<div class="instructions">
		<h3>Keyboard Shortcuts</h3>
		<p>
			<span>⬇➡</span>
			to select next filter.
			<span>⬆⬅</span>
			to select previous filter.
			<span>Enter</span>
			to select the current filter.
			<span>Escape</span>
			or click 👆 on the dark overlay to leave this modal.
		</p>
	</div>
</section>
<div
	class="bg-overlay"
	transition:fade={{ duration: 250 }}
	on:click={() => dispatch('closeModal')} />
