<script setup lang="ts">
import CalendarIcon from "../../../components/icons/Calendar.vue";
import PinIcon from "../../../components/icons/Pin.vue";
import { profile } from "../../../content/saonumi";
import { t } from "../../../i18n/utils/translate";
</script>

<template>
  <div class="profile-metadata">
    <div class="profile-metadata-row">
      <CalendarIcon class="profile-metadata-icon" />
      <time datetime="2005-07-31" :aria-label="t('birth-date') + ': ' + profile.birthDate">{{ profile.birthDate }}</time>
    </div>
    <div class="profile-metadata-row">
      <PinIcon class="profile-metadata-icon" aria-hidden="true" />
      <span>{{ profile.location }}</span>
    </div>
  </div>
</template>

<style scoped>
.profile-metadata { display: grid; gap: 8px; font-size: 14px; line-height: 1.5; }
.profile-metadata-row { display: flex; align-items: center; gap: 9px; }
.profile-metadata-icon { width: 16px; height: 18px; flex-shrink: 0; color: #b51b55; --icon-color: #b51b55; }
@media (min-width: 840px) { .profile-metadata { font-size: 16px; } }
</style>
