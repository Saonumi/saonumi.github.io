<script setup lang="ts">
import { ref } from "vue";
import { t, translateContent as lc } from "../../../i18n/utils/translate";

import { skillGroups } from "../../../content/saonumi";
import { lenis, getSectionScrollTarget } from "../../../composables/useScroll";
const active = ref<string | null>(skillGroups[0]!.id);
const contact = () => lenis.value?.scrollTo(getSectionScrollTarget("#contact"));
</script>

<template>
  <section class="skills-section" aria-labelledby="skills-title">
    <div class="skills-heading">
      <p class="section-eyebrow">04 / {{ lc('SKILLSET & TOOLS') }}</p>
      <h2 id="skills-title">{{ t('skills-title-prefix') }}<br /><span>{{ t('skills-title-accent') }}</span></h2>
      <p class="skills-intro">{{ t('skills-focus') }}</p>
    </div>
    <div class="skill-list">
      <article v-for="group in skillGroups" :key="group.id" :class="['skill-card', { 'skill-card-active':active===group.id }]">
        <span class="skill-corners" aria-hidden="true"></span>
        <button class="skill-toggle" :aria-expanded="active===group.id" :aria-controls="'skill-panel-'+group.id" @click="active=active===group.id ? null : group.id">
          <h3>{{ lc(group.title) }}</h3><span class="skill-arrow" aria-hidden="true">{{ active===group.id ? '−' : '+' }}</span>
        </button>
        <div :id="'skill-panel-'+group.id" class="skill-panel" :aria-hidden="active!==group.id" :inert="active!==group.id">
          <div class="skill-panel-inner">
            <p>{{ lc(group.description) }}</p>
            <h4>{{ lc('SKILLSET & TOOLS') }}</h4>
            <ul><li v-for="tool in group.tools" :key="tool">{{ tool }}</li></ul>
          </div>
        </div>
      </article>
    </div>
    <div class="skills-bottom"><a href="#contact" @click.prevent="contact">{{ t('skills-contact') }} <span>↗</span></a></div>
  </section>
</template>

<style scoped>
.skills-section { position:relative; background:var(--portfolio-navy); color:var(--color-text-cyan-400); width:100%; min-height:100svh; padding:100px clamp(24px,8vw,150px) 40px; display:grid; grid-template-columns:1fr; align-content:center; gap:40px; border-top:1px solid var(--portfolio-line); }
.section-eyebrow { color:var(--color-text-cyan-300); font-size:12px; letter-spacing:.18em; font-weight:700; margin-bottom:24px; }
h2 { font-size:clamp(56px,8vw,112px); font-weight:800; line-height:1.05; letter-spacing:-.045em; }h2 span { color:var(--color-cyan-400); }
.skills-intro { color:var(--color-text-cyan-300); line-height:1.5; font-size:16px; margin-top:28px; }
.skill-list { display:flex; flex-direction:column; }
.skill-card { position:relative; padding:24px; border:1px solid var(--portfolio-line); margin-top:-1px; transition:background .3s; }
.skill-card-active { background:var(--portfolio-panel); }
.skill-toggle { width:100%; display:flex; justify-content:space-between; align-items:center; gap:16px; text-align:left; padding:4px 0; background:none; border:0; color:inherit; cursor:pointer; font:inherit; }
.skill-toggle h3 { font-size:clamp(19px,2.1vw,30px); font-weight:800; letter-spacing:-.015em; line-height:1.25; }
.skill-arrow { font-size:24px; width:32px; height:32px; display:grid; place-items:center; border:1px solid var(--portfolio-line); color:var(--color-cyan-400); flex-shrink:0; }
.skill-toggle:focus-visible { outline:2px solid var(--color-cyan-400); outline-offset:8px; }
.skill-panel { display:grid; grid-template-rows:0fr; opacity:0; transition:grid-template-rows .35s,opacity .25s; }
.skill-card-active .skill-panel { grid-template-rows:1fr; opacity:1; }
.skill-panel-inner { overflow:hidden; }
.skill-panel p { color:var(--color-text-cyan-300); font-size:16px; line-height:1.6; margin-top:22px; max-width:44ch; }
.skill-panel h4 { font-size:10px; letter-spacing:.16em; color:var(--color-text-cyan-300); margin:22px 0 12px; font-weight:400; }
.skill-panel ul { padding:0 0 6px; list-style:none; display:flex; gap:8px; flex-wrap:wrap; }
.skill-panel li { padding:6px 12px; border:1px solid var(--portfolio-line); border-radius:100px; font-size:13px; background:#b51b5506; }
.skill-card::before,.skill-card::after,.skill-corners::before,.skill-corners::after { content:""; position:absolute; width:12px; height:12px; border:2px solid var(--color-text-cyan-300); pointer-events:none; }
.skill-card::before { top:-1px; left:-1px; border-right:0; border-bottom:0; }.skill-card::after { bottom:-1px; left:-1px; border-right:0; border-top:0; }.skill-corners::before { top:-1px; right:-1px; border-left:0; border-bottom:0; }.skill-corners::after { bottom:-1px; right:-1px; border-left:0; border-top:0; }
.skills-bottom { display:flex; justify-content:flex-end; gap:20px; color:var(--color-text-cyan-300); font-size:10px; padding-top:24px; margin-top:20px; }
.skills-bottom a { color:var(--color-cyan-400); text-decoration:none; font-size:13px; letter-spacing:0; }.skills-bottom a span { margin-left:12px; }
@media(min-width:1024px) { .skills-section { grid-template-columns:1fr 1.15fr; column-gap:9vw; }.skills-bottom { grid-column:1/-1; }.skill-card { padding:34px; } }
@media(max-width:600px) { .skills-section { padding-top:88px; padding-bottom:96px; }.skill-card { padding:20px; }.skills-heading h2 { font-size:clamp(44px,11vw,64px); } }
@media(prefers-reduced-motion:reduce) { .skill-panel,.skill-card { transition:none; } }
</style>
