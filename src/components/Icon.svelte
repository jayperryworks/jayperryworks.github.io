<script>
  export let svg,
    size = '',
    margin = '',
    align = 'middle'

  let classes = ''
  export { classes as class }

  let marginClass = margin ? `space-${margin}` : ''
</script>

<span class="icon {size} {marginClass} align-{align} {classes}">
  {@html svg}
</span>

<style>
  .icon {
    --icon-size: 1em;

    color: currentColor;
    display: inline-block;
    fill: currentColor;
    height: 1em;
    height: var(--icon-size);
    max-height: 100%;
    max-width: 100%;
    pointer-events: none;
    vertical-align: middle;
    width: 1em;
    width: var(--icon-size);
  }

  .icon :global(svg) {
    display: block;
    fill: currentColor;
    margin: 0;
    max-height: 100%;
    width: 100%;
  }

  .small {
    --icon-size: 0.7em;
  }

  .large {
    --icon-size: 1.44em;
  }

  .xlarge {
    --icon-size: 2.07em;
  }

  .space-right {
    margin-right: 0.25em;
  }

  .space-left {
    margin-left: 0.25em;
  }

  .align-middle {
    margin-top: -0.15em; /* scooch up a little on the baseline */
    vertical-align: middle;
  }

  .align-baseline {
    margin-top: 0;
    vertical-align: baseline;
  }
</style>
