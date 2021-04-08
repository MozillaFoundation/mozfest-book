import Elements from "components/ContentElements/Elements";
import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

// -----------
function TimelineSection(props) {
  const { page, onEnterView } = props;
  const ref = useRef(null);
  const tlContentRef = useRef(null);
  const tlBodyRef = useRef(null);
  const tlTitleRef = useRef(null);

  const performOnEnterView = useCallback(onEnterView, []);

  useEffect(() => {
    let tl;
    let trigger;
    let navChapterTrigger;

    let elHeader = ref.current.querySelector(".timeline-section__header");
    let elLabel = elHeader.querySelector("h3");
    let elContent = tlContentRef.current;
    let elTitle = tlTitleRef.current;

    gsap.set(elContent, { opacity: 0 });
    gsap.set(elLabel, { scale: 5, transformOrigin: "top center" });
    gsap.set(elTitle, {
      scale: 2.4,
      transformOrigin: "top center"
    });

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: elHeader,
        start: () => {
          return `-=100% top`;
        },
        end: () => {
          return `${window.innerHeight / 3}px top`;
        },
        scrub: true,
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      }
    });
    tl.to(elLabel, { scale: 1, duration: 1 }, "0.5")
      .to(elTitle, { scale: 1, duration: 1 }, "1")
      .to(elContent, { opacity: 1, duration: 1 }, "1.5");

    // store the trigger
    trigger = tl.scrollTrigger;

    //
    navChapterTrigger = ScrollTrigger.create({
      trigger: ref.current,
      start: () => {
        return `+=${window.innerHeight / 3}px top`;
      },
      end: "bottom top",
      onEnter: () => {
        performOnEnterView(page.slug);
      },
      onEnterBack: () => {
        performOnEnterView(page.slug);
      }
    });

    return () => {
      if (trigger) trigger.kill(true);
      if (tl) tl.kill(true);
      if (navChapterTrigger) navChapterTrigger.kill(true);
    };
  }, [performOnEnterView, page]);

  return (
    <div className="timeline-section" data-slug={page.slug} ref={ref}>
      <TimelineHeader index={page.index}></TimelineHeader>
      <div className="timeline-section__body" ref={tlBodyRef}>
        <div className="timeline-section__title container">
          <h1 ref={tlTitleRef}>{page.title}</h1>
        </div>

        <div className="timeline-section__content" ref={tlContentRef}>
          <Elements elements={page.components}></Elements>
        </div>
      </div>
    </div>
  );
}

export default TimelineSection;

/**
 * TimelineHeader
 */
function TimelineHeader(props) {
  const tlHeaderRef = useRef(null);
  const tlLabelRef = useRef(null);

  useEffect(() => {
    // this is responsible for pinning
    let headerTrigger = ScrollTrigger.create({
      trigger: tlHeaderRef.current,
      start: "top top",
      end: () => {
        return `${window.innerHeight / 3}px top`;
      },
      pin: true
    });

    return () => {
      if (headerTrigger) headerTrigger.kill(true);
    };
  }, []);

  return (
    <div className="timeline-section__header " ref={tlHeaderRef}>
      <div className="container">
        <h3 ref={tlLabelRef}>{props.index}</h3>
      </div>
    </div>
  );
}
