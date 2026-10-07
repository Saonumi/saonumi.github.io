import { onMounted, onUnmounted, watchEffect } from "vue";
import gsap from "gsap";
import { BASE_VOLUMES, musicTracks, musicPlaybackState } from "../definitions/music";
import { sizes } from "../../../utils/sizes";
import { howlerUnlocked, soundsEnabled } from "./useHowler";
import { isFeatureEnabled } from "../../../utils/features";
import { useAgent } from "../../../composables/useAgent";

import type { MusicTrack } from "../types";

export const useMusic = () => {
  const { isTouch } = useAgent();

  const tickVolumes = () => {
    musicTracks.background.volume(BASE_VOLUMES.background);
  };

  const tick = () => {
    if (!sizes.visible) return;
    if (!soundsEnabled.value || !howlerUnlocked.value || isTouch.value) return;
    tickVolumes();
  };

  const play = (trackId: MusicTrack) => {
    if (!isFeatureEnabled("sounds") || isTouch.value) return;
    const track = musicTracks[trackId];
    if (!track || track.playing()) return;
    if (track.state() === 'unloaded') {
      musicPlaybackState.value = 'loading';
      track.load();
    }
    track.play();
  };

  watchEffect(() => {
    if (!isFeatureEnabled("sounds")) return;
    if (!soundsEnabled.value) {
      musicTracks.background.pause();
      return;
    }
    if (!howlerUnlocked.value || !soundsEnabled.value || isTouch.value) return;

    play("background");
  });

  onMounted(() => {
    if (!isFeatureEnabled("sounds")) return;
    gsap.ticker.add(tick);
  });

  onUnmounted(() => {
    if (!isFeatureEnabled("sounds")) return;
    gsap.ticker.remove(tick);
    musicTracks.background.stop();
  });
};
