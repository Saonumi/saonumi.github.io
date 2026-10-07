<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { transitions } from "../../../animations";
import { t } from "../../../i18n/utils/translate";
import Social from "../../../components/Social.vue";

const contactElement = ref<HTMLElement | null>(null);

onMounted(() => {
  if (contactElement.value) {
    transitions.contact.setup(contactElement.value);
  }
});

onUnmounted(() => {
  transitions.contact.destroy();
});
</script>

<template>
  <div class="contact grid" ref="contactElement">
    <div class="contact-content">
      <h2 class="contact-title">{{ t('contact') }}</h2>
      <Social variant="background" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact {
  position: relative;
  width: 100%;
  max-width: calc(var(--svw) * 100);
  overflow: hidden;
  min-height: calc(var(--lvh) * 105);
  padding: var(--space-outer);
  padding-top: 100px;
  &-content {
    position: absolute;
    left: var(--space-outer);
    right: var(--space-outer);
    bottom: calc(var(--lvh) * 12 + 20px);
    z-index: 1;
    grid-column: 1 / 13;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    text-align: center;
  }
  &-title {
    font-weight: 700;
    letter-spacing: -.035em;
    line-height: 1.2;
    font-size: clamp(28px, 2.8vw, 40px);
    max-width: 850px;
    :deep(br) { display: none; }
  }
  @media (max-width: 480px) {
    &-title { font-size: 28px; }
  }
  @media (max-height: 740px) { padding-top: 74px; }
}
</style>
