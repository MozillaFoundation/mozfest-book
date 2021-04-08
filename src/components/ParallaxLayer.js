import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxLayer(props) {
  const { initDelay, offsetY, minScreenWidth } = props;
  const refContainer = useRef();

  useEffect(() => {
    if (!refContainer.current) return;
    let tween;
    setTimeout(() => {
      if (window.matchMedia(`(min-width:${minScreenWidth}px)`).matches) {
        tween = gsap.to(refContainer.current, {
          y: offsetY,
          ease: "none",
          scrollTrigger: {
            trigger: refContainer.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, initDelay);
    return () => {
      if (tween) tween.kill(true);
    };
  }, [refContainer, initDelay, offsetY, minScreenWidth]);

  return <div ref={refContainer}>{props.children}</div>;
}
