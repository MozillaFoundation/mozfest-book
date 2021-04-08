import ChapterPage from "components/Chapter/ChapterPage";
import ChapterTitle from "components/Chapter/ChapterTitle";
import { useHistory } from "react-router-dom";
import Elements from "components/ContentElements/Elements";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useGlobal } from "reactn";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TimelineSection from "./TimelineSection";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

function ChapterPagesContinous(props) {
  const { chapter, transitionFinished } = props;
  const history = useHistory();
  const [currentSubChapter, setCurrentSubChapter] = useGlobal("currentSubChapter");
  const [transitionDone, setTransitionDone] = useState(false);

  const isOnEnterView = useRef(false);
  const ignoreLocationChng = useRef(false);
  const isAutoScrolling = useRef(false);
  const [initTimeout, setInitTimeout] = useState(false);

  // remember the previous chapter
  const prevSubChapter = useRef(null);

  let onEnterView = (pageSlug) => {
    if (isAutoScrolling.current) return;
    if (pageSlug === prevSubChapter.current) {
      return;
    }

    isOnEnterView.current = true;
    ignoreLocationChng.current = true;

    history.push(`/${chapter.slug}/${pageSlug}`);
    prevSubChapter.current = pageSlug;
  };

  // a little workaround to get transitions state working smooth.
  //
  useEffect(() => {
    if (!initTimeout) {
      setInitTimeout(true);
      return;
    }

    if (transitionFinished) {
      setTransitionDone(true);
    }
  }, [initTimeout, transitionFinished]);

  useLayoutEffect(() => {
    // prevent scrolling back to top when visiting another chapter
    if (!transitionDone || !chapter.continuous) return;
    if (!currentSubChapter) return;
    if (isAutoScrolling.current) return;

    if (ignoreLocationChng.current && isOnEnterView.current) {
      ignoreLocationChng.current = false;
      isOnEnterView.current = false;
      return;
    }

    let getPageIndex = (slug) => {
      if (!currentSubChapter) return 0;
      let pageObject = chapter.pages.find((o) => o.slug === slug);
      return chapter.pages.indexOf(pageObject);
    };

    let currentChapterIndex = getPageIndex(currentSubChapter);

    let scrollParams = {
      ease: "power4.inOut",
      duration: 1,
      overwrite: true,
      onComplete: () => {
        isAutoScrolling.current = false;
      }
    };

    let scrollToParams = {
      offsetY: -window.innerHeight / 3
    };

    // if the target is the first page
    if (currentChapterIndex === 0) {
      isAutoScrolling.current = true;
      gsap.to(window, {
        scrollTo: { y: 0, ...scrollToParams },
        ...scrollParams
      });
    } else {
      let element = document.body.querySelector(`[data-slug="${currentSubChapter}"]`);
      if (element) {
        isAutoScrolling.current = true;

        gsap.to(window, {
          scrollTo: { y: element, ...scrollToParams },
          ...scrollParams
        });
      }
    }

    prevSubChapter.current = currentSubChapter;

    return () => {
      ignoreLocationChng.current = true;
    };
  }, [currentSubChapter, transitionDone, chapter]);

  return (
    <div className={`chapter__page chapter-page`}>
      <ChapterPage transitionDone={transitionDone} isTitlePage={true}>
        <ChapterTitle chapter={chapter}></ChapterTitle>
        <div className="chapter-page__body">
          <div className="timeline">
            {chapter.pages.map((page, index) => {
              return <TimelineSection key={index} onEnterView={onEnterView} page={page}></TimelineSection>;
            })}
          </div>
        </div>
      </ChapterPage>
    </div>
  );
}

export default ChapterPagesContinous;
