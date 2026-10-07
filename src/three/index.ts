import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { objects } from "./objects";
import { renderTarget } from "./core/renderTarget";
import { threeSizes } from "./utils/sizes";
import { resources } from "../utils/resources";
import { raycast } from "./utils/raycast";

let canvas: HTMLCanvasElement | null = null;
let initialized = false;

const init = (_canvas: HTMLCanvasElement) => {
  canvas = _canvas;

  const setup = () => {
    if (canvas !== _canvas || initialized) return;
    threeSizes.init(_canvas);
    camera.init();
    renderTarget.init();
    renderer.init(canvas);

    objects.init();
    raycast.init();
    initialized = true;
  };
  // Cached resources do not emit "ready" a second time after a Vue remount.
  if (resources.isReady) setup();
  else resources.once("ready", setup);
};

const destroy = () => {
  threeSizes.destroy();
  renderTarget.destroy();
  renderer.destroy();
  objects.destroy();
  camera.destroy();
  raycast.destroy();
  canvas = null;
  initialized = false;
};

export const three = { init, destroy };
