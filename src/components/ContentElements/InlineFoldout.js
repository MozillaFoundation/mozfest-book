import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { uniqueId } from "lodash-es";
import parse from "html-react-parser";
//
import ParallaxLayer from "components/ParallaxLayer";

gsap.registerPlugin(ScrollTrigger);

function InlineFoldout(props) {
  const { name, position, text } = props;
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  const refContainer = useRef();
  const refPanel = useRef();
  const refSizer = useRef();
  const refPanelInner = useRef();
  const collapsedSize = useRef;
  const fullDimension = useRef();
  const prevState = useRef();
  const [theText, setTheText] = useState(props.text);

  let onClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    fullDimension.current = {
      width: refPanelInner.current.offsetWidth,
      height: refPanelInner.current.offsetHeight
    };

    gsap.set(refPanelInner.current, {
      height: refSizer.current.offsetHeight,
      width: refSizer.current.offsetWidth
    });
  }, []);

  useEffect(() => {
    if (!refContainer.current) return;
    let tween;

    setTimeout(() => {
      setClamped(true);

      if (window.matchMedia("(min-width:600px)").matches) {
        tween = gsap.to(refContainer.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: refContainer.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, 500);

    return () => {
      if (tween) tween.kill(true);
    };
  }, [refContainer]);

  useEffect(() => {
    if (!expanded && !prevState.current) return;
    let tween;

    if (expanded) {
      setClamped(false);

      tween = gsap.to(refPanelInner.current, {
        height: fullDimension.current.height,
        width: fullDimension.current.width,
        duration: 0.3,
        ease: "Power4.easeOut",
        onComplete: () => {
          ScrollTrigger.refresh();
          prevState.current = true;
        }
      });

      refContainer.current.focus();
    } else {
      tween = gsap.to(refPanelInner.current, {
        height: refSizer.current.offsetHeight,
        width: refSizer.current.offsetWidth,
        duration: 0.3,
        ease: "Power4.easeOut",
        onComplete: () => {
          setClamped(true);
          prevState.current = false;
          ScrollTrigger.refresh();
        }
      });
    }

    return () => {
      if (tween) tween.kill(true);
    };
  }, [expanded]);

  const ariaControlId = uniqueId("aria-control-");

  return (
    <ParallaxLayer initDelay={750} offsetY={-80} minScreenWidth={600}>
      <article
        className={`inline-foldout ${expanded ? "is-expanded" : ""} ${clamped ? "is-clamped" : ""}`}
        ref={refContainer}
        aria-label={`Quote by ${name}`}
      >
        <div className="inline-foldout__meta">
          <span className="meta__name">{name}</span>
          <span className="meta__position">{position}</span>
        </div>
        <div className="inline-foldout__sizer" ref={refSizer}></div>
        <div className="inline-foldout__panel foldout-panel" ref={refPanel} onClick={onClick}>
          <div className="foldout-panel__inner" ref={refPanelInner} id={ariaControlId}>
            <div className="foldout-panel__wrapper">{parse(theText)}</div>
          </div>
          <div className="foldout-panel__footer" aria-hidden="true">
            <button onClick={onClick}>{`${expanded ? "Close" : "Read more"}`}</button>
          </div>
        </div>
      </article>
    </ParallaxLayer>
  );
}

export default InlineFoldout;
