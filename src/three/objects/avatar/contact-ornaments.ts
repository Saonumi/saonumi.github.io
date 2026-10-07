import { CanvasTexture, Group, MathUtils, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3 } from "three";
import { camera } from "../../core/camera";
import { scene } from "../../core/scene";
import { sizes } from "../../../utils/sizes";
import { sketch } from "./hero-ornaments";

const group = new Group();
const items: Mesh<PlaneGeometry, MeshBasicMaterial>[] = [];
const orientation = new Quaternion(), back = new Vector3(), anchor = new Vector3(), eye = new Vector3(), offset = new Vector3();

function icon(kind: number) {
  if (kind === 1) return sketch(0, false);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  ctx.lineCap = ctx.lineJoin = "round";
  if (kind === 0) {
    ctx.fillStyle = "#ffe4a3";
    ctx.beginPath(); ctx.moveTo(12, 17); ctx.lineTo(240, 8); ctx.lineTo(248, 230); ctx.lineTo(230, 247); ctx.lineTo(14, 238); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f4d1baa6"; ctx.fillRect(96, 0, 63, 20);
    ctx.fillStyle = "#503344"; ctx.font = "bold 28px monospace"; ctx.fillText("Python", 30, 62);
    ctx.font = "bold 18px monospace"; ctx.fillText("import torch", 28, 105);
    ctx.fillStyle = "#b51b55"; ctx.fillText("model.eval()", 28, 139);
    ctx.fillStyle = "#725893"; ctx.fillText("output = model(x)", 28, 174);
    ctx.strokeStyle = "#bc5375"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(181, 208); ctx.lineTo(194, 218); ctx.lineTo(222, 193); ctx.stroke();
  } else if (kind === 2) {
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#c75b89";
    ctx.beginPath(); ctx.moveTo(73, 79); ctx.lineTo(27, 123); ctx.lineTo(72, 167); ctx.stroke();
    ctx.strokeStyle = "#638fa3";
    ctx.beginPath(); ctx.moveTo(181, 78); ctx.lineTo(230, 120); ctx.lineTo(185, 167); ctx.stroke();
    ctx.strokeStyle = "#a58bc7";
    ctx.beginPath(); ctx.moveTo(147, 53); ctx.lineTo(105, 191); ctx.stroke();
  } else {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#a68cc8";
    ctx.beginPath(); ctx.roundRect(64, 62, 126, 128, 14); ctx.stroke();
    ctx.fillStyle = "#dcece8"; ctx.fillRect(81, 80, 92, 92);
    ctx.strokeStyle = "#6da49a";
    ctx.beginPath(); ctx.moveTo(101, 107); ctx.lineTo(153, 107); ctx.moveTo(101, 126); ctx.lineTo(142, 126); ctx.moveTo(101, 145); ctx.lineTo(153, 145); ctx.stroke();
    ctx.strokeStyle = "#d77c94";
    for (const p of [84, 113, 143, 173]) {
      ctx.beginPath(); ctx.moveTo(p, 44); ctx.lineTo(p, 62); ctx.moveTo(p, 190); ctx.lineTo(p, 209);
      ctx.moveTo(43, p); ctx.lineTo(64, p); ctx.moveTo(190, p); ctx.lineTo(211, p); ctx.stroke();
    }
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  return texture;
}

function init() {
  if (!items.length) {
    // Two paper notes, plus three loose icons. All use the avatar's depth buffer.
    const textures = [icon(0), sketch(2), icon(1), icon(2), icon(3)];
    textures.forEach((texture, i) => {
      const mesh = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({
        map: texture, transparent: true, depthTest: true, depthWrite: false, toneMapped: false,
      }));
      mesh.rotation.z = MathUtils.degToRad([8, -6, -10, 9, 5][i]!);
      mesh.renderOrder = 1; items.push(mesh); group.add(mesh);
    });
  }
  group.visible = false; scene.instance.add(group);
}

function update(avatar: Group, radius: number) {
  group.visible = avatar.visible;
  if (!group.visible) return;
  avatar.updateWorldMatrix(true, false);
  camera.instance.getWorldQuaternion(orientation);
  camera.instance.getWorldPosition(eye);
  back.set(0, 0, 1).applyQuaternion(orientation);
  anchor.set(0, 2.175, 0).applyMatrix4(avatar.matrixWorld);
  const depth = offset.copy(eye).sub(anchor).dot(back);
  const perspective = (depth + radius * avatar.scale.x + .3) / Math.max(depth, .1);
  anchor.sub(eye).multiplyScalar(perspective).add(eye);
  group.position.copy(anchor); group.quaternion.copy(orientation);
  group.scale.setScalar(avatar.scale.x * perspective);
  const portrait = !sizes.isLandscape;
  const x = portrait ? 1.7 : 3.2;
  const positions = [[-x, .8], [x, .5], [-x * .85, -1.45], [x * .9, -1.25], [x * .95, 2.45]];
  items.forEach((mesh, i) => {
    mesh.position.set(positions[i]![0]!, positions[i]![1]!, 0);
    mesh.scale.setScalar(i < 2 ? portrait ? 1.25 : 1.65 : portrait ? .95 : 1.25);
  });
}

export const contactOrnaments = { init, update, destroy: () => group.removeFromParent() };
