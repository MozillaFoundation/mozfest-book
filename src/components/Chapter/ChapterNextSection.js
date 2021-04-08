/**
 * This component is responsible for the "scroll to next chapter" functionality.
 * To achieve this effect
 * - When user reaches bottom wait a bit
 * - Then enable another scrolltrigger which gives the user the feeling that they're
 * dragging into the next page
 * - When trigger fires, perform gotoNext();
 */
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useGlobal } from "reactn"; // <-- reactn
import useTransitionDoneEvent from "hooks/useTransitionDoneEvent";
import { useLocation } from "react-router-dom";

// --------------------------------------------------------------------- //
function ChapterNextSection(props) {
  const { nextSection, onGotoNext } = props;
  const [chapterNavEnabled, setChapterNavEnabled] = useGlobal("chapterNavEnabled");
  const isTransitionDone = useTransitionDoneEvent();
  const location = useLocation();
  const chapterNavEnabledRef = useRef(false);
  const ref = useRef();
  const progressRef = useRef();
  const transRef = useRef();
  const initialPathName = useRef(location.pathname);
  const locationChanged = useRef(false);

  const gotoNext = () => {
    // if the chapternav is expanded, triggering goto next
    // will cause a double trigger, this prevents this
    if (chapterNavEnabledRef.current) return;

    // if the location has changed, due to clicking a link or anything,
    // prevent the ScrollTrigger gotoNext() call to cause a double trigger.
    if (locationChanged.current) return;

    if (!chapterNavEnabledRef.current) onGotoNext();
  };

  // if the location changes set a boolean to prevent the
  // onGotoNext in the scrolltrigger from triggering double
  useEffect(() => {
    if (location.pathname !== initialPathName.current) {
      locationChanged.current = true;
    }
  }, [location]);

  useEffect(() => {
    chapterNavEnabledRef.current = chapterNavEnabled;
  }, [chapterNavEnabled]);

  useEffect(() => {
    if (!isTransitionDone) return;

    let scrollNextTween;
    let scrollNextTweenTrigger;

    let initOtherTrigger = () => {
      if (!ref.current) return;

      let initialHeight = ref.current.offsetHeight;
      let height = window.innerHeight;

      ref.current.style.height = height + "px";

      // transRef
      setImmediate(() => {
        scrollNextTween = gsap.to(ref.current, {
          yPercent: 40,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: `+=${initialHeight}px bottom`,
            end: `bottom bottom`,
            scrub: true,
            onEnter: () => {
              if (progressRef.current) {
                gsap.to(progressRef.current, { opacity: 1 });
              }
            },
            onUpdate: ({ progress }) => {
              if (transRef.current) {
                gsap.set(transRef.current, { opacity: 1 - progress });
              }
            },
            onLeave: () => {
              gotoNext();
            }
          }
        });

        scrollNextTweenTrigger = scrollNextTween.scrollTrigger;
      });
    };

    let trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "center bottom",
      end: "bottom bottom",
      onEnter: (e) => {
        setTimeout(() => {
          initOtherTrigger();
        }, 500);
      },
      onEnterBack: () => {
        if (ref.current) {
          ref.current.style.height = "auto";
        }
      }
    });

    return () => {
      if (trigger) trigger.kill(true);
      if (scrollNextTween) scrollNextTween.kill(true);
      if (scrollNextTweenTrigger) scrollNextTweenTrigger.kill(true);
    };
  }, [isTransitionDone]);

  return (
    <div
      className="chapter-page__next"
      onClick={gotoNext}
      ref={ref}
      role="button"
      aria-label={`Goto next article: ${nextSection.title}`}
    >
      <div ref={transRef}>
        <span>Keep scrolling for</span>
        <h3>{nextSection.title}</h3>
      </div>
    </div>
  );
}

export default ChapterNextSection;
