import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";

//
import Image from "../Image";
import OverlayLightBox from "./OverlayLightBox";
import InlineFoldout from "./InlineFoldout";

gsap.registerPlugin(ScrollTrigger);

function ParallaxImage(props) {
  const { image } = props;

  const imageRef = useRef(null);
  const [lightboxImage, setLightboxImage] = useState(false);
  const [imageBnd, setImageBnd] = useState(false);

  // define the responsive image sizes
  var srcSetSizes = "(min-width: 1024px) 10vw, (min-width: 600px) 15vw, 35vw";

  useEffect(() => {
    gsap.set(imageRef.current, { left: `${40 * Math.random()}%`, yPercent: 0 });

    let tween = gsap.to(imageRef.current, {
      yPercent: -70,
      ease: "none",
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      if (tween) tween.kill(true);
    };
  }, []);

  let onClick = () => {
    setImageBnd(imageRef.current.getBoundingClientRect());
    setLightboxImage(true);
  };

  let onClose = () => {
    setLightboxImage(false);
  };

  return (
    <>
      <div onClick={onClick}>
        <Image
          ref={imageRef}
          keepAspect="true"
          {...image}
          sizes={srcSetSizes}
          onClick={onClick}
          caption={false}
        ></Image>
      </div>
      <OverlayLightBox
        onClose={onClose}
        visibleToggle={lightboxImage}
        clickedImageRef={imageRef}
        image={image}
      ></OverlayLightBox>
    </>
  );
}

function DoubleColumnSection(props) {
  const { text, image, foldout } = props;

  return (
    <div className="double-column">
      <div className="double-column__text">
        {image && (
          <div className="image">
            <ParallaxImage image={image}></ParallaxImage>
          </div>
        )}
        <div className="text">{parse(text)}</div>
      </div>
      <div className="double-column__quote">
        {foldout && <InlineFoldout name={foldout.name} position={foldout.position} text={foldout.text}></InlineFoldout>}
      </div>
    </div>
  );
}

function ElementDoubleColumn(props) {
  const { content } = props;
  return (
    <div className="component component--double-column container">
      {content.map((content, index) => (
        <DoubleColumnSection
          key={index}
          foldout={content.foldout}
          text={content.text}
          image={content.image}
        ></DoubleColumnSection>
      ))}
    </div>
  );
}

export default ElementDoubleColumn;
