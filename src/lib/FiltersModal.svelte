<script>
	import { fly, slide, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { createEventDispatcher, onMount, getContext } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Filter from './Filter.svelte';
	const dispatch = createEventDispatcher();

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

	let keysPressed = {}

	const handleKeydown = (e) => {
		keysPressed[e.key] = true
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
		if(keysPressed['Alt'] && e.key == 'a'){
			console.log(keysPressed)
			selectedTagPosition = -1
			const filterSearchInput = document.querySelector('.search-container__input')
			filterSearchInput.focus()
		}
	};

	const handleKeyup = (e) => {

	}

	let filterSearch = '';

	$: filteredTags = customTags.filter((tag) => {
		return tag.toLowerCase().includes(filterSearch.toLowerCase());
	});

	onMount(() => {
		let firstFilterOption = document.querySelector('.addition-tag')
		firstFilterOption.focus()
	})


</script>

<style lang="scss">
	@import '../styles/mixins';

	section.filters-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-height: 80vh;
		max-width: 80%;
		width: 100%;
		background: white;
		padding: 3rem;
		@include flex(column nowrap, start, start);
		gap: 3rem;
		border-radius: 0.5rem;
		z-index: 2;
		overflow-y: scroll;
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
	}

	.search-container__input {
		width: 100%;
		height: auto;
		padding: 3rem 2rem;
		outline: none;
		border: none;
		font-size: 1.5rem;
		font-weight: 700;
		border-bottom: solid 1px v(primary-light);
	}
</style>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>

<!-- REFACTOR TO MAKE COMPONENTS -->

<section class="filters-modal" transition:fly={{ duration: 250, y: -100 }}>
	<div class="left">

		<div class="search-container">
			<input
				type="text"
				class="search-container__input"
				placeholder="🔍 Search Filters (Alt + A)"
				bind:value={filterSearch} />
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
				on:click={() => dispatch('addTag', tag)}
				>
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
