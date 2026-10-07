import { Color, ShaderMaterial, FrontSide, NormalBlending } from "three";
import vertexShader from "../../shaders/hologram/vertex.glsl";
import fragmentShader from "../../shaders/hologram/fragment.glsl";

let material: ShaderMaterial;

const uniforms = {
  uTime: { value: 0 },
  uColor: { value: new Color("#d12d66").convertLinearToSRGB() },
  uProgress: { value: 0 },
  uOpacity: { value: 1 },
  uScanBottom: { value: -.2 },
  uScanHeight: { value: 4.7 },
};

const getMaterial = () => {
  if (material) return material;

  material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    side: FrontSide,
    uniforms,
  });

  return material;
};

export { getMaterial, uniforms };
