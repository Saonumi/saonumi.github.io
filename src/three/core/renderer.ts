import { WebGLRenderer, Vector3 } from "three";
import gsap from "gsap";
import { scene } from "./scene";
import { renderTarget } from "./renderTarget";
import { camera } from "./camera";
import { sceneWeights, sceneWeightsInOut } from "../../animations/scenes";
import { contactHeadPose } from "../objects/avatar/personal-hologram";
import { colors } from "../common/colors";
import { threeSizes } from "../utils/sizes";
import { avatarRotation } from "../../composables/useAvatarRotation";

import type { Camera, Object3D, Scene } from "three";

let instance: WebGLRenderer | null = null;
let canvas: HTMLCanvasElement | null = null;
let visible = true;
let isActive = false;
let lastFrame = -Infinity;
let lastStaticState = "";
let pendingFrame: number | null = null;

const emptyVector = new Vector3();

const init = (_canvas: HTMLCanvasElement | null) => {
  if (instance) return;
  canvas = _canvas;
  instance = new WebGLRenderer({
    canvas: canvas!,
    antialias: true,
    alpha: false,
  });

  gsap.ticker.add(tick);
  threeSizes.on("resize", resize);
  resize();
};

const getInstance = () => {
  if (!instance) throw new Error("Renderer not initialized");
  return instance;
};

const resize = () => {
  if (!instance) return;
  instance.setSize(threeSizes.width, threeSizes.height, false);
  instance.setPixelRatio(threeSizes.pixelRatio);
  lastStaticState = "";
};

const tick = () => {
  if (pendingFrame !== null) return;
  // Draw after all GSAP scene, camera and model updates have finished.
  pendingFrame = requestAnimationFrame(() => { pendingFrame = null; draw(); });
};

const draw = () => {
  const entry = sceneWeightsInOut.about.in;
  const activeScene = sceneWeights.contact > .5 ? "contact" : entry > 0 && entry < 1 ? "transition" : sceneWeights.about > .5 ? "about" : sceneWeights.hero > .5 ? "hero" : "none";
  const shouldBeVisible = !camera.instance.position.equals(emptyVector) && isActive && activeScene !== "none";
  if (canvas && canvas.dataset.renderScene !== activeScene) canvas.dataset.renderScene = activeScene;

  if (canvas && shouldBeVisible !== visible) {
    canvas.style.visibility = shouldBeVisible ? "visible" : "hidden";
    visible = shouldBeVisible;
  }

  if (!instance || !shouldBeVisible || document.hidden) {
    if (canvas) { canvas.dataset.triangles = "0"; canvas.dataset.drawCalls = "0"; }
    lastStaticState = "";
    return;
  }
  // Animate the scanner at 30 fps. Static views redraw only after a change.
  const now = performance.now();
  if (now - lastFrame < 1000 / 30) return;
  const staticState = [activeScene, avatarRotation.value, threeSizes.width, threeSizes.height,
    contactHeadPose.yaw, contactHeadPose.pitch,
    ...camera.instance.position.toArray(), ...camera.instance.quaternion.toArray(),
    ...camera.parallaxGroup.position.toArray(),
    ...scene.instance.children.flatMap(object => [Number(object.visible), ...object.position.toArray(),
      ...object.scale.toArray(), object.rotation.y])
  ].map(value => typeof value === "number" ? value.toFixed(3) : value).join("/");
  if (activeScene !== "about" && staticState === lastStaticState) return;
  lastStaticState = staticState;
  lastFrame = now;

  if (sceneWeights.about > 0.001) {
    renderTarget.render();
  }

  const color = sceneWeights.contact > 0.001 ? colors.beigeDark : colors.beigeLight;
  instance.setClearColor(color);
  instance.render(scene.instance, camera.instance);
  // Never cache an empty frame while section visibility is being updated.
  if (instance.info.render.calls === 0) lastStaticState = "";
  if (canvas) {
    canvas.dataset.entryProgress = entry.toFixed(3);
    canvas.dataset.headYaw = contactHeadPose.yaw.toFixed(3);
    canvas.dataset.headPitch = contactHeadPose.pitch.toFixed(3);
    canvas.dataset.triangles = String(instance.info.render.triangles);
    canvas.dataset.drawCalls = String(instance.info.render.calls);
    canvas.dataset.renderedFrames = String(Number(canvas.dataset.renderedFrames ?? 0) + 1);
  }
};

const compile = async () => {
  await Promise.all([compileScene(camera.instance, scene.instance), compileScene(camera.instance, renderTarget.scene)]);
};

const setIsActive = (value: boolean) => {
  isActive = value;
};

const compileScene = async (camera: Camera, sceneToCompile: Scene) => {
  if (!instance) {
    console.error("Renderer not initialized");
    return;
  }

  return new Promise<void>(async (resolve) => {
    if (!instance) {
      return;
    }

    const invisibleObjects: Object3D[] = [];
    const instancedWithOriginalCullState: [Object3D, boolean][] = [];

    sceneToCompile.traverse((child) => {
      if (child.visible === false) {
        invisibleObjects.push(child);
        child.visible = true;
      }

      if (child.frustumCulled === true) {
        instancedWithOriginalCullState.push([child, child.frustumCulled]);
        child.frustumCulled = false; // Ensure it's rendered
      }
    });

    instance.compile(sceneToCompile, camera);

    invisibleObjects.forEach((child) => (child.visible = false));
    instancedWithOriginalCullState.forEach(([child, originalState]) => {
      child.frustumCulled = originalState;
    });

    renderTarget.render();

    resolve();
  });
};

const destroy = () => {
  if (!instance) return;
  instance.dispose();
  gsap.ticker.remove(tick);
  if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
  pendingFrame = null;
  lastFrame = -Infinity;
  lastStaticState = "";
  instance = null;
  visible = true;
};

export const renderer = { init, destroy, getInstance, compile, setIsActive };
