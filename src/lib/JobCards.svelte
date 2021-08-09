<script>
	export let dataObject;
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

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
</script>

<style lang="scss">
	@import '../styles/mixins';
	// Job cards

	section.job-cards {
		// max-width: 111rem;
		width: 100%;
		padding-inline: 2.4rem;
		@include flex(column nowrap, start, center);
		gap: 4rem;

        @include mq(tablet){
            gap: 2.4rem;
        }
	}
	article.job-card {
		width: 100%;
        max-width: 111rem;
		position: relative;
		@include flex(column nowrap, start, start);
		background: white;
		border-left: 5px solid v(primary);
		border-radius: 0.5rem;
		padding: 3.2rem 1.9rem 2.4rem;
		gap: 1.6rem;
		box-shadow: 0px 15px 20px -5px rgba(13, 113, 130, 0.15);

        &:focus {
            background: red;
        }

		@include mq(tablet) {
			@include eflex(row nowrap, start, center);
            gap: 2.4rem;
		}
	}

	//IMAGE
	.job-card__image-container {
		height: 4.8rem;
		width: 4.8rem;
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(1.9rem, -50%);

		img {
			width: 100%;
			height: 100%;
		}

        @include mq(tablet){
            position: static;
            width: 8.8rem;
            height: 8.8rem;
            left: unset;
            top: unset;
            transform: unset;
            flex: 0 0 auto;
        }
	}

	//JOB INFO
	.job-info {
		width: 100%;
		@include flex(column nowrap, start, start);
		gap: 0.8rem;
		padding-bottom: 1.7rem;
		border-bottom: 1px solid #b7c4c4;

        @include mq(tablet){
            width: auto;
            border-bottom: none;
            padding-bottom: 0;
        }
	}

	.job-info__top {
		width: auto;
		@include flex(row wrap, start, center);
		gap: 0.8rem;

		.job-info__top-company {
			font-style: normal;
			font-weight: bold;
			font-size: 1.3rem;
			line-height: 1.5rem;
			color: v(primary);
		}

		.badge {
			line-height: 1.4rem;
			padding: 0.5rem 1rem 0.4rem;
			letter-spacing: -0.008rem;
			font-size: 1.1rem;
			font-weight: 700;
			border-radius: 1.2rem;
			color: white;

			&.job-info__top-new {
				background: v(primary);
			}
			&.job-info__top-featured {
				background: v(dark);
			}
		}
	}

	//CENTER
	.job-info__center .job-info__center-title {
		font-weight: 700;
		line-height: 2.4rem;
		font-size: 1.5rem;
		color: v(dark);
	}

	//BOTTOM
	.job-info__bottom {
		@include flex(row wrap, start, center);
		margin-right: 0.8rem;
		color: v(light-gray);
		font-size: 1.3rem;
		line-height: 2.4rem;
		gap: 0.8rem;
		font-weight: 500;

		span {
			font-size: 1.3rem;
		}
	}

	//TAGS
	.job-card .tags {
		@include flex(row wrap, start, center);
		gap: 1.6rem;
        flex: 1;
        justify-content: flex-end;

        @include mq(tablet){
            justify-self: end;
        }
		.tag {
			font-style: normal;
			font-weight: bold;
			font-size: 1.3rem;
			line-height: 2.4rem;
			background: v(bg);
			border-radius: 0.4rem;
			padding: 0.4rem 0.8rem;
			color: v(primary);
			flex: 1 0 auto;
			cursor: pointer;
			transition: color 250ms, background 250ms;

            @include mq(tablet) {
                flex: 0;
            }

			&:hover {
				color: v(white);
				background: v(primary);
			}
		}
	}
</style>

<section class="job-cards" title="Job Cards Section">
	{#each dataObject as job, index (job)}
		<article
			class="job-card"
			animate:flip={{ duration: 250 }}
			in:receive={{ key: index }}
			out:send={{ key: index }}>

			<div class="job-card__image-container">
				<img src="assets/images/{job.logo}" alt="" class="job-card__image" />
			</div>

			<section class="job-info" title="Job Info Section for {job.company}">
				<div class="job-info__top">
					<h2 class="job-info__top-company">{job.company}</h2>
					{#if job.new}
						<p class="job-info__top-new badge">NEW!</p>
					{/if}
					{#if job.featured}
						<p class="job-info__top-featured badge">FEATURED</p>
					{/if}
				</div>
				<div class="job-info__center">
					<a href="/{job.company.toLowerCase()}" class="job-info__center-title">{job.position}</a>
				</div>
				<div class="job-info__bottom">
					<p class="bottom__posted-at">{job.postedAt}</p>
					<span>•</span>
					<p class="bottom__contract">{job.contract}</p>
					<span>•</span>
					<p class="bottom__location">{job.location}</p>
				</div>
			</section>

			<section class="tags" title="Job Tags Section for {job.company}">
				<p class="tag" on:click={() => dispatch('addFilterTag', job.role)}>{job.role}</p>
				<p class="tag" on:click={() => dispatch('addFilterTag', job.level)}>{job.level}</p>
				{#each job.languages as tag}
					<button class="tag" on:click={() => dispatch('addFilterTag', tag)}>{tag}</button>
				{/each}
			</section>

		</article>
	{/each}
</section>
