import { ReactComponent as LogoFull } from "assets/logo-full.svg";
import gsap from "gsap/gsap-core";
import React, { useState, useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function HeaderLogo(props) {
  const { listenToScroll, animateOnMount, defaultCollapsed, ignoreMediaQuery } = props;
  const [expanded, setExpanded] = useState(!defaultCollapsed);
  const afterFirstLoad = useRef();

  const ref = useRef();
  const timeline = useRef();

  const onFirstMount = useRef(true);

  const svgRef = useRef();
  const maskMain = useRef();
  const maskText = useRef();

  const scroller = useRef();

  let setDirectCollapsed = () => {
    gsap.set(maskMain.current, { scaleY: 0 });
    gsap.set(maskText.current, { scaleX: 0 });
    gsap.set(svgRef.current, { transformOrigin: "top left", scale: 0.5 });
  };

  let setDirectExpanded = () => {
    gsap.set(maskMain.current, { scaleY: 1 });
    gsap.set(maskText.current, { scaleX: 1 });
    gsap.set(svgRef.current, { transformOrigin: "top left", scale: 1 });
  };

  useEffect(() => {
    if (ref.current) {
      svgRef.current = ref.current.querySelector("svg");
      maskMain.current = ref.current.querySelector("#logo-path-1");
      maskText.current = ref.current.querySelector("#logo-path-3");

      if (window.matchMedia("(max-width:900px)").matches && !ignoreMediaQuery) {
        setDirectCollapsed();

        return;
      } else {
        if (expanded) {
          setDirectExpanded();
        } else {
          setDirectCollapsed();
        }
        if (animateOnMount) {
          setExpanded(!expanded);
        }

        if (listenToScroll) {
          scroller.current = ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: () => {
              return `${document.body.scrollHeight}px`;
            },
            onLeaveBack: () => {
              setExpanded(true);
            },
            onEnter: () => {
              setExpanded(false);
            }
          });
        }
      }
    }

    return () => {
      if (scroller.current) scroller.current.kill(true);
    };
  }, []);

  useEffect(() => {
    if (onFirstMount.current) {
      onFirstMount.current = false;
      return;
    }

    if (!timeline.current) {
      timeline.current = gsap.timeline();
    }
    if (timeline.current) {
      timeline.current.pause();
    }
    if (expanded) {
      gsap.set(svgRef.current, { scale: 0.5 });
      gsap.set(maskMain.current, { scaleY: 0 });
      gsap.set(maskText.current, { scaleX: 0 });
      timeline.current
        .to(svgRef.current, {
          scale: 1,
          ease: "Power4.easeIn",
          transformOrigin: "top left"
        })
        .to(maskMain.current, {
          duration: 0.4,
          scaleY: 1,
          ease: "Power4.easeIn"
        })
        .to(maskText.current, {
          duration: 0.4,
          scaleX: 1,
          ease: "Power4.easeIn"
        });
    } else {
      gsap.set(maskMain.current, { scaleY: 1 });
      gsap.set(maskText.current, { scaleX: 1 });
      timeline.current
        .to(maskText.current, {
          duration: 0.4,
          scaleX: 0,
          ease: "Power4.easeIn"
        })
        .to(
          maskMain.current,
          {
            duration: 0.4,
            scaleY: 0,
            ease: "Power4.easeIn"
          },
          "-=0.2"
        )
        .to(
          svgRef.current,
          {
            scale: 0.5,
            ease: "Power4.easeIn",
            transformOrigin: "top left"
          },
          "-=0.2"
        );
    }
    if (!onFirstMount.current || (onFirstMount.current && animateOnMount)) {
      timeline.current.play();
    }
  }, [expanded, animateOnMount]);

  return (
    <div className="header-logo" ref={ref}>
      <figure role="img" aria-label="MozFest logo">
        <LogoFull></LogoFull>
      </figure>
    </div>
  );
}

export default HeaderLogo;
