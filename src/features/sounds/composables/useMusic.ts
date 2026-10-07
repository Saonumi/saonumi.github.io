import { onMounted, onUnmounted, watch } from "vue";
import {
  musicTracks,
  musicPlaybackState,
} from "../definitions/music";
import { soundsEnabled } from "./useHowler";
import { isFeatureEnabled } from "../../../utils/features";

let playbackId: number | undefined;

export const startBackgroundMusic = () => {
  if (!isFeatureEnabled("sounds") || !soundsEnabled.value) return;

  const track = musicTracks.background;
  if (track.playing() || musicPlaybackState.value === "loading") return;

  musicPlaybackState.value = "loading";
  playbackId = track.play(playbackId);
};

export const useMusic = () => {
  const track = musicTracks.background;
  let mounted = false;

  const handlePlay = () => {
    if (!soundsEnabled.value) track.pause();
  };

  const handleInteraction = (event: Event) => {
    if (!event.isTrusted) return;
    if (event instanceof KeyboardEvent && event.repeat) return;

    startBackgroundMusic();
  };

  watch(
    soundsEnabled,
    (enabled) => {
      if (!mounted || !isFeatureEnabled("sounds")) return;

      if (enabled) {
        startBackgroundMusic();
      } else if (track.state() === "loaded") {
        track.pause();
      }
    },
    { flush: "sync" },
  );

  onMounted(() => {
    if (!isFeatureEnabled("sounds")) return;

    mounted = true;
    track.on("play", handlePlay);
    track.on("unlock", startBackgroundMusic);

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchend", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    startBackgroundMusic();
  });

  onUnmounted(() => {
    if (!isFeatureEnabled("sounds")) return;

    mounted = false;
    track.off("play", handlePlay);
    track.off("unlock", startBackgroundMusic);

    document.removeEventListener("click", handleInteraction);
    document.removeEventListener("touchend", handleInteraction);
    document.removeEventListener("keydown", handleInteraction);

    track.stop();
    playbackId = undefined;
  });
};
