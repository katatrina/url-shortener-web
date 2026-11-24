<!-- Lucide shapes. Plays once when the surrounding button or link is hovered or gets keyboard focus. -->
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path class="top" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path class="bottom" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
</template>

<style scoped>
:is(a, button):is(:hover, :focus-visible) .top {
  animation: link-top 300ms ease-in-out;
}

:is(a, button):is(:hover, :focus-visible) .bottom {
  animation: link-bottom 300ms ease-in-out;
}

@keyframes link-top {
  50% {
    transform: translate(2px, -2px);
  }
}

@keyframes link-bottom {
  50% {
    transform: translate(-2px, 2px);
  }
}
</style>
