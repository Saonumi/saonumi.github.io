import { Howl } from "howler";
import { ref } from "vue";

import backgroundMusic from "../../../assets/music/nhacnen.mp3";

import type { MusicTrack } from "../types";

export const musicTracks = {
  // Stream the long mix instead of decoding the entire file into Web Audio memory.
  background: new Howl({ src: [backgroundMusic], loop: true, html5: true, volume: 0.2, preload: false,
    onplay: () => { musicPlaybackState.value = 'playing'; },
    onpause: () => { musicPlaybackState.value = 'paused'; },
    onstop: () => { musicPlaybackState.value = 'idle'; },
    onloaderror: () => { musicPlaybackState.value = 'error'; },
    onplayerror: () => { musicPlaybackState.value = 'error'; },
  }),
} as const;

export const musicPlaybackState = ref<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');

export const BASE_VOLUMES = {
  background: 0.2,
} as const satisfies Record<MusicTrack, number>;
