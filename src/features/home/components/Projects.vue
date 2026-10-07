<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { t, translateContent as lc } from "../../../i18n/utils/translate";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioProjects } from "../../../content/saonumi";

const sectionRef = ref<HTMLElement | null>(null);
const windowRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const emit = defineEmits<{ loaded: [] }>();
let media: gsap.MatchMedia | null = null;

onMounted(async () => {
  emit("loaded");
  await nextTick();
  media = gsap.matchMedia();
  media.add("(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)", () => {
    const section = sectionRef.value, track = trackRef.value, viewport = windowRef.value;
    if (!section || !track || !viewport) return;
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (distance() === 0) return;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        // The layout is a flex column; reserve space explicitly so Skills
        // cannot slide over these cards while the carousel is pinned.
        pinSpacing: true,
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  });
  ScrollTrigger.refresh();
});
onBeforeUnmount(() => media?.revert());
</script>

<template>
  <section class="work-section" ref="sectionRef" aria-labelledby="work-title">
    <div class="work-heading">
      <div>
        <p class="section-eyebrow">03 / {{ lc('SELECTED WORK') }}</p>
        <h2 id="work-title">{{ t('my-projects-prefix') }} <span>{{ t('my-projects-accent') }}</span></h2>
      </div>
    </div>
    <div class="work-window" ref="windowRef">
      <div class="work-track" ref="trackRef">
        <article class="work-card" v-for="(project, index) in portfolioProjects" :key="project.title">
          <div class="work-card-info">
            <div class="work-card-title">
              <span class="work-number">0{{ index + 1 }}</span>
              <div><h3>{{ lc(project.title) }}</h3><p>{{ lc(project.category) }}</p></div>
            </div>
            <p class="work-description">{{ lc(project.description) }}</p>
            <p class="work-note">{{ lc(project.note) }}</p>
            <ul class="work-tools" :aria-label="lc('Tools')"><li v-for="tool in project.tools" :key="tool">{{ tool }}</li></ul>
          </div>
          <div class="project-art" aria-hidden="true">
            <img :src="project.image" alt="" width="1100" height="619" loading="lazy" decoding="async" />
          </div>
          <div class="work-card-bottom">
            <span :class="['project-status', { 'is-public': project.url }]">{{ lc(project.status) }}</span>
            <a v-if="project.url" :href="project.url" target="_blank" rel="noopener noreferrer" class="project-open" :aria-label="t('source-code') + ': ' + project.title">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </article>
        <aside class="private-projects" :aria-label="t('private-projects-label')">
          <span class="private-plus" aria-hidden="true">+</span>
          <p>{{ t('private-projects-label') }}</p>
          <span class="private-caption">{{ t('private-projects-caption') }}</span>
        </aside>
      </div>
    </div>
    <div class="work-footer"><span>{{ t('project-research-note') }}</span></div>
  </section>
</template>

<style scoped>
.work-section { background:var(--portfolio-navy); color:var(--color-text-cyan-400); width:100%; position:relative; padding:96px clamp(24px,5vw,96px) 36px; overflow:hidden; }
.section-eyebrow { font-size:12px; letter-spacing:.18em; font-weight:700; color:var(--color-text-cyan-300); margin-bottom:16px; }
.work-heading { display:flex; align-items:end; justify-content:space-between; gap:24px; margin:0 auto 40px; max-width:1600px; }
h2 { font-size:clamp(44px,5vw,72px); font-weight:900; line-height:1; letter-spacing:-.04em; }
h2 span { color:var(--color-cyan-400); }
.work-window { width:100%; overflow:hidden; max-width:1600px; margin:auto; }
.work-track { display:grid; grid-template-columns:1fr; gap:24px; }
.work-card { border:1px solid var(--portfolio-line); border-radius:18px; padding:24px; background:var(--portfolio-panel); display:flex; flex-direction:column; gap:22px; min-width:0; }
.work-card-title { display:flex; justify-content:space-between; align-items:start; gap:18px; }
.work-card-title>div { text-align:left; flex:1; }
.work-number { font-weight:900; font-size:42px; line-height:1; color:var(--color-cyan-400); letter-spacing:-.05em; }
h3 { font-weight:700; font-size:22px; line-height:1.25; margin-bottom:6px; }
.work-card-title p,.work-description { font-size:14px; line-height:1.5; color:var(--color-text-cyan-300); }
.work-description { margin-top:20px; font-weight:500; color:#624953; }
.work-note { color:#624953; font-size:12px; line-height:1.6; margin-top:10px; padding-left:12px; border-left:2px solid #b51b5540; }
.work-tools { list-style:none; display:flex; flex-wrap:wrap; gap:6px; margin-top:16px; padding:0; }
.work-tools li { font-size:12px; border:1px solid var(--portfolio-line); border-radius:100px; padding:5px 10px; }
.project-art { min-height:110px; aspect-ratio:16/9; border-radius:10px; overflow:hidden; background:#fff8f7; border:1px solid #f1d5df; }
.project-art img { width:100%; height:100%; display:block; object-fit:cover; }
.private-projects { min-height:220px; min-width:0; border:1px solid var(--portfolio-line); border-radius:18px; background:var(--portfolio-panel); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:28px; }
.private-plus { color:var(--color-cyan-400); font-size:80px; font-weight:400; line-height:1; }
.private-projects p { font-size:18px; font-weight:700; }
.private-caption { font-size:13px; line-height:1.6; color:#624953; max-width:230px; }
.work-card-bottom { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:auto; }
.project-status { color:#624953; font-size:12px; font-weight:700; }
.project-status.is-public { color:#b51b55; }
.project-open { text-decoration:none; color:var(--color-cyan-400); display:flex; align-items:center; gap:10px; font-size:14px; font-weight:600; flex-shrink:0; }.project-open span { font-size:20px; }
.project-open:hover { text-decoration:underline; text-underline-offset:4px; }
.project-open:focus-visible { outline:2px solid var(--color-cyan-400); outline-offset:6px; border-radius:4px; }
.work-footer { max-width:1600px; margin:32px auto 0; display:flex; justify-content:space-between; border-top:1px solid var(--portfolio-line); padding-top:20px; font-size:10px; letter-spacing:.16em; color:var(--color-text-cyan-300); }
@media(min-width:700px) { .work-track { grid-template-columns:repeat(2,minmax(0,1fr)); }.work-card { padding:30px; } }
@media(max-width:699px) { .work-heading { align-items:flex-start; flex-direction:column; gap:14px; margin-bottom:28px; }.work-section { padding:88px 20px 96px; }.work-card { padding:20px; gap:18px; }.work-number { font-size:32px; }.work-card-title { gap:14px; }h3 { font-size:21px; }.work-card-title p { font-size:12px; }.work-footer { letter-spacing:0; font-size:12px; line-height:1.6; } }
@media(min-width:1024px) and (min-height:800px) and (prefers-reduced-motion:no-preference) {
 .work-section { height:100svh; min-height:800px; display:flex; flex-direction:column; padding-top:100px; }
 .work-heading { width:100%; margin-bottom:28px; }
 .work-window { flex:1; min-height:0; margin:0 auto; }
 .work-track { height:100%; display:flex; gap:32px; width:max-content; will-change:transform; }
 .work-card { width:clamp(400px,42vw,620px); flex-shrink:0; height:100%; padding:20px 24px; gap:14px; }
 .private-projects { width:280px; flex-shrink:0; height:100%; }
 .work-card:nth-child(even) .project-art { order:-1; }
 .project-art { flex:1; min-height:110px; max-height:210px; aspect-ratio:auto; }
 .work-description { margin-top:12px; font-size:13px; }
 .work-tools { margin-top:10px; }
 .work-footer { width:100%; margin-top:20px; flex-shrink:0; }
}
</style>
