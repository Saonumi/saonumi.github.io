<script setup lang="ts">
import HeaderLink from "./HeaderLink.vue";
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { t } from "../i18n/utils/translate";
import { lenis, getSectionScrollTarget } from "../composables/useScroll";
import gsap from "gsap";
import { useHeaderTheme } from "../composables/useHeaderTheme";

const handleLinkClick = (link: string) => {
  if (!lenis.value) return;
  lenis.value.scrollTo(getSectionScrollTarget(link));
};

type ActiveLink = "about" | "projects" | "skills" | "contact";
const activeLink = ref<ActiveLink | null>(null);
const sections: ActiveLink[] = ["about", "projects", "skills", "contact"];
const ariaLabels = computed(() => ({
  about: t("about"),
  projects: t("projects"),
  skills: t("services"),
  contact: t("contact"),
}));

const isMounted = ref(false);

const barStyle = ref({ transform: "" });


const { isDarkTheme } = useHeaderTheme();

const updateBarPosition = () => {
  const index = sections.indexOf(activeLink.value as ActiveLink);
  barStyle.value = {
    transform: `translateX(${index * 100}%)`,
  };
};

const updateActiveSection = () => {
  // Pinned projects occupy their entire spacer, even after the card element ends.
  // Resolve elements here because Contact mounts after the project list is ready.
  const marker = window.innerHeight * .35;
  const current = [...sections].reverse().find(name => {
    const element = document.getElementById(name);
    if (!element) return false;
    const region = element.closest<HTMLElement>(".pin-spacer") ?? element;
    return region.getBoundingClientRect().top <= marker;
  }) ?? null;
  if (current === activeLink.value) return;
  activeLink.value = current;
  updateBarPosition();
};
onMounted(() => {
  gsap.ticker.add(updateActiveSection);
  window.addEventListener('resize', updateActiveSection);
  updateActiveSection();
  isMounted.value = true;
});
onBeforeUnmount(() => {
  gsap.ticker.remove(updateActiveSection);
  window.removeEventListener('resize', updateActiveSection);
});
</script>

<template>
  <div :class="['header-home', { 'header-home-mounted': isMounted }]">
    <div :class="['header-home-links', { 'header-home-links-dark': isDarkTheme }]">
      <div
        :class="[
          'header-home-bar',
          { 'header-home-bar-active': activeLink !== null, 'header-home-bar-dark': isDarkTheme },
        ]"
        :style="barStyle"
      ></div>
      <HeaderLink
        v-for="section in sections"
        :key="section"
        :is-active="activeLink === section"
        :aria-current="activeLink === section ? 'location' : undefined"
        :class="[
          'header-home-link',
          { 'header-home-link-active': activeLink === section },
          'children-unclickable',
        ]"
        @click="handleLinkClick('#' + section)"
        :is-dark-theme="isDarkTheme"
        :aria-label="ariaLabels[section]"
        data-sound="click"
        data-hoversound="hover"
      >
        {{ t(section === 'skills' ? 'services' : section) }}
      </HeaderLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-home {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-index-header-home);
  height: var(--height-header);
  align-items: center;
  justify-content: center;
  display: none;
  opacity: 0;
  transition:
    opacity 0.3s ease-in-out,
    transform var(--transition-route-duration) var(--transition-route-ease);


  &-mounted {
    opacity: 1;
  }

  @include mixins.mq("lg") {
    display: flex;
  }

  &-links {
    position: relative;
    display: flex;
    padding: 3px;
    background-color: var(--color-beige-500);
    border-radius: 100px;
    color: var(--color-text-400);
    transition:
      color 0.1s ease-in-out,
      background-color 0.1s ease-in-out;

    &-dark {
      background-color: var(--color-dark-blue-500);
      color: var(--color-white-400);
    }
  }

  &-bar {
    position: absolute;
    top: 3px;
    left: 3px;
    height: calc(100% - 6px);
    width: calc((100% - 6px) / 4);
    background: var(--color-orange-400);
    border-radius: 100px;
    transition:
      transform 0.3s var(--ease-smooth),
      opacity 0.1s ease-in-out,
      background-color 0.1s ease-in-out;
    z-index: 1;
    opacity: 0;

    &-dark {
      background-color: var(--color-cyan-500);
    }

    &-active {
      opacity: 1;
    }
  }

  &-link {
    position: relative;
    z-index: 2;
    letter-spacing: 0.02em;
    font-weight: 700;
    border: none;
    background: none;
    transition: color 0.1s ease-in-out;
    font-size: var(--font-size-md);
    width: 128px;
    white-space: nowrap;
    text-transform: uppercase;

    &-active {
      color: var(--color-white-400);
    }
  }
}

@media (max-width: 1023px) {
  .header-home { display: flex; top: auto; bottom: 12px; height: 44px; width: calc(100% - 24px); max-width: 540px; }
  .header-home-links { width: 100%; box-shadow: 0 6px 30px #00134133; }
  .header-home-link { width: auto; flex: 1; font-size: 11px; min-height: 38px; padding: 0 6px; }
}
</style>
