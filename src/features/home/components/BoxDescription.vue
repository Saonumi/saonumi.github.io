<script setup lang="ts">
import { ref, watchEffect, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { BREAKPOINTS } from "../../../utils/sizes";
import { Vector3 } from "three";
import ProjectedElement from "../../../components/ProjectedElement.vue";
import AppearingText from "../../../components/AppearingText.vue";
import ProfileMetadata from "./ProfileMetadata.vue";
import { t } from "../../../i18n/utils/translate";
import { profile, aboutStatus } from "../../../content/saonumi";

const point = new Vector3(-0.9, 2, 6.75);

const wrapperRef = ref<HTMLDivElement | null>(null);
const timelines = ref<{ timeline: gsap.core.Timeline; delay: number }[]>([]);
let matchMedia: gsap.MatchMedia | null = null;

const emit = defineEmits<{
  "timeline:created": [timeline: gsap.core.Timeline];
}>();

watchEffect((onInvalidate) => {
  const wrapperEl = wrapperRef.value;
  if (!wrapperEl) return;

  // Clean up previous matchMedia
  if (matchMedia) {
    matchMedia.revert();
    matchMedia = null;
  }

  // Initialize GSAP matchMedia
  matchMedia = gsap.matchMedia();

  matchMedia.add(
    {
      isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
      isDesktop: `(min-width: ${BREAKPOINTS.md}px)`,
    },
    (context) => {
      const { conditions } = context;
      const { isMobile } = conditions as { isMobile: boolean; isDesktop: boolean };

      const tl = gsap.timeline({
        paused: true,
      });

      // Only animate clipPath on desktop
      if (!isMobile) {
        tl.fromTo(
          wrapperEl,
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "none" },
          0,
        );
      } else {
        // On mobile, ensure clipPath is set to visible immediately
        gsap.set(wrapperEl, { clipPath: "inset(0% 0% 0% 0%)" });
      }

      for (let i = 0; i < timelines.value.length; i++) {
        const item = timelines.value[i];
        if (!item) continue;
        tl.add(() => {
          item.timeline.restart(true);
        }, item.delay + 0.15);
      }

      emit("timeline:created", tl);

      // Return cleanup function
      return () => {
        tl.kill();
      };
    },
  );

  onInvalidate(() => {
    if (matchMedia) {
      matchMedia.revert();
      matchMedia = null;
    }
  });
});

onBeforeUnmount(() => {
  if (matchMedia) {
    matchMedia.revert();
  }
});

const handleTimelineCreated = (timeline: gsap.core.Timeline, delay: number) => {
  const updatedTimelines = [...timelines.value, { timeline, delay }];
  timelines.value = updatedTimelines;
};
</script>

<template>
  <ProjectedElement :point="point">
    <div ref="wrapperRef" class="box-description">
      <div class="box-description-details">
        <p class="box-description-details-name">{{ profile.name }}</p>
        <ProfileMetadata />
      </div>
      <div class="box-description-content">
        <div class="box-description-copy">
          <h3 class="status-title">{{ t('about-status') }}</h3>
          <ul class="status-list">
            <li v-for="(item, index) in aboutStatus.items" :key="index">
              <AppearingText :text="item" :steps="3" :duration="0.35"
                @timeline:created="(tl: gsap.core.Timeline) => handleTimelineCreated(tl, index * 0.1)" />
            </li>
          </ul>
          <p class="status-pending">{{ t('about-loading') }}</p>
        </div>
      </div>
    </div>
  </ProjectedElement>
</template>

<style scoped lang="scss">
.box-description {
  --line-length: min(48px, calc(var(--svw) * 5));

  display: grid;
  gap: 16px;
  position: absolute;
  bottom: var(--count-height);
  width: calc(100% - var(--space-outer) * 2);
  left: var(--space-outer);

  @include mixins.landscape {
    position: relative;
    left: 0;
    bottom: 0;
    width: 480px;
    max-width: calc(var(--svw) * 38);
    transform: translate(-100%, -50%);
    padding-top: 3px;
    padding-right: var(--line-length);
  }

  @include mixins.landscape-large {
    width: 410px;
    max-width: calc(var(--svw) * 32);
  }

  &-details {
    border: var(--stroke-sm) solid var(--color-cyan-400);
    border-radius: var(--radius-md);
    background: linear-gradient(to bottom, var(--color-hologram-top), var(--color-hologram-bottom));
    padding: var(--space-sm) var(--space-md);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @include mixins.landscape {
      display: none;
    }

    &-name {
      color: #b51b55;
      font-size: var(--font-size-title-xs);
      font-weight: 700;
    }

  }

  &::after,
  &::before {
    display: none;

    @include mixins.landscape {
      display: block;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 11px;
    height: 11px;
    background-color: var(--color-cyan-400);
    border-radius: 50%;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: var(--line-length);
    height: 0;
    border-top: var(--stroke-sm) solid var(--color-cyan-400);
  }

  &-content {
    border: var(--stroke-sm) solid var(--color-cyan-400);
    border-radius: var(--radius-md);
    background: linear-gradient(to bottom, var(--color-hologram-top) 0%, var(--color-hologram-bottom) 100%);

    @include mixins.landscape {
      padding: var(--space-xs) var(--space-sm);

      @include mixins.mq("md") {
        padding: var(--space-sm) var(--space-md);
      }
    }
  }

  &-copy {
    will-change: opacity;
    font-size: var(--font-size-md);
    padding: var(--space-sm) var(--space-md);

    @include mixins.landscape {
      padding: 0;
      font-size: var(--font-size-sm);
    }

    @include mixins.landscape-large {
      font-size: var(--font-size-lg);
    }
  }
}

.status-title { color: #b51b55; font-size: var(--font-size-title-xs); font-weight: 800; margin-bottom: var(--space-sm); }
.status-list { list-style: none; padding: 0; display: grid; gap: var(--space-xs); font-size: var(--font-size-md); line-height: 1.5; font-weight: 400; }
.status-list li { position: relative; padding-left: 18px; }
.status-list li::before { content: ""; position: absolute; left: 2px; top: 9px; width: 4px; height: 4px; background: var(--color-text-cyan-400); border-radius: 50%; }
.status-pending { font-size: 13px; font-style: italic; color: #806671; margin-top: 14px; }
@include mixins.landscape {
  .status-title { font-size: var(--font-size-title-xxs); }
  .status-list { font-size: var(--font-size-sm); }
}
@include mixins.landscape-large {
  .status-title { font-size: var(--font-size-title-xs); }
  .status-list { font-size: var(--font-size-lg); }
}
@media (orientation: portrait) {
  .box-description { bottom: max(var(--count-height), 94px); }
  .box-description-details-name { font-size: 20px; line-height: 1.35; }
  .status-list { font-size: 14px; }
}
</style>
