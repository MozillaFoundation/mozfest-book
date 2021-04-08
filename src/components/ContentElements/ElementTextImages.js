/**
 * This component is positioned in the edge and scales an image
 * from the top left origin to the full width off the screen.
 */
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "../Image";
import GetParentScrollContainer from "../../common/GetParentScrollContainer";
import useTransitionDoneEvent from "hooks/useTransitionDoneEvent";
gsap.registerPlugin(ScrollTrigger);

function ElementTextImages(props) {
  const { images } = props;

  const image = images[0];
  const imageRef = useRef(null);
  const sizerPortrait = useRef(null);
  const sizerLanscape = useRef(null);
  const isTransitionDone = useTransitionDoneEvent();

  // define the responsive image sizes
  var srcSetSizes;
  if (image) {
    if (image.height > image.width) {
      srcSetSizes = "(min-width: 1024px) 30vw, (min-width: 600px) 51vw, 100vw";
    } else {
      srcSetSizes = "(min-width: 1024px) 82vw, 100vw";
    }
  }

  let revealCaption = () => {
    if (!imageRef.current) return;

    let figcaptionEl = imageRef.current.querySelector("figcaption");
    if (!figcaptionEl) return;

    gsap.to(figcaptionEl, { opacity: 1 });
  };

  useEffect(() => {
    if (!isTransitionDone) return;
    if (!window.matchMedia("(min-width:600px)").matches) return;

    let timeline;
    let trigger;

    let scrollContainer = GetParentScrollContainer(imageRef.current);

    let figcaptionEl = imageRef.current.querySelector("figcaption");
    let startScale = sizerLanscape.current.offsetWidth / imageRef.current.offsetWidth;

    // hide figcaption
    if (figcaptionEl) {
      gsap.set(figcaptionEl, { opacity: 0 });
    }

    gsap.set(imageRef.current, {
      transformOrigin: "top left",
      scale: startScale
    });

    timeline = gsap.timeline({
      onComplete: revealCaption,
      scrollTrigger: {
        scroller: scrollContainer,
        trigger: imageRef.current,
        start: "center bottom",
        once: true,
        scrub: true
      },
      ease: "linear"
    });

    timeline
      .set(imageRef.current, {
        transformOrigin: "top left",
        scale: startScale
      })
      .to(imageRef.current, { scale: 1, ease: "linear" });

    // store the trigger
    trigger = timeline.scrollTrigger;

    return () => {
      if (trigger) trigger.kill(true);
      if (timeline) timeline.kill(true);
    };
  }, [isTransitionDone]);

  return (
    <div className="component component--text-images container">
      <div className="text-images">
        <div className="text-images__sizer text-images__sizer--portrait" ref={sizerPortrait}></div>
        <div className="text-images__sizer text-images__sizer--landscape" ref={sizerLanscape}></div>

        <div className="text-images__image">
          <Image keepAspect="true" {...image} sizes={srcSetSizes} ref={imageRef}></Image>
        </div>
      </div>
    </div>
  );
}

export default ElementTextImages;
