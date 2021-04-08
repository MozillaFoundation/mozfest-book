import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useTransitionDoneEvent from "hooks/useTransitionDoneEvent";
import parse from "html-react-parser";

gsap.registerPlugin(ScrollTrigger);

function ElementTextScaling(props) {
  const ref = useRef(null);
  const sizerScaledRef = useRef(null);
  const sizerNormalRef = useRef(null);
  const isTransitionDone = useTransitionDoneEvent();

  useEffect(() => {
    if (!isTransitionDone) return;
    if (!window.matchMedia("(min-width:600px)").matches) return;

    let scaledWidth = sizerScaledRef.current.offsetWidth;
    let normalWidth = sizerNormalRef.current.offsetWidth;

    gsap.set(ref.current, { scale: scaledWidth / normalWidth });

    let tween = gsap.to(ref.current, {
      scale: 1,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        end: "top center",
        scrub: true
      }
    });

    let trigger = tween.scrollTrigger;

    return () => {
      if (trigger) trigger.kill(true);
      if (tween) tween.kill(true);
    };
  }, [isTransitionDone]);

  return (
    <section className="component component--text-scaling container">
      <div className="scaling-text">
        <span className="scaling-text__scaled" ref={sizerScaledRef}></span>
        <span className="scaling-text__normal" ref={sizerNormalRef}></span>

        <div className="scaling-text__text text " ref={ref}>
          {parse(props.text)}
        </div>
      </div>
    </section>
  );
}

export default ElementTextScaling;
