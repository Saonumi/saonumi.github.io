import labModel from "./assets/models/lab.glb";
import diffuseMap from "./assets/textures/diffuse-map.png";
import numbersBitmap from "./assets/textures/numbers-bitmap.webp";
import hologramPlaneTexture from "./assets/textures/hologram-plane.webp";

type Source = {
  name: string;
  type: "gltfModel" | "texture";
  path: string;
};

export const sources = [
  { name: "personal-avatar-model", type: "gltfModel", path: `${import.meta.env.BASE_URL}models/saonumi-avatar-web.glb` },
  { name: "lab-model", type: "gltfModel", path: labModel },
  { name: "diffuse-map", type: "texture", path: diffuseMap },
  { name: "hologram-plane-texture", type: "texture", path: hologramPlaneTexture },
  { name: "numbers-bitmap", type: "texture", path: numbersBitmap },
] as const satisfies Source[];
