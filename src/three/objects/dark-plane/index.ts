import { Mesh, ShaderMaterial, PlaneGeometry, Color } from "three";
import { scene } from "../../core/scene";
import vertexShader from "../../shaders/dark-plane/vertex.glsl";
import fragmentShader from "../../shaders/dark-plane/fragment.glsl";
import gsap from "gsap";
import { sceneWeights } from "../../../animations/scenes";
import { renderTarget } from "../../core/renderTarget";
let mesh: Mesh | null = null;
const tick = () => {
  if (!mesh) return;
  mesh.visible = sceneWeights.about > .001;
  (mesh.material as ShaderMaterial).uniforms.uOpacity!.value = sceneWeights.about;
};
const init = () => {
  if (!mesh) {
    mesh = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
      vertexShader, fragmentShader, depthTest: false, depthWrite: false,
      uniforms: { uOpacity: { value: 0 }, uTexture: { value: renderTarget.instance.texture }, uVignetteColor: { value: new Color("#fff8f7") } },
    }));
    mesh.renderOrder = -100;
    mesh.frustumCulled = false;
  }
  scene.instance.add(mesh);
  tick();
  gsap.ticker.add(tick);
};
const destroy = () => { gsap.ticker.remove(tick); mesh?.removeFromParent(); };
export const darkPlane = { init, destroy };
