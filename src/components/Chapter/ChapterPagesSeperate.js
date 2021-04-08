/**
 * There is a difference between TransitionDone and PageTransitionDone
 * - PageTransitionDone is a local transition of the ChapterPagesSeperate
 * - TransitionDone is used to determine if the transition of the Parent page is done.
 *
 * You see, even though the transitions look the same, a transition initiated from the main menu is a different
 * one that the transition intiated from the index or the "next chapter" functionality.
 *
 */
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useGlobal } from "reactn";
import { useParams, useHistory } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Transition, SwitchTransition } from "react-transition-group";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import parse from "html-react-parser";

//
import ChapterPage from "./ChapterPage";
import ChapterTitle from "./ChapterTitle";
import ChapterPageBody from "./ChapterPageBody";
import ChapterNextSection from "./ChapterNextSection";
import MozfestFooter from "components/Footer/MozfestFooter";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

// Ok this one is funky
function ChapterPagesSeperate(props) {
  const { chapter, page, setCurrentPage, pageSlug, transitionFinished } = props;
  const [scrollToPage, setScrollToPage] = useGlobal("scrollToPage");
  const [pageTransitionDone, setPageTransitionDone] = useState(transitionFinished);
  const promiseRef = useRef(Promise.resolve(true));
  const history = useHistory();
  const firstPageRef = useRef();
  const params = useParams();
  const [transitionDone, setTransitionDone] = useState(false);

  const chapterFirstPage = chapter.pages[0];
  const isTitlePage = !page;

  const [initTimeout, setInitTimeout] = useState(false);

  // create the transition key
  let transitionKey = "";
  if (chapter) transitionKey += chapter.slug;
  if (page) transitionKey += page.slug;

  // the nextSection is used in the bottom of the page, to allow the
  // user to goto the next page in an easy way
  let nextSection;
  let sectionIndex = chapter.pages.indexOf(page);

  if (sectionIndex < chapter.pages.length) {
    if (sectionIndex === -1) {
      nextSection = chapter.pages[1];
    } else {
      nextSection = chapter.pages[sectionIndex + 1];
    }
  }

  // a little timeout to detect if the parent transtio
  useEffect(() => {
    if (!initTimeout) {
      setInitTimeout(true);
      return;
    }

    if (transitionFinished) {
      setTransitionDone(true);
    }
  }, [initTimeout, transitionFinished]);

  // if the pageslug changes set the page transition to false
  // this logic is placed here instead of in the onEnter transition because
  // the setState changes we're not reflected in time before the page mounted
  useEffect(() => {
    setPageTransitionDone(false);
  }, [params.pageSlug]);

  useEffect(() => {
    if (transitionDone) {
      setPageTransitionDone(true);
    }
  }, [transitionDone]);

  // handle the scrolling of the page when the scrollToPage global state is set
  // the indexPanel uses this to create the effect in which clicking on the current page scrolls to top
  useLayoutEffect(() => {
    if (scrollToPage) {
      let tween;
      // could be improved by first checking if the item is alreay in view or close to
      // final position because then we don't need to wait on the scrollDuration
      let scrollParams = {
        ease: "power4.inOut",
        duration: 1,
        overwrite: true,
        onComplete: () => {
          setScrollToPage(false);
        }
      };

      let element = document.body.querySelector(`[data-slug="${scrollToPage}"]`);

      tween = gsap.to(window, {
        scrollTo: element,
        ...scrollParams
      });

      return () => {
        if (tween) tween.kill(true);
      };
    }
  }, [scrollToPage, setScrollToPage]);

  // This handles the update of the current page when we scroll past the title and into the first chapter.
  // The title page is special because it is both the title and the first chapter, thus when scrolling down
  // at a certain point we must update the url. We do not want a transition so there is also some logic inside
  // Chapter.js which prevents a page state from being set.
  useLayoutEffect(() => {
    if (!page && firstPageRef.current) {
      let trigger = ScrollTrigger.create({
        trigger: firstPageRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setCurrentPage(chapterFirstPage.slug);
        },
        onLeaveBack: () => {
          setCurrentPage(false);
        }
      });

      return () => {
        if (trigger) trigger.kill(true);
      };
    }
  }, [page, chapter, chapterFirstPage]);

  // -------------------------------------------------------------------------------------- //
  let onGotoNext = () => {
    history.push(`/${chapter.slug}/${nextSection.slug}`);
  };

  // -- Transitions --------------------------------------------------------------------------- //
  let onEnter = (node) => {
    disableBodyScroll(node);
    promiseRef.current = new Promise((resolve, reject) => {
      node.style.opacity = 0;
      node.style.position = "fixed";

      gsap.set(node, {
        zIndex: 1,
        width: "100%",
        y: `${window.innerHeight}px`,
        top: `0px`,
        opacity: 1
      });

      gsap.to(node, {
        y: "0px",
        delay: 0.1,
        duration: 0.4,
        onComplete: () => {
          // add a little delay, just to give some time to make things smoother
          // swiped scroll has more time to ease
          setTimeout(() => {
            window.scrollTo(0, 0);
            resolve("enter");
            setImmediate(() => {
              gsap.set(node, { clearProps: "zIndex,y,top,position" });
            });
          }, 150);
        }
      });
    });
  };

  let onExit = (node) => {
    promiseRef.current = new Promise((resolve, reject) => {
      resolve("exit");
    });
  };

  let endListener = (node, done) => {
    promiseRef.current
      .then((type) => {
        if (type === "enter") {
          setImmediate(() => {
            setPageTransitionDone(true);
            clearAllBodyScrollLocks();
          });
          return;
        }
      })
      .then(done);
  };

  return (
    <>
      <SwitchTransition mode="in-out">
        <Transition key={transitionKey} onEnter={onEnter} onExit={onExit} addEndListener={endListener}>
          <article className={`chapter__page chapter-page ${!page ? "" : "is-subchapter"}`}>
            <ChapterPage transitionDone={pageTransitionDone} pageSlug={pageSlug} isTitlePage={isTitlePage}>
              {!page && (
                <>
                  <ChapterTitle chapter={chapter}></ChapterTitle>
                  {chapter.intro && <div className="chapter-page__intro text container">{parse(chapter.intro)}</div>}
                  <div ref={firstPageRef}>
                    <ChapterPageBody chapter={chapter} page={chapterFirstPage}></ChapterPageBody>
                  </div>
                </>
              )}
              {page && <ChapterPageBody chapter={chapter} page={page}></ChapterPageBody>}
              {!!nextSection && (
                <ChapterNextSection nextSection={nextSection} onGotoNext={onGotoNext}></ChapterNextSection>
              )}
              {!nextSection && chapter.chapter_nr === "06" && <MozfestFooter></MozfestFooter>}
            </ChapterPage>
          </article>
        </Transition>
      </SwitchTransition>
    </>
  );
}

export default ChapterPagesSeperate;
