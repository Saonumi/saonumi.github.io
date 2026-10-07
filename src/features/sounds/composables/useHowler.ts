import { onMounted, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { Howler } from "howler";
import { lerp } from "../../../utils/math";
import { isFeatureEnabled } from "../../../utils/features";

export const soundsEnabled = ref(true);

Howler.volume(1);

export const useHowler = () => {
  let targetVolume = 1;

  const tick = () => {
    const currentVolume = Howler.volume();

    if (Math.abs(currentVolume - targetVolume) < 0.01) {
      if (currentVolume !== targetVolume) Howler.volume(targetVolume);
      return;
    }

    Howler.volume(
      lerp(currentVolume, targetVolume, targetVolume ? 0.01 : 0.05),
    );
  };

  const handleVisibilityChange = () => {
    Howler.mute(document.visibilityState === "hidden");
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

    if (
      event.code === "KeyM" &&
      !event.repeat &&
      !isTyping &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      soundsEnabled.value = !soundsEnabled.value;
    }
  };

  watch(soundsEnabled, (enabled) => {
    targetVolume = enabled ? 1 : 0;
  });

  onMounted(() => {
    if (!isFeatureEnabled("sounds")) return;

    Howler.volume(1);
    handleVisibilityChange();

    gsap.ticker.add(tick);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyPress);
  });

  onUnmounted(() => {
    if (!isFeatureEnabled("sounds")) return;

    gsap.ticker.remove(tick);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("keydown", handleKeyPress);
  });
};
