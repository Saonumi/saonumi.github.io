import { sceneWeightsInOut } from "../scenes";

let observer: IntersectionObserver | null = null;
const setup = (contact: HTMLElement) => {
  destroy();
  // The canvas belongs to the section, so render as soon as any of it is
  // visible. IntersectionObserver also follows accordion and locale reflow.
  observer = new IntersectionObserver(([entry]) => {
    sceneWeightsInOut.contact.in = entry?.isIntersecting ? 1 : 0;
    sceneWeightsInOut.contact.out = 0;
  });
  observer.observe(contact);
};
const destroy = () => {
  observer?.disconnect();
  observer = null;
  sceneWeightsInOut.contact.in = 0;
};
export const contact = { setup, destroy };
