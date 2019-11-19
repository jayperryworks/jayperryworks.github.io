<script context="module">
  export async function preload({ params, query }) {
    const response = await this.fetch('pictures.json')
    const data = await response.json()

    if (response.status !== 200) {
      this.error(response.status, data.message)
      return
    }

    return {
      pictures: data
    }
  }
</script>

<script>
  import { format } from 'date-fns'
  import arrow from 'icons/arrow-right.svg'
  import Button from '@/components/Button.svelte'
  import Gallery from '@/components/Gallery.svelte'
  import MainNav from '@/components/MainNav.svelte'
  import OutdentedBlurb from '@/components/OutdentedBlurb.svelte'
  import PageTitle from '@/components/PageTitle.svelte'
  import ResponsiveImage from '@/components/ResponsiveImage.svelte'

  export let pictures

  function getProp(picture, prop) {
    return picture.thumbnail.map((item) => {
      return item[prop]
    })
  }
</script>

<style>
  h1 {
    margin-top: -0.38em;
  }
</style>

<PageTitle title="Pictures" />

<MainNav segment="pictures" />
<main>
  <OutdentedBlurb
    class="padding-x-outside padding-y-xwide"
    blurbWidth="narrow"
    bodyWidth="wide"
  >
    <div slot="blurb" class="padding-bottom-wide">
      <h1 class="padding-bottom-narrow">Recent work</h1>
      <Button
        href="https://jayperry.etsy.com"
        iconRight={arrow}
      >
        More prints avaialble at <strong>Etsy</strong>
      </Button>
    </div>

    <div slot="body" class="overflow-hidden">
      <Gallery>
        {#each pictures as picture}
          <li>
            <a
              class="t-link-undecorated"
              rel="prefetch"
              href={picture.path}
            >
              <ResponsiveImage
                sources={picture.thumbnail}
                alt={picture.title}
              />
            </a>
          </li>
        {/each}
      </Gallery>
    </div>
  </OutdentedBlurb>
</main>