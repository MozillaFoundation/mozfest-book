/**
 * The Chapter component is the base of all Chapter type pages.
 *
 * Some specifics about the Chapter component. A chapter can be of type continuous which creates an endles chapter with all
 * pages rendered at the same time i.e. Chapter 02. It could also be a seperate pages page wich requires an extra scroll to show the next page
 * and has a transition.
 *
 * EDGE CASE 'TITLE PAGE'
 * The title page of each chapter is special, because it has a title 'and' the first page is shown. When visiting the chapter
 * the url does not yet contain the first chapter slug, but as soon as you scroll into the first chapter the url needs to update
 * without re-rendering or transitioning the page. To achieve this [1] was added.
 */

import { useRef, useEffect, useState } from "react";
import { useGlobal, useDispatch } from "reactn"; // <-- reactn
import { gsap } from "gsap";
import { useParams } from "react-router-dom";
import { SwitchTransition, Transition } from "react-transition-group";
import { useListener } from "react-bus";

import ChapterWrapper from "./ChapterWrapper";

// -------------------------------------------------------------------------------------------------- //

function Chapter(props) {
  const { transitionFinished } = props;
  let { chapterSlug, pageSlug } = useParams();
  let [chapterState, setChapterState] = useState(null);
  let [pageState, setPageState] = useState(null);
  // -- state --
  const [chaptersData] = useGlobal("chaptersData");
  const [currentChapter, setCurrentChapter] = useGlobal("currentChapter");
  const [currentSubChapter, setCurrentSubChapter] = useGlobal("currentSubChapter");
  const [showChapterNav, setShowChapterNav] = useGlobal("showChapterNav");
  const toggleHeaderBar = useDispatch("toggleHeaderBar");
  const params = useParams();
  const [initTimeout, setInitTimeout] = useState(false);

  //

  const promiseRef = useRef(Promise.resolve(true));

  const [transitionDone, setTransitionDone] = useState(false);

  const prevPageRef = useRef();

  useListener("onTransitionComplete", () => {
    setTransitionDone(true);
  });

  // a little workaround to get transitions state working smooth.
  useEffect(() => {
    if (!initTimeout) return setInitTimeout(true);

    // check if transitionFinished is null or false if "null" there never was a transition initiated
    // if false we are waiting to finish, so its best to ignore false
    if (transitionFinished === null || transitionFinished) {
      setTransitionDone(true);
    }
  }, [initTimeout, transitionFinished]);

  // Perform some basics when the Chapter first loads
  useEffect(() => {
    // todo: maybe remove the setImmediate
    setImmediate(() => {
      toggleHeaderBar(true);
      setShowChapterNav(true);
    });
  }, [setShowChapterNav, toggleHeaderBar]);

  // If the chapterSlug or pageSlug changes, in this part we will set the `chapterState` and `pageState`.
  // There is an exception behavior when the slug changes due to the user scrolling down on the first page
  // this needs to trigger an url change
  useEffect(() => {
    let getChapter = (slug) => {
      return chaptersData.find((chapter) => chapter.slug === chapterSlug);
    };

    let chapterObj = getChapter(chapterSlug);
    let pageObj = {};

    setChapterState(chapterObj);

    if (!chapterObj) {
      // set globals
      setCurrentChapter(null);
      setCurrentSubChapter(null);
    } else {
      setCurrentChapter(chapterObj);

      if (pageSlug) {
        pageObj = chapterObj.pages.find((o) => o.slug === pageSlug);
        setCurrentSubChapter(pageObj.slug);

        // [1] if there is a prevPage set and the current page is not the first page of the chapter
        // set the page state. This causes the ChapterPagesSeperate.js to re-render.
        let pageObjIndex = chapterObj.pages.indexOf(pageObj);

        if (!prevPageRef.current && pageObjIndex !== 0) {
          setPageState(pageObj);
        } else if (prevPageRef.current) {
          setPageState(pageObj);
        }
      } else {
        setCurrentSubChapter(null);
        setPageState(null);
      }
    }

    prevPageRef.current = pageSlug;
  }, [chapterSlug, pageSlug, setCurrentChapter, setCurrentSubChapter, chaptersData]);

  // -- Transitions --------------------------------------------------------------------------- //
  let onEnter = (node) => {
    setTransitionDone(false);

    promiseRef.current = new Promise((resolve, reject) => {
      node.style.opacity = 0;
      node.style.position = "absolute";

      gsap.set(node, {
        zIndex: 1,
        width: "100%",
        y: `${window.innerHeight}px`,
        top: `${window.scrollY}px`,
        opacity: 1
      });

      gsap.to(node, {
        y: "0px",
        delay: 0.1,
        duration: 0.4,
        onComplete: () => {
          window.scrollTo(0, 0);
          gsap.set(node, { clearProps: "zIndex,y,top,position" });
          resolve("enter");
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
    //
    promiseRef.current
      .then((type) => {
        if (type === "enter") {
          // added a little timeout, without the timeout
          // the chapterPagesSeparate kept throwing errors
          // [todo] !! i might be able to remove this
          setImmediate(() => {
            setTransitionDone(true);
          });
        }
        return;
      })
      .then(done);
  };

  return (
    <>
      {chapterState && (
        <SwitchTransition mode="in-out">
          <Transition key={chapterState.slug} onEnter={onEnter} onExit={onExit} addEndListener={endListener}>
            <ChapterWrapper
              chapterState={chapterState}
              pageState={pageState}
              pageSlug={pageSlug}
              setCurrentSubChapter={setCurrentSubChapter}
              transitionFinished={transitionDone}
            ></ChapterWrapper>
          </Transition>
        </SwitchTransition>
      )}
    </>
  );
}
export default Chapter;
