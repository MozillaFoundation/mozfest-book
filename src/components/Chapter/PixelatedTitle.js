import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import useDebouncedResizeObserver from "hooks/useDebouncedResizeObserver";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.registerPlugin(ScrollTrigger);

function PixelatedTitle(props) {
  const { title, darkMode } = props;

  const ref = useRef();
  const canvasRef = useRef();
  const sourceRef = useRef();
  const canvasTitleRef = useRef();

  // detect resize changes
  const size = useDebouncedResizeObserver(500, ref);

  useEffect(() => {
    if (!canvasTitleRef.current) return;

    // give type the time to change
    setTimeout(() => {
      canvasTitleRef.current.refresh();
    }, 500);
  }, [darkMode, size]);

  useEffect(() => {
    if (!canvasTitleRef.current) {
      canvasTitleRef.current = new PixelatedTitleGenerator({
        elTitle: sourceRef.current,
        canvas: canvasRef.current,
        minSampleSize: 4
      });
      canvasTitleRef.current.init();
      canvasTitleRef.current.render();
    }
  }, []);

  useEffect(() => {
    let lowresSampleSize = 30;
    let nearestRoundingSize = 2;
    let trigger = ScrollTrigger.create({
      trigger: canvasRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        if (!canvasTitleRef.current) return;

        let value = lowresSampleSize * Math.abs(self.progress - 0.5);
        let valueRounded = Math.round(value / nearestRoundingSize) * nearestRoundingSize; // round it to the nearest 10
        if (canvasTitleRef.current) {
          canvasTitleRef.current.render(valueRounded);
        }
      }
    });
    //
    // renderVisual(2);
    return () => {
      if (trigger) trigger.kill(true);
    };
  }, []);

  return (
    <div className="mosaic-title" ref={ref}>
      <h1 ref={sourceRef}>{title}</h1>

      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default PixelatedTitle;

/**
 * PixelatedTitleGenerator plots a low resolution version of the title
 * on a given canvas. The size and color and everything is based on the
 * give source element, this way css can control the visuals
 */
function PixelatedTitleGenerator(options) {
  const elTitle = options.elTitle;
  const elCanvasOffscreen = document.createElement("canvas");
  const elCanvasOffscreenCtx = elCanvasOffscreen.getContext("2d");

  const elCanvas = options.canvas;
  const elCanvasCtx = elCanvas.getContext("2d");

  var width, height, dpr, dprWidth, dprHeight, splittedText;
  var textStyles;
  var offscreenImgData;

  //
  var currentSampleSize = -1;

  let prepareSizes = () => {
    if (splittedText) splittedText.revert();
    // calc size of canvas
    let srcBnd = elTitle.getBoundingClientRect();
    width = srcBnd.width;
    height = srcBnd.height + 5; // extra space to catch quircks

    // calculate retina resolution
    dpr = window.devicePixelRatio || 1;
    dprWidth = parseInt(width * dpr);
    dprHeight = parseInt(height * dpr);
  };

  let prepareType = () => {
    // get the text styles from the source element
    let styles = window.getComputedStyle(elTitle);
    textStyles = {
      fontSize: parseInt(styles.getPropertyValue("font-size")),
      fontFamily: styles.getPropertyValue("font-family"),
      fontLineHeight: parseInt(styles.getPropertyValue("line-height")),
      fontColor: styles.getPropertyValue("color")
    };
  };

  let prepareCanvasses = () => {
    prepareSizes();
    prepareType();

    //
    elCanvasOffscreen.width = dprWidth;
    elCanvasOffscreen.height = dprHeight;
    elCanvasOffscreenCtx.scale(dpr, dpr);
    //
    elCanvas.width = dprWidth;
    elCanvas.height = dprHeight;
    elCanvas.style.width = width + "px";
    elCanvas.style.height = height + "px";
  };

  let setCanvasText = () => {
    if (splittedText) splittedText.revert();
    splittedText = new SplitText(elTitle, {
      type: "lines"
    });

    elCanvasOffscreenCtx.clearRect(0, 0, dprWidth, dprHeight);

    // set the font
    elCanvasOffscreenCtx.font = `${textStyles.fontSize}px ${textStyles.fontFamily}`;
    elCanvasOffscreenCtx.textAlign = "center";
    elCanvasOffscreenCtx.fillStyle = textStyles.fontColor;

    // walk through the textlines and draw text
    splittedText.lines.forEach((line, index) => {
      let text = line.textContent;
      elCanvasOffscreenCtx.fillText(
        text,
        width / 2,
        textStyles.fontLineHeight * index + textStyles.fontLineHeight / 1.25
      );
    });

    offscreenImgData = elCanvasOffscreenCtx.getImageData(0, 0, dprWidth, dprHeight);
  };

  let renderPixelatedText = (sampleSize, forceRender = false) => {
    if (!sampleSize || sampleSize < options.minSampleSize) sampleSize = options.minSampleSize;
    if (currentSampleSize === sampleSize && !forceRender) return;
    currentSampleSize = sampleSize;

    // draw image to canvas
    elCanvasCtx.clearRect(0, 0, dprWidth, dprHeight);

    if (sampleSize < options.minSampleSize) {
      sampleSize = options.minSampleSize;
    }

    let sample = offscreenImgData.data;

    for (var y = 0; y < dprHeight; y += sampleSize) {
      for (var x = 0; x < dprWidth; x += sampleSize) {
        var pos = (x + y * dprWidth) * 4;
        var red = sample[pos];
        var green = sample[pos + 1];
        var blue = sample[pos + 2];
        var alpha = sample[pos + 3];

        elCanvasCtx.beginPath();
        elCanvasCtx.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";

        elCanvasCtx.rect(x, y, sampleSize, sampleSize);
        elCanvasCtx.fill();
      }
    }
  };

  let refresh = () => {
    prepareType();
    setCanvasText();
    renderPixelatedText(currentSampleSize, true);
  };

  let init = () => {
    prepareCanvasses();
    setCanvasText();
    renderPixelatedText(currentSampleSize);
  };

  return {
    init: init,
    refresh: refresh,
    render: renderPixelatedText
  };
}
