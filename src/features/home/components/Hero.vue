<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { sceneWeights, sceneWeightsInOut } from "../../../animations/scenes";
import { preloaderVisible } from "../../../composables/usePreloader";
import { t, translateContent as lc } from "../../../i18n/utils/translate";

import { profile } from "../../../content/saonumi";
import { lenis, getSectionScrollTarget } from "../../../composables/useScroll";
import { avatarRotation, setAvatarRotation } from "../../../composables/useAvatarRotation";
const navigate = (target: string) => lenis.value?.scrollTo(getSectionScrollTarget(target));
const dragging = ref(false);
const rotationMode = ref("paused");
let pointerId: number | null = null;
let dragStartX = 0;
let dragStartAngle = 0;
let lastInput = -Infinity;
let reducedMotion: MediaQueryList | null = null;
const interact = () => { lastInput = performance.now(); };
const autoRotate = () => {
  const visible = sceneWeights.hero > .5 && sceneWeightsInOut.about.in < .001
    && !preloaderVisible.value && !document.hidden;
  const idle = pointerId === null && performance.now() - lastInput > 2200;
  const auto = visible && idle && !reducedMotion?.matches;
  rotationMode.value = !visible ? "paused" : dragging.value ? "drag" : auto ? "auto" : "manual";
  if (!auto) return;
  // Real elapsed time, capped after a suspended tab. One revolution / 30 s.
  setAvatarRotation(avatarRotation.value + 12 * Math.min(gsap.ticker.deltaRatio() / 60, .05));
};
onMounted(() => {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  gsap.ticker.add(autoRotate);
});
onUnmounted(() => { gsap.ticker.remove(autoRotate); });

const startRotation = (event: PointerEvent) => {
  if (pointerId !== null || (event.pointerType === "mouse" && event.button !== 0)) return;
  interact();
  pointerId = event.pointerId;
  dragStartX = event.clientX;
  dragStartAngle = avatarRotation.value;
  dragging.value = true;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
};
const rotate = (event: PointerEvent) => {
  if (pointerId === null || event.pointerId !== pointerId) return;
  interact();
  setAvatarRotation(dragStartAngle + (event.clientX - dragStartX) * .7);
};
const endRotation = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return;
  if (event.type === "pointerup") rotate(event);
  lastInput = -Infinity;
  pointerId = null;
  dragging.value = false;
  const target = event.currentTarget as HTMLElement;
  if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
};
const rotateWithKeyboard = (event: KeyboardEvent) => {
  if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
  event.preventDefault();
  interact();
  setAvatarRotation(event.key === "Home" ? 0 : avatarRotation.value + (event.key === "ArrowRight" ? 15 : -15));
};
const resetRotation = () => { interact(); setAvatarRotation(0); };
</script>

<template>
  <section class="hero" :aria-label="t('about')">
    <div
      class="hero-rotation" :class="{ 'is-dragging': dragging }"
      :data-rotation-mode="rotationMode"
      role="slider" tabindex="0" :aria-label="t('rotate-avatar', { name: profile.name })"
      aria-valuemin="-180" aria-valuemax="180" :aria-valuenow="Math.round(avatarRotation)"
      :aria-valuetext="Math.round(avatarRotation) + ' degrees'"
      data-lenis-prevent-touch
      @pointerdown="startRotation" @pointermove="rotate"
      @pointerup="endRotation" @pointercancel="endRotation" @lostpointercapture="endRotation"
      @keydown="rotateWithKeyboard" @dblclick="resetRotation"
    ></div>
    <div class="hero-content-inner" id="hero-content-inner">
      <h1>{{ profile.name }}</h1>
      <p class="hero-role">{{ profile.role }}</p>
      <p class="hero-description">{{ lc(profile.tagline) }}</p>
      <div class="hero-actions">
        <button class="hero-primary" @click="navigate('#projects')">{{ t('view-projects') }} <span aria-hidden="true">↗</span></button>
        <button class="hero-secondary" @click="navigate('#about')">{{ t('meet-saonumi', { name: profile.name }) }}</button>
      </div>
    </div>
    <div class="hero-footer" aria-hidden="true"><span>{{ t('hero-footer') }}</span></div>
  </section>
</template>

<style scoped lang="scss">
.hero { height: calc(var(--lvh) * 100); width: 100%; position: relative; overflow: hidden; color: #35262d; }
.hero-rotation { position: absolute; left: 60%; right: 9%; top: 12%; bottom: 15%; cursor: grab; touch-action: pan-y; user-select: none; border-radius: 24px; }
.hero-rotation.is-dragging { cursor: grabbing; }
.hero-rotation:focus-visible { outline: 2px solid #b51b55; outline-offset: 6px; }
.hero-content-inner { position: absolute; left: 8.5%; top: 48%; transform: translateY(-50%); width: 48%; max-width: 740px; }
h1 { font-size: clamp(54px, 6.9vw, 104px); line-height: 1.1; font-weight: 800; letter-spacing: -.045em; }
.hero-role { font-size: clamp(20px, 2.25vw, 32px); line-height: 1.4; font-weight: 600; color: #b51b55; margin-top: 24px; }
.hero-description { font-size: clamp(15px, 1.4vw, 19px); line-height: 1.7; max-width: 440px; color: #806671; margin-top: 25px; }
.hero-actions { display: flex; align-items: center; gap: 27px; margin-top: 30px; }
.hero-actions button { font-size: 14px; font-weight: 600; cursor: pointer; }
.hero-actions button span { margin-left: 14px; }
.hero-primary { background: #c72d45; color: #fff; border: 1px solid #c72d45; border-radius: 100px; padding: 15px 23px; transition: background .18s; }
.hero-primary:hover { background: #b51b55; border-color: #b51b55; }
.hero-secondary { color: #35262d; border: none; background: none; padding: 14px 0; }
.hero-secondary:hover { color: #b51b55; }
.hero-actions button:focus-visible { outline: 2px solid #b51b55; outline-offset: 5px; }
.hero-footer { position: absolute; left: 8.5%; right: 8.5%; bottom: 27px; display: flex; justify-content: space-between; font-size: 10px; color: #806671; }
@media (orientation: portrait) {
  .hero-content-inner { top: 84px; left: 8%; width: 84%; max-width: none; transform: none; }
  h1 { font-size: clamp(40px, 11vw, 64px); max-width: 500px; }
  .hero-role { font-size: 17px; margin-top: 12px; }
  .hero-description { margin-top: 15px; font-size: 14px; line-height: 1.55; max-width: 460px; }
  .hero-actions { margin-top: 18px; gap: 23px; }
  .hero-actions button { font-size: 12px; }
  .hero-primary { padding: 11px 17px; }
  .hero-footer { display: none; }
  .hero-rotation { left: 15%; right: 15%; top: 43%; bottom: 12%; }
}
@media (orientation: portrait) and (max-height: 740px) {
  .hero-content-inner { top: 68px; }
  h1 { font-size: clamp(40px, 9.2vw, 52px); }
  .hero-role { font-size: 15px; margin-top: 9px; }
  .hero-description { font-size: 13px; margin-top: 10px; }
  .hero-actions { margin-top: 13px; }
}
@media (orientation: landscape) and (max-height: 640px) {
  .hero-footer { display: none; }
  h1 { font-size: clamp(36px, 6vw, 65px); }
  .hero-role { margin-top: 14px; font-size: 18px; }
  .hero-description { margin-top: 14px; font-size: 14px; }
  .hero-actions { margin-top: 17px; }
}
@media (orientation: landscape) and (max-width: 720px) {
  .hero-actions { gap: 12px; }
  .hero-actions button { font-size: 11px; }
  .hero-primary { padding: 11px 13px; }
}
</style>
