<script context="module">
	export async function preload({ params, query }) {
		// get the post for this page using the date and slug params
		const { year, slug } = params
		const response = await this.fetch(`pictures/${year}/${slug}.json`)
		const data = await response.json()

		if (response.status !== 200) {
			this.error(response.status, data.message)
			return
		}

		// grab the list of posts for the next/prev nav
		// -> TODO get this from the store after the index page populates it?
		const list = await this.fetch('pictures.json')
		const listData = await list.json()
		const currentPost = listData.pictures.indexOf(
			listData.pictures.find(item => item.slug === slug)
		)

		if (list.status !== 200) {
			this.error(list.status, listData.message)
			return
		}

		// get the data for the previous and next picture, if it exists
		let nav = {}
		if (listData.pictures[currentPost - 1]) {
			nav.previous = listData.pictures[currentPost - 1]
		}
		if (listData.pictures[currentPost + 1]) {
			nav.next = listData.pictures[currentPost + 1]
		}

		return {
			post: data,
			date: { year },
			nav
		}
	}
</script>

<script>
	import { format } from 'date-fns'
	import { titleize } from '@/utils/stringHelpers.js'
	import Cover from '@/components/Cover.svelte'
	import Gallery from '@/components/Gallery.svelte'
	import MainNav from '@/components/MainNav.svelte'
	import Note from '@/components/Note.svelte'
	import PageTitle from '@/components/PageTitle.svelte'
	import PaginationNavWithThumbs from '@/components/PaginationNavWithThumbs.svelte'
	import Passage from '@/components/Passage.svelte'
	import PrintEdition from '@/components/PrintEdition.svelte'
	import Wrapper from '@/components/Wrapper.svelte'

	export let post, date, nav
	let metadataBreakpoint = 'xsmall'

	$: formattedDate = format(new Date(date.year, 0), 'yyyy')
</script>

<PageTitle title="{post.title}" />

<MainNav segment="pictures" theme="reverse" />
<main>
	<article>

		<!-- Cover image -->
		<header class="padding-x-outside padding-y-xwide">
			<Cover
				sources={post.cover}
				alt={post.title}
			/>

			<!-- Title, media, size info -->
			<div class="metadata type-align-center padding-top">
				<h1 class="metadata-title | type-font-accent type-scale-epsilon type-weight-light">
					{post.title}
				</h1>
				<time
					class="metadata-subtitle | color-fg-secondary | type-font-accent type-weight-light type-scale-epsilon"
					datetime="{formattedDate}"
				>
					{formattedDate}
				</time>
				<p class="metadata-subtitle | color-fg-secondary | type-font-accent type-weight-light type-scale-epsilon type-leading-tight">
					{post.format}{#if post.width && post.height}&nbsp;&bull; {post.width}" x {post.height}"{/if}
				</p>
			</div>
		</header>

		{#if post.intro}
			<!-- Intro -->
			<section class="border-seam-top padding-x-outside padding-y-wide">
				<Wrapper width="xwide">
					<div class="flag">
						<h2 class="flag-heading padding-bottom-narrow">
							Backstory
						</h2>
						<Passage html={post.intro} />
					</div>
				</Wrapper>
			</section>
		{/if}

		{#if post.editions}
			<!-- Editions -->
			<section class="border-seam-top padding-x-outside padding-y-xwide">
				<h2 class="editions-heading padding-bottom-wide">
					Available editions
				</h2>
				{#if post.editions.length > 1}
					<Wrapper width="xxwide">
						<Gallery size="large" gutter="wide">
							{#each post.editions as edition}
								<li>
									<PrintEdition {edition} />
								</li>
							{/each}
						</Gallery>
					</Wrapper>
				{:else}
					<Wrapper width="wide">
						<PrintEdition edition={post.editions[0]} />
					</Wrapper>
				{/if}
			</section>
		{/if}

		<!-- About the edition note -->
		{#each post.printDescriptions as note}
			<aside
				class="border-seam-top padding-x-outside padding-y-xwide"
				id="about-{note.type}"
			>
				<Wrapper width="xwide">
					<div class="flag">
						<h2 class="flag-heading padding-bottom-narrow">
							About {titleize(note.type)} prints
						</h2>
						<Note html={note.description} />
					</div>
				</Wrapper>
			</aside>
		{/each}
	</article>
	{#if nav.previous || nav.next}
		<PaginationNavWithThumbs {nav} heading="More prints &amp; paintings" />
	{/if}
</main>

<style>
	.metadata {
		--spacing: var(--space-xnarrow);
		font-size: 0;
	}

	.metadata-title,
	.metadata-subtitle {
		display: block;
	}

	@media screen and (min-width: 20em) {
		.metadata-subtitle {
			display: inline-block;
			border-color: var(--color-border);
		}

		.metadata-subtitle + .metadata-subtitle {
			border-left: 1px solid;
			margin-left: var(--spacing);
			padding-left: var(--spacing);
		}
	}

	@media screen and (min-width: 25em) {
		.metadata-title {
			display: inline-block;
		}

		.metadata > * + * {
			border-left: 1px solid;
			margin-left: var(--spacing);
			padding-left: var(--spacing);
		}
	}

	@media screen and (min-width: 40em) {
		.editions-heading {
			text-align: center;
		}
	}

	@media screen and (min-width: 60em) {
		@supports (display: grid) {
			.flag {
				padding-top: 0.1em;
				display: grid;
				grid-template-columns: minmax(auto, 28rem) minmax(30rem, 1fr);
				grid-gap: var(--space-wide);
			}

			.flag-heading {
				margin-top: -0.1em;
			}
		}
	}
</style>
