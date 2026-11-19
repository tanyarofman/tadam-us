import { gsap } from "../lib/scroll";

export const mobileSceneQuery = "(max-width: 767px), (orientation: landscape) and (max-height: 500px)";

/** Native sticky on phones: no fixed-pin handoff or spacer rebuild during a swipe. */
export function sceneScroll(section: HTMLElement, pin: HTMLElement, mobile: boolean, screens: number, scrub: number) {
  if (mobile) {
    section.classList.add("mobile-sticky-scene");
    section.style.setProperty("--scene-travel", `${screens * 100}lvh`);
    pin.classList.add("mobile-scene-pin");
    // Register the DOM cleanup with the enclosing matchMedia context.
    gsap.context(() => () => {
      section.classList.remove("mobile-sticky-scene");
      section.style.removeProperty("--scene-travel");
      pin.classList.remove("mobile-scene-pin");
    });
  }
  return {
    trigger: section,
    start: "top top",
    end: () => "+=" + (mobile ? section.offsetHeight - pin.offsetHeight : window.innerHeight * screens),
    pin: mobile ? false as const : pin,
    scrub,
    invalidateOnRefresh: true,
  };
}
