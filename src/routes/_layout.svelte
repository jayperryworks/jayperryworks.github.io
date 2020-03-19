<script>
  import MainFooter from '@/components/MainFooter.svelte'
  import { stores } from '@sapper/app'
  import { onMount, afterUpdate } from 'svelte'

  const { preloading, page } = stores()

  let wrapperEl
  let windowH
  let pageHeight = 0
  let currentScrollPosition = 0
  let scrollProgress = 0
  let ticking = false

  function updatePageHeight () {
  	pageHeight = wrapperEl.clientHeight
  	windowH = window.innerHeight
  }

  function updateScrollPercentage () {
		const weightedScrollPercentage = currentScrollPosition + ((currentScrollPosition / pageHeight) * windowH)
  	scrollProgress = (weightedScrollPercentage / pageHeight) * 100
  }

  function throttle (callback) {
  	if (!ticking) {
  		window.requestAnimationFrame(() => {
  			callback()
  			ticking = false
  		})

	  	ticking = true
  	}
  }

  onMount(() => {
  	wrapperEl = document.getElementById('main-wrapper')
  	updatePageHeight()

  	window.addEventListener('scroll', (event) => {
  		currentScrollPosition = window.scrollY
  		throttle(updateScrollPercentage)
  	})

  	window.addEventListener('resize', (event) => {
  		currentScrollPosition = window.scrollY
  		throttle(updatePageHeight)
  	})
	})
  afterUpdate(updatePageHeight)
</script>

<style type="text/scss" global>
  // global/base styles
  @use 'global';

  // config for this layout
  @use 'config/border';
  @use 'config/positioning';
  @use 'config/color';

  // Sticky footer setup
  html {
    height: 100%; // for opera mini etc

    @supports (min-height: 100vh) {
      height: auto;
      min-height: 100vh;
    }
  }

  body {
    min-height: 100%;
    min-height: 100vh;

    @supports (display: flex) {
      display: flex;
      flex-direction: column;
    }
  }

  #sapper {
    @supports (display: flex) {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }

  #spine-wrapper {
    $bg-color: 'highlight';
    $bg-size: 30px;
    $progress-color: color.get('highlight', $grade: -20);

    --progress-height: 0;

    padding-left: border.width('frame');
    position: relative;

    @supports (display: flex) {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    &::before {
      background-color: color.get($bg-color);
      background-image: linear-gradient(
      	$progress-color var(--progress-height),
      	color.get($bg-color) var(--progress-height)
    	);
      bottom: 0;
      content: '';
      display: block;
      left: 0;
      position: fixed;
      top: 0;
      width: border.width('frame');
      z-index: positioning.z('low');
    }

    &.loading::before {
      @supports (background: repeating-linear-gradient(45deg, #fff, #000)) {
        // cheers to https://css-tricks.com/uniqlo-stripe-hovers/
        animation: stripes 0.75s linear infinite;
        background: repeating-linear-gradient(
          -45deg,
          color.get($bg-color),
          color.get($bg-color) 25%,
          color.get($bg-color, $grade: 30) 25%,
          color.get($bg-color, $grade: 30) 50%,
          color.get($bg-color) 50%
        ) top left fixed;
        background-size: $bg-size $bg-size;
      }
    }

    @keyframes stripes {
      from { background-position: 0 0; }
      to   { background-position: $bg-size $bg-size; }
    }
  }

  #main-wrapper {
    position: relative;

    @supports (flex: 1) {
      display: flex;
      flex-direction: column;
      flex: 1;
    }


  }
</style>

<div
  id="spine-wrapper"
  class:loading={$preloading}
  style={`--progress-height: ${scrollProgress}%;`}
>
  <div id="main-wrapper">
    <slot></slot>
  </div>
  <MainFooter />
</div>
