import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "../Image";
import useTransitionDoneEvent from "hooks/useTransitionDoneEvent";

gsap.registerPlugin(ScrollTrigger);

function ElementImage(props) {
  const { image } = props;
  const growEl = useRef(null);
  const growInnerEl = useRef(null);
  const isTransitionDone = useTransitionDoneEvent();

  // define the responsive image sizes
  var srcSetSizes;
  if (image) {
    if (image.height > image.width) {
      srcSetSizes = "(min-width: 600px) 54vw, 100vw";
    } else {
      srcSetSizes = "(min-width:600px) 83vw, 100vw";
    }
  }

  useEffect(() => {
    if (!isTransitionDone) return;
    if (!window.matchMedia("(min-width:600px)").matches) return;

    let tween = gsap.to(growInnerEl.current, {
      scale: 1,
      scrollTrigger: {
        trigger: growEl.current,
        start: "top 90%",
        end: "top 30%",
        once: true,
        scrub: true
      }
    });

    return () => {
      if (tween) tween.kill(true);
    };
  }, [isTransitionDone]);

  return (
    <div className="component component--image container">
      <div className="grow-image" ref={growEl}>
        <div className="grow-image__inner" ref={growInnerEl}>
          <Image keepAspect="true" {...image} sizes={srcSetSizes}></Image>
        </div>
      </div>
    </div>
  );
}

export default ElementImage;
