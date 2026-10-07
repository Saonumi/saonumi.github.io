import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { lenis } from "./useScroll";

export const useHeaderTheme = ({
  onUpdate,
}: {
  onUpdate?: (element: HTMLElement | null, boundingClientRect: DOMRect | null, hasScrolledIntoView: boolean) => void;
} = {}) => {
  let aboutElement: HTMLElement | null = null;
  const isDarkTheme = ref(false);
  const hasScrolledIntoView = ref(false);

  const handleScroll = () => {
    if (!aboutElement) {
      aboutElement = typeof window !== "undefined" ? document.querySelector("#about") : null;
    }

    if (aboutElement) {
      const aboutBounding = aboutElement.getBoundingClientRect();
      const isScrolledIntoView = aboutBounding.top <= 1;

      hasScrolledIntoView.value = isScrolledIntoView;
      isDarkTheme.value = false;

      if (typeof onUpdate === "function") {
        onUpdate(aboutElement, aboutBounding, isScrolledIntoView);
      }
    }
  };

  // Watch the instance only, not the event-emitter internals changed by .on().
  watch(lenis, (instance, _previous, onCleanup) => {
    instance?.on("scroll", handleScroll);
    handleScroll();
    onCleanup(() => instance?.off("scroll", handleScroll));
  }, { immediate: true });
  onMounted(() => { window.addEventListener("resize", handleScroll); handleScroll(); });
  onBeforeUnmount(() => window.removeEventListener("resize", handleScroll));

  return {
    isDarkTheme,
    hasScrolledIntoView,
  };
};
