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
    <rect class="front" width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path class="back" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
</template>

<style scoped>
:is(a, button):is(:hover, :focus-visible) .front {
  animation: copy-front 300ms ease-in-out;
}

:is(a, button):is(:hover, :focus-visible) .back {
  animation: copy-back 300ms ease-in-out;
}

@keyframes copy-front {
  50% {
    transform: translate(-2px, -2px);
  }
}

@keyframes copy-back {
  50% {
    transform: translate(2px, 2px);
  }
}
</style>
