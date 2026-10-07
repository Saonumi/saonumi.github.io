<script setup lang="ts">
const props = defineProps<{
  external?: boolean;
  renderAs?: "a" | "button" | "div";
  href?: string;
  to?: string;
}>();
</script>

<template>
  <component
    :is="props.renderAs || 'a'"
    :href="props.href || props.to"
    :target="props.external ? '_blank' : undefined"
    :rel="props.external ? 'noopener noreferrer' : undefined"
  >
    <slot></slot>
  </component>
</template>
