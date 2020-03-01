<script context="module">
	export async function preload({ params, query }) {
		const { number } = params
		const response = await this.fetch(`writing/page/${number}.json`)
		const data = await response.json()

		return {
			number,
			total: data.totalPages,
			posts: data.posts
		}
	}
</script>

<script>
	import { format } from 'date-fns'
	import arrowSmallRight from 'icons/arrow-right.svg'
	import arrowDottedLeft from 'icons/arrow-dotted-left.svg'
	import arrowDottedRight from 'icons/arrow-dotted-right.svg'
	import Icon from '@/components/Icon.svelte'
	import OutdentedBlurb from '@/components/OutdentedBlurb.svelte'
	import PageTitle from '@/components/PageTitle.svelte'
	import PostBody from '@/components/PostBody.svelte'
	import Figure from '@/components/Figure.svelte'
	import Wrapper from '@/components/Wrapper.svelte'
	import Bookend from '@/components/Bookend.svelte'

	export let posts, number, total

	const currentDate = format(new Date(), 'yyyy')

	$: nextPage = parseInt(number) + 1
	$: prevPage = parseInt(number) - 1

	$: postsByYear = posts.reduce((result, post) => {
		if (!Object.keys(result).includes(post.date.year)) {
			result[post.date.year] = posts.filter(p => p.date.year === post.date.year)
		}
		return result
	}, {})

	function date(date, template = 'MMMM d, yyyy') {
		return format(new Date(date.year, date.month, date.day), template)
	}
</script>

<style type="text/scss">
	@use 'config/border';
	@use 'config/type';
	@use 'config/breakpoints' as bp;

	ul {
		margin: 0 0 1em 0;
		line-height: type.leading();
	}

	li + li {
		@include border.add(top, $style: 'solid');
	}

	h1 {
		margin-top: -0.3em;
	}

	.pagination-label {
		display: inline-block;
		vertical-align: middle;
		margin-top: -0.7em;
	}
</style>

{#each Object.keys(postsByYear).reverse() as year, index}
	<div class:border-seam-top={index > 0}>
		<OutdentedBlurb class="padding-x-outside padding-y-xwide">
			<h1
				slot="blurb"
				class="padding-bottom-wide"
			>
				{year === currentDate ? 'Recent posts' : year}
			</h1>

			<div slot="body">
				<Wrapper centered={false}>
					<ul class="list-undecorated margin-y-between-xwide padding-y-between-xwide">
						{#each postsByYear[year] as post}
							<li>
								<article>
									<a
										rel="prefetch"
										href={post.path}
										class="t-link-undecorated"
									>
										{#if post.cover && post.cover.sources}
											<div class="padding-bottom">
												<Figure
													sources={post.cover.sources}
													alt={post.cover.alt}
													caption={post.cover.caption}
													credit={post.cover.credit}
													border={post.cover.border}
												/>
											</div>
										{/if}
										<h2>{post.title}</h2>
										{#if post.subtitle}
											<p class="c-fg-tertiary t-font-accent t-scale-gamma">
												{post.subtitle}
											</p>
										{/if}
									</a>
									<time
										class="c-fg-tertiary display-block padding-top-xxnarrow padding-bottom t-font-accent t-scale-zeta t-weight-bold"
										datetime={date(post.date, 'yyyy-M-dd')}
									>
										{date(post.date)}
									</time>
									<PostBody sections={post.excerpt} dropCap={false} />
									{#if post.readMore}
										<a
											class="display-inline-block padding-top t-case-upper t-font-accent t-scale-zeta t-weight-bold t-link-undecorated"
											rel="prefetch"
											href={post.path}
										>
											Read more
											<Icon
												svg={arrowSmallRight}
												margin="left"
												size="small"
											/>
										</a>
									{/if}
								</article>
							</li>
						{/each}
					</ul>
				</Wrapper>
			</div>
		</OutdentedBlurb>
	</div>
{/each}
<footer class="border-seam-top-offset padding-x-outside padding-y-wide">
	<Bookend breakpoint="none" fillSide="none">
		<div slot="left">
			{#if prevPage > 0}
				<a
					class="t-link-undecorated t-scale-gamma t-heading"
					href={`writing/page/${prevPage}`}
				>
					<Icon
						svg={arrowDottedLeft}
						size="xlarge"
						class="margin-right-narrow"
					/>
					<span class="pagination-label hide-below@small">Newer posts</span>
				</a>
			{/if}
		</div>
		<div slot="right">
			{#if nextPage <= total}
				<a
					class="t-link-undecorated t-scale-gamma t-heading"
					href={`writing/page/${nextPage}`}
				>
					<span class="pagination-label hide-below@small">Older posts</span>
					<Icon
						svg={arrowDottedRight}
						size="xlarge"
						class="margin-left-narrow"
					/>
				</a>
			{/if}
		</div>
	</Bookend>
</footer>
