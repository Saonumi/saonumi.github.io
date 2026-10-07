import { Mesh, PlaneGeometry, ShaderMaterial } from "three";
import gsap from "gsap";
import { aboutProgress } from "../../../animations/transitions/about";
import { resources } from "../../../utils/resources";

let plane: Mesh | null = null;

const START_Y = -0.2;
const END_Y = 4.5;
const FADE_IN_START = 0.2;
const FADE_IN_END = 0.3;
const FADE_OUT_START = 0.7;
const FADE_OUT_END = 0.9;

const init = () => {
  if (plane) return;

  // Create a simple plane geometry
  const geometry = new PlaneGeometry(1.5, 1);
  geometry.rotateX(-Math.PI / 2);

  // Procedural raspberry rim matches the light theme without recoloring a
  // baked cyan texture or covering the original face with a solid plane.
  const material = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `varying vec2 vUv; uniform float uOpacity; void main() {
      vec2 edge = min(vUv, 1. - vUv);
      float rim = 1. - smoothstep(.009, .022, min(edge.x, edge.y));
      gl_FragColor = vec4(.82, .18, .40, rim * uOpacity);
    }`,
  });

  plane = new Mesh(geometry, material);
  plane.renderOrder = 24;

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!plane) return;

  const progress = aboutProgress.value * 1.1 - .1;
  const personal = !!resources.items["personal-avatar-model"];
  const start = personal ? 0 : START_Y;
  const end = personal ? 4.35 : END_Y;
  const yPosition = start + progress * (end - start);
  plane.position.y = yPosition + 0.01;

  // Calculate opacity based on progress - fade in and out
  let opacity = 0;
  if (progress <= FADE_IN_START) {
    // Before FADE_IN_START: opacity 0
    opacity = 0;
  } else if (progress <= FADE_IN_END) {
    // Fade in phase: 0.2 to 0.3
    const fadeInProgress = (progress - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
    opacity = fadeInProgress;
  } else if (progress <= FADE_OUT_START) {
    // Fully visible phase: 0.3 to 0.7
    opacity = 1;
  } else if (progress <= FADE_OUT_END) {
    // Fade out phase: 0.7 to 1.0
    const fadeOutProgress = (progress - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
    opacity = 1 - fadeOutProgress;
  } else {
    // After FADE_OUT_END: opacity 0
    opacity = 0;
  }

  // Calculate scale - fade between 0 (scale=1), 0.5 (scale=1.5) and 1 (scale=1)
  let scale = 1;
  if (progress <= 0.5) {
    // From 0 to 0.5: scale from 1 to 1.5
    scale = 1 + (progress / 0.5) * 0.5;
  } else {
    // From 0.5 to 1: scale from 1.5 back to 1
    scale = 1.5 - ((progress - 0.5) / 0.5) * 0.5;
  }

  // Apply scale to X and Z axes
  plane.scale.x = scale;
  // Update material opacity
  if (plane.material instanceof ShaderMaterial) {
    plane.material.uniforms.uOpacity!.value = opacity;
  }

  // Set visibility based on opacity
  plane.visible = opacity > 0;
};

const destroy = () => {
  gsap.ticker.remove(tick);
  if (plane) {
    plane.geometry.dispose();
    if (plane.material instanceof ShaderMaterial) {
      plane.material.dispose();
    }
    plane = null;
  }
};

export const labPlane = {
  init,
  destroy,
  get mesh() {
    return plane;
  },
};
