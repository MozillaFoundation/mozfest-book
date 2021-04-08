import React from "react";
import { uniqueId } from "lodash-es";

const Image = React.forwardRef((props, ref) => {
  const { keepAspect, caption, alt, src, srcset, width, height, sizes } = props;
  const ariaLabelFigure = uniqueId("fig-capt-");

  var orientation = "landscape";
  var style = {};

  if (height >= width) {
    orientation = "portrait";
  }

  // calculate aspect ratio
  if (keepAspect) {
    style = {
      "--aspect-ratio": `${(height / width) * 100}%`
    };
  }

  return (
    <figure
      className={`${keepAspect ? "is-aspect" : ""} is-${orientation}`}
      style={style}
      ref={ref}
      role="figure"
      aria-labelledby={ariaLabelFigure}
    >
      <img src={src} srcSet={sizes ? srcset : ""} sizes={sizes ? sizes : ""} alt={alt}></img>
      {caption && (
        <figcaption id={ariaLabelFigure}>
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
});

export default Image;
