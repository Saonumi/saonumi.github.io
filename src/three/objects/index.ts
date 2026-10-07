import { personalHologram } from "./avatar/personal-hologram";
import { darkPlane } from "./dark-plane";
import { gridFloor } from "./grid-floor";
import { lab } from "./lab";
import { renderer } from "../core/renderer";

const init = () => {
  personalHologram.init();
  darkPlane.init();
  gridFloor.init();
  lab.init();

  renderer.compile();
};

const destroy = () => {
  personalHologram.destroy();
  darkPlane.destroy();
  gridFloor.destroy();
  lab.destroy();
};

export const objects = { init, destroy };
