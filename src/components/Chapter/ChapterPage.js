// The primary role of this component is to keep track of the page scrolling
// because when a page has scrolled it should change the background color
// but, only the background of this specific chapter.

import { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { useGlobal } from "reactn";
import { Provider as BusProvider, useBus, useListener } from "react-bus";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function ChapterPage(props) {
  const { transitionDone, isTitlePage } = props;
  const [backgroundReset, setBackgroundReset] = useState(0);
  const [chapterHasScrolled, setChapterHasScrolled] = useGlobal("chapterScrolled");
  const [headerResetBg, setHeaderResetBg] = useGlobal("headerResetBg");
  const [headerHideBg, setHeaderHideBg] = useGlobal("headerHideBg");
  const [initScrollTrigger, setInitScrollTrigger] = useState(false);
  const bus = useBus();
  const ref = useRef();

  const setPreTransitionState = useCallback(() => {
    setHeaderHideBg(true);
    setBackgroundReset(false);
    setHeaderResetBg(false);
    setChapterHasScrolled(false);
  }, [setHeaderHideBg, setBackgroundReset, setHeaderResetBg, setChapterHasScrolled]);

  const setPostTransitionState = useCallback(() => {
    setHeaderHideBg(false);
    setHeaderResetBg(true);
    setBackgroundReset(true);
    setChapterHasScrolled(true);
  }, [setHeaderHideBg, setHeaderResetBg, setBackgroundReset, setChapterHasScrolled]);

  useListener("onTransitionComplete", () => {
    setInitScrollTrigger(true);
  });

  // on init set different global states
  useEffect(() => {
    setPreTransitionState();
  }, [setPreTransitionState]);

  // when the transition is done
  useEffect(() => {
    if (transitionDone) {
      bus.emit("transitionDone", true);

      setHeaderHideBg(false);

      if (isTitlePage) {
        setInitScrollTrigger(true);
      } else {
        setTimeout(() => {
          setPostTransitionState();
        }, 250);
      }

      // refresh scrolltrigger
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      // accessibility help, which moves the focus for the screenreader
      setTimeout(() => {
        if (ref.current) ref.current.focus();
      }, 250);
    }
  }, [transitionDone, isTitlePage, ref, setInitScrollTrigger, setHeaderHideBg, bus, setPostTransitionState]);

  // Register the trigger which calls a number of global state setters
  // which are used by the rest of the application
  // o.
  useLayoutEffect(() => {
    if (!initScrollTrigger) return;
    if (initScrollTrigger) {
      trigger.current = ScrollTrigger.create({
        start: "top -45%",
        onLeaveBack: () => {
          setBackgroundReset(false);
          setChapterHasScrolled(false);
          setHeaderResetBg(false);
        },
        onEnter: () => {
          setBackgroundReset(true);
          setChapterHasScrolled(true);
          setHeaderResetBg(true);
        }
      });
    }

    return () => {
      if (trigger.current) trigger.current.kill(true);
    };
  }, [initScrollTrigger, setChapterHasScrolled, setHeaderResetBg]);

  const trigger = useRef();

  return (
    <div className={`chapter-page__inner ${backgroundReset ? "has-background-reset" : ""}`} ref={ref} tabIndex="-1">
      {props.children}
    </div>
  );
}
export default ChapterPage;
