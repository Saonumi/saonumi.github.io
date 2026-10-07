import { WebGLRenderTarget, Scene } from "three";
import { renderer } from "../renderer";
import { threeSizes } from "../../utils/sizes";
import { camera as mainCamera } from "../camera";

const instance = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  samples: 0,
  depthBuffer: false,
  stencilBuffer: false,
});

const scene = new Scene();
scene.add(mainCamera.parallaxGroup);

const init = () => {
  threeSizes.on("resize", resize);
  resize();
};

const render = () => {
  const rendererInstance = renderer.getInstance();
  rendererInstance.setRenderTarget(instance);
  rendererInstance.setClearColor("#fff8f7");
  rendererInstance.render(scene, mainCamera.instance);
  rendererInstance.setRenderTarget(null);
};

const destroy = () => {
  threeSizes.off("resize", resize);
};

const resize = () => {
  const { width, height, pixelRatio } = threeSizes;
  instance.setSize(Math.round(width * pixelRatio * .75), Math.round(height * pixelRatio * .75));
};

export const renderTarget = { render, scene, init, instance, destroy };
