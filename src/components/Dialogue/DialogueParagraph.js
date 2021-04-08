import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DialogueParagraph(props) {
  const { reveal, onRevealed, paragraphId } = props;
  const ref = useRef();
  const paragraphRef = useRef(null);
  const paragraphLoaderRef = useRef(null);
  const isRevealed = useRef(false);

  const tweenLoaderRef = useRef();
  const tweenParagraphRef = useRef();

  let hideText = useCallback(() => {
    gsap.set([ref.current, paragraphRef.current], { opacity: 0 });
    gsap.set(paragraphRef.current, { y: "10px" });
  }, []);

  useEffect(() => {
    hideText();
  }, [hideText]);

  // listen for page scrolling
  useEffect(() => {
    if (!reveal) return;

    let mainTrigger;
    let textTrigger;
    let revealTimeout;

    function revealText() {
      if (isRevealed.current) return;

      tweenLoaderRef.current = gsap.to(paragraphLoaderRef.current, { opacity: 0, duration: 0.2 });
      tweenParagraphRef.current = gsap.to(paragraphRef.current, {
        delay: 0.2,
        duration: 0.2,
        opacity: 1,
        y: "0px",
        onComplete: () => {
          isRevealed.current = true;
          onRevealed(paragraphId);
        }
      });
    }

    // main trigger
    mainTrigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 90%",
      onEnter: (e) => {
        gsap.to(ref.current, { opacity: 1, y: "0px" });
        revealTimeout = setTimeout(revealText, 1000);
      }
    });

    // text reveal trigger
    textTrigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 50%",
      // markers: true,
      onEnter: (e) => {
        clearTimeout(revealTimeout);
        setTimeout(revealText, 0);
      }
    });

    return () => {
      if (revealTimeout) clearTimeout(revealTimeout);
      if (mainTrigger) mainTrigger.kill(true);
      if (textTrigger) textTrigger.kill(true);
      if (tweenLoaderRef.current) tweenLoaderRef.current.kill(true);
      if (tweenParagraphRef.current) tweenParagraphRef.current.kill(true);
    };
  }, [reveal, onRevealed, paragraphId]);

  return (
    <div className="dialogue-paragraph" ref={ref}>
      <div
        className="dialogue-paragraph__text"
        ref={paragraphRef}
        dangerouslySetInnerHTML={{ __html: props.text }}
      ></div>

      <div className="dialogue-paragraph__loader" ref={paragraphLoaderRef}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
