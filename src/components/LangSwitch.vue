<script setup lang="ts">
import Button from "./Button.vue";
import { locale } from "../i18n/store";
import { changeLocale } from "../i18n/utils/locale";

</script>

<template>
  <div class="language-switch" role="group" aria-label="Language / Ngôn ngữ">
    <Button v-for="language in (['vi', 'en'] as const)" :key="language"
      :variant="locale === language ? 'accent' : 'border'" size="sm"
      :aria-label="language === 'vi' ? 'Tiếng Việt' : 'English'"
      :aria-pressed="locale === language" @click="changeLocale(language)"
      data-cursor="circle-white" data-sound="click" data-hoversound="hover"
    >{{ language === 'vi' ? 'VIE' : 'EN' }}</Button>
  </div>
</template>

<style scoped>
.language-switch { display: flex; gap: 8px; }
</style>
