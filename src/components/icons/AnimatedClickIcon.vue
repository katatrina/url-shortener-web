<!-- Lucide shapes. Plays once when the surrounding button or link is hovered or gets keyboard focus. -->
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    overflow="visible"
    aria-hidden="true"
  >
    <path class="rays" d="M14 4.1L12 6M5.1 8l-2.9-.8M6 12l-1.9 2M7.2 2.2L8 5.1" />
    <path
      class="cursor"
      d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
    />
  </svg>
</template>

<style scoped>
/* The rays spread from the tip of the cursor. */
.rays {
  transform-origin: 9px 9px;
}

:is(a, button):is(:hover, :focus-visible) .rays {
  animation: click-rays 500ms ease-out;
}

:is(a, button):is(:hover, :focus-visible) .cursor {
  animation: click-cursor 500ms ease-in-out;
}

@keyframes click-rays {
  from {
    opacity: 0;
    transform: scale(0.2);
  }

  60% {
    opacity: 1;
    transform: scale(1.25);
  }
}

@keyframes click-cursor {
  30% {
    transform: translate(-3px, -3px);
  }
}
</style>
