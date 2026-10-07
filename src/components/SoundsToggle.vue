<script setup lang="ts">
import { soundsEnabled } from "../features/sounds/composables/useHowler";
import { startBackgroundMusic } from "../features/sounds/composables/useMusic";
import { musicPlaybackState } from "../features/sounds/definitions/music";
import ButtonRound from "./ButtonRound.vue";
import Volume from "./icons/Volume.vue";
import { t } from "../i18n/utils/translate";

const props = defineProps<{
  isDarkTheme: boolean;
}>();

const toggleSounds = () => {
  if (
    soundsEnabled.value &&
    (musicPlaybackState.value === "playing" ||
      musicPlaybackState.value === "loading")
  ) {
    soundsEnabled.value = false;
  } else {
    soundsEnabled.value = true;
    startBackgroundMusic();
  }
};
</script>

<template>
  <ButtonRound
    variant="theme"
    :class="{
      'music-toggle': true,
      'music-toggle-dark': props.isDarkTheme,
      'children-unclickable': true,
    }"
    @click="toggleSounds"
    :aria-label="
      soundsEnabled && musicPlaybackState === 'playing'
        ? t('disable-sounds')
        : t('enable-sounds')
    "
    :aria-pressed="soundsEnabled && musicPlaybackState === 'playing'"
    :data-music-state="musicPlaybackState"
    data-music-source="nhacnen.mp3"
    data-cursor="circle-white"
  >
    <Volume :active="soundsEnabled && musicPlaybackState === 'playing'" />
  </ButtonRound>
</template>

<style scoped lang="scss">
.music-toggle {
  &-dark {
    background-color: var(--color-dark-blue-500);
    color: var(--color-white-400);
    --icon-color: var(--color-white-400);
  }
}
</style>
