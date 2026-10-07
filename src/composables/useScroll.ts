import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ref, onMounted, onUnmounted } from "vue";

export const lenis = ref<Lenis | null>(null);
export const velocity = ref(0);

export const getSectionScrollTarget = (selector: string): string | number => {
  if (selector !== "#about") return selector;
  const section = document.querySelector(selector);
  if (!section) return selector;
  // Navigation lands on the completed hologram; manual scrolling still scans it.
  return section.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
};

const handleScroll = () => {
  ScrollTrigger.update();
};

export const useScroll = () => {
  const tick = (time: number) => {
    const instance = lenis.value;
    if (!instance) return;

    if (instance.isScrolling === "smooth" && Math.abs(instance.velocity) > 0) {
      velocity.value = Math.min(Math.abs(instance.velocity * 0.75) || 0, 1);
    }

    instance.raf(time * 1000);
  };

  const createNewLenis = () => {
    if (lenis.value) {
      lenis.value.destroy();
      lenis.value.off("scroll", handleScroll);
    }

    lenis.value = new Lenis({
      lerp: 0.08,
    });

    lenis.value.on("scroll", handleScroll);
  };

  onMounted(() => {
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    createNewLenis();
  });


  onUnmounted(() => {
    gsap.ticker.remove(tick);
  });
};
