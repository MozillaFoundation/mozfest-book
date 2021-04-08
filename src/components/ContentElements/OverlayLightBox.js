import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Transition } from "react-transition-group";
import useKeypress from "hooks/useKeyPress";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

gsap.registerPlugin(ScrollTrigger);

function OverlayLightBox(props) {
  const { visibleToggle, onClose, image, clickedImageRef } = props;
  const [visible, setVisible] = useState(props.visibleToggle);
  const transImageRef = useRef(null);
  const imageRef = useRef(null);
  const ref = useRef(null);

  let calcEnlargedScale = (imgWidth, imgHeight) => {
    let vPadding = 140;

    if (window.matchMedia("(min-width:600px)").matches) {
      vPadding = 60;
    }

    //
    let wHeight = window.innerHeight * 0.9 - vPadding;
    let wWidth = window.innerWidth * 0.9;

    let scale = 1;

    let imageAspect = imgHeight / imgWidth;
    let viewerAspect = wHeight / wWidth;

    //
    if (imgHeight < wHeight && imgWidth < wWidth) {
      scale = 1;
    } else {
      if (imageAspect < viewerAspect) {
        scale = wWidth / imgWidth;
      } else {
        scale = wHeight / imgHeight;
      }
    }

    return scale;
  };

  const enlargedScale = calcEnlargedScale(image.width, image.height);
  const srcSize = `${Math.round(((image.width * enlargedScale) / window.innerWidth) * 100)}vw`;

  let onEnter = () => {
    gsap.set(transImageRef.current, { opacity: 0, position: "absolute", width: image.width, height: image.height });
    gsap.set(imageRef.current, { opacity: 0, width: image.width, height: image.height });

    setTimeout(() => {
      gsap.set(clickedImageRef.current, { opacity: 0 });

      let imageBnd = clickedImageRef.current.getBoundingClientRect();
      let toScale = calcEnlargedScale(image.width, image.height);

      let start = {
        x: imageBnd.x + "px",
        y: imageBnd.y + "px",
        opacity: 1,
        scale: imageBnd.width / image.width
      };

      //  position the scalable image
      gsap.set(imageRef.current, {
        x: window.innerWidth / 2 - image.width / 2 + "px",
        y: window.innerHeight / 2 - image.height / 2 + "px",
        transformOrigin: "center center",

        scale: toScale
      });

      // do the transition
      // initial
      gsap.set(transImageRef.current, {
        ...start,
        transformOrigin: "top left"
      });

      // // //
      gsap.to(transImageRef.current, {
        x: window.innerWidth / 2 - (image.width * toScale) / 2 + "px",
        y: window.innerHeight / 2 - (image.height * toScale) / 2 + "px",
        scale: toScale,
        duration: 0.2,
        onComplete: () => {
          gsap.set(imageRef.current, { opacity: 1 });
          gsap.set(transImageRef.current, { opacity: 0 });
        }
      });
      return;
    }, 200);
  };

  let onExit = () => {
    let imageBnd = clickedImageRef.current.getBoundingClientRect();

    gsap.set(transImageRef.current, { opacity: 1 });
    gsap.set(imageRef.current, { opacity: 0 });

    gsap.to(transImageRef.current, {
      x: imageBnd.x + "px",
      y: imageBnd.y + "px",
      scale: imageBnd.width / image.width,
      duration: 0.2,
      onComplete: () => {
        gsap.set(clickedImageRef.current, { opacity: 1 });
        gsap.set(transImageRef.current, { opacity: 0 });
      }
    });
  };

  useEffect(() => {
    setVisible(visibleToggle);
  }, [visibleToggle]);

  // lock scrolling when element appears
  useEffect(() => {
    if (visible) {
      disableBodyScroll(ref.current);
    } else {
      clearAllBodyScrollLocks();
    }

    return () => {
      clearAllBodyScrollLocks();
    };
  }, [visible]);

  useKeypress("Escape", onClose);
  return (
    <Transition in={visible} onEnter={onEnter} onExit={onExit} timeout={500} mountOnEnter unmountOnExit>
      <div className="overlay-lightbox" onClick={onClose} ref={ref}>
        <div>
          <img
            src={image.src}
            srcSet={image.srcset}
            sizes={srcSize}
            alt={image.alt}
            ref={transImageRef}
            className="transition-image"
            aria-hidden="true"
          ></img>
          <img src={image.src} srcSet={image.srcset} alt={image.alt} ref={imageRef} sizes={srcSize} />
        </div>
      </div>
    </Transition>
  );
}

export default OverlayLightBox;
