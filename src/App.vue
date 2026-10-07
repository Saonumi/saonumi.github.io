<script setup lang="ts">
import Header from "./components/Header.vue";
import { useTranslations } from "./i18n/composables/useTranslations";
import { usePreloader } from "./composables/usePreloader";
import Cursor from "./components/Cursor.vue";
import { useAgent } from "./composables/useAgent";
import { useMusic } from "./features/sounds/composables/useMusic";
import { useHowler } from "./features/sounds/composables/useHowler";
import Home from "./features/home/components/Home.vue";
import { useScroll } from "./composables/useScroll";

useTranslations();
usePreloader();
useMusic();
useHowler();
useScroll();
const { isTouch } = useAgent();
</script>

<template>
  <Header />
  <Home />
  <Cursor v-if="!isTouch" />
</template>
