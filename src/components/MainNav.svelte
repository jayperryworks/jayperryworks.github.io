<script>
  import arrow from 'icons/arrow-down.svg'
  import menu from 'icons/menu.svg'
  import Icon from './Icon.svelte'

  import Bookend from './Bookend.svelte'
  import Dropdown from './Dropdown.svelte'
  import LogoJP from './logos/LogoJP.svelte'

	export let segment,
    theme = false,
    overlay = false,
    hideMenu = false

  let items = [
    {
      label: 'Prints &amp; paintings',
      url: 'pictures',
      priority: 1,
      prefetch: true
    },
    {
      label: 'Writing',
      url: 'writing',
      priority: 2,
      prefetch: true
    },
    {
      label: 'About',
      url: 'about',
      priority: 2,
      prefetch: true
    }
  ]

  function priorityClass (item) {
    return item.priority == 1 ? 'hide-above@xsmall' : ''
  }
</script>

<style>
  .logo {
    display: block;
    border: none;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: transparent;
  }
</style>

<nav
  class="padding-x-outside"
  class:overlay
  data-theme={theme || ''}
>
  <Bookend
    breakpoint="none"
    align="top"
  >
    <a
      slot="left"
      class="logo"
      href="/"
    >
      <LogoJP />
    </a>

    <!-- large screen menu -->
  	<div slot="right">
      {#if !hideMenu}
        <ul class="display-inline-block hide-below@xsmall list-undecorated margin-x-between">
          {#each items as item}
            <li class="
              display-inline-block
              no-margin-top
              {item.priority > 1 ? 'hide-visually show-visually-above@small' : ''}
            ">
              <a
                class="display-block padding-top-narrow t-font-accent t-link-undecorated t-scale-zeta"
                class:t-highlight-top={segment === item.url}
                rel={item.prefetch ? 'prefetch' : ''}
                href={item.url}
              >
                {@html item.label}
              </a>
            </li>
          {/each}
        </ul>

        <!-- small-screen menu -->
        <Dropdown class="hide-above@small padding-top-narrow margin-left">
          <span
            slot="label"
            class="display-block t-scale-zeta"
          >
            <Icon svg={menu} margin="right" />
            <span class="hide-visually-above@xsmall t-font-accent">
              Menu
            </span>
            <Icon svg={arrow} margin="left" size="small" />
          </span>
          <ul slot="dropdown" class="list-undecorated">
            {#each items as item, index}
              <li
                class="display-block no-margin-top {priorityClass(item)}"
                class:padding-bottom={index != items.length - 1}
              >
                <a
                  class="display-block padding-x t-font-accent t-leading-tight t-link-undecorated t-scale-zeta"
                  class:t-highlight-left={segment === item.url}
                  href={item.url}
                >
                  {@html item.label}
                </a>
              </li>
            {/each}
          </ul>
        </Dropdown>
      {/if}
    </div>
  </Bookend>
</nav>
