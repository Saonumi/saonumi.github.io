import { CanvasTexture, Group, MathUtils, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3 } from "three";
import { camera } from "../../core/camera";
import { scene } from "../../core/scene";
import { sizes } from "../../../utils/sizes";
import { avatarRotation } from "../../../composables/useAvatarRotation";

const group = new Group();
const ornaments: Mesh<PlaneGeometry, MeshBasicMaterial>[] = [];
const orientation = new Quaternion();
const back = new Vector3(), anchor = new Vector3(), cameraPosition = new Vector3();
const projectedAnchor = new Vector3(), cameraOffset = new Vector3();

export function sketch(index: number, paper = true) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d")!;
  context.scale(2, 2);
  if (paper) {
    context.fillStyle = ["#ffe7a9", "#e6d6f1", "#fff0de", "#deebf4", "#d9eee5", "#ffe0eb"][index]!;
    context.beginPath();
    context.moveTo(7, 12); context.lineTo(245, 7); context.lineTo(250, 232);
    context.lineTo(236, 248); context.lineTo(10, 245); context.closePath(); context.fill();
    context.fillStyle = "#f3d7afa6"; context.fillRect(91, 0, 69, 18);
  }
  context.fillStyle = "#b51b55";
  context.strokeStyle = "#c72d45";
  context.lineWidth = 3.6;
  context.lineCap = context.lineJoin = "round";
  context.textAlign = "center";
  const path = (points: number[][]) => {
    context.beginPath();
    points.forEach(([x, y], i) => i ? context.lineTo(x!, y!) : context.moveTo(x!, y!));
    context.stroke();
  };
  const dot = (x: number, y: number, radius = 6) => {
    context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.stroke();
  };
  if (index === 0) {
    const inputs = [[40, 49], [36, 105], [43, 163]];
    const hidden = [[124, 64], [119, 145]];
    context.globalAlpha = .75;
    inputs.forEach(a => hidden.forEach(b => path([a, b])));
    hidden.forEach(a => path([a, [212, 106]]));
    context.globalAlpha = 1;
    [...inputs, ...hidden, [212, 106]].forEach(([x, y]) => dot(x!, y!, 8));
  } else if (index === 1) {
    context.globalAlpha = .75;
    for (const radius of [30, 57, 83]) {
      context.beginPath(); context.ellipse(131, 112, radius, radius * .65, -.3, 0, Math.PI * 2); context.stroke();
    }
    context.globalAlpha = 1;
    path([[49, 59], [71, 120], [97, 93], [115, 121], [131, 112]]);
    [[49, 59], [71, 120], [97, 93], [115, 121], [131, 112]].forEach(([x, y]) => dot(x!, y!, 3));
  } else if (index === 2) {
    // Illustrative Mel spectrogram: time columns and layered frequency bands.
    context.fillStyle = "#442b3f";
    context.beginPath(); context.roundRect(20, 42, 218, 134, 7); context.fill();
    const palette = ["#553149", "#773452", "#a13d62", "#c85272", "#e88b92", "#f6cba8"];
    for (let row = 0; row < 16; row++) {
      for (let column = 0; column < 32; column++) {
        const phrase = Math.max(0, Math.sin(column * .31 - .4));
        const harmonic = Math.pow(Math.max(0, Math.cos(row * 1.9 + Math.sin(column * .22) * .65)), 2);
        const energy = phrase * (.3 + harmonic * .7) * (.45 + row / 25);
        context.fillStyle = palette[Math.min(5, Math.floor(energy * 5.5))]!;
        context.fillRect(27 + column * 6.4, 49 + row * 7.45, 5.7, 6.8);
      }
    }
    context.globalAlpha = .5;
    path([[20, 181], [20, 188], [237, 188]]);
    path([[13, 43], [13, 176]]);
    context.fillStyle = "#806671";
    context.font = "italic 12px Georgia, serif";
    context.fillText("time", 210, 201);
  } else if (index === 3) {
    context.fillStyle = "#354052";
    context.beginPath(); context.roundRect(17, 42, 224, 143, 9); context.fill();
    context.fillStyle = "#efb4c5";
    context.beginPath(); context.roundRect(17, 42, 224, 25, [9, 9, 0, 0]); context.fill();
    for (const x of [29, 41, 53]) {
      context.fillStyle = "#a94b6b";
      context.beginPath(); context.arc(x, 55, 2.5, 0, Math.PI * 2); context.fill();
    }
    context.textAlign = "left";
    context.font = "bold 15px monospace";
    context.fillStyle = "#83566e"; context.fillText("access.log", 77, 59);
    context.fillStyle = "#a1d9cf"; context.fillText("INFO  event.login", 29, 89);
    context.fillStyle = "#f3ca91"; context.fillText("WARN  auth.retry", 29, 112);
    context.fillStyle = "#bea9e4"; context.fillText("TRACE request.id", 29, 135);
    context.fillStyle = "#ecd5df"; context.fillText("INFO  audit.write", 29, 158);
    context.fillStyle = "#efb4c5"; context.fillRect(29, 169, 6, 2);
    context.textAlign = "center";
  } else if (index === 4) {
    context.globalAlpha = .75;
    path([[40, 39], [38, 172], [220, 175]]);
    context.globalAlpha = 1;
    path([[53, 57], [67, 90], [84, 112], [107, 132], [139, 141], [165, 149], [199, 151]]);
    dot(84, 112, 4); dot(165, 149, 4);
  } else {
    context.globalAlpha = .8;
    for (const end of [37, 96, 155, 214]) {
      context.beginPath(); context.moveTo(96, 151);
      context.quadraticCurveTo((96 + end) / 2, end === 96 ? 83 : 23, end, 151);
      context.stroke();
    }
    context.globalAlpha = 1;
    for (const x of [37, 96, 155, 214]) dot(x, 158, 9);
  }
  context.globalAlpha = 1;
  context.fillStyle = "#503344";
  context.font = "bold 25px 'Be Vietnam Pro', sans-serif";
  context.fillText(["Neural Network", "Optimizer", "Mel Spectrogram", "Security Logs", "Training Loss", "Attention"][index]!, 128, 228, 238);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
function init() {
  if (!ornaments.length) {
    for (let i = 0; i < 6; i++) {
      const mesh = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({
        map: sketch(i), transparent: true, depthTest: true, depthWrite: false, toneMapped: false,
      }));
      // The avatar's depth always masks artwork behind its silhouette.
      mesh.renderOrder = 1;
      mesh.rotation.z = MathUtils.degToRad([5, -6, 4, -5, 7, -3][i]!);
      ornaments.push(mesh); group.add(mesh);
    }
  }
  group.visible = false;
  scene.instance.add(group);
}

function update(hero: Group, radius: number, entry: number) {
  group.visible = hero.visible && entry < .15;
  if (!group.visible) return;
  hero.updateWorldMatrix(true, false);
  camera.instance.getWorldQuaternion(orientation);
  camera.instance.getWorldPosition(cameraPosition);
  back.set(0, 0, 1).applyQuaternion(orientation);
  anchor.set(0, sizes.isLandscape ? 2.175 : 2.425, 0).applyMatrix4(hero.matrixWorld);
  const sourceDepth = cameraOffset.copy(cameraPosition).sub(anchor).dot(back);
  projectedAnchor.copy(anchor).project(camera.instance);
  // A rear billboard plane, beyond the whole model's bounding sphere, avoids
  // intersections at every drag angle. Extend the viewing ray so the ring
  // remains centered on the character instead of drifting toward the screen center.
  const perspective = (sourceDepth + radius * hero.scale.x + .2) / Math.max(sourceDepth, .1);
  anchor.sub(cameraPosition).multiplyScalar(perspective).add(cameraPosition);
  group.position.copy(anchor);
  group.quaternion.copy(orientation);
  group.scale.setScalar(hero.scale.x * perspective);
  const angle = MathUtils.degToRad(avatarRotation.value);
  const wide = MathUtils.clamp((sizes.aspectRatio - 1) / .6, 0, 1);
  const size = sizes.isLandscape ? MathUtils.lerp(1.05, 1.25, wide) : 1;
  const halfViewWidth = sourceDepth * Math.tan(MathUtils.degToRad(camera.instance.fov / 2)) * camera.instance.aspect;
  const rightRoom = (1 - projectedAnchor.x) * halfViewWidth / hero.scale.x;
  const radiusX = Math.min(sizes.isLandscape ? 2.05 : 2.25, Math.max(.5, rightRoom - size * .5 - .15));
  const radiusY = sizes.isLandscape ? 2.65 : 2.3;
  ornaments.forEach((mesh, i) => {
    const phase = angle + i * Math.PI / 3 + .3;
    mesh.position.set(Math.cos(phase) * radiusX, Math.sin(phase) * radiusY, 0);
    mesh.scale.setScalar(size * .8);
    mesh.material.opacity = 1 - MathUtils.smoothstep(entry, 0, .15);
    // Positions circle in the rear plane; icons stay upright and readable.
  });
}

export const heroOrnaments = { init, update, destroy: () => group.removeFromParent() };
