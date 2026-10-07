import { Box3, Group, Mesh, MeshBasicMaterial, Vector3, CanvasTexture, PlaneGeometry, MathUtils, ShaderMaterial, FrontSide } from "three";
import type { Material } from "three";
import gsap from "gsap";
import { scene } from "../../core/scene";
import { resources } from "../../../utils/resources";
import { sceneWeights, sceneWeightsInOut } from "../../../animations/scenes";
import { aboutProgress } from "../../../animations/transitions/about";
import { sizes } from "../../../utils/sizes";
import { getMaterial } from "./hologram-material";
import depthShader from "../../shaders/hologram/depth.glsl";
import { avatarRotation } from "../../../composables/useAvatarRotation";
import { heroOrnaments } from "./hero-ornaments";
import { contactOrnaments } from "./contact-ornaments";

// Separate transforms prevent one shared avatar teleporting between scenes.
const hero = new Group(), contact = new Group(), hologram = new Group();
let hologramMaterial: ReturnType<typeof getMaterial> | null = null;
let hologramDepthMaterial: ShaderMaterial;
let contactShadow: MeshBasicMaterial;
const heroMaterials: { material: MeshBasicMaterial; opacity: number }[] = [];
const aboutSolidMaterials: { material: MeshBasicMaterial; opacity: number }[] = [];
let ready = false, active = false, pointer = 0, pointerY = 0, yaw = 0;
let heroRadius = 3;
export const contactHeadPose = { yaw: 0, pitch: 0 };
const headUniforms = {
  uHeadAngles: { value: new Vector3() },
  uHeadPivot: { value: new Vector3() },
  uBodyBottom: { value: -13 },
  uBodyHeight: { value: 4.35 * .82 },
};

function headFollow(source: Material) {
  const material = unlit(source);
  // Rotate only the head, with a soft neck band, in world space. This keeps
  // the original mesh, UVs and unlit face while the feet/body stay still.
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, headUniforms);
    shader.vertexShader = `
      uniform vec3 uHeadAngles;
      uniform vec3 uHeadPivot;
      uniform float uBodyBottom;
      uniform float uBodyHeight;
    ` + shader.vertexShader.replace("#include <project_vertex>", `
      vec4 headWorld = modelMatrix * vec4(transformed, 1.0);
      float headWeight = smoothstep(0.515, 0.575, (headWorld.y - uBodyBottom) / uBodyHeight);
      vec3 offset = headWorld.xyz - uHeadPivot;
      float cy = cos(uHeadAngles.x), sy = sin(uHeadAngles.x);
      float cp = cos(uHeadAngles.y), sp = sin(uHeadAngles.y);
      offset = vec3(offset.x, cp * offset.y - sp * offset.z, sp * offset.y + cp * offset.z);
      offset = vec3(cy * offset.x + sy * offset.z, offset.y, -sy * offset.x + cy * offset.z);
      headWorld.xyz = mix(headWorld.xyz, uHeadPivot + offset, headWeight);
      vec4 mvPosition = viewMatrix * headWorld;
      gl_Position = projectionMatrix * mvPosition;
    `);
  };
  material.customProgramCacheKey = () => "saonumi-contact-head-follow-v1";
  return material;
}

function groundShadow() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(65, 43, 24, .25)");
  gradient.addColorStop(1, "rgba(65, 43, 24, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const mesh = new Mesh(new PlaneGeometry(2.5, 1.6), new MeshBasicMaterial({
    map: new CanvasTexture(canvas), transparent: true, depthWrite: false, toneMapped: false,
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = .005;
  return mesh;
}

function unlit(source: Material) {
  const material = source as MeshBasicMaterial;
  const result = new MeshBasicMaterial({
    color: material.color?.clone(), map: material.map, vertexColors: material.vertexColors,
    side: material.side, transparent: material.transparent, opacity: material.opacity,
    alphaMap: material.alphaMap, alphaTest: material.alphaTest, toneMapped: false,
  });
  return result;
}

function scannedUnlit(source: Material) {
  const material = unlit(source);
  aboutSolidMaterials.push({ material, opacity: material.opacity });
  material.transparent = false;
  material.onBeforeCompile = shader => {
    // Complement the hologram mask in the same world space and at the same
    // scan height. The original texture remains visible above the scanner.
    shader.uniforms.uProgress = hologramMaterial!.uniforms.uProgress!;
    shader.uniforms.uScanBottom = hologramMaterial!.uniforms.uScanBottom!;
    shader.uniforms.uScanHeight = hologramMaterial!.uniforms.uScanHeight!;
    shader.vertexShader = `
      varying float vSolidModelProgress;
      uniform float uScanBottom;
      uniform float uScanHeight;
    ` + shader.vertexShader.replace("#include <project_vertex>", `
      #include <project_vertex>
      vSolidModelProgress = ((modelMatrix * vec4(transformed, 1.0)).y - uScanBottom) / uScanHeight;
    `);
    shader.fragmentShader = `
      varying float vSolidModelProgress;
      uniform float uProgress;
    ` + shader.fragmentShader.replace("void main() {", `
      void main() {
        if (uProgress > 0.0 && vSolidModelProgress <= uProgress + 0.002) discard;
    `);
  };
  material.customProgramCacheKey = () => "saonumi-unlit-scan-complement-v1";
  return material;
}

function fitModel(holographic: boolean, followsPointer = false) {
  // Share geometry/textures; retain the source face and mesh unchanged.
  const root = resources.items["personal-avatar-model"].scene.clone(true) as Group;
  root.rotation.y = holographic ? Math.PI / 2 : -Math.PI / 2;
  root.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(root);
  const height = bounds.getSize(new Vector3()).y;
  const center = bounds.getCenter(new Vector3());
  if (!(height > 0)) throw new Error("Personal avatar has no usable bounds");
  const fit = new Group();
  const factor = 4.35 / height;
  fit.scale.setScalar(factor);
  fit.position.set(-center.x * factor, -bounds.min.y * factor, -center.z * factor);
  if (holographic) {
    const solidRoot = root.clone(true);
    solidRoot.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.material = Array.isArray(object.material)
        ? object.material.map(scannedUnlit) : scannedUnlit(object.material);
      object.renderOrder = 23;
    });
    fit.add(solidRoot);
  }
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const makeMaterial = followsPointer ? headFollow : unlit;
    object.material = holographic ? hologramMaterial! : Array.isArray(object.material)
      ? object.material.map(makeMaterial) : makeMaterial(object.material);
    object.renderOrder = holographic ? 23 : 0;
  });
  if (holographic) {
    const depthRoot = root.clone(true);
    depthRoot.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.material = hologramDepthMaterial;
      object.renderOrder = 22;
    });
    fit.add(depthRoot);
  }
  fit.add(root);
  return fit;
}

const movePointer = (event: MouseEvent) => {
  pointer = event.clientX / sizes.width - .5;
  pointerY = event.clientY / sizes.height - .5;
};
const resetPointer = () => { pointer = pointerY = 0; };
const visibility = (weight: number) => MathUtils.smoothstep(weight, 0, 1);

const tick = () => {
  if (!ready) return;
  const landscape = sizes.isLandscape;
  const wide = MathUtils.clamp((sizes.aspectRatio - 1) / .6, 0, 1);
  yaw = MathUtils.lerp(yaw, pointer * .09, Math.min(.15, .08 * gsap.ticker.deltaRatio()));

  const entry = sceneWeightsInOut.about.in;
  const arriving = entry > 0 && entry < 1;
  const entryEase = MathUtils.smoothstep(entry, 0, 1);
  hero.visible = (sceneWeights.hero > .001 || arriving) && sceneWeights.contact < .001;
  // Keep the standing pose; Hero owns idle rotation and pointer interaction.
  hero.position.set((landscape ? 2.15 + .5 * wide : 0) * (1 - entryEase), landscape ? .45 * (1 - entryEase) : 0, 6 * entryEase);
  const heroScale = landscape ? MathUtils.lerp(.80, .94, wide) : sizes.height < 760 ? .84 : .95;
  hero.scale.setScalar(MathUtils.lerp(heroScale, 1, entryEase));
  hero.rotation.y = MathUtils.lerp(-.08 + MathUtils.degToRad(avatarRotation.value), yaw, entryEase);
  heroOrnaments.update(hero, heroRadius, entry);

  contact.visible = sceneWeights.contact > .001;
  contactShadow.opacity = visibility(sceneWeights.contact);
  const contactScale = .78;
  const contactBottom = -13 + (landscape ? 1 : .65) + (sizes.height < 650 ? .2 : 0);
  contact.position.set(0, contactBottom, .8);
  contact.scale.setScalar(contactScale);
  contact.rotation.y = 0;
  contactOrnaments.update(contact, heroRadius);
  const follow = sceneWeights.contact > .5;
  const smoothing = Math.min(.2, .075 * gsap.ticker.deltaRatio());
  contactHeadPose.yaw = MathUtils.lerp(contactHeadPose.yaw, follow ? pointer * .48 : 0, smoothing);
  contactHeadPose.pitch = MathUtils.lerp(contactHeadPose.pitch, follow ? pointerY * .28 : 0, smoothing);
  headUniforms.uHeadAngles.value.set(contactHeadPose.yaw, contactHeadPose.pitch, 0);
  headUniforms.uBodyHeight.value = 4.35 * contactScale;
  headUniforms.uBodyBottom.value = contactBottom;
  headUniforms.uHeadPivot.value.set(0, contactBottom + 2.30 * contactScale, .8);

  hologram.visible = entry >= 1 && sceneWeights.about > .001;
  hologram.position.set(0, 0, 6);
  hologram.rotation.y = -Math.PI + yaw;
  hologramMaterial!.uniforms.uTime!.value = gsap.ticker.time;
  hologramMaterial!.uniforms.uProgress!.value = aboutProgress.value * 1.1 - .1;
  hologramMaterial!.uniforms.uOpacity!.value = visibility(sceneWeights.about);
  for (const entry of aboutSolidMaterials) {
    entry.material.opacity = entry.opacity;
  }
};

const init = () => {
  active = true;
  if (!ready) {
    hologramMaterial = getMaterial().clone();
    hologramMaterial.uniforms.uScanBottom!.value = 0;
    hologramMaterial.uniforms.uScanHeight!.value = 4.35;
    hologramDepthMaterial = new ShaderMaterial({
      vertexShader: hologramMaterial.vertexShader, fragmentShader: depthShader,
      uniforms: hologramMaterial.uniforms, side: FrontSide,
      colorWrite: false, depthWrite: true,
    });
    const heroModel = fitModel(false);
    heroRadius = new Box3().setFromObject(heroModel).getSize(new Vector3()).length() / 2;
    hero.add(heroModel, groundShadow());
    hero.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        const basic = material as MeshBasicMaterial;
        heroMaterials.push({ material: basic, opacity: basic.opacity });
        // Opaque textures keep the face intact during section changes.
        // The ground shadow retains its own alpha blending.
      }
    });
    contact.add(fitModel(false, true));
    hologram.add(fitModel(true));
    const contactGround = groundShadow();
    contactShadow = contactGround.material;
    contact.add(contactGround);
    ready = true;
  }
  scene.instance.add(hero, contact, hologram);
  heroOrnaments.init();
  contactOrnaments.init();
  window.addEventListener("mousemove", movePointer);
  window.addEventListener("mouseleave", resetPointer);
  tick();
  gsap.ticker.add(tick);
};

const destroy = () => {
  active = false;
  hero.visible = contact.visible = hologram.visible = false;
  hero.removeFromParent(); contact.removeFromParent(); hologram.removeFromParent();
  heroOrnaments.destroy();
  contactOrnaments.destroy();
  gsap.ticker.remove(tick);
  window.removeEventListener("mousemove", movePointer);
  window.removeEventListener("mouseleave", resetPointer);
  pointer = pointerY = yaw = contactHeadPose.yaw = contactHeadPose.pitch = 0;
};

export const personalHologram = { init, destroy, isReady: () => active && ready };

