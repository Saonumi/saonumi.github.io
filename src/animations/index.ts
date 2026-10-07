import { waypoints } from "./waypoints";
import { scenes } from "./scenes";
import { about } from "./transitions/about";
import { contact } from "./transitions/contact";

export const transitions = {
  about,
  contact,
};

let isInitialized = false;

const init = () => {
  if (isInitialized) return;
  scenes.init();
  waypoints.init();
  isInitialized = true;
};

const destroy = () => {
  if (!isInitialized) return;
  scenes.destroy();
  waypoints.destroy();
  isInitialized = false;
};

export const animations = { init, destroy };
